"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { useFlow } from "@/lib/flow-context";

export default function BasketDrawer() {
  const { basket, closeBasket, cart, quote, cartTotal, quoteTotal, bump } = useCart();
  const { startFlow } = useFlow();
  if (!basket) return null;
  const isCart = basket === "cart";
  const active = isCart ? cart : quote;
  const items = active?.cart_items ?? [];
  const total = isCart ? cartTotal : quoteTotal;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={closeBasket} style={{ position: "absolute", inset: 0, background: "rgba(6,56,46,.45)" }} />
      <aside style={{ position: "relative", width: "min(460px,100%)", height: "100%", background: "#F5F1E8", color: "#06382E", display: "flex", flexDirection: "column", animation: "dsIn .35s cubic-bezier(.2,.8,.2,1) both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid rgba(6,56,46,.12)" }}>
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.16em", color: "#28705A" }}>
              {isCart ? "D’EMPORIUM" : "D’PROVISION"}
            </span>
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{isCart ? "Your cart" : "Your quote list"}</span>
          </span>
          <button type="button" onClick={closeBasket} aria-label="Close" style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid rgba(6,56,46,.25)", background: "transparent", fontSize: 16, color: "#06382E" }}>
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px" }}>
          {items.length === 0 && (
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#3A4A44", margin: "24px 0" }}>
              {isCart ? "Your cart is empty. Add something from D’Emporium." : "Your quote list is empty. Add items from the D’Provision catalogue."}
            </p>
          )}
          {items.map((it) => (
            <div key={it.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 10, padding: "14px 0", borderBottom: "1px solid rgba(6,56,46,.10)" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                <span style={{ fontWeight: 800, fontSize: 15.5 }}>{it.name}</span>
                <span style={{ fontSize: 13.5, color: "#5E6E68" }}>{fmt(it.price)} each</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button type="button" onClick={() => bump(basket, it.id, it.quantity - 1)} aria-label="Fewer" style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "transparent", color: "#06382E" }}>
                  −
                </button>
                <span style={{ minWidth: 22, textAlign: "center", fontWeight: 800 }}>{it.quantity}</span>
                <button type="button" onClick={() => bump(basket, it.id, it.quantity + 1)} aria-label="More" style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "transparent", color: "#06382E" }}>
                  +
                </button>
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: "18px 22px 22px", borderTop: "1px solid rgba(6,56,46,.12)", display: "flex", flexDirection: "column", gap: 10, background: "#EFEADC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 700, color: "#3A4A44" }}>{isCart ? "Total" : "Estimate ex. VAT"}</span>
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{fmt(total)}</span>
          </div>
          <Link href="/basket" onClick={closeBasket} style={{ fontSize: 13.5, fontWeight: 800, color: "#06382E", alignSelf: "center", borderBottom: "2px solid #D4A637" }}>
            View full basket →
          </Link>
          <button
            type="button"
            onClick={() => {
              closeBasket();
              startFlow(isCart ? "checkout" : "quote");
            }}
            style={{ minHeight: 50, borderRadius: 999, border: 0, background: "#06382E", color: "#F5F1E8", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}
          >
            {isCart ? "Check out" : "Request a quote"}
          </button>
        </div>
      </aside>
    </div>
  );
}
