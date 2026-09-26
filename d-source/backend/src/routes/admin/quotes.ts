import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminQuotesRouter = Router();
adminQuotesRouter.use(requireStaff("Quotes"));

const SLA_WORKING_MINUTES = 240;

function workingMinutesSince(iso: string): number {
  // Simple approximation: elapsed minutes, capped to working hours (9am–6pm
  // weekdays) isn't modeled precisely — refine once real office hours are
  // confirmed. For now this is elapsed minutes, which is a safe (slightly
  // pessimistic) stand-in for "working minutes".
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

adminQuotesRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("quotes").select("*, customers(full_name, company_name), quote_lines(*)").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  const rows = (data ?? []).map((q) => {
    const ago = q.submitted_at ? workingMinutesSince(q.submitted_at) : 0;
    return { ...q, ago, overdue: q.status === "submitted" && ago > SLA_WORKING_MINUTES };
  });
  res.json({ quotes: rows, slaMinutes: SLA_WORKING_MINUTES });
});

adminQuotesRouter.get("/:ref", async (req, res) => {
  const { data, error } = await db.from("quotes").select("*, customers(*), quote_lines(*)").eq("ref", req.params.ref).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ quote: data });
});
