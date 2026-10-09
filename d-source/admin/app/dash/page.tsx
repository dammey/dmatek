"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Kpi, Card } from "@/components/ui";
import { api } from "@/lib/api";

type Attention = { tag: string; text: string; tagBg: string; tagInk: string; route: string };
type Data = {
  kpis: { ordersToConfirm: number; quotesOpen: number; reviewsPending: number; accountsPending: number; surveysPending: number; lowStock: number };
  attention: Attention[];
  recentOrders: { ref: string; status: string; placed_at: string; channel: string; customers?: { full_name: string } }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    api.get<Data>("/admin/dashboard").then(setData).catch(() => {});
  }, []);

  const k = data?.kpis;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="What needs you today" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: 12, marginBottom: 20 }}>
        <Kpi label="ORDERS TO CONFIRM" value={String(k?.ordersToConfirm ?? "—")} sub="Call to confirm delivery" onClick={() => router.push("/orders")} />
        <Kpi label="QUOTES OPEN" value={String(k?.quotesOpen ?? "—")} sub="Reply within SLA" ink={k && k.quotesOpen > 0 ? "#B25E00" : undefined} onClick={() => router.push("/quotes")} />
        <Kpi label="REVIEWS TO CHECK" value={String(k?.reviewsPending ?? "—")} sub="Match against purchases" onClick={() => router.push("/reviews")} />
        <Kpi label="ACCOUNTS TO APPROVE" value={String(k?.accountsPending ?? "—")} sub="30-day invoice" onClick={() => router.push("/accounts")} />
        <Kpi label="SURVEYS TO SCHEDULE" value={String(k?.surveysPending ?? "—")} sub="Free site surveys" onClick={() => router.push("/surveys")} />
        <Kpi label="LOW STOCK" value={String(k?.lowStock ?? "—")} sub="Live products under 3" ink={k && k.lowStock > 0 ? "#B25E00" : undefined} onClick={() => router.push("/products")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16, alignItems: "start" }}>
        <Card>
          <span style={{ fontWeight: 800, fontSize: 18, display: "block", marginBottom: 8 }}>Needs attention</span>
          {!data?.attention.length && <p style={{ color: "#5E6E68" }}>Nothing needs you right now.</p>}
          {data?.attention.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => router.push(a.route)}
              style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 12, alignItems: "center", border: 0, borderTop: "1px solid #EEEAE2", background: "transparent", padding: "12px 0", textAlign: "left", color: "#06382E", width: "100%" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", padding: "4px 8px", borderRadius: 4, background: a.tagBg, color: a.tagInk, whiteSpace: "nowrap" }}>{a.tag}</span>
              <span style={{ fontSize: 14.5, fontWeight: 600 }}>{a.text}</span>
              <span style={{ fontWeight: 800, color: "#28705A" }}>→</span>
            </button>
          ))}
        </Card>
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
    </div>
  );
}
