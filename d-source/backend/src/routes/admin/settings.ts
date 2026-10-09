import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";
import { SETTINGS_KEYS, getSettings } from "../../util/settings.js";

export const adminSettingsRouter = Router();
adminSettingsRouter.use(requireStaff("Settings"));

const settingsSchema = z.object(Object.fromEntries(SETTINGS_KEYS.map((k) => [k, z.string().max(500).optional()])));

adminSettingsRouter.get("/", async (_req, res) => {
  res.json({ settings: await getSettings() });
});

/** PUT /admin/settings — saved values publish straight to the storefront
 * (GET /content › settings). */
adminSettingsRouter.put("/", async (req, res) => {
  const body = settingsSchema.parse(req.body);
  const merged = { ...(await getSettings()), ...body };
  const { error } = await db.from("storefront_content").upsert({ key: "settings", value: merged, updated_at: new Date().toISOString() });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ settings: merged });
});
