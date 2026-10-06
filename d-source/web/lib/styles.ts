/** Plain style helpers (usable from server and client components). */
export const mono: React.CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: ".16em" };

type BtnKind = "buy" | "deep" | "outline" | "ghost" | "link";
export function btn(kind: BtnKind, extra?: React.CSSProperties): React.CSSProperties {
  const base: React.CSSProperties = { borderRadius: 99, padding: "13px 20px", fontWeight: 700, fontSize: 15, border: 0, display: "inline-flex", gap: 9, alignItems: "center", justifyContent: "center", textAlign: "center" };
  const k: Record<BtnKind, React.CSSProperties> = {
    buy: { background: "var(--buy)", color: "var(--onBuy)", fontWeight: 800 },
    deep: { background: "var(--d)", color: "#fff" },
    outline: { background: "#fff", color: "var(--d)", border: "1px solid var(--m)" },
    ghost: { background: "#fff", color: "var(--ink)", border: "1px solid var(--line)" },
    link: { background: "none", padding: 0, color: "var(--m)", textDecoration: "underline", borderRadius: 0 },
  };
  return { ...base, ...k[kind], ...extra };
}

export const field: React.CSSProperties = { border: "1px solid var(--line)", borderRadius: 10, padding: 13, fontSize: 15, background: "#fff", color: "var(--ink)", width: "100%" };
export const labelS: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 13, fontWeight: 700 };

export const pagePad: React.CSSProperties = { padding: "clamp(28px,5vw,64px) var(--gut) clamp(40px,6vw,80px)" };
