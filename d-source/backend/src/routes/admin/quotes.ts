import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";
import { quoteSlaMinutes } from "../../util/settings.js";

export const adminQuotesRouter = Router();
adminQuotesRouter.use(requireStaff("Quotes"));

const minutesSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 60000);

/** GET /admin/quotes — `ago` is minutes since submission; the reply promise
 * (Settings › QUOTE REPLY (HOURS), 24 by default) comes back as slaMinutes. */
adminQuotesRouter.get("/", async (_req, res) => {
  const [sla, { data, error }] = await Promise.all([
    quoteSlaMinutes(),
    db.from("quotes").select("*, customers(full_name, company_name, phone, email), quote_lines(*)").order("created_at", { ascending: false }),
  ]);
  if (error) return res.status(500).json({ error: error.message });
  const rows = (data ?? []).map((q) => {
    const ago = q.submitted_at ? minutesSince(q.submitted_at) : 0;
    return { ...q, ago, overdue: q.status === "submitted" && ago > sla };
  });
  res.json({ quotes: rows, slaMinutes: sla });
});

adminQuotesRouter.get("/:ref", async (req, res) => {
  const { data, error } = await db.from("quotes").select("*, customers(*), quote_lines(*)").eq("ref", req.params.ref).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ quote: { ...data, ago: data.submitted_at ? minutesSince(data.submitted_at) : 0 } });
});

/** PATCH /admin/quotes/:ref — volume discount (0–50%) and note to customer. */
adminQuotesRouter.patch("/:ref", async (req, res) => {
  const body = z.object({ discountPct: z.number().min(0).max(50).optional(), note: z.string().max(2000).optional() }).parse(req.body);
  const patch: Record<string, unknown> = {};
  if (body.discountPct !== undefined) patch.discount_pct = body.discountPct;
  if (body.note !== undefined) patch.customer_note = body.note;
  const { error } = await db.from("quotes").update(patch).eq("ref", req.params.ref);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
