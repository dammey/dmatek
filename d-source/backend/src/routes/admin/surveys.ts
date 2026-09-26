import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminSurveysRouter = Router();
adminSurveysRouter.use(requireStaff("Site surveys"));

const STAGES = ["requested", "date_confirmed", "surveyed", "quote_sent"] as const;

adminSurveysRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("site_surveys").select("*, staff:engineer_staff_id(name)").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ surveys: data });
});

adminSurveysRouter.patch("/:ref/advance", async (req, res) => {
  const { data: survey } = await db.from("site_surveys").select("stage").eq("ref", req.params.ref).maybeSingle();
  if (!survey) return res.status(404).json({ error: "Not found" });
  const idx = STAGES.indexOf(survey.stage as (typeof STAGES)[number]);
  const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
  await db.from("site_surveys").update({ stage: next }).eq("ref", req.params.ref);
  res.json({ stage: next });
});

adminSurveysRouter.patch("/:ref/assign", async (req, res) => {
  const { engineerStaffId } = z.object({ engineerStaffId: z.string().uuid() }).parse(req.body);
  await db.from("site_surveys").update({ engineer_staff_id: engineerStaffId }).eq("ref", req.params.ref);
  res.json({ ok: true });
});
