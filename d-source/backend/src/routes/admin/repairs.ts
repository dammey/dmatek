import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminRepairsRouter = Router();
adminRepairsRouter.use(requireStaff("Returns and repairs"));

// v3: Requested, Collected, Diagnosed, Quote sent, Approved, Fixing, Returned.
// No work starts until the customer approves the quote.
export const REPAIR_STAGES = ["requested", "collected", "diagnosed", "quote_sent", "approved", "fixing", "returned"] as const;
// Legacy stage names map onto the v3 sequence.
const norm = (s: string) => (s === "diagnosing" ? "diagnosed" : s === "ready" ? "fixing" : s);

adminRepairsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("repairs").select("*, customers(full_name, company_name)").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ repairs: (data ?? []).map((r) => ({ ...r, stage: norm(r.stage) })) });
});

/** Advance one stage. Quote sent → Approved only via /approve (the customer decides). */
adminRepairsRouter.patch("/:ref/advance", async (req, res) => {
  const { data: repair } = await db.from("repairs").select("stage").eq("ref", req.params.ref).maybeSingle();
  if (!repair) return res.status(404).json({ error: "Not found" });
  const idx = REPAIR_STAGES.indexOf(norm(repair.stage) as (typeof REPAIR_STAGES)[number]);
  if (REPAIR_STAGES[idx] === "quote_sent") return res.status(409).json({ error: "Waiting for the customer to approve or decline the quote" });
  if (REPAIR_STAGES[idx] === "diagnosed") return res.status(409).json({ error: "Send the quote first" });
  const next = REPAIR_STAGES[Math.min(idx + 1, REPAIR_STAGES.length - 1)];
  await db.from("repairs").update({ stage: next }).eq("ref", req.params.ref);
  res.json({ stage: next });
});

/** POST /:ref/quote — record the diagnosis quote and mark it sent. */
adminRepairsRouter.post("/:ref/quote", async (req, res) => {
  const { amount } = z.object({ amount: z.number().nonnegative() }).parse(req.body);
  const { error } = await db.from("repairs").update({ quote_amount: amount, stage: "quote_sent" }).eq("ref", req.params.ref);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ stage: "quote_sent" });
});

adminRepairsRouter.post("/:ref/approve", async (req, res) => {
  const { error } = await db.from("repairs").update({ stage: "approved" }).eq("ref", req.params.ref).eq("stage", "quote_sent");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ stage: "approved" });
});

/** Declined: the device goes back unrepaired. */
adminRepairsRouter.post("/:ref/decline", async (req, res) => {
  const { error } = await db.from("repairs").update({ stage: "returned" }).eq("ref", req.params.ref).eq("stage", "quote_sent");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ stage: "returned" });
});
