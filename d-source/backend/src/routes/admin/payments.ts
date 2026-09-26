import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminPaymentsRouter = Router();
adminPaymentsRouter.use(requireStaff("Payments"));

adminPaymentsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("payments").select("*, orders(ref, customers(full_name))").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ payments: data });
});

/** PATCH /admin/payments/:id/confirm — for transfer/USSD/pay-on-delivery
 * orders, which need a person to confirm the money actually arrived. */
adminPaymentsRouter.patch("/:id/confirm", async (req, res) => {
  const { data: payment, error } = await db.from("payments").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", req.params.id).select("order_id").single();
  if (error) return res.status(500).json({ error: error.message });
  await db.from("orders").update({ status: "confirmed" }).eq("id", payment.order_id);
  res.json({ ok: true });
});

adminPaymentsRouter.patch("/:id/refund", async (req, res) => {
  await db.from("payments").update({ status: "refunded" }).eq("id", req.params.id);
  res.json({ ok: true });
});

export const adminInvoicesRouter = Router();
adminInvoicesRouter.use(requireStaff("Invoices"));

/** Invoices are business-account orders on 30-day terms — derived from
 * payments with method 'invoice_terms', not a separate table. */
adminInvoicesRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("payments").select("*, orders(ref, customers(company_name))").eq("method", "invoice_terms").order("due_at");
  if (error) return res.status(500).json({ error: error.message });
  const now = Date.now();
  const rows = (data ?? []).map((p) => ({ ...p, overdue: p.status === "pending" && p.due_at && new Date(p.due_at).getTime() < now }));
  res.json({ invoices: rows });
});

adminInvoicesRouter.patch("/:id/mark-paid", requireStaff("Invoices"), async (req, res) => {
  const { error } = await db.from("payments").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
