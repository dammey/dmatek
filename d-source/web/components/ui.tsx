"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon, { IconLabel } from "./Icon";
import ImageSlot from "./ImageSlot";
import { captureFlip } from "@/lib/flip";
import { PROMISE } from "@/lib/promises";
import { btn, mono } from "@/lib/styles";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { checkLabel, checklistFor, priceLabel, warrantyFor } from "@/lib/shop";
import type { Product } from "@/lib/types";
import { StoreText, WhatsAppLink } from "@/lib/settings-context";

/* ---------- type + buttons ---------- */


export function Kicker({ children, color = "var(--m)", style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return <span style={{ ...mono, color, display: "block", marginBottom: 12, ...style }}>{children}</span>;
}

export function PageTitle({ children, size = "h1", style }: { children: React.ReactNode; size?: "h1" | "h2" | "small"; style?: React.CSSProperties }) {
  const fs = size === "h1" ? "clamp(44px,7vw,104px)" : size === "h2" ? "clamp(34px,4.4vw,64px)" : "clamp(28px,4vw,44px)";
  return <h1 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: fs, lineHeight: size === "small" ? 1.05 : 0.92, letterSpacing: size === "small" ? "-.04em" : "-.06em", ...style }}>{children}</h1>;
}

export const H2 = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <h2 style={{ margin: "0 0 14px", fontSize: "clamp(22px,3vw,34px)", letterSpacing: "-.03em", fontWeight: 800, ...style }}>{children}</h2>
);




/* ---------- adire ---------- */

const ADIRE =
  "url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%2306382E%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23F5F1E8%22%20stroke-opacity%3D%22.5%22%20stroke-width%3D%221.3%22%3E%3Cpath%20d%3D%22M32%200V64M0%2032H64%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2210%22%2F%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%225%22%2F%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%2210%22%2F%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%225%22%2F%3E%3Cpath%20d%3D%22M36%204l24%2024M36%2014l14%2014M46%204l14%2014M4%2036l24%2024M4%2046l14%2014M14%2036l14%2014%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23D4A637%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%221.8%22%2F%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%221.8%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%220%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%220%22%20cy%3D%2264%22%20r%3D%222.4%22%2F%3E%3Ccircle%20cx%3D%2264%22%20cy%3D%2264%22%20r%3D%222.4%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)";

/** Adire band: 10px strip (under header, above the kit selector) or 22px (footer). */
export function Adire({ h = 10 }: { h?: 10 | 22 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: h, backgroundColor: "#06382E", backgroundImage: ADIRE, backgroundSize: `auto ${h}px`, borderBottom: h === 22 ? "2px solid #D4A637" : "1px solid #D4A637" }}
    />
  );
}

/* ---------- small pieces ---------- */

/** The 1-hour promise always travels with its hours. */
export function ResponseHours({ variant = "mono", color = "var(--mutedMono)" }: { variant?: "mono" | "text"; color?: string }) {
  if (variant === "text") return <>{PROMISE.replyPersonal}</>;
  return (
    <span style={{ ...mono, letterSpacing: ".12em", color, display: "inline-flex", gap: 6, alignItems: "center" }}>
      <Icon name="clock" size={14} />
      {PROMISE.replyPersonalMono}
    </span>
  );
}

export function ConditionBadge({ condition, style }: { condition?: string; style?: React.CSSProperties }) {
  const isNew = !condition || condition === "New";
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", background: isNew ? "#fff" : "var(--a)", color: isNew ? "var(--d)" : "var(--onA)", borderRadius: 6, padding: "4px 8px", ...style }}>
      {condition ?? "New"}
    </span>
  );
}

export function CheckedMark({ text = "CHECKED" }: { text?: string }) {
  return <span style={{ alignSelf: "flex-start", fontSize: 11, fontWeight: 800, color: "var(--m)", background: "var(--t)", borderRadius: 99, padding: "4px 9px" }}>✓ {text}</span>;
}

export function EmptyState({ title = "Nothing listed for that right now." }: { title?: string }) {
  return (
    <div style={{ background: "var(--t)", borderRadius: 20, padding: "clamp(24px,4vw,44px)", display: "flex", flexDirection: "column", gap: 10 }}>
      <b style={{ fontSize: "clamp(24px,3vw,36px)", letterSpacing: "-.04em" }}>{title}</b>
      <span style={{ fontSize: 15, color: "var(--muted)" }}>
        The catalogue shows what we commonly source, not everything we can get. Can’t find it? We’ll source it. {PROMISE.replyPersonal}
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link href="/source" style={btn("buy")}>
          Request an item →
        </Link>
        <WhatsAppLink style={btn("outline")}>
          WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}

export function SkeletonTile() {
  return (
    <div style={{ border: "1px solid var(--line)", background: "#fff", borderRadius: 18, overflow: "hidden" }}>
      <div className="ds-skel" style={{ aspectRatio: "4/3" }} />
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 14, width: "70%", background: "var(--t)", borderRadius: 6 }} />
        <div style={{ height: 12, width: "40%", background: "var(--t)", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
      {steps.map((l, i) => (
        <div key={l} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 5, borderRadius: 9, background: i <= current ? "var(--d)" : "var(--line)" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: i <= current ? "var(--d)" : "#6B7570" }}>
            {i + 1}. {l}
          </span>
        </div>
      ))}
    </div>
  );
}

export const STAGES = ["Ordered", "Sourced", "Checked", "Out for delivery", "Delivered"] as const;

export function TrackingStages({ stage, onPick }: { stage: number; onPick?: (i: number) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {STAGES.map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => onPick?.(i)}
          disabled={!onPick}
          style={{ flex: "1 1 130px", textAlign: "left", border: `2px solid ${i === stage ? "var(--d)" : "var(--line)"}`, background: i <= stage ? "var(--t)" : "#fff", color: "var(--ink)", borderRadius: 14, padding: 12, cursor: onPick ? "pointer" : "default" }}
        >
          <div style={{ ...mono, letterSpacing: ".1em" }}>{i < stage ? "DONE" : i === stage ? "NOW" : "NEXT"}</div>
          <b>{l}</b>
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {items.map((l) => (
        <button key={l} type="button" onClick={() => onChange(l)} style={{ border: "1px solid var(--line)", borderRadius: 99, padding: "9px 16px", fontWeight: 700, fontSize: 14, background: value === l ? "var(--d)" : "#fff", color: value === l ? "#fff" : "var(--ink)" }}>
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---------- guarantee ---------- */

export function GuaranteeSummary({ warranty }: { warranty: string }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, background: "#fff" }}>
      <IconLabel name="inspect">{PROMISE.inspect}</IconLabel>
      <IconLabel name="returns">{PROMISE.returns}</IconLabel>
      <IconLabel name="warranty">D’Source warranty: {warranty}</IconLabel>
      <IconLabel name="truck" style={{ fontWeight: 500, color: "var(--muted)" }}>
        <StoreText k="delivery" />
      </IconLabel>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>{PROMISE.manufacturerShort}</span>
      <Link href="/guarantee" style={{ alignSelf: "flex-start", fontWeight: 700, textDecoration: "underline" }}>
        Read the guarantee
      </Link>
    </div>
  );
}

/* ---------- Checked by D'Source ---------- */

/** One reusable panel taking a category checklist. Rows go "Checking…" →
 * result as the panel scrolls into view (end state under reduced motion).
 * Catalogue listings have no unit yet, so the result is the honest one:
 * the check runs on your unit before dispatch. */
export function CheckedPanel({ group, items, meta = "Unit-specific results shown before dispatch", result = "Before dispatch" }: { group?: string; items?: string[]; meta?: string; result?: string }) {
  const rows = items ?? checklistFor(group ?? "");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [scrolled, setPc] = useState(0);
  const pc = reduce ? 1 : scrolled;
  useEffect(() => {
    if (reduce) return;
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const v = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * 0.5 + r.height * 0.5)));
      setPc(Math.round(v * 40) / 40);
    };
    addEventListener("scroll", on, { passive: true });
    const raf = requestAnimationFrame(on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
    };
  }, [reduce]);
  return (
    <section ref={ref} style={{ border: "2px solid var(--d)", borderRadius: 24, overflow: "hidden", background: "#fff" }}>
      <div style={{ background: "var(--d)", color: "#fff", padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "space-between", alignItems: "center" }}>
        <b style={{ fontSize: 17, display: "inline-flex", gap: 8, alignItems: "center" }}>
          <Icon name="seal" size={22} />
          Checked by D’Source
        </b>
        <span style={{ fontSize: 12, opacity: 0.85 }}>{meta}</span>
      </div>
      <div style={{ padding: "6px 18px 14px" }}>
        {rows.map((k, i) => {
          const done = pc > ((i + 0.5) / rows.length) * 0.9;
          return (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
              <span>{k}</span>
              <b style={{ color: done ? "var(--pass)" : "#9AA39F" }}>{done ? result : "Checking…"}</b>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- product tile ---------- */

export function ProductTile({ p }: { p: Product }) {
  const group = p.group ?? "";
  return (
    <Link
      href={`/p/${p.id}`}
      data-rv="1"
      className="ds-lift"
      onClick={(e) => captureFlip(e.currentTarget.querySelector("[data-timg]"))}
      style={{ textAlign: "left", border: "1px solid var(--line)", background: "#fff", borderRadius: 18, overflow: "hidden", color: "var(--ink)", display: "flex", flexDirection: "column" }}
    >
      <div data-timg="1" style={{ aspectRatio: "4/3", background: "var(--t)", position: "relative", color: "var(--m)" }}>
        <ImageSlot src={p.images?.[0]} alt={p.name} placeholder={p.name} sizes="(max-width: 600px) 100vw, 320px" />
        <ConditionBadge condition={p.condition} style={{ position: "absolute", left: 10, top: 10, zIndex: 2 }} />
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em", color: "var(--mutedMono)" }}>{String(p.specs?.brand ?? "").toUpperCase()}</span>
        <b style={{ fontSize: 17, letterSpacing: "-.02em" }}>{p.name}</b>
        <span style={{ fontWeight: 800 }}>{priceLabel(p)}</span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, gap: 8, marginTop: "auto" }}>
          <IconLabel name="seal" size={15} style={{ gap: 5, fontWeight: 800, color: "var(--m)" }}>
            Checked · {checkLabel(group)}
          </IconLabel>
          <span style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{p.mode === "Quote" ? "Request a quote" : "Buy now"}</span>
        </div>
      </div>
    </Link>
  );
}

/** The design's best-seller placeholder word ("PHOTO · PHONE"). */
const PHOTO_WORD: Record<string, string> = { "phones-tablets": "PHONE", "laptops-computers": "LAPTOP", "servers-storage": "SERVER", "networking-wifi": "NETWORK", "printers-office": "PRINTER", "security-cctv": "CCTV", "internet-devices": "ROUTER" };
export const photoWord = (g: string) => PHOTO_WORD[g] ?? "PRODUCT";

/** Best-seller card (home): smaller, condition line + checked mark. */
export function BestCard({ p }: { p: Product }) {
  return (
    <Link href={`/p/${p.id}`} onClick={(e) => captureFlip(e.currentTarget.querySelector("[data-timg]"))} className="ds-lift" style={{ textAlign: "left", border: "1px solid var(--line)", background: "#fff", borderRadius: 16, overflow: "hidden", color: "var(--ink)", display: "flex", flexDirection: "column" }}>
      {p.images?.[0] ? (
        <div data-timg="1" style={{ aspectRatio: "4/3", background: "var(--t)", position: "relative", color: "var(--m)" }}>
          <ImageSlot src={p.images[0]} alt={p.name} placeholder={p.name} sizes="(max-width: 600px) 100vw, 300px" />
        </div>
      ) : (
        <div data-timg="1" style={{ aspectRatio: "4/3", background: "var(--t)", display: "flex", alignItems: "flex-end", padding: 10, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "var(--m)" }}>
          PHOTO · {photoWord(p.group ?? "")}
        </div>
      )}
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 16 }}>{p.name}</span>
        <span style={{ fontSize: 13, color: "#4A5651" }}>{p.condition && p.condition.startsWith("Grade") ? `${p.condition} · UK-used` : p.condition ?? "New"}</span>
        <span style={{ fontWeight: 800 }}>{priceLabel(p)}</span>
        <CheckedMark />
      </div>
    </Link>
  );
}

/* ---------- quote row ---------- */

export function QuoteListRow({ name, note, qty, install, onInstall, onQty }: { name: string; note: string; qty: number; install: boolean; onInstall: (v: boolean) => void; onQty?: (n: number) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "10px 14px", padding: "14px 0", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
      <div>
        <b>{name}</b>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{note}</div>
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--line)", borderRadius: 8, padding: "4px 6px", fontWeight: 700, background: "#fff" }}>
        {onQty && (
          <button type="button" aria-label="Fewer" onClick={() => onQty(qty - 1)} style={{ border: 0, background: "none", width: 24, fontSize: 16 }}>
            −
          </button>
        )}
        Qty {qty}
        {onQty && (
          <button type="button" aria-label="More" onClick={() => onQty(qty + 1)} style={{ border: 0, background: "none", width: 24, fontSize: 16 }}>
            +
          </button>
        )}
      </span>
      <label style={{ gridColumn: "1/-1", fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={install} onChange={(e) => onInstall(e.target.checked)} />
        Include installation by D’Matek engineers
      </label>
    </div>
  );
}

export { warrantyFor };
export { btn, field, labelS, mono, pagePad } from "@/lib/styles";
