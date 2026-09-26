import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminRepairsRouter = Router();
adminRepairsRouter.use(requireStaff("Returns and repairs"));

const STAGES = ["requested", "collected", "diagnosing", "fixing", "ready", "returned"] as const;

adminRepairsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("repairs").select("*, customers(full_name)").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ repairs: data });
});

adminRepairsRouter.patch("/:ref/advance", async (req, res) => {
  const { data: repair } = await db.from("repairs").select("stage").eq("ref", req.params.ref).maybeSingle();
  if (!repair) return res.status(404).json({ error: "Not found" });
  const idx = STAGES.indexOf(repair.stage as (typeof STAGES)[number]);
  const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
  await db.from("repairs").update({ stage: next }).eq("ref", req.params.ref);
  res.json({ stage: next });
});
