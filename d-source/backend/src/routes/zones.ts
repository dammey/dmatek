import { Router } from "express";
import { db } from "../supabase.js";

export const zonesRouter = Router();

/** GET /zones — public; checkout reads this to show delivery fee/time and
 * whether pay-on-delivery is available for the address's zone. */
zonesRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("delivery_zones").select("*").order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ zones: data });
});
