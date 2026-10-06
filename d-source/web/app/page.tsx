"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pilotNote } from "@dmatek/brand";
import ImageSlot from "@/components/ImageSlot";
import ProductCard from "@/components/ProductCard";
import Seam from "@/components/Seam";
import { api } from "@/lib/api";
import { HERO, TINTS } from "@/lib/constants";
import { config } from "@/lib/config";
import { useCategoryNav } from "@/lib/useCategoryNav";
import { useCategoryCounts } from "@/lib/useCategoryCounts";
import { useFlow } from "@/lib/flow-context";
import { fmt } from "@/lib/format";
import { useKitOverlay } from "@/lib/kit-overlay-context";
import { playStoreTransition } from "@/lib/storeTransition";
import type { Kit, Product } from "@/lib/types";

const LIFECYCLE = [
  { n: "01", t: "Buy", d: "Genuine, warranty-backed devices, delivered nationwide." },
  { n: "02", t: "Set up", d: "Installed by D’Matek engineers. Free on TVs, laptops, phones and Office in a Box." },
  { n: "03", t: "Repair", d: "We collect it from you, or you send it to us by courier." },
  { n: "04", t: "Refresh", d: "When it’s time, we replace it and move you across." },
];

export default function SourceHome() {
  const router = useRouter();
  const { startFlow } = useFlow();
  const { openKit, openKey } = useKitOverlay();
  const empCategories = useCategoryNav("emporium");
  const provCategories = useCategoryNav("provision");
  const empCounts = useCategoryCounts("emporium");
  const provCounts = useCategoryCounts("provision");
  const [i, setI] = useState(0);
  const [q, setQ] = useState("");
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [heroImages, setHeroImages] = useState<Record<string, string>>({});
  const [reduce, setReduce] = useState(false);
  const noClickRef = useRef(false);

  // Words rotate every 2.3s, paused while a kit is open.
  useEffect(() => {
    if (openKey) return;
    const iv = setInterval(() => setI((n) => (n + 1) % HERO.length), 2300);
    return () => clearInterval(iv);
  }, [openKey]);

  // First-visit start view (config.startView), like the design's startView prop.
  useEffect(() => {
    if (config.startView === "Source") return;
    try {
      if (sessionStorage.getItem("ds-started")) return;
      sessionStorage.setItem("ds-started", "1");
    } catch {}
    router.replace(config.startView === "Emporium" ? "/emporium" : "/provision");
  }, [router]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);


  useEffect(() => {
    let drag: { ln: HTMLElement; x: number; s: number; m: boolean } | null = null;
    function down(e: PointerEvent) {
      const ln = (e.target as HTMLElement)?.closest?.("[data-line]") as HTMLElement | null;
      if (!ln || e.pointerType === "touch") return;
      drag = { ln, x: e.clientX, s: ln.scrollLeft, m: false };
    }
    function move(e: PointerEvent) {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) drag.m = true;
      drag.ln.scrollLeft = drag.s - dx;
    }
    function up() {
      const d = drag;
      drag = null;
      if (d && d.m) {
        noClickRef.current = true;
        setTimeout(() => {
          noClickRef.current = false;
        }, 60);
      }
    }
    addEventListener("pointerdown", down);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerup", up);
    return () => {
      removeEventListener("pointerdown", down);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
    };
  }, []);

  useEffect(() => {
    api
      .get<{ bestSellers: Product[]; heroImages?: Record<string, string> }>("/content")
      .then(({ bestSellers, heroImages }) => {
        setBestSellers(bestSellers);
        setHeroImages(heroImages ?? {});
      })
      .catch(() => {});
    api
      .get<{ kits: Kit[] }>("/catalogue/kits")
      .then(({ kits }) => setKits(kits))
      .catch(() => {});
  }, []);

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const h = HERO[i];
  // The background follows the rotating word (config.heroRotate); otherwise,
  // and under reduced motion, the first layer stays.
  const activeLayer = config.heroRotate && !reduce ? i : 0;

  return (
    <main style={{ background: "#F5F1E8", color: "#06382E" }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          className="ds-herobg"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            WebkitMaskImage: "linear-gradient(to left,#000 45%,transparent 100%)",
            maskImage: "linear-gradient(to left,#000 45%,transparent 100%)",
          }}
        >
          {HERO.map((x, j) => {
            const on = j === activeLayer;
            return (
              <div key={x[1]} style={{ position: "absolute", inset: 0, opacity: on ? 1 : 0, pointerEvents: on ? "auto" : "none", transition: "opacity .9s ease", background: TINTS[j % 3][0], color: "#06382E" }}>
                <ImageSlot src={heroImages[x[1]]} alt="" placeholder={x[2].replace("Photo:", "Wide background:")} sizes="75vw" priority={j === 0} />
              </div>
            );
          })}
        </div>
        <section
          data-hero="1"
          style={{
            pointerEvents: "none",
            position: "relative",
            zIndex: 1,
            maxWidth: 1400,
            margin: "0 auto",
            padding: "clamp(40px,8vh,96px) clamp(18px,3vw,40px) clamp(32px,5vh,56px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(28px,4vw,64px)",
            alignItems: "center",
            minHeight: "min(calc(100svh - 110px),780px)",
          }}
        >
          <div style={{ pointerEvents: "auto", flex: "0 1 auto", minWidth: "min(100%,460px)", display: "flex", flexDirection: "column", gap: "clamp(16px,2.4vh,24px)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", color: "#5E6E68" }}>
              COMMERCE BY D&rsquo;MATEK · DELIVERED NATIONWIDE
            </span>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(64px,11vw,176px)", lineHeight: 0.84, letterSpacing: "-0.065em" }}>D&rsquo;Source</h1>
            <button
              type="button"
              onClick={() => openKit(h[1])}
              style={{
                alignSelf: "flex-start",
                display: "flex",
                flexWrap: "nowrap",
                whiteSpace: "nowrap",
                alignItems: "baseline",
                gap: "0.3em",
                border: 0,
                background: "transparent",
                padding: 0,
                textAlign: "left",
                fontWeight: 800,
                fontSize: "clamp(20px,3.6vw,54px)",
                letterSpacing: "-0.035em",
                lineHeight: 1.08,
                color: "#06382E",
              }}
            >
              <span style={{ color: "#5E6E68" }}>Sourced for the</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.28em" }}>
                <span style={{ display: "inline-block", overflow: "hidden", height: "1.15em", color: "#28705A", borderBottom: "4px solid #D4A637" }}>{h[0]}</span>
                <span style={{ width: "1.05em", height: "1.05em", borderRadius: "50%", background: "#06382E", color: "#F5F1E8", display: "grid", placeItems: "center", fontSize: "0.46em" }}>
                  &#8599;&#xFE0E;
                </span>
              </span>
            </button>
            <form onSubmit={runSearch} style={{ maxWidth: 560, display: "flex", gap: 6, background: "#fff", border: "2px solid #06382E", borderRadius: 999, padding: 6 }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search laptops, mesh Wi-Fi, cameras, signage…"
                style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", padding: "10px 14px", fontSize: 16, fontWeight: 600, outline: "none", color: "#06382E" }}
              />
              <button type="submit" style={{ border: 0, borderRadius: 999, background: "#06382E", color: "#F5F1E8", padding: "0 20px", minHeight: 44, fontWeight: 800, fontSize: 14 }}>
                Search
              </button>
            </form>
            <p style={{ margin: 0, maxWidth: "46ch", fontSize: "clamp(16px,1.3vw,19px)", lineHeight: 1.5, fontWeight: 500, color: "#5E6E68" }}>
              Tap the place to see what goes in it and what it costs. We deliver anywhere in Nigeria.
            </p>
          </div>
        </section>
      </div>

      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "clamp(36px,4vw,60px)" }}
      >
        <path
          d="M0 20 H380 Q392 20 392 32 V36 Q392 48 404 48 H1040 Q1052 48 1052 36 V24 Q1052 12 1064 12 H1440"
          fill="none"
          stroke="#D4A637"
          strokeWidth={2}
          strokeOpacity={0.55}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 20 H380 Q392 20 392 32 V36 Q392 48 404 48 H1040 Q1052 48 1052 36 V24 Q1052 12 1064 12 H1440"
          pathLength={2400}
          fill="none"
          stroke="#D4A637"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray="120 2280"
          strokeDashoffset={2400}
          vectorEffect="non-scaling-stroke"
          style={{ animation: "dsFlow 9s linear 1s infinite" }}
        />
      </svg>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(24px,4vh,48px) clamp(18px,3vw,40px) 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px,3.6vw,52px)", letterSpacing: "-0.045em", lineHeight: 0.98 }}>Shop by category</h2>
          <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Link href="/categories" style={{ fontWeight: 800, fontSize: 15, color: "#06382E", borderBottom: "2px solid #D4A637", paddingBottom: 2 }}>
              All categories &rarr;
            </Link>
            <Link href="/search" style={{ fontWeight: 800, fontSize: 15, color: "#06382E", borderBottom: "2px solid #D4A637", paddingBottom: 2 }}>
              All products &rarr;
            </Link>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", padding: "5px 9px", borderRadius: 4, background: "#0C1411", color: "#A6F000" }}>
                D&rsquo;EMPORIUM
              </span>
              <span style={{ fontWeight: 800, fontSize: 17 }}>For home</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,168px),1fr))", gap: 10 }}>
              {empCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/emporium/${c.slug}`}
                  style={{ border: "1px solid #E6E2D8", background: "#FFFFFF", color: "#06382E", borderRadius: 6, padding: "10px 10px 14px", display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <span style={{ display: "block", position: "relative", aspectRatio: "1/1", borderRadius: 3, overflow: "hidden", background: "#F6F4EF" }}>
                    <ImageSlot placeholder={c.label} />
                  </span>
                  <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6, padding: "0 4px" }}>
                    <span style={{ fontWeight: 800, fontSize: 15.5 }}>{c.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#5E6E68" }}>{empCounts[c.canonical] ?? ""}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", padding: "5px 9px", borderRadius: 4, background: "#06382E", color: "#D4A637" }}>
                D&rsquo;PROVISION
              </span>
              <span style={{ fontWeight: 800, fontSize: 17 }}>For business</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,168px),1fr))", gap: 10 }}>
              {provCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/provision/${c.slug}`}
                  style={{ border: "1px solid #E6E2D8", background: "#FFFFFF", color: "#06382E", borderRadius: 20, padding: "10px 10px 14px", display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <span style={{ display: "block", position: "relative", aspectRatio: "1/1", borderRadius: 14, overflow: "hidden", background: "#F6F4EF" }}>
                    <ImageSlot placeholder={c.label} />
                  </span>
                  <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6, padding: "0 4px" }}>
                    <span style={{ fontWeight: 800, fontSize: 15.5 }}>{c.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#5E6E68" }}>{provCounts[c.canonical] ?? ""}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {kits.length > 0 && (
        <section id="pick-a-place" data-screen-label="Pick a place" style={{ padding: "clamp(24px,4vh,48px) 0 clamp(40px,6vh,72px)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 16,
              flexWrap: "wrap",
              padding: "0 clamp(18px,3vw,40px) 14px",
              maxWidth: 1400,
              margin: "0 auto",
            }}
          >
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px,3.6vw,52px)", letterSpacing: "-0.045em", lineHeight: 0.98 }}>Pick a place. Get the whole kit.</h2>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#5E6E68" }}>DRAG OR SCROLL ALONG THE LINE &rarr;</span>
          </div>
          <div data-line="1" style={{ position: "relative", overflowX: "auto", scrollbarWidth: "none", cursor: "grab" }}>
            <div style={{ position: "relative", display: "flex", gap: "clamp(16px,2vw,26px)", padding: "30px clamp(18px,3vw,40px) 34px", width: "max-content" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 2, background: "#D4A637" }} />
              {kits.map((kit, idx) => {
                const bz = kit.store === "provision";
                const total = kit.kit_items.reduce((a, x) => a + (x.price ?? 0), 0);
                const priceLine = kit.is_chooser ? "Away or at home" : bz ? `Kit from ${fmt(total)} · quote` : `Kit ${fmt(total)}`;
                return (
                  <button
                    key={kit.id}
                    type="button"
                    onClick={() => {
                      if (noClickRef.current) return;
                      openKit(kit.key);
                    }}
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transform: `rotate(${idx % 2 ? 2.5 : -2.5}deg)`,
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      textAlign: "left",
                    }}
                  >
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: bz ? "#D4A637" : "#A6F000", border: "2px solid #06382E", marginTop: -6 }} />
                    <span style={{ width: 1, height: 18 + ((idx * 13) % 40), background: "#06382E" }} />
                    <span
                      style={{
                        width: "clamp(184px,17vw,236px)",
                        background: "#fff",
                        borderRadius: bz ? 22 : 4,
                        padding: "10px 10px 14px",
                        boxShadow: "0 18px 36px rgba(6,56,46,.10)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 9,
                      }}
                    >
                      <span style={{ display: "block", position: "relative", aspectRatio: "4/3", borderRadius: bz ? 16 : 2, overflow: "hidden", background: "#EFEADC" }}>
                        <ImageSlot src={kit.photo_ref} alt={kit.name} placeholder={`Photo: ${kit.short.toLowerCase()}`} sizes="236px" />
                      </span>
                      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, padding: "0 4px" }}>
                        <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", color: "#06382E" }}>{kit.name}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em", color: "#5E6E68", whiteSpace: "nowrap" }}>
                          {bz ? "D’PROVISION" : "D’EMPORIUM"}
                        </span>
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#28705A", padding: "0 4px" }}>{priceLine}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(30px,3.6vw,52px)", letterSpacing: "-0.045em", lineHeight: 0.98 }}>Best sellers</h2>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#5E6E68" }}>HOME AND BUSINESS · [ LIVE PRICES FROM CATALOGUE ]</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,250px),1fr))", gap: 12 }}>
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Seam />

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(64px,9vh,110px) clamp(18px,3vw,40px) 0" }}>
        <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10, marginBottom: 20 }}>
          DEVICE LIFECYCLE
        </span>
        <h2 style={{ margin: "0 0 clamp(24px,3vw,40px)", fontWeight: 800, fontSize: "clamp(34px,4.6vw,68px)", letterSpacing: "-0.045em", lineHeight: 0.98 }}>
          Buy. Set up. Repair. Refresh.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))", gap: 12 }}>
          {LIFECYCLE.map((l) => (
            <div key={l.n} style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)", borderRadius: 24, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 10, minHeight: 170 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#28705A" }}>{l.n}</span>
              <span style={{ fontWeight: 800, fontSize: 23, letterSpacing: "-0.02em", marginTop: "auto" }}>{l.t}</span>
              <span style={{ fontSize: 15, lineHeight: 1.55, color: "#3A4A44" }}>{l.d}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            border: "1px dashed rgba(6,56,46,.35)",
            borderRadius: 24,
            padding: "clamp(22px,3vw,32px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px 32px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
            <span
              style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", border: "1px dashed rgba(6,56,46,.45)", padding: "8px 14px", borderRadius: 4 }}
            >
              AVAILABLE AS A PILOT
            </span>
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>Device care plan</span>
            <span style={{ fontSize: 15, lineHeight: 1.6, color: "#3A4A44" }}>{pilotNote}</span>
          </div>
          <button
            type="button"
            onClick={() => startFlow("enquiry", "I’d like to talk about joining the device care plan pilot.")}
            style={{ border: "1px solid rgba(6,56,46,.22)", background: "transparent", color: "#06382E", borderRadius: 999, padding: "15px 24px", fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap" }}
          >
            Talk to us about joining the pilot &rarr;
          </button>
        </div>
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) 0" }}>
        <div
          style={{
            background: "radial-gradient(120% 140% at 8% 0%,#0B4B3D,#06382E 60%)",
            color: "#F5F1E8",
            borderRadius: "clamp(28px,4vw,56px)",
            padding: "clamp(30px,5vw,64px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))",
            gap: "clamp(24px,4vw,56px)",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#06382E", background: "#D4A637", padding: "8px 14px", borderRadius: 4 }}>
              PACKAGE · FOR NEW BUSINESSES
            </span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(34px,4.4vw,64px)", letterSpacing: "-0.045em", lineHeight: 0.98 }}>Office in a Box</h2>
            <p style={{ margin: 0, fontSize: "clamp(17px,1.6vw,21px)", lineHeight: 1.55, color: "rgba(245,241,232,.9)", maxWidth: "30em" }}>
              Everything a new office needs, set up right the first time.
            </p>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "rgba(245,241,232,.78)", maxWidth: "34em" }}>
              <strong style={{ color: "#F5F1E8" }}>What&rsquo;s included:</strong> Devices, office network and internet with backup, domain, email and files, website, MFA and backup, set up and documented.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
              <button
                type="button"
                onClick={() => startFlow("quote", "I’d like to talk about Office in a Box.")}
                style={{ border: 0, background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "16px 26px", fontWeight: 800, fontSize: 15 }}
              >
                Ask about Office in a Box &rarr;
              </button>
              <button
                type="button"
                onClick={(e) => playStoreTransition(router, "provision", e.currentTarget)}
                style={{ background: "transparent", color: "#F5F1E8", border: "1px solid rgba(245,241,232,.3)", borderRadius: 999, padding: "15px 24px", fontWeight: 700, fontSize: 15 }}
              >
                Visit D&rsquo;Provision
              </button>
            </div>
          </div>
          <div style={{ position: "relative", aspectRatio: "5/4", borderRadius: "44% 56% 50% 50% / 50% 44% 56% 50%", overflow: "hidden", background: "#0B4B3D", color: "#F5F1E8" }}>
            <ImageSlot placeholder="Photo: a new office on day one, devices set up" />
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(64px,9vh,110px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(24px,4vh,40px)" }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px,7.4vw,112px)", lineHeight: 0.88, letterSpacing: "-0.06em" }}>
            Not on the list? <span style={{ color: "#D4A637" }}>Tell us the place.</span>
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => startFlow("enquiry")}
              style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "18px 28px", fontWeight: 800, fontSize: 16 }}
            >
              Tell us what you need &rarr;
            </button>
            <button
              type="button"
              onClick={() => startFlow("quote")}
              style={{ background: "transparent", color: "#06382E", border: "1px solid rgba(6,56,46,.3)", borderRadius: 999, padding: "17px 26px", fontWeight: 700, fontSize: 16 }}
            >
              Request a business quote
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
