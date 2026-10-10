import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";
import { lowStockCount } from "../../util/stock.js";
import { SETTINGS_KEYS, getSettings, quoteSlaMinutes } from "../../util/settings.js";

export const adminDashboardRouter = Router();
adminDashboardRouter.use(requireStaff("Dashboard"));

const ORDER_ROW = "ref, status, placed_at, channel, customers(full_name, company_name), addresses:shipping_address_id(city, state), order_lines(quantity, unit_price), payments(method, status)";

/** GET /admin/dashboard — the raw lists the v3 dashboard is built from
 * (KPIs, "Needs attention", recent orders). */
adminDashboardRouter.get("/", async (_req, res) => {
  const [sla, settings, toSource, openQuotes, reviewsPending, accountsPending, surveysPending, lowStock, recent, requests] = await Promise.all([
    quoteSlaMinutes(),
    getSettings(),
    db.from("orders").select(ORDER_ROW).eq("status", "pending").order("placed_at", { ascending: true }),
    db.from("quotes").select("ref, status, submitted_at, customers(full_name, company_name)").eq("status", "submitted"),
    db.from("reviews").select("id", { count: "exact", head: true }).eq("state", "pending"),
    db.from("customers").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    db.from("site_surveys").select("id", { count: "exact", head: true }).eq("stage", "requested"),
    lowStockCount(),
    db.from("orders").select(ORDER_ROW).neq("status", "cancelled").order("placed_at", { ascending: false }).limit(5),
    db.from("enquiries").select("id, type, from_name, from_contact").eq("done", false).in("type", ["Sourcing request", "Return / failed inspection", "Repair collection"]).order("created_at"),
  ]);
  const now = Date.now();
  res.json({
    sla,
    quotes: (openQuotes.data ?? []).map((q) => ({ ...q, ago: q.submitted_at ? Math.floor((now - new Date(q.submitted_at).getTime()) / 60000) : 0 })),
    toSource: toSource.data ?? [],
    reviewsPending: reviewsPending.count ?? 0,
    accountsPending: accountsPending.count ?? 0,
    surveysPending: surveysPending.count ?? 0,
    lowStock,
    recent: recent.data ?? [],
    requests: requests.data ?? [],
    // Prototype: the first ten settings (fees … WhatsApp) must all be filled.
    settingsIncomplete: !SETTINGS_KEYS.slice(0, 10).every((k) => Boolean(settings[k])),
  });
});
