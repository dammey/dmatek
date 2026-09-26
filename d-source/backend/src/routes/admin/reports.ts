import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminReportsRouter = Router();
adminReportsRouter.use(requireStaff("Reports"));

adminReportsRouter.get("/", async (_req, res) => {
  const { data: orders } = await db.from("orders").select("channel, status, order_lines(quantity, unit_price)");
  const { data: quotes } = await db.from("quotes").select("status, submitted_at");
  const { data: enquiries } = await db.from("enquiries").select("type");

  const total = (o: { order_lines: { quantity: number; unit_price: number }[] }) => o.order_lines.reduce((a, l) => a + l.quantity * l.unit_price, 0);
  const sales = (orders ?? []).reduce((a, o) => a + total(o), 0);
  const homeSales = (orders ?? []).filter((o) => o.channel === "emporium").reduce((a, o) => a + total(o), 0);
  const byStage = (orders ?? []).reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.status]: (acc[o.status] ?? 0) + 1 }), {});
  const pilotInterest = (enquiries ?? []).filter((e) => e.type === "Pilot interest").length;
  const SLA_MINUTES = 240;
  const metSla = (quotes ?? []).filter((q) => q.status !== "submitted" || (q.submitted_at && (Date.now() - new Date(q.submitted_at).getTime()) / 60000 <= SLA_MINUTES)).length;

  res.json({
    sales,
    homeSales,
    businessSales: sales - homeSales,
    orderCount: (orders ?? []).length,
    quoteSlaMetPct: quotes?.length ? Math.round((100 * metSla) / quotes.length) : null,
    ordersByStage: byStage,
    pilotInterest,
  });
});
