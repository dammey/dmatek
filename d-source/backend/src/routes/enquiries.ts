import { randomUUID } from "node:crypto";
import { Router, raw } from "express";
import { z } from "zod";
import { withCustomer } from "../auth/middleware.js";
import { db } from "../supabase.js";

export const enquiriesRouter = Router();
enquiriesRouter.use(withCustomer);

const enquirySchema = z.object({
  type: z.enum(["Sourcing request", "Business sourcing", "Return / failed inspection", "Repair collection", "Pilot interest", "WhatsApp order", "General"]).default("General"),
  fromName: z.string().optional(),
  fromContact: z.string().optional(),
  message: z.string(),
});

/** POST /enquiries — the storefront's catch-all: repairs, pilot interest
 * (device care plan demand log), WhatsApp order intents, "We'll source it"
 * requests (personal or business), general asks. */
enquiriesRouter.post("/", async (req, res) => {
  const body = enquirySchema.parse(req.body);
  const { error } = await db.from("enquiries").insert({
    type: body.type,
    from_name: body.fromName,
    from_contact: body.fromContact,
    customer_id: req.customer?.id ?? null,
    message: body.message,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ok: true });
});

const ATTACH_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "application/pdf": "pdf" };

/** POST /enquiries/attachment — the sourcing form's "Upload a photo or spec
 * sheet": raw file body (Content-Type set to the file's type), stored under an
 * unguessable path; the returned URL goes into the request's message. */
enquiriesRouter.post("/attachment", raw({ type: Object.keys(ATTACH_TYPES), limit: "15mb" }), async (req, res) => {
  const type = (req.headers["content-type"] ?? "").split(";")[0];
  const ext = ATTACH_TYPES[type];
  if (!ext || !Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ error: "Upload a JPG, PNG, WebP, HEIC or PDF file" });
  const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;
  const up = await db.storage.from("enquiry-attachments").upload(path, req.body, { contentType: type, upsert: false });
  if (up.error) return res.status(500).json({ error: up.error.message });
  res.status(201).json({ url: db.storage.from("enquiry-attachments").getPublicUrl(path).data.publicUrl });
});
