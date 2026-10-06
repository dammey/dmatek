"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconLabel } from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import Hero, { FlowLine } from "@/components/home/Hero";
import KitSelector from "@/components/home/KitSelector";
import PinnedCheck from "@/components/home/PinnedCheck";
import SeamEntry from "@/components/home/SeamEntry";
import { BestCard, H2, btn, mono } from "@/components/ui";
import { api } from "@/lib/api";
import { config } from "@/lib/config";
import { PLACES } from "@/lib/places";
import { PROMISE } from "@/lib/promises";
import { GROUPS } from "@/lib/shop";
import type { Product } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";

const sec: React.CSSProperties = { padding: "clamp(28px,4vw,48px) var(--gut) 0" };
// Real customers only: captions stay placeholders until supplied.
const MOMENTS = ["[ First name, area ] · [ item ]", "[ First name, area ] · [ item ]", "[ First name, area ] · [ item ]"];

export default function Home() {
  const [pi, setPi] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const [best, setBest] = useState<Product[]>([]);
  const [heroImages, setHeroImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (paused || reduce || !config.heroRotate) return;
    const iv = setInterval(() => {
      setPi((i) => {
        setPrev(i);
        return (i + 1) % PLACES.length;
      });
    }, 3200);
    return () => clearInterval(iv);
  }, [paused, reduce]);

  useEffect(() => {
    api
      .get<{ bestSellers: Product[]; heroImages?: Record<string, string> }>("/content")
      .then((c) => {
        setBest(c.bestSellers ?? []);
        setHeroImages(c.heroImages ?? {});
      })
      .catch(() => {});
  }, []);

  function goKit() {
    setPaused(true);
    const k = document.getElementById("kits");
    if (k) window.scrollTo({ top: k.getBoundingClientRect().top + window.scrollY - 60, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <main>
      <Hero pi={pi} prev={prev} paused={paused} reduce={reduce} heroImages={heroImages} onPause={setPaused} onGoKit={goKit} />
      <FlowLine />

      <SeamEntry />

      <section style={sec}>
        <H2>Browse everything we source</H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,150px),1fr))", gap: 10 }}>
          {GROUPS.map((g, i) => (
            <Link key={g.slug} href={`/shop/${g.slug}`} data-rv="1" className="ds-tile" style={{ textAlign: "left", border: "1px solid var(--line)", background: "#fff", color: "var(--d)", borderRadius: 16, padding: "9px 9px 13px", display: "flex", flexDirection: "column", gap: 9, transition: "box-shadow .35s,transform .35s" }}>
              <span style={{ display: "block", position: "relative", aspectRatio: "1/1", borderRadius: 10, overflow: "hidden", background: "var(--t)", color: "var(--m)" }}>
                <ImageSlot placeholder={g.name} sizes="200px" />
              </span>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 6, padding: "0 3px" }}>
                <span style={{ fontWeight: 800, fontSize: 14.5, lineHeight: 1.2 }}>{g.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mutedMono)" }}>{String(i + 1).padStart(2, "0")}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {best.length > 0 && (
        <section style={sec}>
          <H2>Best sellers</H2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))", gap: 14 }}>
            {best.map((p) => (
              <BestCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      <PinnedCheck />

      <section style={{ padding: "clamp(24px,4vw,40px) var(--gut)", display: "flex", flexWrap: "wrap", gap: "10px 28px", fontWeight: 700, fontSize: 15, justifyContent: "space-between" }}>
        <IconLabel name="truck" size={22}>
          {PROMISE.deliveryLagos}
        </IconLabel>
        <IconLabel name="truck" size={22}>
          {PROMISE.deliveryOutside}
        </IconLabel>
        <IconLabel name="banknote" size={22}>
          {PROMISE.pod} · <Link href="/terms#pay-on-delivery">terms</Link>
        </IconLabel>
      </section>

      <section style={{ padding: "0 var(--gut) clamp(24px,4vw,40px)" }}>
        <H2>Delivered and handed over</H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 12 }}>
          {MOMENTS.map((m, i) => (
            <div key={i} data-rv="1">
              <div style={{ aspectRatio: "1", background: "var(--t)", borderRadius: 14, display: "flex", alignItems: "flex-end", padding: 10, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "var(--m)" }}>REAL PHOTO PLACEHOLDER</div>
              <div style={{ fontSize: 13, marginTop: 6, fontWeight: 600 }}>{m}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 var(--gut) clamp(24px,4vw,40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 14 }}>
        <div style={{ border: "1px solid var(--line)", borderRadius: 18, padding: 22, display: "flex", flexDirection: "column", gap: 8, background: "#fff" }}>
          <IconLabel name="wrench" size={24} style={{ gap: 9, fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", color: "var(--d)" }}>
            Pickup repairs
          </IconLabel>
          <span style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>We collect a faulty device, diagnose it, quote before any work, fix it and return it. One device or a whole office.</span>
          <Link href="/repair" style={btn("deep", { alignSelf: "flex-start", padding: "11px 18px", marginTop: 6 })}>
            Book a pickup
          </Link>
        </div>
        <div style={{ border: "1px solid var(--line)", borderRadius: 18, padding: 22, display: "flex", flexDirection: "column", gap: 12, background: "#fff" }}>
          <b style={{ fontSize: 20, letterSpacing: "-.02em" }}>Buy → Set up → Repair → Refresh</b>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Buy", "Set up", "Repair", "Refresh"].map((l) => (
              <span key={l} style={{ background: "var(--t)", color: "var(--d)", fontWeight: 700, fontSize: 13, borderRadius: 99, padding: "8px 14px" }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 var(--gut) clamp(24px,4vw,40px)" }}>
        <div style={{ border: "1px dashed var(--m)", borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ ...mono, letterSpacing: ".14em", color: "var(--m)" }}>PILOT</span>
          <b style={{ fontSize: 19 }}>Device care plan</b>
          <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
            Available as a pilot. We’re rolling this out with a small number of early customers. If it fits what you need, talk to us about joining the pilot.
          </span>
        </div>
      </section>

      <KitSelector
        pi={pi}
        onPick={(i) => {
          setPrev(pi);
          setPi(i);
          setPaused(true);
        }}
      />

      <section style={{ padding: "clamp(24px,4vw,48px) var(--gut)" }}>
        <div style={{ background: "var(--d)", color: "#fff", borderRadius: 20, padding: "clamp(22px,4vw,40px)", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ maxWidth: 520 }}>
            <b style={{ fontSize: "clamp(22px,3vw,32px)", letterSpacing: "-.03em" }}>Office in a Box</b>
            <p style={{ margin: "8px 0 0", opacity: 0.9, lineHeight: 1.5, fontSize: 15 }}>Devices, network and internet with backup, domain, email and files, website, MFA and backup, set up and documented.</p>
          </div>
          <Link href="/provision" style={btn("buy")}>
            See Provision →
          </Link>
        </div>
      </section>
    </main>
  );
}
