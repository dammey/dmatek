import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ background: "#F5F1E8", color: "#06382E", minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)", display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.16em", color: "#5E6E68" }}>ERROR 404</span>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(56px,10vw,160px)", lineHeight: 0.86, letterSpacing: "-0.06em" }}>
          This page isn&rsquo;t <span style={{ color: "#28705A", borderBottom: "6px solid #D4A637" }}>on the shelf.</span>
        </h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "#3A4A44", maxWidth: "36em" }}>It may have moved, or the link is wrong. Try one of these.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/" style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800 }}>
            D&rsquo;Source home
          </Link>
          <Link href="/search" style={{ background: "#fff", color: "#06382E", border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "14px 22px", fontWeight: 700 }}>
            All products
          </Link>
          <Link href="/categories" style={{ background: "#fff", color: "#06382E", border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "14px 22px", fontWeight: 700 }}>
            All categories
          </Link>
        </div>
      </section>
    </main>
  );
}
