import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminZonesRouter = Router();
adminZonesRouter.use(requireStaff("Delivery zones"));

adminZonesRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("delivery_zones").select("*").order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ zones: data });
});

const zoneSchema = z.object({
  name: z.string().optional(),
  fee: z.number().nullable().optional(),
  deliveryTime: z.string().optional(),
  payOnDelivery: z.boolean().optional(),
  installationAvailable: z.boolean().optional(),
});

adminZonesRouter.post("/", async (req, res) => {
  const { data, error } = await db.from("delivery_zones").insert({ name: "New zone" }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ zone: data });
});

adminZonesRouter.patch("/:id", async (req, res) => {
  const body = zoneSchema.parse(req.body);
  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) patch.name = body.name;
  if (body.fee !== undefined) patch.fee = body.fee;
  if (body.deliveryTime !== undefined) patch.delivery_time = body.deliveryTime;
  if (body.payOnDelivery !== undefined) patch.pay_on_delivery = body.payOnDelivery;
  if (body.installationAvailable !== undefined) patch.installation_available = body.installationAvailable;
  const { error } = await db.from("delivery_zones").update(patch).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

adminZonesRouter.delete("/:id", async (req, res) => {
  await db.from("delivery_zones").delete().eq("id", req.params.id);
  res.json({ ok: true });
});
