"use client";

import { useEffect, useState } from "react";
import DrawerShell from "@/components/DrawerShell";
import { Card, PageHeader, Row, Table, btnGhost, btnPrimary, inputStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type QuoteLine = { id: string; description: string; quantity: number; unit_price: number | null };
type Quote = {
  ref: string;
  status: string;
  submitted_at: string;
  spec_notes: string | null;
  ago: number;
  overdue: boolean;
  customers?: { full_name: string; company_name: string | null };
  quote_lines: QuoteLine[];
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [sla, setSla] = useState(240);
  const [selected, setSelected] = useState<string | null>(null);
  const { say } = useToast();

  function load() {
    api.get<{ quotes: Quote[]; slaMinutes: number }>("/admin/quotes").then((d) => {
      setQuotes(d.quotes);
      setSla(d.slaMinutes);
    });
  }
  useEffect(load, []);

  return (
    <div>
      <PageHeader title="Quotes" subtitle="Reply within the promised working hours" />
      <Card style={{ marginBottom: 16, fontSize: 14, color: "#3A4A44" }}>
        The storefront promises a reply <strong>within {sla / 60} working hours</strong>. Quotes turn red when they pass it.
      </Card>
      <Table cols="120px minmax(180px,1fr) 80px 120px 160px 110px 70px" head={["REFERENCE", "ORGANISATION", "LINES", "ESTIMATE", "REPLY DUE", "STATUS", ""]} minWidth="900px">
        {quotes.map((q) => {
          const total = q.quote_lines.reduce((a, l) => a + l.quantity * (l.unit_price ?? 0), 0);
          const dueMinutes = sla - q.ago;
          const overdue = q.status === "submitted" && dueMinutes < 0;
          const soon = q.status === "submitted" && dueMinutes >= 0 && dueMinutes < 60;
          const due = q.status !== "submitted" ? "Replied" : overdue ? `Overdue by ${Math.floor(-dueMinutes / 60)}h` : `Due in ${Math.floor(dueMinutes / 60)}h ${dueMinutes % 60}m`;
          const dueColor = overdue ? "#B42318" : soon ? "#B25E00" : "#06382E";
          return (
            <Row key={q.ref} cols="120px minmax(180px,1fr) 80px 120px 160px 110px 70px">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{q.ref}</span>
              <span style={{ fontWeight: 700 }}>{q.customers?.company_name || q.customers?.full_name}</span>
              <span>{q.quote_lines.length || "Described"}</span>
              <span style={{ fontWeight: 800 }}>{total ? fmt(total) : "To price"}</span>
              <span style={{ fontWeight: 800, color: dueColor }}>{due}</span>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: q.status === "submitted" ? "#FFF1CC" : "#D9F0E3", color: q.status === "submitted" ? "#7A5B00" : "#1F7A5A", justifySelf: "start" }}>
                {q.status}
              </span>
              <button type="button" onClick={() => setSelected(q.ref)} style={btnGhost}>
                Open
              </button>
            </Row>
          );
        })}
      </Table>
      {selected && (
        <QuoteDrawer
          quoteRef={selected}
          onClose={() => setSelected(null)}
          onChanged={() => {
            load();
            say("Quote updated");
          }}
        />
      )}
    </div>
  );
}

function QuoteDrawer({ quoteRef, onClose, onChanged }: { quoteRef: string; onClose: () => void; onChanged: () => void }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get<{ quote: Quote }>(`/admin/quotes/${quoteRef}`).then(({ quote }) => {
      setQuote(quote);
      setPrices(Object.fromEntries(quote.quote_lines.map((l) => [l.id, l.unit_price ? String(l.unit_price) : ""])));
    });
  }, [quoteRef]);

  if (!quote) return null;

  async function saveLine(lineId: string) {
    const v = Number(prices[lineId] || 0);
    await api.patch(`/quotes/${quoteRef}/lines/${lineId}`, { unitPrice: v });
  }

  async function send() {
    for (const l of quote!.quote_lines) await saveLine(l.id);
    await api.post(`/quotes/${quoteRef}/send`);
    onChanged();
    onClose();
  }

  return (
    <DrawerShell kicker={quote.ref} title={quote.customers?.company_name ?? quote.customers?.full_name ?? ""} onClose={onClose}>
      {quote.spec_notes && <p style={{ margin: 0, fontSize: 14, color: "#3A4A44" }}>{quote.spec_notes}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#28705A" }}>LINES · UNIT PRICE EX. VAT</span>
        {quote.quote_lines.map((l) => (
          <div key={l.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 50px 120px", gap: 8, alignItems: "center", fontSize: 14 }}>
            <span style={{ fontWeight: 700 }}>{l.description}</span>
            <span style={{ textAlign: "center" }}>× {l.quantity}</span>
            <input value={prices[l.id] ?? ""} onChange={(e) => setPrices((p) => ({ ...p, [l.id]: e.target.value }))} inputMode="numeric" style={{ ...inputStyle, textAlign: "right" }} />
          </div>
        ))}
      </div>
      <button type="button" onClick={send} style={btnPrimary}>
        Send quote to customer
      </button>
    </DrawerShell>
  );
}
