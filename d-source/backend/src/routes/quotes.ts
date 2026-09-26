import { Router } from "express";
import { z } from "zod";
import { requireStaff, withCustomer } from "../auth/middleware.js";
import { db } from "../supabase.js";
import { makeRef } from "../util/ref.js";

export const quotesRouter = Router();
quotesRouter.use(withCustomer);

const requestSchema = z.object({
  cartId: z.string().uuid().optional(),
  organisation: z.string(),
  contactName: z.string(),
  contact: z.string(),
  deliveryLocation: z.string().optional(),
  neededBy: z.string().optional(),
  setup: z.string().optional(),
  siteSurveyRequested: z.boolean().default(false),
  note: z.string().optional(),
});

/** POST /quotes — D'Provision "request a quote", with or without a built
 * quote-list cart (a blank enquiry with just a note is also valid). */
quotesRouter.post("/", async (req, res) => {
  const body = requestSchema.parse(req.body);
  const ref = makeRef("DQ");

  let customerId = req.customer?.id ?? null;
  if (!customerId) {
    const { data } = await db
      .from("customers")
      .insert({ full_name: body.contactName, email: body.contact.includes("@") ? body.contact : null, phone: body.contact.includes("@") ? null : body.contact, company_name: body.organisation, type: "business" })
      .select("id")
      .single();
    customerId = data?.id ?? null;
  }

  const { data: quote, error } = await db
    .from("quotes")
    .insert({ ref, customer_id: customerId, status: "submitted", submitted_at: new Date().toISOString(), spec_notes: body.note ?? null })
    .select("id, ref")
    .single();
  if (error) return res.status(500).json({ error: error.message });

  if (body.cartId) {
    const { data: cart } = await db.from("carts").select("cart_items(*)").eq("id", body.cartId).maybeSingle();
    const items = (cart?.cart_items ?? []) as { product_id: string | null; name: string; quantity: number }[];
    if (items.length) {
      await db.from("quote_lines").insert(items.map((i) => ({ quote_id: quote.id, product_id: i.product_id, description: i.name, quantity: i.quantity })));
    }
    await db.from("cart_items").delete().eq("cart_id", body.cartId);
  }

  if (body.siteSurveyRequested) {
    await db.from("site_surveys").insert({
      ref: makeRef("SV"),
      customer_id: customerId,
      organisation: body.organisation,
      address: body.deliveryLocation ?? "",
      stage: "requested",
    });
  }

  res.status(201).json({ ref: quote.ref, quoteId: quote.id });
});

quotesRouter.get("/:ref", async (req, res) => {
  const { data, error } = await db.from("quotes").select("*, quote_lines(*)").eq("ref", req.params.ref).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ quote: data });
});

/** POST /quotes/:ref/order-on-account — converts a priced quote into an
 * order for an approved business account (30-day invoice). */
quotesRouter.post("/:ref/order-on-account", async (req, res) => {
  if (!req.customer) return res.status(401).json({ error: "Sign in required" });
  const { data: customer } = await db.from("customers").select("account_status, credit_terms_days").eq("id", req.customer.id).maybeSingle();
  if (customer?.account_status !== "approved") return res.status(403).json({ error: "Business account not yet approved" });

  const { data: quote } = await db.from("quotes").select("id, quote_lines(*)").eq("ref", req.params.ref).maybeSingle();
  if (!quote) return res.status(404).json({ error: "Not found" });

  const orderRef = makeRef("DS");
  const { data: order, error } = await db
    .from("orders")
    .insert({ ref: orderRef, customer_id: req.customer.id, channel: "provision", quote_id: quote.id, status: "confirmed" })
    .select("id")
    .single();
  if (error) return res.status(500).json({ error: error.message });

  const lines = (quote.quote_lines as { product_id: string | null; description: string; quantity: number; unit_price: number | null }[]).map((l) => ({
    order_id: order.id,
    product_id: l.product_id,
    description: l.description,
    quantity: l.quantity,
    unit_price: l.unit_price ?? 0,
  }));
  await db.from("order_lines").insert(lines);
  await db.from("payments").insert({
    order_id: order.id,
    method: "invoice_terms",
    status: "pending",
    amount: lines.reduce((a, l) => a + l.unit_price * l.quantity, 0),
    due_at: new Date(Date.now() + (customer.credit_terms_days ?? 30) * 86400000).toISOString(),
  });
  await db.from("quotes").update({ status: "accepted" }).eq("id", quote.id);

  res.status(201).json({ ref: orderRef });
});

/** Admin: price a quote's lines and send it. */
quotesRouter.patch("/:ref/lines/:lineId", requireStaff("Quotes"), async (req, res) => {
  const { unitPrice } = z.object({ unitPrice: z.number() }).parse(req.body);
  await db.from("quote_lines").update({ unit_price: unitPrice }).eq("id", req.params.lineId);
  res.json({ ok: true });
});

quotesRouter.post("/:ref/send", requireStaff("Quotes"), async (req, res) => {
  await db.from("quotes").update({ status: "priced", priced_at: new Date().toISOString() }).eq("ref", req.params.ref);
  res.json({ ok: true });
});
