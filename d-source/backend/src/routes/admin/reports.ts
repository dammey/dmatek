import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";
import { quoteSlaMinutes } from "../../util/settings.js";

export const adminReportsRouter = Router();
adminReportsRouter.use(requireStaff("Reports"));

type Line = { quantity: number; unit_price: number; products?: { store: string; categories?: { name: string } | null; category_id: string | null } | null };

/** GET /admin/reports — the four v3 tiles and four charts, from real data:
 * last-7-day sales and orders, quote promise met, sales by store and by
 * category, orders by stage, and pilot interest grouped by pilot. */
adminReportsRouter.get("/", async (_req, res) => {
  const since = new Date(Date.now() - 7 * 86400e3).toISOString();
  const [sla, { data: orders }, { data: week }, { data: quotes }, { data: pilots }, { data: placements }] = await Promise.all([
    quoteSlaMinutes(),
    db.from("orders").select("channel, status, placed_at, order_lines(quantity, unit_price, products(store, category_id, categories(name)))").neq("status", "cancelled"),
    db.from("orders").select("id", { count: "exact" }).gte("placed_at", since).neq("status", "cancelled"),
    db.from("quotes").select("status, submitted_at, priced_at"),
    db.from("enquiries").select("message").eq("type", "Pilot interest"),
    db.from("category_placements").select("store, category_id, label"),
  ]);
  const all = orders ?? [];
  const total = (o: { order_lines: Line[] }) => o.order_lines.reduce((a, l) => a + Number(l.quantity) * Number(l.unit_price), 0);
  const recent = all.filter((o) => o.placed_at >= since);
  const sales7 = recent.reduce((a, o) => a + total(o as unknown as { order_lines: Line[] }), 0);
  const sales = all.reduce((a, o) => a + total(o as unknown as { order_lines: Line[] }), 0);
  const homeSales = all.filter((o) => o.channel === "emporium").reduce((a, o) => a + total(o as unknown as { order_lines: Line[] }), 0);

  // Category label as the admin shows it: the store's bar label, "(business)" for business categories.
  const byCategory: Record<string, number> = {};
  for (const o of all) {
    for (const l of o.order_lines as unknown as Line[]) {
      const p = l.products;
      const pl = (placements ?? []).find((x) => x.store === p?.store && x.category_id === p?.category_id);
      const name = pl?.label ?? p?.categories?.name ?? "Other";
      const key = p?.store === "provision" ? `${name} (business)` : name;
      byCategory[key] = (byCategory[key] ?? 0) + Number(l.quantity) * Number(l.unit_price);
    }
  }

  const now = Date.now();
  const q = quotes ?? [];
  const met = q.filter((x) => {
    if (!x.submitted_at) return true;
    const end = x.priced_at ? new Date(x.priced_at).getTime() : now;
    return (end - new Date(x.submitted_at).getTime()) / 60000 <= sla;
  }).length;

  const pilotCounts: Record<string, number> = {};
  for (const e of pilots ?? []) {
    const m = /\(Pilot:\s*([^)]+)\)/.exec(e.message ?? "");
    const name = m ? m[1].trim() : "[ PILOT ]";
    pilotCounts[name] = (pilotCounts[name] ?? 0) + 1;
  }

  res.json({
    sales7,
    orders7: week?.length ?? 0,
    quotePromiseMetPct: q.length ? Math.round((100 * met) / q.length) : null,
    slaHours: sla / 60,
    sales,
    homeSales,
    byCategory,
    ordersByStage: all.reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.status]: (acc[o.status] ?? 0) + 1 }), {}),
    orderCount: all.length,
    pilots: pilotCounts,
  });
});
