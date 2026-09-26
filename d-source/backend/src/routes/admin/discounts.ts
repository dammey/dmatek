import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminDiscountsRouter = Router();
adminDiscountsRouter.use(requireStaff("Discounts"));

adminDiscountsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("discounts").select("*").order("ends_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ discounts: data });
});

/** POST /admin/discounts — every code needs a reason and an end date;
 * the storefront only ever shows a discount when a real offer exists. */
adminDiscountsRouter.post("/", async (req, res) => {
  const body = z
    .object({ code: z.string(), appliesTo: z.string(), value: z.string(), startsAt: z.string().optional(), endsAt: z.string(), reason: z.string() })
    .parse(req.body);
  const { data, error } = await db
    .from("discounts")
    .insert({ code: body.code, applies_to: body.appliesTo, value: body.value, starts_at: body.startsAt, ends_at: body.endsAt, reason: body.reason, active: false })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ discount: data });
});

adminDiscountsRouter.patch("/:id/activate", async (req, res) => {
  await db.from("discounts").update({ active: true }).eq("id", req.params.id);
  res.json({ ok: true });
});
