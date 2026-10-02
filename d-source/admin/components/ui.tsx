export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 220 }}>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 26, letterSpacing: "-0.035em" }}>{title}</h1>
        <span style={{ fontSize: 13.5, color: "#5E6E68" }}>{subtitle}</span>
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.14em",
          background: "#EFEADC",
          border: "1px dashed rgba(6,56,46,.3)",
          padding: "6px 10px",
          borderRadius: 4,
          whiteSpace: "nowrap",
        }}
      >
        SAMPLE DATA
      </span>
    </div>
  );
}

export function Kpi({ label, value, sub, ink, onClick }: { label: string; value: string; sub: string; ink?: string; onClick?: () => void }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        textAlign: "left",
        border: "1px solid rgba(6,56,46,.1)",
        background: "#fff",
        color: "#06382E",
        borderRadius: 20,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#28705A" }}>{label}</span>
      <span style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-0.04em", color: ink ?? "#06382E" }}>{value}</span>
      <span style={{ fontSize: 13, color: "#5E6E68" }}>{sub}</span>
    </Comp>
  );
}

export function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${active ? "#06382E" : "rgba(6,56,46,.18)"}`,
        background: active ? "#06382E" : "#fff",
        color: active ? "#F5F1E8" : "#06382E",
        borderRadius: 999,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

export function StatusPill({ label, bg, ink }: { label: string; bg: string; ink: string }) {
  return (
    <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: bg, color: ink, whiteSpace: "nowrap" }}>{label}</span>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <section style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, ...style }}>{children}</section>;
}

export function Table({ cols, head, children, minWidth = "800px" }: { cols: string; head: string[]; children: React.ReactNode; minWidth?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
      <div style={{ minWidth }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
          {head.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Row({ cols, children }: { cols: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, padding: "13px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 12, fontSize: 14.5, background: "#fff", color: "#06382E" };
export const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" };
export const btnPrimary: React.CSSProperties = { border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "12px 20px", fontWeight: 800, fontSize: 14 };
export const btnGhost: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "11px 18px", fontWeight: 700, fontSize: 14 };
