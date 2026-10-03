"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { useBasketActions } from "@/lib/basketActions";
import { playStoreTransition } from "@/lib/storeTransition";

export default function BasketPage() {
  const router = useRouter();
  const { cart, quote, cartTotal, quoteTotal, bump } = useCart();
  const [tab, setTab] = useState<"cart" | "quote">("cart");
  const actions = useBasketActions(tab);
  const active = tab === "cart" ? cart : quote;
  const items = active?.cart_items ?? [];
  const total = tab === "cart" ? cartTotal : quoteTotal;

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <span style={{ fontWeight: 700, color: "#06382E" }}>Basket</span>
      </div>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <h1 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>Your basket</h1>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "18px 0 28px" }}>
          {(["cart", "quote"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{ border: `1px solid ${tab === id ? "#06382E" : "#E6E2D8"}`, background: tab === id ? "#06382E" : "#fff", color: tab === id ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "10px 18px", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}
            >
              {id === "cart" ? `Cart (${cart?.cart_items.reduce((a, i) => a + i.quantity, 0) ?? 0})` : `Quote list (${quote?.cart_items.reduce((a, i) => a + i.quantity, 0) ?? 0})`}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,40px)", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 560px", minWidth: 0, display: "flex", flexDirection: "column", borderTop: "1px solid #EEEAE2" }}>
            {items.length === 0 && (
              <div style={{ background: "#F6F4EF", borderRadius: 24, padding: "clamp(24px,4vw,40px)", marginTop: 16, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.02em" }}>{tab === "quote" ? "Your quote list is empty." : "Your cart is empty."}</span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={(e) => playStoreTransition(router, "emporium", e.currentTarget)}
                    style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}
                  >
                    Shop for home
                  </button>
                  <button
                    type="button"
                    onClick={(e) => playStoreTransition(router, "provision", e.currentTarget)}
                    style={{ background: "#fff", color: "#06382E", border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "14px 22px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}
                  >
                    Shop for business
                  </button>
                </div>
              </div>
            )}
            {items.map((it) => (
              <div key={it.id} style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr) auto", gap: 16, alignItems: "center", padding: "16px 0", borderBottom: "1px solid #EEEAE2" }}>
                <div style={{ width: 72, height: 72, borderRadius: 14, background: "#F6F4EF" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: 16.5 }}>{it.name}</span>
                  <span style={{ fontSize: 13.5, color: "#5E6E68" }}>{fmt(it.price)} each</span>
                  <button type="button" onClick={() => bump(tab, it.id, -it.quantity)} style={{ alignSelf: "flex-start", border: 0, background: "transparent", padding: 0, fontSize: 13, fontWeight: 700, color: "#28705A", borderBottom: "1px solid rgba(40,112,90,.4)" }}>
                    Remove
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #E6E2D8", borderRadius: 999, overflow: "hidden" }}>
                    <button type="button" onClick={() => bump(tab, it.id, it.quantity - 1)} aria-label="Fewer" style={{ width: 38, height: 38, border: 0, background: "#fff", fontSize: 17, color: "#06382E" }}>
                      −
                    </button>
                    <span style={{ minWidth: 28, textAlign: "center", fontWeight: 800 }}>{it.quantity}</span>
                    <button type="button" onClick={() => bump(tab, it.id, it.quantity + 1)} aria-label="More" style={{ width: 38, height: 38, border: 0, background: "#fff", fontSize: 17, color: "#06382E" }}>
                      +
                    </button>
                  </div>
                  <span style={{ fontWeight: 800 }}>{it.price ? fmt(it.price * it.quantity) : "Quoted"}</span>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <aside style={{ flex: "0 1 320px", minWidth: "min(100%,280px)", background: "#EFEADC", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, color: "#3A4A44" }}>{tab === "cart" ? "Total" : "Estimate ex. VAT"}</span>
                <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{fmt(total)}</span>
              </div>
              {actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.go}
                  style={{
                    minHeight: 50,
                    borderRadius: 999,
                    border: a.primary ? "0" : "1px solid rgba(6,56,46,.25)",
                    background: a.primary ? "#06382E" : "transparent",
                    color: a.primary ? "#F5F1E8" : "#06382E",
                    fontWeight: 800,
                    fontSize: 15,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px 16px",
                  }}
                >
                  {a.label}
                  <span style={{ fontSize: 11.5, fontWeight: 600, opacity: 0.75 }}>{a.sub}</span>
                </button>
              ))}
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
