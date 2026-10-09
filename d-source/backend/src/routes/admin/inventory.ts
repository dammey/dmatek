import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminInventoryRouter = Router();
adminInventoryRouter.use(requireStaff("Inventory"));

/** GET /admin/inventory — stock on hand, reserved, reorder level, supplier
 * and recorded serial numbers per product. */
adminInventoryRouter.get("/", async (_req, res) => {
  const { data, error } = await db
    .from("products")
    .select("id, name, store, is_active, categories(name), inventory(quantity_on_hand, quantity_reserved, reorder_level), product_suppliers(suppliers(name)), stock_serials(serial)")
    .order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ products: data ?? [] });
});

/** POST /admin/inventory/:productId/receive — receive stock (and serials). */
adminInventoryRouter.post("/:productId/receive", async (req, res) => {
  const { quantity, serials } = z.object({ quantity: z.number().int().positive(), serials: z.array(z.string().trim().min(1)).default([]) }).parse(req.body);
  const id = req.params.productId;
  const { data: inv } = await db.from("inventory").select("id, quantity_on_hand").eq("product_id", id).maybeSingle();
  if (inv) await db.from("inventory").update({ quantity_on_hand: inv.quantity_on_hand + quantity, updated_at: new Date().toISOString() }).eq("id", inv.id);
  else await db.from("inventory").insert({ product_id: id, quantity_on_hand: quantity });
  if (serials.length) {
    const { error } = await db.from("stock_serials").upsert(serials.map((serial) => ({ product_id: id, serial })), { onConflict: "product_id,serial", ignoreDuplicates: true });
    if (error) return res.status(500).json({ error: error.message });
  }
  res.json({ ok: true, onHand: (inv?.quantity_on_hand ?? 0) + quantity });
});
