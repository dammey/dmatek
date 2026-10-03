"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { EMPORIUM_CATEGORIES } from "@/lib/constants";
import { playStoreTransition } from "@/lib/storeTransition";
import type { Kit, Product } from "@/lib/types";

const TRUST = [
  { t: "Genuine, warranty-backed", d: "Every device sourced properly." },
  { t: "Installed by our engineers", d: "Free set-up on TVs, laptops and phones. Other installs are a paid add-on." },
  { t: "Delivered nationwide", d: "[ DELIVERY TIMES AND FEES TO CONFIRM ]" },
  { t: "Pay your way", d: "Card, bank transfer, USSD or pay on delivery. Or order on WhatsApp." },
];

const KIT_COLORS: [string, string][] = [
  ["#A6F000", "#0C1411"],
  ["#131D19", "#F2F2EC"],
  ["#F2F2EC", "#0C1411"],
  ["#1F7A5A", "#F2F2EC"],
];

export default function EmporiumHome() {
  const router = useRouter();
  const [tabKey, setTabKey] = useState(EMPORIUM_CATEGORIES[0][0]);
  const [items, setItems] = useState<Product[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);

  useEffect(() => {
    api
      .get<{ items: Product[] }>("/catalogue/products?store=emporium")
      .then(({ items }) => setItems(items))
      .catch(() => setItems([]));
    api
      .get<{ kits: Kit[] }>("/catalogue/kits?store=emporium")
      .then(({ kits }) => setKits(kits.slice(0, 4)))
      .catch(() => {});
  }, []);

  const tabLabel = EMPORIUM_CATEGORIES.find(([key]) => key === tabKey)?.[1] ?? "";
  const shown = items.filter((p) => ((p.categories?.name as string) ?? "").toLowerCase() === tabLabel.toLowerCase());

  return (
    <main style={{ background: "#0C1411", color: "#F2F2EC" }}>
      <section
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "clamp(40px,7vh,88px) clamp(18px,3vw,40px) clamp(32px,5vh,56px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))",
          gap: "clamp(28px,4vw,64px)",
          alignItems: "end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", color: "#A6F000" }}>D&rsquo;EMPORIUM · FOR HOME</span>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(56px,9vw,148px)", lineHeight: 0.84, letterSpacing: "-0.06em", textTransform: "uppercase" }}>
            Get it.
            <br />
            Set it up.
            <br />
            <span style={{ color: "#A6F000" }}>Sorted.</span>
          </h1>
          <p style={{ margin: 0, maxWidth: "40ch", fontSize: "clamp(16px,1.3vw,19px)", lineHeight: 1.55, color: "#B9C2BD" }}>
            Retail and consumer technology from D&rsquo;Source. Genuine devices, set up and supported.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EMPORIUM_CATEGORIES.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => router.push(`/emporium/${key}`)}
                style={{ border: "1px solid #2A3A33", background: "transparent", color: "#F2F2EC", borderRadius: 4, padding: "11px 16px", fontWeight: 800, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 10, minHeight: "clamp(300px,36vw,480px)" }}>
          <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "#131D19" }} />
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 10 }}>
            <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "#131D19" }} />
            <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "#A6F000" }} />
          </div>
        </div>
      </section>

      <section id="e-shop" style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,6vh,72px) clamp(18px,3vw,40px) 0", scrollMarginTop: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(34px,4.4vw,64px)", letterSpacing: "-0.05em", lineHeight: 0.92, textTransform: "uppercase" }}>Shop</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#9AA59F" }}>DELIVERED NATIONWIDE · [ LIVE PRICES FROM CATALOGUE ]</span>
          <Link href={`/emporium/${tabKey}`} style={{ color: "#A6F000", fontWeight: 800, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            See all {tabLabel} &rarr;
          </Link>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "20px 0 22px", borderBottom: "1px solid #22322B" }}>
          {EMPORIUM_CATEGORIES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTabKey(key)}
              style={{
                background: "transparent",
                border: 0,
                borderBottom: `3px solid ${key === tabKey ? "#A6F000" : "transparent"}`,
                marginBottom: -1,
                padding: "12px 14px",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#F2F2EC",
                opacity: key === tabKey ? 1 : 0.6,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {shown.length === 0 && <p style={{ color: "rgba(242,242,236,.7)" }}>Nothing here yet — the catalogue is still being loaded by staff.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,250px),1fr))", gap: 10 }}>
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} store="emporium" />
          ))}
        </div>
      </section>

      {kits.length > 0 && (
        <section id="e-kits" style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(64px,9vh,110px) clamp(18px,3vw,40px) 0", scrollMarginTop: 80 }}>
          <h2 style={{ margin: "0 0 22px", fontWeight: 800, fontSize: "clamp(34px,4.4vw,64px)", letterSpacing: "-0.05em", lineHeight: 0.92, textTransform: "uppercase" }}>Kits for home</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 10 }}>
            {kits.map((kit, idx) => {
              const [bg, ink] = KIT_COLORS[idx % KIT_COLORS.length];
              const total = kit.kit_items.reduce((a, x) => a + (x.price ?? 0), 0);
              return (
                <Link
                  key={kit.id}
                  href="/emporium/categories"
                  style={{ border: 0, borderRadius: 6, background: bg, color: ink, minHeight: "clamp(220px,28vw,320px)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", textAlign: "left" }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em" }}>
                    {kit.kit_items.map((i) => i.name).join(" · ")}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: "clamp(36px,4vw,56px)", lineHeight: 0.88, letterSpacing: "-0.055em", textTransform: "uppercase" }}>{kit.name} &rarr;</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Kit {`₦${Math.round(total).toLocaleString("en-NG")}`}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 1, background: "#22322B", border: "1px solid #22322B", borderRadius: 6, overflow: "hidden" }}>
          {TRUST.map((t) => (
            <div key={t.t} style={{ background: "#0C1411", padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 18 }}>{t.t}</span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: "#9AA59F" }}>{t.d}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <div
          style={{
            background: "radial-gradient(120% 140% at 8% 0%,#0B4B3D,#06382E 60%)",
            color: "#F5F1E8",
            borderRadius: 28,
            padding: "clamp(28px,4vw,52px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px 40px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 560 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#D4A637" }}>D&rsquo;PROVISION</span>
            <span style={{ fontWeight: 800, fontSize: "clamp(28px,3.4vw,46px)", letterSpacing: "-0.04em", lineHeight: 1 }}>Buying for a business?</span>
            <span style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(245,241,232,.82)" }}>Quotes, quote lists and orders on account. Office in a Box for new businesses.</span>
          </div>
          <button
            type="button"
            onClick={(e) => playStoreTransition(router, "provision", e.currentTarget)}
            style={{ border: 0, background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "16px 26px", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}
          >
            Go to D&rsquo;Provision &rarr;
          </button>
        </div>
      </section>
    </main>
  );
}
