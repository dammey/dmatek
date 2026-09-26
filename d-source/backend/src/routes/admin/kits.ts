import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminKitsRouter = Router();
adminKitsRouter.use(requireStaff("Kits"));

adminKitsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("kits").select("*, kit_items(*)").order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ kits: data });
});

adminKitsRouter.patch("/:id", async (req, res) => {
  const body = z.object({ live: z.boolean().optional(), photoRef: z.string().optional() }).parse(req.body);
  const patch: Record<string, unknown> = {};
  if (body.live !== undefined) patch.live = body.live;
  if (body.photoRef !== undefined) patch.photo_ref = body.photoRef;
  const { error } = await db.from("kits").update(patch).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/** PATCH /admin/kits/items/:itemId/pin — drag-to-place pin coordinates. */
adminKitsRouter.patch("/items/:itemId/pin", async (req, res) => {
  const { x, y } = z.object({ x: z.number(), y: z.number() }).parse(req.body);
  const { error } = await db.from("kit_items").update({ pin_x: x, pin_y: y }).eq("id", req.params.itemId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
