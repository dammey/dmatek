import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminNavCountsRouter = Router();
adminNavCountsRouter.use(requireStaff());

// Quotes and business requests: within 24 hours.
const SLA_MINUTES = 1440;

/** Sidebar nav badges — a count per module the nav links to, gold except
 * quotes.overdue which the sidebar renders red. */
adminNavCountsRouter.get("/", async (req, res) => {
  if (req.staff!.role === "Engineer") return res.status(403).json({ error: "Engineers can only use the engineer app" });
  const [orders, quotes, payments, invoices, reviews, accounts, surveys, inventory, enquiries, returns, repairs, unassigned] = await Promise.all([
    db.from("orders").select("id", { count: "exact", head: true }).in("status", ["pending", "confirmed"]),
    db.from("quotes").select("submitted_at").eq("status", "submitted"),
    db.from("payments").select("id", { count: "exact", head: true }).eq("status", "pending").neq("method", "invoice_terms"),
    db.from("payments").select("id", { count: "exact", head: true }).eq("method", "invoice_terms").eq("status", "overdue"),
    db.from("reviews").select("id", { count: "exact", head: true }).eq("state", "pending"),
    db.from("customers").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    db.from("site_surveys").select("id", { count: "exact", head: true }).eq("stage", "requested"),
    db.from("inventory").select("id", { count: "exact", head: true }).lt("quantity_on_hand", 3),
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("done", false),
    db.from("returns").select("id", { count: "exact", head: true }).eq("state", "Open"),
    db.from("repairs").select("id", { count: "exact", head: true }).not("stage", "in", "(fixing,returned)"),
    db.from("jobs").select("id", { count: "exact", head: true }).is("engineer_staff_id", null),
  ]);

  const quoteRows = quotes.data ?? [];
  const quotesOverdue = quoteRows.some((q) => q.submitted_at && (Date.now() - new Date(q.submitted_at).getTime()) / 60000 > SLA_MINUTES);

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
    returns: returns.count ?? 0,
    repairs: repairs.count ?? 0,
    unassigned: unassigned.count ?? 0,
  });
});
