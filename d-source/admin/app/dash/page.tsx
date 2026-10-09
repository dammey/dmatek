"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderDrawer, ST_COL, STAGES, stageOf, type Order } from "@/components/orders";
import { QuoteDrawer } from "@/components/quotes";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";

type DashQuote = { ref: string; status: string; ago: number; customers?: { full_name: string; company_name: string | null } | null };
type Data = {
  sla: number;
  quotes: DashQuote[];
  toSource: Order[];
  reviewsPending: number;
  accountsPending: number;
  surveysPending: number;
  lowStock: number;
  recent: Order[];
  requests: { id: string; type: string; from_name: string | null; from_contact: string | null }[];
  settingsIncomplete: boolean;
};

const hm = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
const who = (c?: { full_name: string; company_name: string | null } | null) => c?.company_name || c?.full_name || "[ CUSTOMER ]";
const total = (o: Order) => o.order_lines.reduce((a, l) => a + l.quantity * l.unit_price, 0);

export default function DashboardPage() {
  const router = useRouter();
  const [d, setD] = useState<Data | null>(null);
  const [drawer, setDrawer] = useState<{ t: "order" | "quote"; id: string } | null>(null);

  function load() {
    api.get<Data>("/admin/dashboard").then(setD).catch(() => {});
  }
  useEffect(load, []);

  const sla = d?.sla ?? 1440;
  const n = (v: number | undefined) => (d ? String(v) : "—");
  const overdue = d ? d.quotes.filter((x) => x.ago > sla).length : 0;
  const soon = d ? d.quotes.filter((x) => x.ago <= sla && sla - x.ago < 60).length : 0;
  const go = (id: string) => () => router.push(`/${id}`);

  const kpis = [
    { label: "TO SOURCE", value: n(d?.toSource.length), sub: "Order placed, find the item", ink: "#06382E", go: go("orders") },
    { label: "QUOTES OPEN", value: n(d?.quotes.length), sub: overdue ? `${overdue} past ${sla / 60} hours` : `${soon} due soon · 24-hour promise`, ink: overdue ? "#B42318" : "#06382E", go: go("quotes") },
    { label: "REVIEWS TO CHECK", value: n(d?.reviewsPending), sub: "Match against purchases", ink: "#06382E", go: go("reviews") },
    { label: "ACCOUNTS TO APPROVE", value: n(d?.accountsPending), sub: "30-day invoice", ink: "#06382E", go: go("accounts") },
    { label: "SURVEYS TO SCHEDULE", value: n(d?.surveysPending), sub: "Free site surveys", ink: "#06382E", go: go("surveys") },
    { label: "LOW STOCK", value: n(d?.lowStock), sub: "Live products under 3", ink: d?.lowStock ? "#B25E00" : "#06382E", go: go("products") },
  ];

  const att: { tag: string; text: string; bg: string; ink: string; go: () => void }[] = [];
  if (d) {
    [...d.quotes]
      .sort((a, b) => b.ago - a.ago)
      .slice(0, 3)
      .forEach((x) => {
        const left = sla - x.ago;
        const due = left < 0 ? `Overdue by ${hm(-left)}` : `Due in ${hm(left)}`;
        att.push({ tag: "QUOTE", text: `${who(x.customers)} · ${due}`, bg: "#D4A637", ink: "#06382E", go: () => setDrawer({ t: "quote", id: x.ref }) });
      });
    d.toSource.forEach((o) => att.push({ tag: "ORDER", text: `${who(o.customers)} · ${o.ref} · source it`, bg: "#EFEADC", ink: "#06382E", go: () => setDrawer({ t: "order", id: o.ref }) }));
    const from = (e: Data["requests"][number]) => e.from_name || e.from_contact || "[ NAME ]";
    d.requests.filter((e) => e.type === "Sourcing request").forEach((e) => att.push({ tag: "SOURCING", text: `${from(e)} · reply within 1 hour (8am–8pm)`, bg: "#D9F0E3", ink: "#1F7A5A", go: go("enquiries") }));
    d.requests.filter((e) => e.type === "Return / failed inspection").forEach((e) => att.push({ tag: "RETURN", text: `${from(e)} · failed inspection`, bg: "#FDE7E4", ink: "#9E1B32", go: go("enquiries") }));
    d.requests.filter((e) => e.type === "Repair collection").forEach((e) => att.push({ tag: "REPAIR", text: `${from(e)} · collection requested`, bg: "#DCEBFF", ink: "#1B4A8A", go: go("enquiries") }));
    if (d.settingsIncomplete) att.push({ tag: "SETTINGS", text: "Storefront still shows [ TO CONFIRM ] details", bg: "#FDE7E4", ink: "#B42318", go: go("settings") });
  }

  const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 4 };
  const rowBtn: React.CSSProperties = { display: "grid", gap: 12, alignItems: "center", border: 0, borderTop: "1px solid #EEEAE2", background: "transparent", padding: "12px 0", textAlign: "left", color: "#06382E" };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: 12 }}>
        {kpis.map((k) => (
          <button key={k.label} type="button" onClick={k.go} className="ds-kpi" style={{ textAlign: "left", border: "1px solid rgba(6,56,46,.1)", background: "#fff", color: "#06382E", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#28705A" }}>{k.label}</span>
            <span style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-.04em", color: k.ink }}>{k.value}</span>
            <span style={{ fontSize: 13, color: "#5E6E68" }}>{k.sub}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16, alignItems: "start" }}>
        <section style={card}>
          <span style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Needs attention</span>
          {att.slice(0, 6).map((a, i) => (
            <button key={i} type="button" onClick={a.go} style={{ ...rowBtn, gridTemplateColumns: "auto minmax(0,1fr) auto" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: ".12em", padding: "4px 8px", borderRadius: 4, background: a.bg, color: a.ink, whiteSpace: "nowrap" }}>{a.tag}</span>
              <span style={{ fontSize: 14.5, fontWeight: 600 }}>{a.text}</span>
              <span style={{ fontWeight: 800, color: "#28705A" }}>→</span>
            </button>
          ))}
          {d && !att.length && <span style={{ fontSize: 14, color: "#5E6E68", padding: "12px 0", borderTop: "1px solid #EEEAE2" }}>Nothing needs you right now.</span>}
        </section>
        <section style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Recent orders</span>
            <button type="button" onClick={go("orders")} style={{ border: 0, background: "transparent", fontWeight: 800, fontSize: 13.5, color: "#06382E", borderBottom: "2px solid #D4A637", padding: "0 0 2px" }}>
              All orders →
            </button>
          </div>
          {(d?.recent ?? []).map((o) => {
            const i = Math.max(0, stageOf(o.status));
            return (
              <button key={o.ref} type="button" onClick={() => setDrawer({ t: "order", id: o.ref })} style={{ ...rowBtn, gridTemplateColumns: "minmax(0,1fr) auto auto" }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{o.ref}</span>
                  <span style={{ fontSize: 13.5, color: "#5E6E68", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {who(o.customers)} · {o.addresses?.city ?? "[ CITY ]"}
                  </span>
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: ST_COL[i][0], color: ST_COL[i][1], whiteSpace: "nowrap" }}>{STAGES[i]}</span>
                <span style={{ fontWeight: 800, whiteSpace: "nowrap" }}>{fmt(total(o))}</span>
              </button>
            );
          })}
          {d && !d.recent.length && <span style={{ fontSize: 14, color: "#5E6E68", padding: "12px 0", borderTop: "1px solid #EEEAE2" }}>No orders yet.</span>}
        </section>
      </div>
      {drawer?.t === "order" && <OrderDrawer orderRef={drawer.id} onClose={() => setDrawer(null)} onChanged={load} />}
      {drawer?.t === "quote" && <QuoteDrawer quoteRef={drawer.id} sla={sla} onClose={() => setDrawer(null)} onChanged={load} />}
    </>
  );
}
