import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";
import { makeRef } from "../../util/ref.js";

export const adminReturnsRouter = Router();
adminReturnsRouter.use(requireStaff("Returns and repairs"));

/** Returns and inspections. Window = days since delivery (7-day returns). */
adminReturnsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("returns").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  const now = Date.now();
  res.json({
    returns: (data ?? []).map((r) => ({ ...r, day: r.delivered_at ? Math.max(0, Math.floor((now - new Date(r.delivered_at).getTime()) / 86400000)) : 0 })),
  });
});

adminReturnsRouter.post("/", async (req, res) => {
  const body = z.object({ orderRef: z.string(), item: z.string(), reason: z.string() }).parse(req.body);
  const { data: order } = await db.from("orders").select("id, customers(full_name, company_name)").eq("ref", body.orderRef.toUpperCase()).maybeSingle();
  const c = order?.customers as unknown as { full_name?: string; company_name?: string } | null;
  const { data, error } = await db
    .from("returns")
    .insert({ ref: makeRef("RT"), order_id: order?.id ?? null, order_ref: body.orderRef.toUpperCase(), customer_name: c?.company_name || c?.full_name || null, item: body.item, reason: body.reason })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ return: data });
});

adminReturnsRouter.patch("/:ref", async (req, res) => {
  const { state } = z.object({ state: z.enum(["Refunded", "Replaced", "Rejected"]) }).parse(req.body);
  const { error } = await db.from("returns").update({ state }).eq("ref", req.params.ref).eq("state", "Open");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
