import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminJobsRouter = Router();
adminJobsRouter.use(requireStaff("Installations"));

/** GET /admin/jobs — the engineer calendar: everything scheduled, grouped
 * client-side by engineer/day; plus the unscheduled backlog. */
adminJobsRouter.get("/", async (_req, res) => {
  const [scheduled, unassigned] = await Promise.all([
    db.from("jobs").select("*, staff:engineer_staff_id(name)").order("scheduled_date"),
    db.from("jobs").select("*").is("engineer_staff_id", null),
  ]);
  res.json({ jobs: scheduled.data ?? [], unassigned: unassigned.data ?? [] });
});

const jobSchema = z.object({
  ref: z.string().optional(),
  kind: z.enum(["install", "survey", "oib", "repair"]),
  engineerStaffId: z.string().uuid().optional(),
  scheduledDate: z.string().optional(),
  timeWindow: z.string().optional(),
  orderId: z.string().uuid().optional(),
  surveyId: z.string().uuid().optional(),
  address: z.string().optional(),
});

adminJobsRouter.post("/", async (req, res) => {
  const body = jobSchema.parse(req.body);
  const { data, error } = await db
    .from("jobs")
    .insert({ ref: body.ref, kind: body.kind, engineer_staff_id: body.engineerStaffId, scheduled_date: body.scheduledDate, time_window: body.timeWindow, order_id: body.orderId, survey_id: body.surveyId, address: body.address })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ job: data });
});

adminJobsRouter.patch("/:id/assign", async (req, res) => {
  const { engineerStaffId, scheduledDate, timeWindow } = z
    .object({ engineerStaffId: z.string().uuid(), scheduledDate: z.string(), timeWindow: z.string().optional() })
    .parse(req.body);
  const { error } = await db.from("jobs").update({ engineer_staff_id: engineerStaffId, scheduled_date: scheduledDate, time_window: timeWindow }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

adminJobsRouter.patch("/:id/status", async (req, res) => {
  const { status } = z.object({ status: z.enum(["scheduled", "in_progress", "done"]) }).parse(req.body);
  await db.from("jobs").update({ status }).eq("id", req.params.id);
  if (status === "done") {
    const { data: job } = await db.from("jobs").select("order_id").eq("id", req.params.id).maybeSingle();
    if (job?.order_id) await db.from("orders").update({ status: "completed" }).eq("id", job.order_id);
  }
  res.json({ ok: true });
});
