"use client";

export default function DrawerShell({ kicker, title, onClose, children }: { kicker: string; title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(6,56,46,.4)" }} />
      <aside style={{ position: "relative", width: "min(560px,100%)", height: "100%", background: "#FFFFFF", color: "#06382E", display: "flex", flexDirection: "column", animation: "dsIn .3s cubic-bezier(.2,.8,.2,1) both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid #EEEAE2" }}>
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "#28705A" }}>{kicker}</span>
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em" }}>{title}</span>
          </span>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 42, height: 42, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E" }}>
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
      </aside>
    </div>
  );
}
