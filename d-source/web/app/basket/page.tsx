"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { useFlow } from "@/lib/flow-context";

export default function BasketPage() {
  const { cart, quote, cartTotal, quoteTotal, bump } = useCart();
  const { startFlow } = useFlow();
  const [tab, setTab] = useState<"cart" | "quote">("cart");
  const active = tab === "cart" ? cart : quote;
  const items = active?.cart_items ?? [];
  const total = tab === "cart" ? cartTotal : quoteTotal;

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["cart", "quote"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{ border: `1px solid ${tab === id ? "#06382E" : "#E6E2D8"}`, background: tab === id ? "#06382E" : "#fff", color: tab === id ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "10px 18px", fontWeight: 700 }}
            >
              {id === "cart" ? `Cart (${cart?.cart_items.reduce((a, i) => a + i.quantity, 0) ?? 0})` : `Quote list (${quote?.cart_items.reduce((a, i) => a + i.quantity, 0) ?? 0})`}
            </button>
          ))}
        </div>

        {items.length === 0 && <p style={{ color: "#5E6E68" }}>{tab === "cart" ? "Your cart is empty." : "Your quote list is empty."}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 32 }}>
          <div>
            {items.map((it) => (
              <div key={it.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: 12, alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(6,56,46,.08)" }}>
                <span style={{ fontWeight: 700 }}>{it.name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button type="button" onClick={() => bump(tab, it.id, it.quantity - 1)} style={{ width: 32, height: 32, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "transparent" }}>−</button>
                  <span>{it.quantity}</span>
                  <button type="button" onClick={() => bump(tab, it.id, it.quantity + 1)} style={{ width: 32, height: 32, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "transparent" }}>+</button>
                </span>
                <span style={{ fontWeight: 800 }}>{fmt((it.price ?? 0) * it.quantity)}</span>
              </div>
            ))}
          </div>
          {items.length > 0 && (
            <aside style={{ background: "#EFEADC", borderRadius: 20, padding: 20, height: "fit-content", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#3A4A44" }}>{tab === "cart" ? "Subtotal" : "Estimate ex. VAT"}</span>
                <span style={{ fontWeight: 800, fontSize: 20 }}>{fmt(total)}</span>
              </div>
              <button
                type="button"
                onClick={() => startFlow(tab === "cart" ? "checkout" : "quote")}
                style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, minHeight: 50, fontWeight: 800 }}
              >
                {tab === "cart" ? "Check out" : "Request a quote"}
              </button>
              <button type="button" onClick={() => startFlow("whatsapp")} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", borderRadius: 999, minHeight: 46, fontWeight: 700 }}>
                Order on WhatsApp
              </button>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
