"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Seam from "@/components/Seam";
import { api } from "@/lib/api";
import { HERO_WORDS } from "@/lib/constants";
import type { Product } from "@/lib/types";

export default function SourceHome() {
  const [i, setI] = useState(0);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    const iv = setInterval(() => setI((n) => (n + 1) % HERO_WORDS.length), 2300);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    api
      .get<{ bestSellers: Product[] }>("/content")
      .then(({ bestSellers }) => setBestSellers(bestSellers))
      .catch(() => {});
  }, []);

  return (
    <main style={{ background: "#F5F1E8", color: "#06382E" }}>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,7vh,88px) clamp(18px,3vw,40px)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", color: "#5E6E68" }}>SOURCED FOR THE</span>
        <h1 style={{ margin: "8px 0 24px", fontWeight: 800, fontSize: "clamp(40px,7vw,110px)", lineHeight: 0.92, letterSpacing: "-0.05em" }}>{HERO_WORDS[i]}</h1>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/emporium" style={{ border: 0, background: "#0C1411", color: "#A6F000", borderRadius: 6, padding: "16px 26px", fontWeight: 800 }}>
            D&rsquo;Emporium · For home →
          </Link>
          <Link href="/provision" style={{ border: 0, background: "#06382E", color: "#D4A637", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
            D&rsquo;Provision · For business →
          </Link>
        </div>
      </section>

      <Seam />

      {bestSellers.length > 0 && (
        <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,6vh,72px) clamp(18px,3vw,40px)" }}>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "-0.03em", marginBottom: 24 }}>Best sellers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} store="emporium" />
            ))}
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,6vh,72px) clamp(18px,3vw,40px)", display: "flex", flexDirection: "column", gap: 18 }}>
        <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>
          FOR BUSINESS
        </span>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px,3.8vw,54px)", letterSpacing: "-0.04em", lineHeight: 1 }}>Set up and documented, on account.</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/office-in-a-box" style={{ border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "15px 24px", fontWeight: 700 }}>
            Office in a Box
          </Link>
          <Link href="/site-survey" style={{ border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "15px 24px", fontWeight: 700 }}>
            Book a free site survey
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,6vh,72px) clamp(18px,3vw,40px)" }}>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "-0.03em", marginBottom: 12 }}>Not on the list?</h2>
        <p style={{ maxWidth: "36em", fontSize: 17, lineHeight: 1.7, color: "#3A4A44", marginBottom: 20 }}>
          Tell us what you need. You don&rsquo;t need to know which technology it needs.
        </p>
        <Link href="/search" style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800, display: "inline-block" }}>
          Browse everything →
        </Link>
      </section>
    </main>
  );
}
