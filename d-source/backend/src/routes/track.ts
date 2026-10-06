import { Router } from "express";
import { conditionOf } from "../shop.js";
import { db } from "../supabase.js";

export const trackRouter = Router();

// Order status → tracking stage: Ordered, Sourced, Checked, Out for delivery, Delivered.
const STAGE_ORDER = ["pending", "confirmed", "fulfilling", "shipped", "completed"] as const;

type Line = { quantity: number; unit_price: number; description: string; products: { name: string; store: string; specs: unknown } | null };

/** GET /track/:ref — public order lookup for Tracking and the receipt. Each
 * line carries its D'Source warranty (1 month new, 7 days used). */
trackRouter.get("/:ref", async (req, res) => {
  const { data: order, error } = await db
    .from("orders")
    .select("ref, status, placed_at, channel, check_battery, check_imei, check_condition, check_media, order_lines(quantity, unit_price, description, products(name, store, specs))")
    .eq("ref", req.params.ref.toUpperCase())
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!order) return res.status(404).json({ error: "No order with that reference" });

  const lines = (order.order_lines as unknown as Line[]).map(({ products, ...l }) => {
    const used = products ? conditionOf(products) !== "New" : false;
    return { ...l, used, warranty: products ? (used ? "7 days" : "1 month") : null };
  });
  const total = lines.reduce((a, l) => a + l.quantity * l.unit_price, 0);
  const stageIndex = order.status === "cancelled" ? -1 : STAGE_ORDER.indexOf(order.status as (typeof STAGE_ORDER)[number]);
  res.json({ order: { ...order, order_lines: lines, total, stageIndex } });
});
