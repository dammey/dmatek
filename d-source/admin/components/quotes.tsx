"use client";

import { useEffect, useState } from "react";
import DrawerShell from "@/components/DrawerShell";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

type QuoteLine = { id: string; description: string; quantity: number; unit_price: number | null };
export type Quote = {
  ref: string;
  status: string;
  submitted_at: string;
  spec_notes: string | null;
  customer_note: string | null;
  discount_pct: number;
  ago: number;
  customers?: { full_name: string; company_name: string | null; phone: string | null; email: string | null } | null;
  quote_lines: QuoteLine[];
};

const COLS = "120px minmax(180px,1fr) 80px 120px 160px 110px 70px";
export const isNew = (q: Quote) => q.status === "submitted" || q.status === "draft";
const statusLabel = (q: Quote) => (isNew(q) ? "New" : "Sent");
const org = (q: Quote) => q.customers?.company_name || q.customers?.full_name || "[ ORGANISATION ]";
const contact = (q: Quote) => [q.customers?.company_name ? q.customers?.full_name : null, q.customers?.phone || q.customers?.email].filter(Boolean).join(" · ") || "[ CONTACT ]";
const hm = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

/** Reply due, as the prototype's due(): Replied / Overdue by / Due in. */
export function due(q: Quote, sla: number): [string, string] {
  const left = sla - q.ago;
  if (!isNew(q)) return ["Replied", "#1F7A5A"];
  if (left < 0) return [`Overdue by ${hm(-left)}`, "#B42318"];
  return [`Due in ${hm(left)}`, left < 60 ? "#B25E00" : "#06382E"];
}

const subtotal = (q: Quote) => q.quote_lines.reduce((a, l) => a + l.quantity * (l.unit_price ?? 0), 0);
const qTotal = (q: Quote) => subtotal(q) * (1 - (q.discount_pct || 0) / 100);

export function QuotesView() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [sla, setSla] = useState(1440);
  const [selected, setSelected] = useState<string | null>(null);
  const { q } = useSearch();

  function load() {
    api
      .get<{ quotes: Quote[]; slaMinutes: number }>("/admin/quotes")
      .then((d) => {
        setQuotes(d.quotes);
        setSla(d.slaMinutes);
      })
      .catch(() => setQuotes([]));
  }
  useEffect(load, []);

  const needle = q.trim().toLowerCase();
  const rows = (quotes ?? []).filter((x) => !needle || `${x.ref} ${org(x)}`.toLowerCase().includes(needle));

  return (
    <>
      <div style={{ background: "#EFEADC", borderRadius: 16, padding: "14px 18px", fontSize: 14, color: "#3A4A44" }}>
        The storefront promises a reply <strong>within {sla / 60} hours</strong>. Quotes turn red when they pass it.
      </div>
      <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
        <div style={{ minWidth: 820 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
            <span>REFERENCE</span>
            <span>ORGANISATION</span>
            <span>LINES</span>
            <span>ESTIMATE</span>
            <span>REPLY DUE</span>
            <span>STATUS</span>
            <span />
          </div>
          {rows.map((x) => {
            const [d, ink] = due(x, sla);
            const n = isNew(x);
            return (
              <div key={x.ref} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "13px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{x.ref}</span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ fontWeight: 700 }}>{org(x)}</span>
                  <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{contact(x)}</span>
                </span>
                <span>{x.quote_lines.length ? String(x.quote_lines.length) : "Described"}</span>
                <span style={{ fontWeight: 800 }}>{qTotal(x) ? fmt(qTotal(x)) : "To price"}</span>
                <span style={{ fontWeight: 800, color: ink }}>{d}</span>
                <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: n ? "#FFF1CC" : "#D9F0E3", color: n ? "#7A5B00" : "#1F7A5A", justifySelf: "start" }}>{statusLabel(x)}</span>
                <button type="button" onClick={() => setSelected(x.ref)} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "7px 12px", fontSize: 13, fontWeight: 700 }}>
                  Open
                </button>
              </div>
            );
          })}
          {quotes && !rows.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No quotes yet.</div>}
        </div>
      </div>
      {selected && <QuoteDrawer quoteRef={selected} sla={sla} onClose={() => setSelected(null)} onChanged={load} />}
    </>
  );
}

const lineInput: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 10, padding: 9, fontSize: 14, textAlign: "right", background: "#fff", color: "#06382E" };

export function QuoteDrawer({ quoteRef, sla, onClose, onChanged }: { quoteRef: string; sla: number; onClose: () => void; onChanged: () => void }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const { say } = useToast();

  useEffect(() => {
    api.get<{ quote: Quote }>(`/admin/quotes/${quoteRef}`).then(({ quote }) => setQuote({ ...quote, discount_pct: Number(quote.discount_pct) || 0 }));
  }, [quoteRef]);

  if (!quote) return null;
  const sub = subtotal(quote);
  const disc = (sub * (quote.discount_pct || 0)) / 100;
  const net = sub - disc;
  const vat = net * 0.075;
  const setLine = (id: string, v: number) => setQuote({ ...quote, quote_lines: quote.quote_lines.map((l) => (l.id === id ? { ...l, unit_price: v } : l)) });

  async function send() {
    const qq = quote!;
    for (const l of qq.quote_lines) await api.patch(`/quotes/${quoteRef}/lines/${l.id}`, { unitPrice: Number(l.unit_price ?? 0) });
    await api.patch(`/admin/quotes/${quoteRef}`, { discountPct: qq.discount_pct || 0, note: qq.customer_note ?? "" });
    await api.post(`/quotes/${quoteRef}/send`);
    say(`Quote ${quoteRef} sent`);
    onChanged();
    onClose();
  }

  const meta: [string, string][] = [
    ["Contact", contact(quote)],
    ["Received", `${hm(quote.ago)} ago`],
    ["Reply", due(quote, sla)[0]],
    ["Status", statusLabel(quote)],
  ];

  return (
    <DrawerShell kicker={quote.ref} title={org(quote)} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "130px minmax(0,1fr)", gap: "8px 12px", fontSize: 14 }}>
        {meta.map(([k, v]) => (
          <Pair key={k} k={k} v={v} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#28705A" }}>LINES · UNIT PRICE EX. VAT</span>
        {quote.quote_lines.length ? (
          quote.quote_lines.map((l) => (
            <div key={l.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 60px 130px", gap: 8, alignItems: "center", fontSize: 14 }}>
              <span style={{ fontWeight: 700 }}>{l.description}</span>
              <span style={{ textAlign: "center" }}>× {Number(l.quantity)}</span>
              <input value={l.unit_price ? String(l.unit_price) : ""} onChange={(e) => setLine(l.id, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)} inputMode="numeric" style={lineInput} />
            </div>
          ))
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 60px 130px", gap: 8, alignItems: "center", fontSize: 14 }}>
            <span style={{ fontWeight: 700 }}>{quote.spec_notes || "No list — customer described the need. Price after the site survey."}</span>
            <span style={{ textAlign: "center" }}>× —</span>
            <input disabled inputMode="numeric" style={lineInput} />
          </div>
        )}
      </div>
      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: 14, fontWeight: 700 }}>
        Volume discount %
        <input
          value={quote.discount_pct ? String(quote.discount_pct) : ""}
          onChange={(e) => setQuote({ ...quote, discount_pct: Math.min(50, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0) })}
          inputMode="numeric"
          style={{ ...lineInput, width: 90 }}
        />
      </label>
      <div style={{ background: "#F5F1E8", borderRadius: 16, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
        {(
          [
            ["Subtotal", fmt(sub), 600],
            ["Volume discount", `− ${fmt(disc)}`, 600],
            ["VAT 7.5%", fmt(vat), 600],
            ["Total", fmt(net + vat), 800],
          ] as [string, string, number][]
        ).map(([k, v, fw]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#3A4A44" }}>{k}</span>
            <span style={{ fontWeight: fw }}>{v}</span>
          </div>
        ))}
      </div>
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>
        NOTE TO CUSTOMER
        <textarea
          rows={3}
          value={quote.customer_note ?? ""}
          onChange={(e) => setQuote({ ...quote, customer_note: e.target.value })}
          placeholder="Delivery, installation, validity"
          style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 12, fontSize: 14, background: "#fff", color: "#06382E", resize: "vertical" }}
        />
      </label>
      <button type="button" onClick={send} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "13px 22px", fontWeight: 800, fontSize: 14.5 }}>
        {isNew(quote) ? "Send quote to customer" : "Resend quote"}
      </button>
    </DrawerShell>
  );
}

function Pair({ k, v }: { k: string; v: string }) {
  return (
    <>
      <span style={{ color: "#5E6E68" }}>{k}</span>
      <span style={{ fontWeight: 700 }}>{v}</span>
    </>
  );
}
