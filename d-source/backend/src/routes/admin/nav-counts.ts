import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminNavCountsRouter = Router();
adminNavCountsRouter.use(requireStaff());

const SLA_WORKING_MINUTES = 240;

/** Sidebar nav badges — a count per module the nav links to, gold except
 * quotes.overdue which the sidebar renders red. */
adminNavCountsRouter.get("/", async (_req, res) => {
  const [orders, quotes, payments, invoices, reviews, accounts, surveys, inventory, enquiries] = await Promise.all([
    db.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("quotes").select("submitted_at").eq("status", "submitted"),
    db.from("payments").select("id", { count: "exact", head: true }).eq("status", "pending").neq("method", "invoice_terms"),
    db.from("payments").select("id", { count: "exact", head: true }).eq("method", "invoice_terms").eq("status", "pending"),
    db.from("reviews").select("id", { count: "exact", head: true }).eq("state", "pending"),
    db.from("customers").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    db.from("site_surveys").select("id", { count: "exact", head: true }).eq("stage", "requested"),
    db.from("inventory").select("id", { count: "exact", head: true }).lt("quantity_on_hand", 3),
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("done", false),
  ]);

  const quoteRows = quotes.data ?? [];
  const quotesOverdue = quoteRows.some((q) => q.submitted_at && (Date.now() - new Date(q.submitted_at).getTime()) / 60000 > SLA_WORKING_MINUTES);

  res.json({
    orders: orders.count ?? 0,
    quotes: quoteRows.length,
    quotesOverdue,
    payments: payments.count ?? 0,
    invoices: invoices.count ?? 0,
    reviews: reviews.count ?? 0,
    accounts: accounts.count ?? 0,
    surveys: surveys.count ?? 0,
    inventory: inventory.count ?? 0,
    enquiries: enquiries.count ?? 0,
  });
});
