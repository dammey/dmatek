import Link from "next/link";
import { btn, pagePad } from "@/lib/styles";

export default function NotFound() {
  return (
    <main style={{ ...pagePad, minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: ".16em", color: "var(--mutedMono)" }}>ERROR 404</span>
      <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px,7vw,104px)", lineHeight: 0.9, letterSpacing: "-.065em" }}>
        This page isn’t <span style={{ color: "var(--m)", borderBottom: ".06em solid var(--a)" }}>on the shelf.</span>
      </h1>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "var(--muted)" }}>It may have moved, or the link is wrong.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/" style={btn("deep")}>
          D’Source home
        </Link>
        <Link href="/shop" style={btn("outline")}>
          Shop
        </Link>
        <Link href="/source" style={btn("buy")}>
          We’ll source it
        </Link>
      </div>
    </main>
  );
}
