"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Kpi, Card } from "@/components/ui";
import { api } from "@/lib/api";

type Data = {
  kpis: { ordersToConfirm: number; quotesOpen: number; reviewsPending: number; accountsPending: number; surveysPending: number; lowStock: number };
  recentOrders: { ref: string; status: string; placed_at: string; channel: string; customers?: { full_name: string } }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    api.get<Data>("/admin/dashboard").then(setData).catch(() => {});
  }, []);

  const k = data?.kpis;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="What needs you today" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: 12, marginBottom: 20 }}>
        <Kpi label="ORDERS TO CONFIRM" value={String(k?.ordersToConfirm ?? "—")} sub="Call to confirm delivery" />
        <Kpi label="QUOTES OPEN" value={String(k?.quotesOpen ?? "—")} sub="Reply within SLA" ink={k && k.quotesOpen > 0 ? "#B25E00" : undefined} />
        <Kpi label="REVIEWS TO CHECK" value={String(k?.reviewsPending ?? "—")} sub="Match against purchases" />
        <Kpi label="ACCOUNTS TO APPROVE" value={String(k?.accountsPending ?? "—")} sub="30-day invoice" />
        <Kpi label="SURVEYS TO SCHEDULE" value={String(k?.surveysPending ?? "—")} sub="Free site surveys" />
        <Kpi label="LOW STOCK" value={String(k?.lowStock ?? "—")} sub="Live products under 3" ink={k && k.lowStock > 0 ? "#B25E00" : undefined} />
      </div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Recent orders</span>
          <Link href="/orders" style={{ fontWeight: 800, fontSize: 13.5, borderBottom: "2px solid #D4A637" }}>
            All orders →
          </Link>
        </div>
        {!data?.recentOrders.length && <p style={{ color: "#5E6E68" }}>No orders yet.</p>}
        {data?.recentOrders.map((o) => (
          <div key={o.ref} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: 12, padding: "12px 0", borderTop: "1px solid #EEEAE2" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{o.ref}</span>
              <span style={{ fontSize: 13.5, color: "#5E6E68" }}>{o.customers?.full_name}</span>
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 800 }}>{o.status}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
