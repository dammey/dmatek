"use client";

import Link from "next/link";
import { useFlow } from "@/lib/flow-context";

const WAYS = [
  { n: "01", t: "Request a quote", d: "Tell us the site and what it needs. We come back with a quote within 4 working hours." },
  { n: "02", t: "Build a quote list", d: "Add items and quantities from the catalogue, then send the list." },
  { n: "03", t: "Order on account", d: "For approved business accounts. Order against a PO, pay on 30-day invoice." },
];

export default function ProvisionHome() {
  const { startFlow } = useFlow();

  return (
    <main style={{ background: "#F5F1E8", color: "#06382E" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,7vh,88px) clamp(18px,3vw,40px)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em", color: "#28705A" }}>D&rsquo;PROVISION · FOR BUSINESS</span>
        <h1 style={{ margin: "10px 0 20px", fontWeight: 800, fontSize: "clamp(36px,5.5vw,72px)", letterSpacing: "-0.045em" }}>Welcome in. Let&rsquo;s equip the building.</h1>
        <p style={{ maxWidth: "34em", fontSize: 16, lineHeight: 1.6, color: "#3A4A44" }}>
          Quotes within 4 working hours. Free site surveys. Volume pricing on larger orders. 30-day invoice for approved accounts.
        </p>
      </section>

      <section id="p-ways" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(18px,3vw,40px) clamp(56px,7vh,96px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {WAYS.map((w) => (
          <div key={w.n} style={{ background: "#EFEADC", borderRadius: 22, padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#28705A" }}>{w.n}</span>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 19 }}>{w.t}</p>
            <p style={{ margin: 0, fontSize: 14.5, color: "#3A4A44" }}>{w.d}</p>
          </div>
        ))}
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(18px,3vw,40px) clamp(56px,7vh,96px)", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="button" onClick={() => startFlow("quote")} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
          Request a quote →
        </button>
        <Link href="/provision/categories" style={{ border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "15px 24px", fontWeight: 700 }}>
          Open the catalogue →
        </Link>
        <Link href="/office-in-a-box" style={{ border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "15px 24px", fontWeight: 700 }}>
          Office in a Box
        </Link>
      </section>
    </main>
  );
}
