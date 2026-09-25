"use client";

import { useState } from "react";

const DMATEK_URL = process.env.NEXT_PUBLIC_DMATEK_URL ?? "https://dmatek-website.vercel.app";
const SISTERS = [
  { verb: "RUN IT", name: "D’Matek Cloud", href: `${DMATEK_URL}/businesses` },
  { verb: "CONNECT IT", name: "D’Matek Infrastructure", href: `${DMATEK_URL}/businesses` },
];

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section id="start" data-screen-label="Contact" style={{ background: "#F5F1E8", color: "#06382E", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px) 28px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
        <h2 data-rv="rise" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(72px,14vw,260px)", lineHeight: 0.82, letterSpacing: "-.05em" }}>
          Bring the{" "}
          <span style={{ display: "block", fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.03em", color: "#28705A" }}>problem.</span>
        </h2>
        {!sent && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", maxWidth: 960 }}>
            <input
              placeholder="Describe it in one sentence"
              style={{ flex: 1, minWidth: 260, background: "#FFFFFF", border: "2px solid #06382E", borderRadius: 999, padding: "20px 26px", fontFamily: "inherit", fontSize: "clamp(17px,1.6vw,22px)", fontWeight: 600, color: "#06382E", outline: "none" }}
            />
            <button
              onClick={() => setSent(true)}
              className="df-send-btn"
              style={{ background: "#06382E", color: "#F5F1E8", border: 0, borderRadius: 999, padding: "22px 30px", fontSize: 16, fontWeight: 800, whiteSpace: "nowrap", transition: "transform .4s cubic-bezier(.34,1.56,.64,1)" }}
            >
              Send it &rarr;
            </button>
          </div>
        )}
        {sent && (
          <div style={{ alignSelf: "flex-start", background: "#D4A637", borderRadius: 999, padding: "18px 28px", fontWeight: 700, fontSize: "clamp(17px,1.6vw,22px)" }}>
            Got it. An engineer will reply within two working days.
          </div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {SISTERS.map((x) => (
            <a key={x.name} href={x.href} className="df-sister-link" style={{ display: "flex", gap: 10, alignItems: "center", border: "2px solid #06382E", borderRadius: 999, padding: "12px 20px", fontWeight: 700, fontSize: 15 }}>
              <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, fontWeight: 600, color: "#B08620" }}>{x.verb}</span>
              {x.name} &#8599;
            </a>
          ))}
        </div>
        <footer style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderTop: "2px solid #06382E", paddingTop: 20, fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".1em" }}>
          <span>D&rsquo;FOUNDRY IS A D&rsquo;MATEK BUSINESS</span>
          <a href={DMATEK_URL}>D&rsquo;MATEK.COM &#8599;</a>
        </footer>
      </div>
      <style jsx global>{`
        .df-send-btn:hover {
          background: #d4a637;
          color: #06382e;
          transform: rotate(-3deg) scale(1.05);
        }
        .df-sister-link:hover {
          background: #06382e;
          color: #f5f1e8;
        }
      `}</style>
    </section>
  );
}
