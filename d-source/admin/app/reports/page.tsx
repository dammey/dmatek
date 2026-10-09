"use client";

import { useEffect, useState } from "react";
import { Card, Kpi } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";

type Report = { sales: number; homeSales: number; businessSales: number; orderCount: number; quoteSlaMetPct: number | null; ordersByStage: Record<string, number>; pilotInterest: number };

export default function ReportsPage() {
  const [data, setData] = useState<Report | null>(null);

  useEffect(() => {
    api.get<Report>("/admin/reports").then(setData);
  }, []);

  const bar = (label: string, v: number, max: number, col: string, valueLabel: string) => (
    <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(90px,150px) minmax(0,1fr) auto", gap: 10, alignItems: "center", fontSize: 13.5 }}>
      <span>{label}</span>
      <span style={{ height: 12, borderRadius: 6, background: "#F3F0E9", overflow: "hidden" }}>
        <span style={{ display: "block", height: "100%", width: `${Math.max(2, Math.round((100 * v) / (max || 1)))}%`, background: col, borderRadius: 6 }} />
      </span>
      <span style={{ fontWeight: 800 }}>{valueLabel}</span>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 12, marginBottom: 16 }}>
        <Kpi label="SALES" value={fmt(data?.sales ?? 0)} sub="All time" />
        <Kpi label="ORDERS" value={String(data?.orderCount ?? 0)} sub="All time" />
        <Kpi label="QUOTE SLA MET" value={data?.quoteSlaMetPct != null ? `${data.quoteSlaMetPct}%` : "—"} sub="Replied within promised hours" />
        <Kpi label="PILOT INTEREST" value={String(data?.pilotInterest ?? 0)} sub="Device care plan" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16 }}>
        <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 17 }}>Sales by store</span>
          {bar("D’Emporium", data?.homeSales ?? 0, data?.sales ?? 1, "#A6F000", fmt(data?.homeSales ?? 0))}
          {bar("D’Provision", data?.businessSales ?? 0, data?.sales ?? 1, "#D4A637", fmt(data?.businessSales ?? 0))}
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 17 }}>Orders by stage</span>
          {Object.entries(data?.ordersByStage ?? {}).map(([stage, n]) => bar(stage, n, data?.orderCount ?? 1, "#06382E", String(n)))}
          {!Object.keys(data?.ordersByStage ?? {}).length && <span style={{ color: "#5E6E68", fontSize: 14 }}>No orders yet.</span>}
        </Card>
      </div>
    </div>
  );
}
