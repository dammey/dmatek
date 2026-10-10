"use client";

import { useEffect, useState } from "react";
import { STAGES, STATUS_KEYS } from "@/components/orders";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";

type Report = {
  sales7: number;
  orders7: number;
  quotePromiseMetPct: number | null;
  slaHours: number;
  sales: number;
  homeSales: number;
  byCategory: Record<string, number>;
  ordersByStage: Record<string, number>;
  orderCount: number;
  pilots: Record<string, number>;
};

type Bar = { label: string; v: string; w: string; col: string };
const bar = (label: string, v: number, max: number, col: string, vv: string): Bar => ({ label, v: vv, w: `${Math.max(2, Math.round((100 * v) / (max || 1)))}%`, col });

export default function ReportsPage() {
  const [d, setD] = useState<Report | null>(null);
  useEffect(() => {
    api.get<Report>("/admin/reports").then(setD).catch(() => {});
  }, []);

  const tiles = [
    { label: "SALES", value: d ? fmt(d.sales7) : "—", sub: "Last 7 days" },
    { label: "ORDERS", value: d ? String(d.orders7) : "—", sub: "Last 7 days" },
    { label: "QUOTE PROMISE MET", value: d?.quotePromiseMetPct != null ? `${d.quotePromiseMetPct}%` : "—", sub: `Replied within ${d?.slaHours ?? 24} working hours` },
    { label: "QUOTE TO ORDER", value: "—", sub: "Needs 30 days of data" },
  ];

  const cats = d ? Object.entries(d.byCategory).sort((a, b) => b[1] - a[1]) : [];
  const cmax = Math.max(...cats.map((c) => c[1]), 1);
  const pilots = d ? Object.entries(d.pilots) : [];
  const pmax = Math.max(...pilots.map((p) => p[1]), 1);
  const charts: { title: string; sub: string; bars: Bar[] }[] = d
    ? [
        { title: "Sales by store", sub: "From live orders", bars: [bar("D’Emporium", d.homeSales, d.sales, "#A6F000", fmt(d.homeSales)), bar("D’Provision", d.sales - d.homeSales, d.sales, "#D4A637", fmt(d.sales - d.homeSales))] },
        { title: "Sales by category", sub: "From live orders", bars: cats.map(([k, v]) => bar(k, v, cmax, "#1F7A5A", fmt(v))) },
        { title: "Orders by stage", sub: "Right now", bars: STAGES.map((l, i) => bar(l, d.ordersByStage[STATUS_KEYS[i]] ?? 0, d.orderCount, "#06382E", String(d.ordersByStage[STATUS_KEYS[i]] ?? 0))) },
        { title: "Pilot interest", sub: "From “join the pilot” requests", bars: pilots.length ? pilots.map(([k, v]) => bar(k, v, pmax, "#D4A637", String(v))) : [bar("Device care plan", 0, 1, "#D4A637", "0")] },
      ]
    : [];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 12 }}>
        {tiles.map((k) => (
          <div key={k.label} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 18, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#28705A" }}>{k.label}</span>
            <span style={{ fontWeight: 800, fontSize: 32, letterSpacing: "-.04em" }}>{k.value}</span>
            <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{k.sub}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16, alignItems: "start" }}>
        {charts.map((c) => (
          <section key={c.title} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 800, fontSize: 17 }}>{c.title}</span>
              <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{c.sub}</span>
            </div>
            {c.bars.map((b) => (
              <div key={b.label} style={{ display: "grid", gridTemplateColumns: "minmax(90px,150px) minmax(0,1fr) auto", gap: 10, alignItems: "center", fontSize: 13.5 }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.label}</span>
                <span style={{ height: 12, borderRadius: 6, background: "#F3F0E9", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: b.w, background: b.col, borderRadius: 6 }} />
                </span>
                <span style={{ fontWeight: 800, whiteSpace: "nowrap" }}>{b.v}</span>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
