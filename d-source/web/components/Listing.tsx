"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, Kicker, PageTitle, ProductTile, SkeletonTile, btn, mono, pagePad } from "./ui";
import { api } from "@/lib/api";
import { PROMISE } from "@/lib/promises";
import { CONDITIONS, DEFAULT_INTRO, INTRO, groupName } from "@/lib/shop";
import type { Product } from "@/lib/types";
import { WhatsAppLink } from "@/lib/settings-context";

const PAGE = 24;
const SORTS = [
  ["Featured", ""],
  ["Price: low to high", "low"],
  ["Price: high to low", "high"],
] as const;

type Filters = { cond: string; mode: string; brand: string; sort: string };
const ALL: Filters = { cond: "All", mode: "All", brand: "All", sort: "Featured" };

/** Category / Search results / Shop all. Filters work against the real
 * catalogue; a filter change shows the skeleton for at least 500ms. */
export default function Listing({ group, q, onClearQ }: { group?: string; q?: string; onClearQ?: () => void }) {
  const [f, setF] = useState<Filters>(ALL);
  const [res, setRes] = useState<{ key: string; items: Product[]; total: number; brands: string[]; error: boolean } | null>(null);
  const [shown, setShown] = useState(PAGE);

  // New scope (category or query) → reset filters and paging (render-time reset).
  const scope = `${group ?? ""}|${q ?? ""}`;
  const [lastScope, setLastScope] = useState(scope);
  if (lastScope !== scope) {
    setLastScope(scope);
    setF(ALL);
    setShown(PAGE);
  }

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (group) p.set("group", group);
    if (q) p.set("q", q);
    if (f.cond !== "All") p.set("cond", f.cond);
    if (f.mode !== "All") p.set("mode", f.mode === "Quote" ? "Quote" : "Buy now");
    if (f.brand !== "All") p.set("brand", f.brand);
    const s = SORTS.find(([l]) => l === f.sort)?.[1];
    if (s) p.set("sort", s);
    return p.toString();
  }, [group, q, f]);

  useEffect(() => {
    let live = true;
    const started = Date.now();
    api
      .get<{ items: Product[]; total: number; brands?: string[] }>(`/catalogue/products?${qs}`)
      .then((r) => {
        // Skeleton shows for at least 500ms on a filter change.
        setTimeout(() => live && setRes({ key: qs, items: r.items, total: r.total, brands: r.brands ?? [], error: false }), Math.max(0, 500 - (Date.now() - started)));
      })
      .catch(() => live && setRes({ key: qs, items: [], total: 0, brands: [], error: true }));
    return () => {
      live = false;
    };
  }, [qs]);

  const loading = res?.key !== qs;
  const items = loading ? [] : res!.items;
  const total = res?.total ?? 0;
  const error = !!res?.error;
  // Keep the brand row stable while loading.
  const brands = res?.brands ?? [];

  const set = (k: keyof Filters, v: string) => {
    setF((o) => ({ ...o, [k]: v }));
    setShown(PAGE);
  };

  const rows: [string, readonly string[], keyof Filters][] = [
    ["CONDITION", ["All", ...CONDITIONS], "cond"],
    ["BUYING", ["All", "Buy now", "Quote"], "mode"],
    ["BRAND", ["All", ...brands], "brand"],
    ["SORT", SORTS.map(([l]) => l), "sort"],
  ];

  const kicker = q ? "SEARCH RESULTS" : group ? "CATEGORY" : "SHOP";
  const title = q ? `“${q}”` : group ? groupName(group) : "Everything we source";
  const intro = q ? "Everything in the catalogue that matches. If it isn’t here, we’ll source it." : group ? INTRO[group] ?? DEFAULT_INTRO : DEFAULT_INTRO;
  const visible = items.slice(0, shown);

  return (
    <main style={pagePad}>
      <Kicker>{kicker}</Kicker>
      <PageTitle style={{ lineHeight: 0.9, letterSpacing: "-.065em" }}>{title}</PageTitle>
      <p style={{ margin: "0 0 24px", color: "var(--muted)", fontSize: "clamp(15px,1.3vw,18px)", maxWidth: "56ch", lineHeight: 1.55 }}>{intro}</p>


      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
        {rows.map(([title, opts, key]) => (
          <div key={key} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...mono, letterSpacing: ".14em", color: "var(--mutedMono)", width: 78 }}>{title}</span>
            {opts.map((o) => (
              <button key={o} type="button" className="ds-chip" onClick={() => set(key, o)} aria-pressed={f[key] === o} style={{ ...chip(f[key] === o), flexShrink: 0 }}>
                {o}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
        <span style={{ ...mono, letterSpacing: ".14em", color: "var(--mutedMono)" }}>
          {loading ? "LOADING…" : `${total} ${total === 1 ? "ITEM" : "ITEMS"} · CHECKED BEFORE DELIVERY`}
        </span>
        {q && onClearQ && (
          <button type="button" onClick={onClearQ} style={btn("link", { fontWeight: 700 })}>
            Clear search
          </button>
        )}
      </div>

      {loading ? (
        <div style={grid}>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <SkeletonTile key={k} />
          ))}
        </div>
      ) : visible.length ? (
        <>
          <div style={grid}>
            {visible.map((p) => (
              <ProductTile key={p.id} p={p} />
            ))}
          </div>
          {items.length > shown && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
              <button type="button" onClick={() => setShown((n) => n + PAGE)} style={btn("ghost")}>
                Show more · {items.length - shown} left
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title={error ? "We couldn’t load the catalogue just now." : "Nothing listed for that right now."} />
      )}

      <div style={{ marginTop: 22, background: "var(--t)", borderRadius: 16, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <b>Can’t find it? We’ll source it.</b>
          <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{PROMISE.replyPersonal}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/source" style={btn("buy", { padding: "12px 18px" })}>
            Request an item
          </Link>
          <WhatsAppLink style={btn("outline", { padding: "12px 18px" })}>
            WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </main>
  );
}

const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,240px),1fr))", gap: 14 };

function chip(on: boolean): React.CSSProperties {
  return { border: "1px solid var(--line)", background: on ? "var(--d)" : "#fff", color: on ? "#fff" : "var(--ink)", borderRadius: 99, padding: "8px 14px", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 };
}
