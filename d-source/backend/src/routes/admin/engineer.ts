import { Router } from "express";
import { z } from "zod";
import { ENGINEER_APP, requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

/** The engineer app. An Engineer only ever sees and updates their own
 * jobs; office staff with Installations (and the Owner) can preview any
 * engineer's day. */
export const adminEngineerRouter = Router();
adminEngineerRouter.use(requireStaff(ENGINEER_APP));

const JOB_SELECT = "*, orders(ref, customers(full_name, phone)), site_surveys(ref, customers(full_name, phone))";

adminEngineerRouter.get("/", async (req, res) => {
  const me = req.staff!;
  const isEngineer = me.role === "Engineer";
  const engineers = isEngineer
    ? [{ id: me.id, name: me.name }]
    : ((await db.from("staff").select("id, name").eq("role", "Engineer").eq("active", true).order("name")).data ?? []);
  const pick = isEngineer ? me.id : typeof req.query.staff === "string" ? req.query.staff : engineers[0]?.id;
  if (!pick) return res.json({ engineers, jobs: [] });
  const { data, error } = await db.from("jobs").select(JOB_SELECT).eq("engineer_staff_id", pick).order("scheduled_date").order("time_window");
  if (error) return res.status(500).json({ error: error.message });
  const jobs = (data ?? []).map((j) => {
    const c = j.orders?.customers ?? j.site_surveys?.customers ?? null;
    return { ...j, customerName: c?.full_name ?? null, customerPhone: c?.phone ?? null };
  });
  res.json({ engineers, picked: pick, jobs });
});

adminEngineerRouter.patch("/jobs/:id/status", async (req, res) => {
  const { status } = z.object({ status: z.enum(["in_progress", "done"]) }).parse(req.body);
  const { data: job } = await db.from("jobs").select("id, engineer_staff_id, order_id").eq("id", req.params.id).maybeSingle();
  if (!job) return res.status(404).json({ error: "Not found" });
  if (req.staff!.role === "Engineer" && job.engineer_staff_id !== req.staff!.id) return res.status(403).json({ error: "Not your job" });
  const { error } = await db.from("jobs").update({ status }).eq("id", job.id);
  if (error) return res.status(500).json({ error: error.message });
  if (status === "done" && job.order_id) await db.from("orders").update({ status: "completed" }).eq("id", job.order_id);
  res.json({ ok: true });
});
