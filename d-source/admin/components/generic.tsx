"use client";

/** The prototype's generic module layout (payments, invoices, customers,
 * repairs, returns, inventory, suppliers, discounts) and generic drawer,
 * markup and style values 1:1 with "DSource Admin v3.dc.html". */

import DrawerShell from "./DrawerShell";

export type Cell = { t: string; fw?: number; ink?: string; bg?: string; pad?: string; rad?: string; ff?: string; fs?: string; ls?: string; ws?: string };
const MONO = "var(--font-mono)";
const C0 = (x: unknown): Cell => ({ t: String(x), fw: 500, ink: "#3A4A44", bg: "transparent", pad: "0", rad: "0", ff: "inherit", fs: "14px", ls: "0", ws: "nowrap" });
export const cT = (x: unknown) => C0(x);
export const cB = (x: unknown): Cell => ({ ...C0(x), fw: 800, ink: "#06382E" });
export const cM = (x: unknown): Cell => ({ ...C0(x), ff: MONO, fs: "12.5px", ink: "#06382E" });
export const cW = (x: unknown): Cell => ({ ...C0(x), ws: "normal" });
export const cP = (x: unknown, bg: string, ink: string): Cell => ({ ...C0(x), fw: 800, fs: "11.5px", bg, ink, pad: "5px 10px", rad: "999px" });
export const cTag = (business: boolean): Cell =>
  business
    ? { ...C0("BUSINESS"), ff: MONO, fs: "10px", ls: ".1em", fw: 600, bg: "#06382E", ink: "#D4A637", pad: "4px 8px", rad: "4px" }
    : { ...C0("FOR YOU"), ff: MONO, fs: "10px", ls: ".1em", fw: 600, bg: "#EFEADC", ink: "#06382E", pad: "4px 8px", rad: "4px" };

export type GenRow = { key: string; cells: Cell[]; btn?: string; go?: () => void; op?: number };
export type ChipDef = { label: string; on: boolean; go: () => void };
export type Tile = { label: string; value: string; sub: string; ink: string };

export function GenChips({ chips, actions = [] }: { chips: ChipDef[]; actions?: { label: string; go: () => void }[] }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
        {chips.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={c.go}
            style={{ border: `1px solid ${c.on ? "#06382E" : "rgba(6,56,46,.18)"}`, background: c.on ? "#06382E" : "#fff", color: c.on ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}
          >
            {c.label}
          </button>
        ))}
      </div>
      {actions.map((a) => (
        <button key={a.label} type="button" onClick={a.go} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "11px 18px", fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>
          {a.label}
        </button>
      ))}
    </div>
  );
}

export function GenNote({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "#EFEADC", borderRadius: 16, padding: "14px 18px", fontSize: 14, lineHeight: 1.55, color: "#3A4A44" }}>{children}</div>;
}

export function GenTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: 12 }}>
      {tiles.map((k) => (
        <div key={k.label} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#28705A" }}>{k.label}</span>
          <span style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-.03em", color: k.ink }}>{k.value}</span>
          <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{k.sub}</span>
        </div>
      ))}
    </div>
  );
}

/** Like the prototype, a 110px button column is appended (and the blank
 * header kept) only when at least one row has a button. */
export function GenTable({ cols, head, rows, minW, empty = "Nothing here yet." }: { cols: string; head: string[]; rows: GenRow[]; minW: string; empty?: string }) {
  const hasB = rows.some((r) => r.btn);
  const gCols = cols + (hasB ? " 110px" : "");
  const gHead = hasB ? head : head.filter((h) => h);
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
      <div style={{ minWidth: minW }}>
        <div style={{ display: "grid", gridTemplateColumns: gCols, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
          {gHead.map((h, i) => (
            <span key={i}>{h}</span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.key} style={{ display: "grid", gridTemplateColumns: gCols, gap: 12, padding: "12px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14, opacity: r.op ?? 1 }}>
            {r.cells.map((c, i) => (
              <span
                key={i}
                style={{
                  justifySelf: "start",
                  maxWidth: "100%",
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: c.ws as React.CSSProperties["whiteSpace"],
                  fontWeight: c.fw,
                  color: c.ink,
                  background: c.bg,
                  padding: c.pad,
                  borderRadius: c.rad,
                  fontFamily: c.ff,
                  fontSize: c.fs,
                  letterSpacing: c.ls,
                }}
              >
                {c.t}
              </span>
            ))}
            {r.btn && (
              <button type="button" onClick={r.go} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "7px 12px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", justifySelf: "end" }}>
                {r.btn}
              </button>
            )}
          </div>
        ))}
        {!rows.length && <div style={{ padding: "28px 18px", color: "#5E6E68", fontSize: 14.5 }}>{empty}</div>}
      </div>
    </div>
  );
}

export type GenAction = { label: string; go: () => void; primary?: boolean };
export type GenField = { label: string; ph: string; value?: string; onChange?: (v: string) => void };

export function GenDrawer({
  kicker,
  title,
  onClose,
  meta,
  linesTitle,
  lines,
  fields = [],
  actions,
}: {
  kicker: string;
  title: string;
  onClose: () => void;
  meta: { k: string; v: string }[];
  linesTitle?: string;
  lines?: { a: string; b: string }[];
  fields?: GenField[];
  actions: GenAction[];
}) {
  return (
    <DrawerShell kicker={kicker} title={title} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1fr)", gap: "8px 12px", fontSize: 14 }}>
        {meta.map((m) => (
          <Pair key={m.k} k={m.k} v={m.v} />
        ))}
      </div>
      {lines && (
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #EEEAE2" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#28705A", padding: "12px 0 4px" }}>{linesTitle}</span>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
              <span>{l.a}</span>
              <span style={{ fontWeight: 700, textAlign: "right" }}>{l.b}</span>
            </div>
          ))}
        </div>
      )}
      {fields.map((f) => (
        <label key={f.label} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>
          {f.label}
          <input
            placeholder={f.ph}
            value={f.value}
            onChange={f.onChange ? (e) => f.onChange!(e.target.value) : undefined}
            style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 12, fontSize: 14.5, letterSpacing: 0, fontWeight: 500, background: "#fff", color: "#06382E" }}
          />
        </label>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={a.go}
            style={{ border: a.primary ? 0 : "1px solid rgba(6,56,46,.2)", background: a.primary ? "#06382E" : "#fff", color: a.primary ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "12px 20px", fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}
          >
            {a.label}
          </button>
        ))}
      </div>
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
