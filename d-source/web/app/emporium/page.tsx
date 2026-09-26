"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { EMPORIUM_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/lib/types";

export default function EmporiumHome() {
  const [tab, setTab] = useState(EMPORIUM_CATEGORIES[0][1]);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<{ items: Product[] }>(`/catalogue/products?store=emporium`)
      .then(({ items }) => setItems(items))
      .catch(() => setItems([]));
  }, []);

  const shown = items.filter((p) => ((p.categories?.name as string) ?? "").toLowerCase() === tab.toLowerCase());

  return (
    <main style={{ background: "#0C1411", color: "#F2F2EC" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,7vh,88px) clamp(18px,3vw,40px)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.2em", color: "#A6F000" }}>D&rsquo;EMPORIUM · FOR HOME</span>
        <h1 style={{ margin: "10px 0 20px", fontWeight: 800, fontSize: "clamp(36px,5.5vw,72px)", letterSpacing: "-0.04em" }}>Doors open. Delivered nationwide.</h1>
        <p style={{ maxWidth: "34em", fontSize: 16, lineHeight: 1.6, opacity: 0.82 }}>
          Genuine, warranty-backed devices. Free set-up on TVs, laptops and phones. Pay by card, transfer, USSD or on delivery.
        </p>
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(18px,3vw,40px) clamp(56px,7vh,96px)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {EMPORIUM_CATEGORIES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(label)}
              style={{ border: "none", background: "transparent", color: tab === label ? "#A6F000" : "#F2F2EC", opacity: tab === label ? 1 : 0.6, fontWeight: 700, fontSize: 14, padding: "8px 4px", borderBottom: tab === label ? "2px solid #A6F000" : "2px solid transparent" }}
            >
              {label}
            </button>
          ))}
        </div>

        {shown.length === 0 && <p style={{ opacity: 0.7 }}>Nothing here yet — the catalogue is still being loaded by staff.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} store="emporium" />
          ))}
        </div>

        <Link
          href={`/emporium/${EMPORIUM_CATEGORIES.find(([, l]) => l === tab)?.[0]}`}
          style={{ display: "inline-block", marginTop: 20, fontWeight: 800, color: "#A6F000", borderBottom: "2px solid #A6F000" }}
        >
          See all {tab} →
        </Link>
      </section>
    </main>
  );
}
