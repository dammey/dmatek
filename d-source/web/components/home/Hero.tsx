"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconLabel } from "../Icon";
import Image from "next/image";
import { ResponseHours, btn } from "../ui";
import { config } from "@/lib/config";
import { PLACES, placeKey } from "@/lib/places";

type Props = {
  pi: number;
  prev: number;
  paused: boolean;
  reduce: boolean;
  heroImages: Record<string, string>;
  onPause: (v: boolean) => void;
  onGoKit: () => void;
};

/** "Sourced for the [place]": place cycles every 3.2s; photo wipes in left to
 * right (clip-path, 1s), the word wipes in (.8s). Pauses on hover/tap; static
 * under reduced motion. Tapping the background, the word or the link scrolls
 * to the kit selector with that place selected. */
export default function Hero({ pi, prev, paused, reduce, heroImages, onPause, onGoKit }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const photoRef = useRef<HTMLDivElement>(null);
  const place = PLACES[pi];

  // Slight scroll parallax on the photo.
  useEffect(() => {
    if (reduce) return;
    const on = () => {
      if (photoRef.current) photoRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [reduce]);

  function search() {
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const note = reduce ? "Reduced motion on: rotation off." : paused && config.heroRotate ? "Paused" : "";

  return (
    <section
      className="ds-hero"
      onMouseEnter={() => onPause(true)}
      onMouseLeave={() => onPause(false)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button,input,a")) return;
        onPause(true);
        onGoKit();
      }}
    >
      <div ref={photoRef} className="ds-hero-photo">
        {PLACES.map((pl, i) => {
          const on = i === pi;
          const under = i === prev && !on;
          return (
            <div
              key={pl}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: on ? 2 : under ? 1 : 0,
                clipPath: on || under ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: on && !reduce ? "clip-path 1s cubic-bezier(.7,0,.2,1)" : "none",
              }}
            >
              <Image src={heroImages[placeKey(pl)] || `/photos/hero-${placeKey(pl)}.webp`} alt="" fill sizes="(max-width: 699px) 100vw, 57vw" priority={i === 0} style={{ objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
      <div aria-hidden="true" className="ds-hero-fade" />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "clamp(14px,2vw,22px)", maxWidth: 820, pointerEvents: "none" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: ".16em", color: "rgba(255,255,255,.72)" }}>COMMERCE BY D’MATEK · TECH YOU NEED, DELIVERED.</span>
        <h1 className="ds-hero-h1" style={{ margin: 0, lineHeight: 1, paddingBottom: ".08em", letterSpacing: "-.065em", fontWeight: 800 }}>
          Sourced for
          <br />
          the{" "}
          <span
            key={place}
            role="button"
            tabIndex={0}
            onClick={onGoKit}
            onKeyDown={(e) => e.key === "Enter" && onGoKit()}
            style={{ color: "#9BE6C5", display: "inline-block", pointerEvents: "auto", cursor: "pointer", borderBottom: ".06em solid var(--a)", animation: reduce ? "none" : "wordin .6s cubic-bezier(.2,.7,.2,1)" }}
          >
            {place}
          </span>
        </h1>
        <p style={{ margin: 0, fontSize: "clamp(17px,2vw,22px)", fontWeight: 600 }}>Every item checked before it reaches you.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: 14, fontWeight: 700 }}>
          <IconLabel name="seal">Every item checked</IconLabel>
          <IconLabel name="inspect">Inspect on delivery</IconLabel>
          <IconLabel name="returns">7-day returns</IconLabel>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6, pointerEvents: "auto" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            role="search"
            style={{ boxSizing: "content-box", flex: "1 1 260px", maxWidth: 520, display: "flex", background: "#fff", border: "2px solid var(--d)", borderRadius: 999, padding: "5px 5px 5px 18px", alignItems: "center" }}
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" placeholder="Search phones, laptops, routers…" style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", fontSize: 15, outline: "none", color: "var(--d)" }} />
            <button type="submit" style={{ border: 0, background: "var(--d)", color: "#fff", borderRadius: 999, padding: "12px 20px", fontWeight: 700 }}>
              Search
            </button>
          </form>
          <Link href="/source" style={btn("buy", { padding: "16px 22px" })}>
            <IconLabel name="source" style={{ gap: 9 }}>
              Can’t find it? We’ll source it
            </IconLabel>
          </Link>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", pointerEvents: "auto" }}>
          <button type="button" onClick={onGoKit} style={{ whiteSpace: "nowrap", border: 0, background: "none", padding: 0, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "underline" }}>
            See what goes in a {place} →
          </button>
          <span>
            <ResponseHours color="rgba(255,255,255,.72)" />{" "}
            {note && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: "rgba(255,255,255,.72)" }}>{note}</span>}
          </span>
        </div>
      </div>
    </section>
  );
}

/** Gold animated flow line under the hero. */
export function FlowLine() {
  const d = "M0 20 H380 Q392 20 392 32 V36 Q392 48 404 48 H1040 Q1052 48 1052 36 V24 Q1052 12 1064 12 H1440";
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "clamp(30px,4vw,56px)" }}>
      {/* The hero's dark base continues into the seam. */}
      <path d={`${d} V0 H0 Z`} fill="#072A1F" stroke="none" />
      <path d={d} fill="none" stroke="#D4A637" strokeWidth={2} strokeOpacity={0.55} vectorEffect="non-scaling-stroke" />
      <path d={d} pathLength={2400} fill="none" stroke="#D4A637" strokeWidth={3.5} strokeLinecap="round" strokeDasharray="120 2280" strokeDashoffset={2400} vectorEffect="non-scaling-stroke" style={{ animation: "dsFlow 9s linear 1s infinite" }} />
    </svg>
  );
}
