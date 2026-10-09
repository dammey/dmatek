import { Router, raw } from "express";
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

const ROOM_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** POST /admin/kits/:id/photo — raw image body; the kit's room photo
 * (shown behind its pins on the storefront). */
adminKitsRouter.post("/:id/photo", raw({ type: Object.keys(ROOM_TYPES), limit: "10mb" }), async (req, res) => {
  const type = (req.headers["content-type"] ?? "").split(";")[0];
  const ext = ROOM_TYPES[type];
  if (!ext || !Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ error: "Upload a JPG, PNG or WebP photo" });
  const path = `kits/${req.params.id}/${Date.now()}.${ext}`;
  const up = await db.storage.from("product-images").upload(path, req.body, { contentType: type });
  if (up.error) return res.status(500).json({ error: up.error.message });
  const url = db.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  const { error } = await db.from("kits").update({ photo_ref: url }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ url });
});
