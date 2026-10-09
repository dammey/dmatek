import { fmt } from "@/lib/format";
import { PROMISE } from "@/lib/promises";

export type ReceiptLine = { description: string; quantity: number; unit_price: number | null; warranty: string | null };

/** Invoice / receipt: each item with its D'Source warranty, plus the
 * manufacturer-warranty footnote. Unknown values stay as visible placeholders. */
export default function Receipt({ refNo, date, lines, children }: { refNo?: string; date?: string; lines: ReceiptLine[]; children?: React.ReactNode }) {
  const total = lines.every((l) => l.unit_price != null) && lines.length ? lines.reduce((a, l) => a + (l.unit_price ?? 0) * l.quantity, 0) : null;
  return (
    <section style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <b style={{ fontSize: 18 }}>Invoice / receipt</b>
        <span style={{ color: "var(--muted)" }}>
          {refNo ?? "DS-[ number ]"} · {date ?? "[ date ]"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: "8px 16px", fontWeight: 700, borderBottom: "2px solid var(--d)", paddingBottom: 8 }}>
        <span>Item</span>
        <span>D’Source warranty</span>
        <span style={{ textAlign: "right" }}>Price</span>
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: "8px 16px", borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
          <span>
            {l.description}
            {l.quantity > 1 ? ` × ${l.quantity}` : ""}
          </span>
          <span>{l.warranty ?? "[ period ]"}</span>
          <span style={{ textAlign: "right" }}>{l.unit_price != null ? fmt(l.unit_price * l.quantity) : "₦ [ price ]"}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
        <span>Total</span>
        <span>{total != null ? fmt(total) : "₦ [ total ]"}</span>
      </div>
      <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{PROMISE.manufacturerLong}</span>
      {children}
    </section>
  );
}
