import { Router } from "express";
import { db } from "../supabase.js";

export const trackRouter = Router();

const STAGE_ORDER = ["pending", "confirmed", "fulfilling", "shipped", "completed"] as const;

/** GET /track/:ref — public order lookup, matches the storefront's Track page. */
trackRouter.get("/:ref", async (req, res) => {
  const { data: order, error } = await db
    .from("orders")
    .select("ref, status, placed_at, channel, order_lines(quantity, unit_price, description)")
    .eq("ref", req.params.ref.toUpperCase())
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!order) return res.status(404).json({ error: "No order with that reference" });

  const total = (order.order_lines as { quantity: number; unit_price: number }[]).reduce((a, l) => a + l.quantity * l.unit_price, 0);
  const stageIndex = order.status === "cancelled" ? -1 : STAGE_ORDER.indexOf(order.status as (typeof STAGE_ORDER)[number]);
  res.json({ order: { ...order, total, stageIndex } });
});
