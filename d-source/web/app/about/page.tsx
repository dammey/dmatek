"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { playStoreTransition } from "@/lib/storeTransition";

const DMATEK_URL = process.env.NEXT_PUBLIC_DMATEK_URL ?? "https://dmatek.ng";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main style={{ background: "#F5F1E8", color: "#06382E" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D’Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>›</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>About</span>
      </div>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)", display: "flex", flexDirection: "column", gap: "clamp(40px,6vh,72px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
          <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>ABOUT D’SOURCE</span>
          <h1 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>Commerce by D’Matek.</h1>
          <p style={{ margin: 0, fontSize: "clamp(17px,1.7vw,21px)", lineHeight: 1.65, color: "#3A4A44" }}>
            Genuine devices and equipment, set up and supported. For homes through D’Emporium, and for businesses through D’Provision.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14 }}>
          <div style={{ background: "#0C1411", color: "#F2F2EC", borderRadius: 6, padding: 28, display: "flex", flexDirection: "column", gap: 10, minHeight: 240 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "#A6F000" }}>FOR HOME</span>
            <span style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-0.045em", textTransform: "uppercase", marginTop: "auto" }}>D’Emporium</span>
            <span style={{ fontSize: 15, color: "#B9C2BD" }}>Retail and consumer technology.</span>
            <button
              type="button"
              onClick={(e) => playStoreTransition(router, "emporium", e.currentTarget)}
              style={{ alignSelf: "flex-start", border: 0, background: "#A6F000", color: "#0C1411", borderRadius: 4, padding: "11px 16px", fontWeight: 800, fontSize: 13.5 }}
            >
              Shop for home →
            </button>
          </div>
          <div style={{ background: "radial-gradient(120% 120% at 10% 0%,#0B4B3D,#06382E 60%)", color: "#F5F1E8", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 10, minHeight: 240 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#D4A637" }}>FOR BUSINESS</span>
            <span style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-0.045em", marginTop: "auto" }}>D’Provision</span>
            <span style={{ fontSize: 15, color: "rgba(245,241,232,.8)" }}>Business procurement.</span>
            <button
              type="button"
              onClick={(e) => playStoreTransition(router, "provision", e.currentTarget)}
              style={{ alignSelf: "flex-start", border: 0, background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "11px 18px", fontWeight: 800, fontSize: 13.5 }}
            >
              Equip my business →
            </button>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(6,56,46,.12)", borderRadius: 24, padding: 28, display: "flex", flexDirection: "column", gap: 10, minHeight: 240 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#28705A" }}>AFTER YOU BUY</span>
            <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: "-0.04em", marginTop: "auto", lineHeight: 1.05 }}>Buy. Set up. Repair. Refresh.</span>
            <span style={{ fontSize: 15, color: "#3A4A44" }}>Installed by D’Matek engineers, and looked after when something breaks.</span>
          </div>
        </div>

        <div style={{ borderTop: "2px solid #D4A637", paddingTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: 24, alignItems: "start" }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(28px,3.4vw,46px)", letterSpacing: "-0.04em", lineHeight: 1 }}>Part of D’Matek.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "#3A4A44" }}>
              D’Matek designs, builds and runs the technology behind connected businesses, properties, workplaces and homes. D’Source is the part that sources it.
            </p>
            <a href={DMATEK_URL} style={{ alignSelf: "flex-start", fontWeight: 800, fontSize: 15, borderBottom: "2px solid #D4A637", paddingBottom: 2 }}>
              Visit D’Matek ↗︎
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
