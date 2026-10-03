import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminDashboardRouter = Router();
adminDashboardRouter.use(requireStaff("Dashboard"));

const SLA_MINUTES = 240;

const SETTINGS_FIELDS = ["address", "returnsPolicy", "businessAccountReviewTime", "deliveryTimesAndFees", "podAreas", "phone", "email", "whatsapp"];

adminDashboardRouter.get("/", async (_req, res) => {
  const [ordersToConfirm, quotesOpen, reviewsPending, accountsPending, surveysPending, lowStock, recentOrders, openQuotes, pendingOrders, repairEnquiries, settingsRow] = await Promise.all([
    db.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("quotes").select("id", { count: "exact", head: true }).eq("status", "submitted"),
    db.from("reviews").select("id", { count: "exact", head: true }).eq("state", "pending"),
    db.from("customers").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    db.from("site_surveys").select("id", { count: "exact", head: true }).eq("stage", "requested"),
    db.from("inventory").select("id", { count: "exact", head: true }).lt("quantity_on_hand", 3),
    db.from("orders").select("ref, status, placed_at, channel, customers(full_name)").order("placed_at", { ascending: false }).limit(5),
    db.from("quotes").select("ref, submitted_at, customers(full_name, company_name)").eq("status", "submitted").order("submitted_at", { ascending: true }).limit(3),
    db.from("orders").select("ref, customers(full_name)").eq("status", "pending"),
    db.from("enquiries").select("from_name, created_at").eq("type", "Repair collection").eq("done", false),
    db.from("storefront_content").select("value").eq("key", "settings").maybeSingle(),
  ]);

  const attention: { tag: string; text: string; tagBg: string; tagInk: string; route: string }[] = [];

  for (const q of openQuotes.data ?? []) {
    const ago = q.submitted_at ? Math.floor((Date.now() - new Date(q.submitted_at).getTime()) / 60000) : 0;
    const due = ago > SLA_MINUTES ? `overdue by ${ago - SLA_MINUTES} min` : `due in ${SLA_MINUTES - ago} min`;
    const org = (q.customers as unknown as { full_name: string; company_name: string | null } | null)?.company_name ?? (q.customers as unknown as { full_name: string } | null)?.full_name ?? q.ref;
    attention.push({ tag: "QUOTE", text: `${org} · ${due}`, tagBg: "#D4A637", tagInk: "#06382E", route: "/quotes" });
  }
  for (const o of pendingOrders.data ?? []) {
    const name = (o.customers as unknown as { full_name: string } | null)?.full_name ?? o.ref;
    attention.push({ tag: "ORDER", text: `${name} · ${o.ref} · call to confirm`, tagBg: "#EFEADC", tagInk: "#06382E", route: "/orders" });
  }
  for (const e of repairEnquiries.data ?? []) {
    attention.push({ tag: "REPAIR", text: `${e.from_name} · collection requested`, tagBg: "#DCEBFF", tagInk: "#1B4A8A", route: "/enquiries" });
  }
  const settings = (settingsRow.data?.value as Record<string, unknown>) ?? {};
  if (!SETTINGS_FIELDS.every((f) => Boolean(settings[f]))) {
    attention.push({ tag: "SETTINGS", text: "Storefront still shows [ TO CONFIRM ] details", tagBg: "#FDE7E4", tagInk: "#B42318", route: "/settings" });
  }

  res.json({
    kpis: {
      ordersToConfirm: ordersToConfirm.count ?? 0,
      quotesOpen: quotesOpen.count ?? 0,
      reviewsPending: reviewsPending.count ?? 0,
      accountsPending: accountsPending.count ?? 0,
      surveysPending: surveysPending.count ?? 0,
      lowStock: lowStock.count ?? 0,
    },
    attention: attention.slice(0, 6),
    recentOrders: recentOrders.data ?? [],
  });
});
