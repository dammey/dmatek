import { Router } from "express";
import { z } from "zod";
import { withCustomer } from "../auth/middleware.js";
import { activePaymentProvider } from "../payments/index.js";
import { db } from "../supabase.js";
import { makeRef } from "../util/ref.js";

export const checkoutRouter = Router();
checkoutRouter.use(withCustomer);

const checkoutSchema = z.object({
  cartId: z.string().uuid(),
  channel: z.enum(["emporium", "provision"]),
  contact: z.object({ name: z.string(), phone: z.string(), email: z.string().email().optional() }),
  address: z.object({ line1: z.string(), city: z.string(), state: z.string().optional() }),
  setupRequested: z.boolean().default(false),
  paymentMethod: z.enum(["card", "transfer", "ussd", "pod"]),
  provider: z.enum(["paystack", "flutterwave"]).optional(),
});

async function findOrCreateCustomer(req: import("express").Request, contact: { name: string; phone: string; email?: string }) {
  if (req.customer) return req.customer.id;
  if (contact.email) {
    const { data: existing } = await db.from("customers").select("id").eq("email", contact.email).maybeSingle();
    if (existing) return existing.id;
  }
  const { data, error } = await db
    .from("customers")
    .insert({ full_name: contact.name, phone: contact.phone, email: contact.email ?? `${contact.phone}@no-email.dsource`, type: "retail" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

/** POST /checkout — creates the order from a cart and, for card payment,
 * an initialized transaction to redirect to. Transfer/USSD/pay-on-delivery
 * create the order straight away, awaiting confirmation in Admin > Payments. */
checkoutRouter.post("/", async (req, res) => {
  const body = checkoutSchema.parse(req.body);
  const { data: cart } = await db.from("carts").select("*, cart_items(*)").eq("id", body.cartId).maybeSingle();
  if (!cart || !cart.cart_items.length) return res.status(400).json({ error: "Cart is empty" });

  const customerId = await findOrCreateCustomer(req, body.contact);
  const { data: address, error: addrErr } = await db
    .from("addresses")
    .insert({ customer_id: customerId, line1: body.address.line1, city: body.address.city, state: body.address.state, country: "Nigeria" })
    .select("id")
    .single();
  if (addrErr) return res.status(500).json({ error: addrErr.message });

  const ref = makeRef("DS");
  const total = (cart.cart_items as { price: number | null; quantity: number }[]).reduce((a, l) => a + (l.price ?? 0) * l.quantity, 0);

  const { data: order, error: orderErr } = await db
    .from("orders")
    .insert({ ref, customer_id: customerId, channel: body.channel, status: "pending", shipping_address_id: address.id, billing_address_id: address.id })
    .select("id, ref")
    .single();
  if (orderErr) return res.status(500).json({ error: orderErr.message });

  const lines = (cart.cart_items as { product_id: string | null; name: string; price: number | null; quantity: number }[]).map((l) => ({
    order_id: order.id,
    product_id: l.product_id,
    description: l.name,
    quantity: l.quantity,
    unit_price: l.price ?? 0,
  }));
  await db.from("order_lines").insert(lines);

  const method = body.paymentMethod === "card" ? "card" : body.paymentMethod === "transfer" ? "transfer" : body.paymentMethod === "ussd" ? "transfer" : "transfer";
  await db.from("payments").insert({ order_id: order.id, method, status: "pending", amount: total });

  if (body.paymentMethod === "card") {
    const init = await activePaymentProvider.initialize({
      reference: ref,
      amountKobo: Math.round(total * 100),
      email: body.contact.email ?? "",
      callbackUrl: `${req.headers.origin ?? ""}/track?ref=${ref}`,
    });
    await db.from("cart_items").delete().eq("cart_id", cart.id);
    return res.status(201).json({ ref, orderId: order.id, payment: init });
  }

  await db.from("cart_items").delete().eq("cart_id", cart.id);
  res.status(201).json({ ref, orderId: order.id, payment: { authorizationUrl: null, reference: ref, sandbox: true } });
});

/** GET /checkout/verify/:reference — polled by the storefront after a card
 * redirect returns, and used by the webhook handler below. */
checkoutRouter.get("/verify/:reference", async (req, res) => {
  const result = await activePaymentProvider.verify(req.params.reference);
  if (result.status === "paid") {
    await db.from("payments").update({ status: "paid", paid_at: new Date().toISOString() }).eq("order_id", (await orderIdForRef(result.reference)) ?? "");
    await db.from("orders").update({ status: "confirmed" }).eq("ref", result.reference);
  }
  res.json(result);
});

async function orderIdForRef(ref: string) {
  const { data } = await db.from("orders").select("id").eq("ref", ref).maybeSingle();
  return data?.id ?? null;
}
