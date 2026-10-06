"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useFlow } from "@/lib/flow-context";
import { useKitOverlay } from "@/lib/kit-overlay-context";
import { fmt } from "@/lib/format";
import { getSavedKits, saveKit as persistSaveKit } from "@/lib/savedKits";
import type { Kit } from "@/lib/types";
import ImageSlot from "@/components/ImageSlot";

export default function KitOverlay() {
  const { openKey, closeKit } = useKitOverlay();
  if (!openKey) return null;
  return <KitOverlayInner key={openKey} kitKey={openKey} closeKit={closeKit} />;
}

function KitOverlayInner({ kitKey, closeKit }: { kitKey: string; closeKit: () => void }) {
  const { addToCart, addToQuote, say } = useCart();
  const { startFlow } = useFlow();
  const [kit, setKit] = useState<Kit | null>(null);
  const [sel, setSel] = useState<Record<number, boolean>>({});
  const [focus, setFocus] = useState<number | null>(null);
  const [saved, setSaved] = useState<string[]>(() => getSavedKits());
  const animatedFor = useRef<string | null>(null);

  useEffect(() => {
    api
      .get<{ kit: Kit }>(`/catalogue/kits/${kitKey}`)
      .then(({ kit }) => {
        setKit(kit);
        const initial: Record<number, boolean> = {};
        kit.kit_items.forEach((_, i) => (initial[i] = true));
        setSel(initial);
      })
      .catch(() => setKit(null));
  }, [kitKey]);

  useEffect(() => {
    if (!kit || animatedFor.current === kit.key) return;
    animatedFor.current = kit.key;
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    requestAnimationFrame(() => {
      const room = document.querySelector("[data-kitroom]") as HTMLElement | null;
      if (room?.animate) {
        room.animate([{ transform: "scale(1.22)", filter: "blur(3px) saturate(.8)" }, { transform: "scale(1)", filter: "none" }], { duration: 1100, easing: "cubic-bezier(.2,.8,.2,1)" });
      }
      const pins = Array.from(document.querySelectorAll("[data-kitpin]"));
      pins.forEach((p, i) => {
        (p as HTMLElement).animate(
          [{ transform: "translateY(-70px) scale(.3)", opacity: 0 }, { transform: "translateY(6px) scale(1.12)", opacity: 1, offset: 0.65 }, { transform: "none", opacity: 1 }],
          { duration: 640, delay: 420 + i * 150, easing: "cubic-bezier(.34,1.4,.64,1)", fill: "backwards" }
        );
      });
      Array.from(document.querySelectorAll("[data-kitrow]")).forEach((r, i) => {
        (r as HTMLElement).animate([{ transform: "translateX(28px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 520, delay: 260 + i * 90, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
      });
      const el = document.querySelector("[data-kittotal]") as HTMLElement | null;
      if (!el) return;
      const final = el.textContent ?? "";
      const target = parseInt(final.replace(/\D/g, ""), 10) || 0;
      el.textContent = fmt(0);
      const start = performance.now() + 420 + pins.length * 150;
      const dur = 900;
      const tick = (now: number) => {
        if (!document.body.contains(el)) return;
        const k = Math.max(0, Math.min(1, (now - start) / dur));
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = k >= 1 ? final : fmt(target * e);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, [kit]);

  if (!kit) return null;

  const biz = kit.store === "provision";
  const items = kit.kit_items;
  const chosen = items.map((x, i) => [x, i] as const).filter(([, i]) => sel[i]);
  const total = chosen.reduce((a, [x]) => a + (x.price ?? 0), 0);
  const f = focus != null ? items[focus] : null;

  function toggle(i: number) {
    setSel((s) => ({ ...s, [i]: !s[i] }));
  }

  async function addKit() {
    const linked = chosen.filter(([x]) => x.product_id);
    const unlinked = chosen.length - linked.length;
    for (const [x] of linked) {
      if (biz) await addToQuote({ productId: x.product_id!, name: x.name, price: x.price, channel: "provision" });
      else await addToCart({ productId: x.product_id!, name: x.name, price: x.price, channel: "emporium" });
    }
    if (unlinked > 0) say(`${unlinked} item${unlinked === 1 ? "" : "s"} in this kit ${unlinked === 1 ? "isn't" : "aren't"} linked to a catalogue product yet, so couldn't be added`);
  }

  const isSaved = saved.includes(kit.key);

  return (
    <div data-screen-label="Kit overlay" style={{ position: "fixed", inset: 0, zIndex: 200, background: "#F5F1E8", color: "#06382E", overflowY: "auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 2, background: "#F5F1E8", borderBottom: "1px solid rgba(6,56,46,.12)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "14px clamp(18px,3vw,40px)" }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", color: "#5E6E68" }}>SOURCED FOR THE</span>
          <span style={{ fontWeight: 800, fontSize: "clamp(24px,2.6vw,36px)", letterSpacing: "-0.04em" }}>{kit.name.toLowerCase()}.</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.14em",
              padding: "5px 9px",
              borderRadius: 4,
              background: biz ? "#06382E" : "#A6F000",
              color: biz ? "#D4A637" : "#0C1411",
            }}
          >
            {biz ? "D’PROVISION" : "D’EMPORIUM"}
          </span>
        </span>
        <button type="button" onClick={closeKit} aria-label="Close" style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(6,56,46,.3)", background: "transparent", fontSize: 18, color: "#06382E" }}>
          ✕
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "clamp(40px,8vh,96px) clamp(18px,3vw,40px)", textAlign: "center" }}>
          <p style={{ fontSize: 17, color: "#3A4A44" }}>This kit doesn&rsquo;t have its items set up yet.</p>
        </div>
      ) : (
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(20px,4vh,40px) clamp(18px,3vw,40px) 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(20px,3vw,44px)", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 28, overflow: "hidden", background: "#EFEADC" }}>
              <div data-kitroom="1" style={{ position: "absolute", inset: 0, transformOrigin: "50% 55%", color: "#06382E" }}>
                <ImageSlot src={kit.photo_ref} alt={kit.name} placeholder={`Photo: ${kit.short.toLowerCase()}`} sizes="(max-width: 900px) 100vw, 680px" />
              </div>
              {items.map((it, i) => (
                <button
                  key={it.id}
                  data-kitpin="1"
                  type="button"
                  onClick={() => setFocus(i)}
                  aria-label={it.name}
                  style={{
                    position: "absolute",
                    left: `${it.pin_x}%`,
                    top: `${it.pin_y}%`,
                    width: 44,
                    height: 44,
                    margin: "-22px 0 0 -22px",
                    borderRadius: "50%",
                    border: "3px solid #F5F1E8",
                    background: sel[i] ? "#D4A637" : "#F5F1E8",
                    color: "#06382E",
                    fontWeight: 800,
                    fontSize: 15,
                    animation: "dsPulse 1.8s ease-out infinite",
                    zIndex: 2,
                  }}
                >
                  {i + 1}
                </button>
              ))}
              {f && (
                <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, zIndex: 3, background: "#06382E", color: "#F5F1E8", borderRadius: 20, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontWeight: 800, fontSize: 17 }}>{f.name}</span>
                    <span style={{ fontSize: 14, color: "rgba(245,241,232,.75)" }}>
                      {f.price ? `${fmt(f.price)} · ` : ""}
                      {f.note}
                    </span>
                  </span>
                  <button type="button" onClick={() => toggle(focus!)} style={{ border: 0, borderRadius: 999, background: "#D4A637", color: "#06382E", padding: "0 18px", minHeight: 44, fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>
                    {sel[focus!] ? "Remove from kit" : "Add to kit"}
                  </button>
                </div>
              )}
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "#5E6E68" }}>TAP A PIN TO SEE WHAT GOES THERE</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(40px,5vw,76px)", lineHeight: 0.9, letterSpacing: "-0.055em" }}>The {kit.short} kit</h2>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #06382E" }}>
              {items.map((it, i) => (
                <button
                  key={it.id}
                  data-kitrow="1"
                  type="button"
                  onClick={() => toggle(i)}
                  style={{ display: "grid", gridTemplateColumns: "36px minmax(0,1fr) auto 32px", alignItems: "center", gap: 12, padding: "16px 0", border: 0, borderBottom: "1px solid rgba(6,56,46,.14)", background: "transparent", textAlign: "left", color: "#06382E" }}
                >
                  <span style={{ width: 30, height: 30, borderRadius: "50%", background: sel[i] ? "#D4A637" : "#F5F1E8", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span style={{ fontWeight: 800, fontSize: 17 }}>{it.name}</span>
                    <span style={{ fontSize: 14, color: "#5E6E68" }}>{it.note}</span>
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>{it.price ? fmt(it.price) : "Quoted"}</span>
                  <span style={{ width: 28, height: 28, borderRadius: 8, border: "2px solid #06382E", background: sel[i] ? "#06382E" : "transparent", color: "#F5F1E8", display: "grid", placeItems: "center", fontSize: 14 }}>{sel[i] ? "✓" : ""}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#5E6E68" }}>
                {chosen.length} of {items.length} in your kit
              </span>
              <span data-kittotal="1" style={{ fontWeight: 800, fontSize: "clamp(30px,3vw,44px)", letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
                {fmt(total)}
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={!chosen.length}
                onClick={async () => {
                  if (!chosen.length) return;
                  await addKit();
                  closeKit();
                  say(`${chosen.length} items added to ${biz ? "quote" : "cart"}`);
                }}
                style={{ flex: "1 1 220px", border: 0, borderRadius: 999, background: biz ? "#D4A637" : "#A6F000", color: biz ? "#06382E" : "#0C1411", minHeight: 56, fontWeight: 800, fontSize: 16, opacity: chosen.length ? 1 : 0.5 }}
              >
                Add {chosen.length} to {biz ? "quote list" : "cart"}
              </button>
              <button
                type="button"
                disabled={!chosen.length}
                onClick={async () => {
                  if (!chosen.length) return;
                  await addKit();
                  setTimeout(() => startFlow(biz ? "quote" : "checkout", biz ? `Kit: ${kit.name}` : ""), 30);
                }}
                style={{ flex: "1 1 220px", background: "transparent", border: "2px solid #06382E", borderRadius: 999, minHeight: 56, fontWeight: 800, fontSize: 16, color: "#06382E", opacity: chosen.length ? 1 : 0.5 }}
              >
                {biz ? "Request a quote for this kit →" : "Check out now →"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isSaved) return;
                  setSaved(persistSaveKit(kit.key));
                  say("Kit saved");
                }}
                style={{ flex: "1 1 100%", background: "transparent", border: 0, minHeight: 40, fontWeight: 800, fontSize: 14, color: "#28705A" }}
              >
                {isSaved ? "Saved to your account ✓" : "Save kit to my account"}
              </button>
            </div>
            <span style={{ fontSize: 14, lineHeight: 1.5, color: "#5E6E68" }}>Delivered nationwide. Installed by D&rsquo;Matek engineers.</span>
          </div>
        </div>
      )}
    </div>
  );
}
