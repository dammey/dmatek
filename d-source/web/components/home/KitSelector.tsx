"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageSlot from "../ImageSlot";
import { Adire, btn } from "../ui";
import { useCart } from "@/lib/cart-context";
import { config } from "@/lib/config";
import { KITS, PLACES, placeKey } from "@/lib/places";

const TILT = [-3, 2, -2, 3, -1, 2];

/** Place rope: tilted cards hanging from a gold line, one per place. Selecting
 * a place updates "What goes in a [place]" (price on quote); the kit can be
 * added to the quote list. */
export default function KitSelector({ pi, onPick }: { pi: number; onPick: (i: number) => void }) {
  const router = useRouter();
  const { addToQuote } = useCart();
  const [busy, setBusy] = useState(false);
  const place = PLACES[pi];

  async function addKit() {
    setBusy(true);
    try {
      for (const [n, d] of KITS[place]) await addToQuote({ productId: null, name: `${n} (${place} kit: ${d})`, price: null, channel: "provision" });
      router.push("/cart?tab=quote");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {config.adire && <Adire h={10} />}
      <section id="kits" style={{ background: "var(--t)", padding: "clamp(24px,4vw,48px) var(--gut)", scrollMarginTop: 70 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-.03em", fontWeight: 800 }}>Kit selector</h2>
        <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: 15 }}>For setups: Wi-Fi, security, power, office. Pre-selected from the hero.</p>
        <div className="ds-noscroll" style={{ position: "relative", overflowX: "auto", margin: "0 calc(-1 * var(--gut))" }}>
          <div style={{ position: "relative", display: "flex", gap: 16, padding: "26px var(--gut)", width: "max-content" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 26, height: 2, background: "var(--a)" }} />
            {PLACES.map((pl, i) => {
              const on = i === pi;
              return (
                <button
                  key={pl}
                  type="button"
                  onClick={() => onPick(i)}
                  aria-pressed={on}
                  style={{ position: "relative", border: 0, background: "none", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", transformOrigin: "50% 0", transform: `rotate(${on ? 0 : TILT[i]}deg)`, transition: "transform .6s cubic-bezier(.34,1.6,.64,1)" }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: on ? "var(--a)" : "#fff", border: "2px solid var(--d)", marginTop: -6 }} />
                  <span style={{ width: 1, height: 16 + (i % 3) * 8, background: "var(--d)" }} />
                  <span style={{ width: "clamp(150px,16vw,200px)", background: "#fff", borderRadius: 16, padding: "9px 9px 13px", boxShadow: "0 14px 30px rgba(6,56,46,.12)", display: "flex", flexDirection: "column", gap: 8, outline: on ? "3px solid var(--a)" : "0 solid transparent", textAlign: "left" }}>
                    <span style={{ display: "block", position: "relative", aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "var(--t)", color: "var(--m)" }}>
                      <ImageSlot placeholder={`Photo: ${pl}`} sizes="200px" />
                    </span>
                    <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-.02em", padding: "0 3px", color: "var(--d)" }}>{pl}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <b style={{ fontSize: 17 }}>What goes in a {place}</b>
          {KITS[place].map(([n, d]) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8, fontSize: 14 }}>
              <span>
                <b>{n}</b>
                <br />
                <span style={{ color: "var(--muted)" }}>{d}</span>
              </span>
              <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>Price on quote</span>
            </div>
          ))}
          <button type="button" onClick={addKit} disabled={busy} style={btn("deep", { alignSelf: "flex-start", padding: "11px 18px" })}>
            {busy ? "Adding…" : "Add kit to quote"}
          </button>
        </div>
      </section>
    </>
  );
}

export { placeKey };
