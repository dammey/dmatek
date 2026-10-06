"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageSlot from "@/components/ImageSlot";
import { CheckedPanel, GuaranteeSummary, Kicker, btn, field, pagePad } from "@/components/ui";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { runFlip } from "@/lib/flip";
import { setQuoteMeta } from "@/lib/quoteMeta";
import { GRADES, conditionLine, groupName, priceLabel, versionOf, warrantyFor } from "@/lib/shop";
import type { Product } from "@/lib/types";

type Review = { id: string; stars: number; title: string | null; body: string; reviewer_name: string | null; created_at: string };

const COPY = {
  a: { cta: "Buy now", note: "Confirmed at checkout.", sub: "Delivered and ready to use.", meta: "Unit-specific results shown before dispatch" },
  b: { cta: "Buy now", note: "Confirmed at checkout.", sub: "Photos show the actual unit, marks included.", meta: "Unit-specific results shown before dispatch" },
  c: { cta: "Request a quote", note: "Price on quote, by configuration.", sub: "Quote within 24 hours.", meta: "Run on every unit before installation" },
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, addToQuote } = useCart();
  const [res, setRes] = useState<{ id: string; product: Product | null } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);
  const [install, setInstall] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<{ product: Product }>(`/catalogue/products/${id}`)
      .then(({ product }) => setRes({ id, product }))
      .catch(() => setRes({ id, product: null }));
    api
      .get<{ reviews: Review[] }>(`/reviews/product/${id}`)
      .then(({ reviews }) => setReviews(reviews ?? []))
      .catch(() => {});
  }, [id]);

  const p = res?.id === id ? res.product : undefined;
  useEffect(() => {
    if (p) requestAnimationFrame(runFlip);
  }, [p]);

  if (p === undefined)
    return (
      <main style={pagePad}>
        <div className="ds-skel" style={{ aspectRatio: "1", maxWidth: 520, borderRadius: 24 }} />
      </main>
    );
  if (p === null)
    return (
      <main style={pagePad}>
        <Kicker>PRODUCT</Kicker>
        <h1 style={{ margin: "0 0 14px", fontSize: "clamp(34px,4.4vw,64px)", letterSpacing: "-.06em" }}>We couldn’t find that item.</h1>
        <Link href="/shop" style={btn("deep")}>
          Back to the shop
        </Link>
      </main>
    );

  const v = versionOf(p);
  const c = COPY[v];
  const group = p.group ?? "";
  const brand = String(p.specs?.brand ?? "");
  const spec = String(p.specs?.spec ?? "");
  const kicker = v === "c" ? `${groupName(group).toUpperCase()} · REQUEST A QUOTE` : `${groupName(group).toUpperCase()} · ${(p.condition && p.condition.startsWith("Grade") ? "UK-USED" : p.condition ?? "NEW").toUpperCase()}`;
  const photoLabel = v === "b" ? "REAL PHOTO PLACEHOLDER · ACTUAL UNIT" : `PHOTO PLACEHOLDER · ${p.name.toUpperCase()}`;

  async function buy() {
    setBusy(true);
    try {
      await addToCart({ productId: p!.id, name: p!.name, price: p!.price, channel: "emporium" });
      router.push("/cart");
    } finally {
      setBusy(false);
    }
  }
  async function quote(quantity: number) {
    setBusy(true);
    try {
      setQuoteMeta(p!.name, { install, notes });
      await addToQuote({ productId: p!.id, name: p!.name, price: p!.price, quantity, channel: "provision" });
      router.push("/cart?tab=quote");
    } finally {
      setBusy(false);
    }
  }

  const specs: [string, string][] = [
    ["Brand", brand || "[ spec ]"],
    ["Model", p.name],
    ["Specification", spec ? spec.replace(/ · /g, ", ") : "[ spec ]"],
    ["Condition", conditionLine(p)],
    ...(p.description ? ([["Details", p.description]] as [string, string][]) : []),
  ];

  return (
    <main style={pagePad}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(18px,3vw,36px)", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div data-flip="1" style={{ position: "relative", aspectRatio: "1", background: "var(--t)", borderRadius: 24, overflow: "hidden", color: "var(--m)" }}>
            <ImageSlot src={p.images?.[0]} alt={p.name} placeholder={photoLabel} priority sizes="(max-width: 900px) 100vw, 680px" />
          </div>
          {v === "b" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[1, 2, 3].map((n) => {
                const src = p.images?.[n];
                return (
                  <div key={n} style={{ position: "relative", aspectRatio: "1", background: "var(--t2)", borderRadius: 10, overflow: "hidden", fontSize: 10, fontWeight: 700, padding: 6, color: "var(--m)" }}>
                    {src ? <ImageSlot src={src} alt={`${p.name}, actual unit`} placeholder="" sizes="200px" /> : `ACTUAL UNIT · PHOTO ${n}`}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ds-buycol" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <Kicker style={{ marginBottom: 0 }}>{kicker}</Kicker>
            <h1 style={{ margin: "8px 0 0", fontWeight: 800, fontSize: "clamp(34px,4.4vw,64px)", letterSpacing: "-.06em", lineHeight: 0.95 }}>{p.name}</h1>
            {spec && <div style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>{spec}</div>}
          </div>
          {v === "b" && (
            <div style={{ background: "var(--t)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontWeight: 800 }}>Condition: {p.condition}</span>
              {GRADES.map((g) => (
                <div key={g.k} style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <b>{g.k}</b> · {g.v}
                </div>
              ))}
            </div>
          )}
          <div>
            <div style={{ fontSize: "clamp(30px,3.4vw,44px)", fontWeight: 800, letterSpacing: "-.04em" }}>{priceLabel(p)}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{c.note}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" disabled={busy} onClick={() => (v === "c" ? quote(qty) : buy())} style={{ ...btn("buy"), flex: "1 1 180px", borderRadius: 12, padding: 16, fontSize: 16 }}>
              {busy ? "Adding…" : c.cta}
            </button>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{c.sub}</div>
          {v === "c" && (
            <div style={{ background: "var(--t)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <b>Spec summary</b>
              <span>{spec || "[ CPU, memory, storage as configured ]"}</span>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={install} onChange={(e) => setInstall(e.target.checked)} />
                Installed and configured by D’Matek engineers
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} aria-label="Quantity" style={{ ...field, width: 80, padding: 10 }} />
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" aria-label="Notes" style={{ ...field, flex: 1, padding: 10 }} />
              </div>
              <button type="button" disabled={busy} onClick={() => quote(qty)} style={{ ...btn("deep"), borderRadius: 10, padding: 12 }}>
                Add to quote · quote within 24 hours
              </button>
            </div>
          )}
          <GuaranteeSummary warranty={warrantyFor(p)} />
          <button type="button" onClick={() => quote(5)} style={{ ...btn("link"), alignSelf: "flex-start", fontWeight: 700, fontSize: 14 }}>
            Buying 5 or more? Get a bulk quote →
          </button>
        </div>
      </div>

      <div style={{ marginTop: "clamp(32px,5vw,64px)" }}>
        <CheckedPanel group={group} meta={c.meta} />
      </div>

      <section style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 18 }}>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>Specs</h3>
          {specs.map(([k, val]) => (
            <details key={k} style={{ borderTop: "1px solid var(--line)", padding: "10px 0" }}>
              <summary style={{ fontWeight: 700, cursor: "pointer" }}>{k}</summary>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>{val}</div>
            </details>
          ))}
        </div>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>Verified-purchase reviews</h3>
          {reviews.length ? (
            reviews.map((r) => (
              <div key={r.id} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 14, fontSize: 14, lineHeight: 1.5, marginBottom: 8, background: "#fff" }}>
                <b>{r.reviewer_name ?? "Customer"}</b> · Verified purchase · {"★".repeat(r.stars)}
                {r.title && <div style={{ fontWeight: 700, marginTop: 4 }}>{r.title}</div>}
                <div style={{ color: "var(--muted)", marginTop: 4 }}>{r.body}</div>
              </div>
            ))
          ) : (
            <div style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 14, fontSize: 14, lineHeight: 1.5, background: "#fff" }}>
              <b>[ Reviewer first name, area ]</b> · Verified purchase
              <div style={{ color: "var(--muted)", marginTop: 4 }}>[ Review text and customer photos appear here. ]</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
