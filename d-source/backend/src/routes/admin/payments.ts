import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminPaymentsRouter = Router();
adminPaymentsRouter.use(requireStaff("Payments"));

adminPaymentsRouter.get("/", async (_req, res) => {
  const { data, error } = await db.from("payments").select("*, orders(ref, customers(full_name, company_name))").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ payments: data });
});

/** PATCH /admin/payments/:id/confirm — for transfer/USSD/pay-on-delivery
 * orders, which need a person to confirm the money actually arrived. */
adminPaymentsRouter.patch("/:id/confirm", async (req, res) => {
  const { error } = await db.from("payments").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
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
  const { data, error } = await db.from("payments").select("*, orders(ref, customers(full_name, company_name))").eq("method", "invoice_terms").order("due_at");
  if (error) return res.status(500).json({ error: error.message });
  const now = Date.now();
  const rows = (data ?? []).map((p) => ({ ...p, overdue: p.status === "overdue" || (p.status === "pending" && !!p.due_at && new Date(p.due_at).getTime() < now) }));
  res.json({ invoices: rows });
});

adminInvoicesRouter.patch("/:id/mark-paid", requireStaff("Invoices"), async (req, res) => {
  const { error } = await db.from("payments").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/** POST /admin/payments/:id/resend-link — a fresh card payment link for a failed payment. */
adminPaymentsRouter.post("/:id/resend-link", async (req, res) => {
  const { data: p } = await db.from("payments").select("amount, orders(ref, customers(email))").eq("id", req.params.id).maybeSingle();
  if (!p) return res.status(404).json({ error: "Not found" });
  const order = p.orders as unknown as { ref: string; customers?: { email?: string } | null } | null;
  const { activePaymentProvider } = await import("../../payments/index.js");
  const init = await activePaymentProvider.initialize({ reference: `${order?.ref}-${Date.now().toString(36)}`, amountKobo: Math.round(Number(p.amount) * 100), email: order?.customers?.email ?? "", callbackUrl: "" });
  await db.from("payments").update({ status: "pending" }).eq("id", req.params.id);
  res.json({ link: init.authorizationUrl });
});

/** POST /admin/invoices/:id/remind — queues a payment reminder in the notification log. */
adminInvoicesRouter.post("/:id/remind", async (req, res) => {
  const { data: p } = await db.from("payments").select("order_id, amount, due_at").eq("id", req.params.id).maybeSingle();
  if (!p) return res.status(404).json({ error: "Not found" });
  const { error } = await db.from("notification_log").insert({ order_id: p.order_id, channel: "email", body: `Invoice reminder: ${p.amount} due ${p.due_at ?? ""}` });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
