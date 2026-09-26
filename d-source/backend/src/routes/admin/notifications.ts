import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminNotificationsRouter = Router();
adminNotificationsRouter.use(requireStaff("Notifications"));

adminNotificationsRouter.get("/", async (req, res) => {
  const { audience } = req.query as { audience?: string };
  let query = db.from("notification_templates").select("*");
  if (audience) query = query.eq("audience", audience);
  const { data, error } = await query.order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ templates: data });
});

adminNotificationsRouter.patch("/:id", async (req, res) => {
  const body = z.object({ body: z.string().optional(), enabled: z.boolean().optional() }).parse(req.body);
  const { error } = await db.from("notification_templates").update(body).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

adminNotificationsRouter.post("/:id/test", async (req, res) => {
  const { data: template } = await db.from("notification_templates").select("*").eq("id", req.params.id).maybeSingle();
  if (!template) return res.status(404).json({ error: "Not found" });
  await db.from("notification_log").insert({ template_id: template.id, recipient: "[ YOUR NUMBER ]", channel: template.channels[0], body: template.body });
  res.json({ ok: true });
});
