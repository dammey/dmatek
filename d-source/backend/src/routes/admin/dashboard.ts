import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminDashboardRouter = Router();
adminDashboardRouter.use(requireStaff("Dashboard"));

adminDashboardRouter.get("/", async (_req, res) => {
  const [ordersToConfirm, quotesOpen, reviewsPending, accountsPending, surveysPending, lowStock, recentOrders] = await Promise.all([
    db.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("quotes").select("id", { count: "exact", head: true }).eq("status", "submitted"),
    db.from("reviews").select("id", { count: "exact", head: true }).eq("state", "pending"),
    db.from("customers").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    db.from("site_surveys").select("id", { count: "exact", head: true }).eq("stage", "requested"),
    db.from("inventory").select("id", { count: "exact", head: true }).lt("quantity_on_hand", 3),
    db.from("orders").select("ref, status, placed_at, channel, customers(full_name)").order("placed_at", { ascending: false }).limit(5),
  ]);

  res.json({
    kpis: {
      ordersToConfirm: ordersToConfirm.count ?? 0,
      quotesOpen: quotesOpen.count ?? 0,
      reviewsPending: reviewsPending.count ?? 0,
      accountsPending: accountsPending.count ?? 0,
      surveysPending: surveysPending.count ?? 0,
      lowStock: lowStock.count ?? 0,
    },
    recentOrders: recentOrders.data ?? [],
  });
});
