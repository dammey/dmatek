"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFlow } from "@/lib/flow-context";
import { useCart } from "@/lib/cart-context";
import { api } from "@/lib/api";
import { PROVISION_CATEGORIES } from "@/lib/constants";
import { fmt } from "@/lib/format";
import { playStoreTransition } from "@/lib/storeTransition";
import type { Kit, Product } from "@/lib/types";

const WAYS: { n: string; t: string; d: string; cta: string; action: "quote" | "catalogue" | "account" }[] = [
  { n: "01", t: "Request a quote", d: "Tell us the site and what it needs. We come back with a quote within 4 working hours.", cta: "Request a quote →", action: "quote" },
  { n: "02", t: "Build a quote list", d: "Add items and quantities from the catalogue, then send the list.", cta: "Open the catalogue →", action: "catalogue" },
  { n: "03", t: "Order on account", d: "For approved business accounts. Order against a PO, pay on 30-day invoice.", cta: "Sign in →", action: "account" },
];

const FACTS = ["Quotes within 4 working hours", "Free site surveys", "Volume pricing on larger orders", "30-day invoice for approved accounts"];

const OIB_PARTS = ["Devices", "Office network", "Internet with backup", "Domain, email and files", "Website", "MFA and backup"];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ProvisionHome() {
  const router = useRouter();
  const { startFlow } = useFlow();
  const { addToQuote } = useCart();
  const [tabKey, setTabKey] = useState(PROVISION_CATEGORIES[0].toLowerCase());
  const [items, setItems] = useState<Product[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [qty, setQty] = useState<Record<string, number>>({});

  useEffect(() => {
    api
      .get<{ items: Product[] }>("/catalogue/products?store=provision")
      .then(({ items }) => setItems(items))
      .catch(() => setItems([]));
    api
      .get<{ kits: Kit[] }>("/catalogue/kits?store=provision")
      .then(({ kits }) => setKits(kits))
      .catch(() => {});
  }, []);

  const tabLabel = PROVISION_CATEGORIES.find((l) => l.toLowerCase() === tabKey) ?? "";
  const shown = items.filter((p) => ((p.categories?.name as string) ?? "").toLowerCase() === tabLabel.toLowerCase());

  function qtyFor(id: string) {
    return qty[id] ?? 1;
  }
  function bump(id: string, d: number) {
    setQty((q) => ({ ...q, [id]: Math.max(1, qtyFor(id) + d) }));
  }

  return (
    <main style={{ background: "#F5F1E8", color: "#06382E" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(44px,7vh,92px) clamp(18px,3vw,40px) clamp(28px,4vh,48px)" }}>
        <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10, marginBottom: 22 }}>D&rsquo;PROVISION · FOR BUSINESS</span>
        <h1 style={{ margin: "0 0 22px", fontWeight: 800, fontSize: "clamp(42px,6vw,92px)", lineHeight: 0.98, letterSpacing: "-0.045em", maxWidth: "14em" }}>
          Equip the whole building. <span style={{ color: "#28705A" }}>Specified properly.</span>
        </h1>
        <p style={{ margin: "0 0 26px", maxWidth: "40em", fontSize: "clamp(17px,1.6vw,20px)", lineHeight: 1.65, color: "#3A4A44" }}>
          Business procurement from D&rsquo;Source. Genuine, warranty-backed devices and equipment, installed by D&rsquo;Matek engineers and supported after handover.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
          <button type="button" onClick={() => startFlow("quote")} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "17px 28px", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}>
            Request a quote &rarr;
          </button>
          <button
            type="button"
            onClick={() => startFlow("quote", "I’d like to book a free site survey.")}
            style={{ background: "transparent", color: "#06382E", border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "16px 26px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}
          >
            Book a free site survey
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FACTS.map((f) => (
            <span key={f} style={{ fontSize: 13.5, fontWeight: 700, color: "#06382E", background: "#EFEADC", padding: "10px 14px", borderRadius: 4 }}>
              {f}
            </span>
          ))}
        </div>
      </section>

      <section id="p-ways" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(18px,3vw,40px)", scrollMarginTop: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 12 }}>
          {WAYS.map((w) => (
            <button
              key={w.n}
              type="button"
              onClick={() => (w.action === "catalogue" ? scrollToId("p-cat") : startFlow(w.action))}
              style={{ textAlign: "left", border: "1px solid rgba(6,56,46,.14)", background: "#FFFFFF", color: "#06382E", borderRadius: 24, padding: 26, display: "flex", flexDirection: "column", gap: 10, minHeight: 200 }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#28705A" }}>{w.n}</span>
              <span style={{ fontWeight: 800, fontSize: 23, letterSpacing: "-0.02em", marginTop: "auto" }}>{w.t}</span>
              <span style={{ fontSize: 15, lineHeight: 1.55, color: "#3A4A44" }}>{w.d}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#06382E", borderBottom: "2px solid #D4A637", alignSelf: "flex-start", paddingBottom: 2 }}>{w.cta}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="oib" style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(48px,7vh,88px) clamp(18px,3vw,40px) 0", scrollMarginTop: 80 }}>
        <div
          style={{
            background: "radial-gradient(120% 140% at 8% 0%,#0B4B3D,#06382E 60%)",
            color: "#F5F1E8",
            borderRadius: "clamp(28px,4vw,48px)",
            padding: "clamp(30px,5vw,60px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))",
            gap: "clamp(24px,4vw,56px)",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#06382E", background: "#D4A637", padding: "8px 14px", borderRadius: 4 }}>PACKAGE</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(32px,4vw,56px)", letterSpacing: "-0.045em", lineHeight: 1 }}>Office in a Box</h2>
            <p style={{ margin: 0, fontSize: "clamp(17px,1.6vw,20px)", lineHeight: 1.55, color: "rgba(245,241,232,.9)" }}>Everything a new office needs, set up right the first time.</p>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "rgba(245,241,232,.78)" }}>
              <strong style={{ color: "#F5F1E8" }}>What&rsquo;s included:</strong> Devices, office network and internet with backup, domain, email and files, website, MFA and backup, set up and documented.
            </p>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "rgba(245,241,232,.78)" }}>
              <strong style={{ color: "#F5F1E8" }}>For:</strong> New businesses
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
              <button
                type="button"
                onClick={() => startFlow("quote", "I’d like to talk about Office in a Box.")}
                style={{ border: 0, background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "16px 26px", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}
              >
                Ask about this package &rarr;
              </button>
              <button
                type="button"
                onClick={() => router.push("/office-in-a-box")}
                style={{ background: "transparent", color: "#F5F1E8", border: "1px solid rgba(245,241,232,.3)", borderRadius: 999, padding: "15px 24px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}
              >
                See what&rsquo;s included
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {OIB_PARTS.map((o) => (
              <span key={o} style={{ background: "rgba(245,241,232,.08)", borderRadius: 4, padding: "14px 16px", fontSize: 14.5, fontWeight: 600 }}>
                {o}
              </span>
            ))}
          </div>
        </div>
      </section>

      {kits.length > 0 && (
        <section id="p-kits" style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) 0", scrollMarginTop: 80 }}>
          <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10, marginBottom: 20 }}>KITS BY PLACE</span>
          <h2 style={{ margin: "0 0 22px", fontWeight: 800, fontSize: "clamp(30px,3.8vw,54px)", letterSpacing: "-0.04em", lineHeight: 1 }}>Start from where it&rsquo;s going.</h2>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(6,56,46,.16)" }}>
            {kits.map((kit) => {
              const total = kit.kit_items.reduce((a, x) => a + (x.price ?? 0), 0);
              return (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => router.push("/provision/categories")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0,1fr) auto auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "20px 4px",
                    border: 0,
                    borderBottom: "1px solid rgba(6,56,46,.16)",
                    background: "transparent",
                    textAlign: "left",
                    color: "#06382E",
                  }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                    <span style={{ fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-0.025em" }}>{kit.name}</span>
                    <span style={{ fontSize: 14, color: "#5E6E68" }}>{kit.kit_items.map((i) => i.name).join(" · ")}</span>
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#28705A", whiteSpace: "nowrap" }}>From {fmt(total)}</span>
                  <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#06382E", color: "#D4A637", display: "grid", placeItems: "center", fontWeight: 800 }}>&rarr;</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section id="p-cat" style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) 0", scrollMarginTop: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10, marginBottom: 20 }}>CATALOGUE</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px,3.8vw,54px)", letterSpacing: "-0.04em", lineHeight: 1 }}>Build a quote list.</h2>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#5E6E68" }}>UNIT PRICES EX. VAT · VOLUME PRICING ON LARGER ORDERS</span>
          <button
            type="button"
            onClick={() => router.push(`/provision/${tabKey}`)}
            style={{ border: 0, background: "transparent", color: "#06382E", fontWeight: 800, fontSize: 14, borderBottom: "2px solid #D4A637", padding: "0 0 2px" }}
          >
            See all {tabLabel} &rarr;
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "22px 0 10px" }}>
          {PROVISION_CATEGORIES.map((label) => {
            const key = label.toLowerCase();
            const active = key === tabKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTabKey(key)}
                style={{ border: `1px solid ${active ? "#06382E" : "rgba(6,56,46,.2)"}`, background: active ? "#06382E" : "transparent", color: active ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "10px 18px", fontSize: 14, fontWeight: 700 }}
              >
                {label}
              </button>
            );
          })}
        </div>
        {shown.length === 0 ? (
          <p style={{ color: "#5E6E68" }}>Nothing here yet — the catalogue is still being loaded by staff.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid rgba(6,56,46,.12)", borderRadius: 24, overflow: "hidden" }}>
            {shown.map((p) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr) auto", gap: 16, alignItems: "center", padding: "16px 18px", borderBottom: "1px solid rgba(6,56,46,.08)" }}>
                <div style={{ width: 64, height: 64, position: "relative", borderRadius: 16, overflow: "hidden", background: "#EFEADC" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "#5E6E68", letterSpacing: "0.06em" }}>
                    {(p.specs?.brand as string) ?? ""} {p.description ? `· ${p.description}` : ""}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 17, color: "#06382E" }}>{p.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#28705A" }}>{fmt(p.price)} per unit</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(6,56,46,.2)", borderRadius: 999, overflow: "hidden" }}>
                    <button type="button" aria-label="Fewer" onClick={() => bump(p.id, -1)} style={{ width: 40, height: 40, border: 0, background: "transparent", fontSize: 18, color: "#06382E" }}>
                      −
                    </button>
                    <span style={{ minWidth: 28, textAlign: "center", fontWeight: 800 }}>{qtyFor(p.id)}</span>
                    <button type="button" aria-label="More" onClick={() => bump(p.id, 1)} style={{ width: 40, height: 40, border: 0, background: "transparent", fontSize: 18, color: "#06382E" }}>
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToQuote({ productId: p.id, name: p.name, price: p.price, quantity: qtyFor(p.id), channel: "provision" })}
                    style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "0 18px", minHeight: 42, fontWeight: 800, fontSize: 13.5, whiteSpace: "nowrap" }}
                  >
                    Add to quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <div
          style={{
            background: "#0C1411",
            color: "#F2F2EC",
            borderRadius: 6,
            padding: "clamp(28px,4vw,52px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px 40px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 560 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "#A6F000" }}>D&rsquo;EMPORIUM</span>
            <span style={{ fontWeight: 800, fontSize: "clamp(28px,3.4vw,46px)", letterSpacing: "-0.05em", lineHeight: 0.95, textTransform: "uppercase" }}>Shopping for home?</span>
            <span style={{ fontSize: 16, lineHeight: 1.55, color: "#B9C2BD" }}>Laptops, phones, Wi-Fi, TV and power. Check out, order on WhatsApp or send an enquiry.</span>
          </div>
          <button
            type="button"
            onClick={(e) => playStoreTransition(router, "emporium", e.currentTarget)}
            style={{ border: 0, background: "#A6F000", color: "#0C1411", borderRadius: 4, padding: "16px 24px", fontWeight: 800, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}
          >
            Go to D&rsquo;Emporium &rarr;
          </button>
        </div>
      </section>
    </main>
  );
}
