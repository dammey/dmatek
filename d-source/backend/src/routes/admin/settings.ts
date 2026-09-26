import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminSettingsRouter = Router();
adminSettingsRouter.use(requireStaff("Settings"));

const SETTINGS_KEY = "settings";

const settingsSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  returnsPolicy: z.string().optional(),
  businessAccountReviewTime: z.string().optional(),
  quoteReplyHours: z.number().optional(),
  invoiceTermsDays: z.number().optional(),
});

adminSettingsRouter.get("/", async (_req, res) => {
  const { data } = await db.from("storefront_content").select("value").eq("key", SETTINGS_KEY).maybeSingle();
  res.json({ settings: data?.value ?? {} });
});

adminSettingsRouter.put("/", async (req, res) => {
  const body = settingsSchema.parse(req.body);
  const { data: existing } = await db.from("storefront_content").select("value").eq("key", SETTINGS_KEY).maybeSingle();
  const merged = { ...(existing?.value as object ?? {}), ...body };
  const { error } = await db.from("storefront_content").upsert({ key: SETTINGS_KEY, value: merged, updated_at: new Date().toISOString() });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ settings: merged });
});
