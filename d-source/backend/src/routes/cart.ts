import { Router } from "express";
import { z } from "zod";
import { withCustomer } from "../auth/middleware.js";
import { db } from "../supabase.js";

export const cartRouter = Router();
cartRouter.use(withCustomer);

async function loadCart(cartId: string) {
  const { data } = await db.from("carts").select("*, cart_items(*)").eq("id", cartId).maybeSingle();
  return data;
}

/** POST /cart — creates a cart (kind: 'cart' | 'quote', channel: 'emporium' | 'provision'). */
cartRouter.post("/", async (req, res) => {
  const body = z.object({ kind: z.enum(["cart", "quote"]).default("cart"), channel: z.enum(["emporium", "provision"]) }).parse(req.body);
  const { data, error } = await db
    .from("carts")
    .insert({ kind: body.kind, channel: body.channel, customer_id: req.customer?.id ?? null })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ cart: data });
});

cartRouter.get("/:id", async (req, res) => {
  const cart = await loadCart(req.params.id);
  if (!cart) return res.status(404).json({ error: "Not found" });
  res.json({ cart });
});

const lineSchema = z.object({ productId: z.string().uuid(), name: z.string(), price: z.number().nullable(), quantity: z.number().min(1).default(1) });

/** POST /cart/:id/items — add or bump a line (matched by productId). */
cartRouter.post("/:id/items", async (req, res) => {
  const body = lineSchema.parse(req.body);
  const cart = await loadCart(req.params.id);
  if (!cart) return res.status(404).json({ error: "Not found" });

  const existing = (cart.cart_items as { id: string; product_id: string; quantity: number }[]).find((i) => i.product_id === body.productId);
  if (existing) {
    await db.from("cart_items").update({ quantity: existing.quantity + body.quantity }).eq("id", existing.id);
  } else {
    await db.from("cart_items").insert({ cart_id: cart.id, product_id: body.productId, name: body.name, price: body.price, quantity: body.quantity });
  }
  await db.from("carts").update({ updated_at: new Date().toISOString() }).eq("id", cart.id);
  res.json({ cart: await loadCart(cart.id) });
});

cartRouter.patch("/:id/items/:itemId", async (req, res) => {
  const { quantity } = z.object({ quantity: z.number() }).parse(req.body);
  if (quantity <= 0) await db.from("cart_items").delete().eq("id", req.params.itemId);
  else await db.from("cart_items").update({ quantity }).eq("id", req.params.itemId);
  res.json({ cart: await loadCart(req.params.id) });
});

cartRouter.delete("/:id/items/:itemId", async (req, res) => {
  await db.from("cart_items").delete().eq("id", req.params.itemId);
  res.json({ cart: await loadCart(req.params.id) });
});
