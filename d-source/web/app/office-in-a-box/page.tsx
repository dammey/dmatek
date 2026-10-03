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
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D’Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>›</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>Office in a Box</span>
      </div>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(24px,4vh,44px) clamp(18px,3vw,40px) 0" }}>
        <div
          style={{
            background: "radial-gradient(120% 140% at 8% 0%,#0B4B3D,#06382E 60%)",
            color: "#F5F1E8",
            borderRadius: "clamp(28px,4vw,56px)",
            padding: "clamp(30px,5vw,72px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))",
            gap: "clamp(24px,4vw,56px)",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#06382E", background: "#D4A637", padding: "8px 14px", borderRadius: 4 }}>
              D’PROVISION · PACKAGE
            </span>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px,6vw,96px)", letterSpacing: "-0.05em", lineHeight: 0.92 }}>Office in a Box</h1>
            <p style={{ margin: 0, fontSize: "clamp(18px,1.8vw,23px)", lineHeight: 1.5, color: "rgba(245,241,232,.92)" }}>Everything a new office needs, set up right the first time.</p>
            <p style={{ margin: 0, fontSize: 15, color: "rgba(245,241,232,.78)" }}>
              <strong style={{ color: "#F5F1E8" }}>For:</strong> New businesses · Set-up is included
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
              <button
                type="button"
                onClick={() => startFlow("quote", "I’d like to talk about Office in a Box.")}
                style={{ border: 0, background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "16px 26px", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}
              >
                Ask about Office in a Box →
              </button>
              <Link
                href="/site-survey"
                style={{ background: "transparent", color: "#F5F1E8", border: "1px solid rgba(245,241,232,.3)", borderRadius: 999, padding: "15px 24px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}
              >
                Book a free site survey
              </Link>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              aspectRatio: "5/4",
              borderRadius: "44% 56% 50% 50% / 50% 44% 56% 50%",
              overflow: "hidden",
              background: "#0B4B3D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(245,241,232,.5)",
              fontSize: 13,
              textAlign: "center",
              padding: 20,
            }}
          >
            Photo: a new office on day one
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)", display: "flex", flexDirection: "column", gap: "clamp(40px,6vh,72px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>WHAT’S INCLUDED</span>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px,3.8vw,54px)", letterSpacing: "-0.04em", lineHeight: 1 }}>Set up and documented.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
            {PARTS.map((p) => (
              <div key={p} style={{ background: "#FFFFFF", border: "1px solid rgba(6,56,46,.12)", borderRadius: 20, padding: 22, fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em", minHeight: 110, display: "flex", alignItems: "flex-end" }}>
                {p}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>HOW IT WORKS</span>
          <p style={{ margin: 0, maxWidth: "44em", fontSize: 17, lineHeight: 1.7, color: "#3A4A44" }}>
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
