"use client";

import Link from "next/link";
import { useFlow } from "@/lib/flow-context";

const PARTS = ["Devices", "Office network", "Internet with backup", "Domain, email and files", "Website", "MFA and backup"];
const STEPS = [
  ["01", "Understand"],
  ["02", "Simplify"],
  ["03", "Solve"],
  ["04", "Support"],
];

export default function OfficeInABoxPage() {
  const { startFlow } = useFlow();

  return (
    <main style={{ background: "#F5F1E8", color: "#06382E" }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em", color: "#28705A" }}>D&rsquo;PROVISION · OFFICE IN A BOX</span>
        <h1 style={{ margin: "10px 0 20px", fontWeight: 800, fontSize: "clamp(36px,5.5vw,68px)", letterSpacing: "-0.045em" }}>A new office on day one.</h1>
        <p style={{ maxWidth: "36em", fontSize: 16, lineHeight: 1.7, color: "#3A4A44", marginBottom: 28 }}>
          Devices, network, internet, domain and email, a website, and the backups and security to go with it — set up before anyone shows up.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={() => startFlow("quote", "I’d like to talk about Office in a Box.")} style={{ border: 0, background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
            Ask about Office in a Box →
          </button>
          <Link href="/site-survey" style={{ background: "transparent", color: "#F5F1E8", border: "1px solid rgba(6,56,46,.3)", borderRadius: 999, padding: "15px 24px", fontWeight: 700 }}>
            Book a free site survey
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(18px,3vw,40px) clamp(56px,8vh,96px)", display: "flex", flexDirection: "column", gap: 40 }}>
        <div>
          <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10, marginBottom: 18 }}>
            WHAT&rsquo;S INCLUDED
          </span>
          <h2 style={{ margin: "0 0 20px", fontWeight: 800, fontSize: "clamp(30px,3.8vw,54px)", letterSpacing: "-0.04em" }}>Set up and documented.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
            {PARTS.map((p) => (
              <div key={p} style={{ background: "#FFFFFF", border: "1px solid rgba(6,56,46,.12)", borderRadius: 20, padding: 22, fontWeight: 800, fontSize: 18, minHeight: 100, display: "flex", alignItems: "flex-end" }}>
                {p}
              </div>
            ))}
          </div>
        </div>
        <div>
          <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10, marginBottom: 18 }}>
            HOW IT WORKS
          </span>
          <p style={{ maxWidth: "44em", fontSize: 17, lineHeight: 1.7, color: "#3A4A44", marginBottom: 18 }}>
            We start with what matters to you, not with a box, a licence or a brand. We make it simpler, solve it properly, and stay to keep it working and improving.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 10 }}>
            {STEPS.map(([n, t]) => (
              <div key={n} style={{ background: "#EFEADC", borderRadius: 4, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#28705A" }}>{n}</span>
                <span style={{ fontWeight: 800, fontSize: 18 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
