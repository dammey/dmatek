"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SettingsValue from "@/components/SettingsValue";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { useFlow } from "@/lib/flow-context";
import { playFlipIn } from "@/lib/flipTransition";
import { useKitOverlay } from "@/lib/kit-overlay-context";
import type { Kit, Product } from "@/lib/types";

type Review = { id: string; stars: number; title: string | null; body: string; reviewer_name: string | null; created_at: string };

const THUMBS = ["FRONT", "SIDE", "IN USE", "BOX"];

function stars(n: number) {
  return "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, addToQuote } = useCart();
  const { startFlow } = useFlow();
  const { openKit } = useKitOverlay();
  const [product, setProduct] = useState<Product | null | "loading">("loading");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [kitMatch, setKitMatch] = useState<Kit | null>(null);
  const [qty, setQty] = useState(1);
  const [gi, setGi] = useState(0);

  useEffect(() => {
    api
      .get<{ product: Product }>(`/catalogue/products/${id}`)
      .then(({ product }) => setProduct(product))
      .catch(() => setProduct(null));
    api
      .get<{ reviews: Review[] }>(`/reviews/product/${id}`)
      .then(({ reviews }) => setReviews(reviews))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (product && product !== "loading") playFlipIn();
  }, [product]);

  useEffect(() => {
    if (!product || product === "loading" || !product.category_id) return;
    const qs = new URLSearchParams({ store: product.store, category: product.category_id });
    api
      .get<{ items: Product[] }>(`/catalogue/products?${qs}`)
      .then(({ items }) => setRelated(items.filter((p) => p.id !== product.id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [product]);

  useEffect(() => {
    if (!product || product === "loading") return;
    api
      .get<{ kits: Kit[] }>(`/catalogue/kits?store=${product.store}`)
      .then(({ kits }) => setKitMatch(kits.find((k) => k.kit_items.some((it) => it.product_id === product.id)) ?? null))
      .catch(() => setKitMatch(null));
  }, [product]);

  if (product === null) notFound();
  if (product === "loading") return <main data-screen-label="Product" style={{ padding: 60 }} />;

  const p = product;
  const emp = p.store === "emporium";
  const brand = (p.specs?.brand as string) ?? "";
  const spec = (p.specs?.spec as string) ?? "";
  const free = (p.specs?.free as boolean) ?? false;
  const photos = p.images ?? [];
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.stars, 0) / reviews.length : 0;
  const revStars = reviews.length ? stars(avg) : "☆☆☆☆☆";
  const revHead = reviews.length ? `${avg.toFixed(1)} out of 5` : "No reviews yet";
  const revLine = reviews.length ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}` : "No reviews yet · write one";

  function addN() {
    if (emp) addToCart({ productId: p.id, name: p.name, price: p.price, quantity: qty, channel: "emporium" });
    else addToQuote({ productId: p.id, name: p.name, price: p.price, quantity: qty, channel: "provision" });
  }

  const btnRad = emp ? 4 : 999;
  function btn(primary: boolean): React.CSSProperties {
    return {
      border: primary ? "0" : "1px solid #E6E2D8",
      borderRadius: btnRad,
      background: primary ? (emp ? "#A6F000" : "#06382E") : "#fff",
      color: primary ? (emp ? "#0C1411" : "#F5F1E8") : "#06382E",
      minHeight: 54,
      padding: "6px 16px",
      fontWeight: 800,
      fontSize: 15,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    };
  }

  const pActions = emp
    ? [
        { label: "Add to cart", sub: "Keep shopping", go: () => { addN(); }, primary: true },
        { label: "Buy now", sub: "Straight to checkout", go: () => { addN(); setTimeout(() => startFlow("checkout"), 30); }, primary: false },
        { label: "Order on WhatsApp", sub: "Send it as a message", go: () => { addN(); setTimeout(() => startFlow("whatsapp"), 30); }, primary: false },
        { label: "Ask a question", sub: "Before you buy", go: () => startFlow("enquiry", `About: ${p.name}`), primary: false },
      ]
    : [
        { label: "Add to quote list", sub: "Keep building", go: () => { addN(); }, primary: true },
        { label: "Request a quote", sub: "Back within 4 working hours", go: () => { addN(); setTimeout(() => startFlow("quote"), 30); }, primary: false },
        { label: "Order on account", sub: "Approved accounts, 30-day invoice", go: () => { addN(); setTimeout(() => startFlow("account"), 30); }, primary: false },
        { label: "Book a free site survey", sub: "We survey before we specify", go: () => startFlow("quote", `Site survey for: ${p.name}`), primary: false },
      ];

  const freeWhat = p.categories?.name === "TV & Audio" ? " (wall mounting)" : " (set-up and data transfer)";
  const pInfo = [
    { t: "Delivery", d: <>Delivered nationwide. <SettingsValue field="deliveryTimesAndFees" placeholder="[ DELIVERY TIMES AND FEES TO CONFIRM ]" /></> as React.ReactNode },
    { t: "Installation", d: free ? `Free${freeWhat}, by D’Matek engineers.` : "Installed by D’Matek engineers as a paid add-on." },
    { t: "Payment", d: emp ? "Card (Paystack or Flutterwave), bank transfer, USSD or pay on delivery." : "Quote within 4 working hours. Approved accounts pay on 30-day invoice." },
    { t: "Warranty", d: "Genuine and warranty-backed. For repairs we collect it from you, or you send it by courier." },
  ];
  const pSpecs = [
    { k: "Brand", v: brand },
    { k: "Model", v: p.name },
    { k: "Specification", v: spec },
    { k: "Category", v: p.categories?.name ?? "" },
    { k: "Set-up", v: free ? `Free${freeWhat}` : "Paid add-on" },
    { k: "Pricing", v: emp ? "Delivery fee shown at checkout" : "Per unit ex. VAT · volume pricing" },
  ].filter((s) => s.v);

  return (
    <main data-screen-label="Product" style={{ background: "#FFFFFF", color: "#06382E", paddingBottom: 88 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D&rsquo;Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>&rsaquo;</span>
        <Link href={`/${p.store}`} style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          {emp ? "D’Emporium" : "D’Provision"}
        </Link>
        {p.categories && (
          <>
            <span style={{ color: "#B9B3A6" }}>&rsaquo;</span>
            <Link href={`/${p.store}/${p.categories.slug}`} style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
              {p.categories.name}
            </Link>
          </>
        )}
        <span style={{ color: "#B9B3A6" }}>&rsaquo;</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>{p.name}</span>
      </div>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(20px,3vh,36px) clamp(18px,3vw,40px) 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "clamp(24px,4vw,64px)", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <div data-pdpimg="1" style={{ position: "relative", aspectRatio: "1/1", borderRadius: emp ? 6 : 28, overflow: "hidden", background: "#F6F4EF" }}>
            {free && (
              <span style={{ position: "absolute", left: 16, top: 16, zIndex: 2, fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "#06382E", background: "#D4A637", padding: "7px 11px", borderRadius: 4 }}>
                FREE SET-UP
              </span>
            )}
            {photos[gi] && <Image src={photos[gi]} alt={p.name} fill priority sizes="(max-width: 900px) 100vw, 680px" style={{ objectFit: "cover" }} />}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 8 }}>
            {(photos.length ? photos.slice(0, 4) : THUMBS).map((item, i) => (
              <button
                key={item}
                type="button"
                onClick={() => setGi(i)}
                aria-label={photos.length ? `Photo ${i + 1}` : item}
                style={{ position: "relative", aspectRatio: "1/1", borderRadius: emp ? 3 : 14, overflow: "hidden", background: "#F6F4EF", border: `2px solid ${i === gi ? "#06382E" : "transparent"}`, padding: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "#5E6E68" }}
              >
                {photos.length ? <Image src={item} alt="" fill sizes="160px" style={{ objectFit: "cover" }} /> : item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 130 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", padding: "5px 9px", borderRadius: 4, background: emp ? "#0C1411" : "#06382E", color: emp ? "#A6F000" : "#D4A637" }}>
              {emp ? "D’EMPORIUM" : "D’PROVISION"}
            </span>
            {brand && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#5E6E68" }}>{brand}</span>}
          </div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(34px,4vw,58px)", lineHeight: 1, letterSpacing: "-0.045em" }}>{p.name}</h1>
          {spec && <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#5E6E68" }}>{spec}</span>}
          <button
            type="button"
            onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, border: 0, background: "transparent", padding: 0, fontSize: 14, fontWeight: 700, color: "#06382E" }}
          >
            <span style={{ color: "#D4A637", letterSpacing: 2 }}>{revStars}</span>
            <span style={{ borderBottom: "1px solid rgba(6,56,46,.3)" }}>{revLine}</span>
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "14px 0", borderTop: "1px solid #EEEAE2", borderBottom: "1px solid #EEEAE2" }}>
            <span style={{ fontWeight: 800, fontSize: "clamp(32px,3.4vw,46px)", letterSpacing: "-0.035em" }}>{fmt(p.price)}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#28705A" }}>{emp ? "Delivered nationwide · pay by card, transfer, USSD or on delivery" : "Per unit ex. VAT · volume pricing on larger orders"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "#28705A" }}>QUANTITY</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #E6E2D8", borderRadius: 999, overflow: "hidden" }}>
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Fewer" style={{ width: 44, height: 44, border: 0, background: "#fff", fontSize: 18, color: "#06382E" }}>
                −
              </button>
              <span style={{ minWidth: 34, textAlign: "center", fontWeight: 800 }}>{qty}</span>
              <button type="button" onClick={() => setQty((n) => n + 1)} aria-label="More" style={{ width: 44, height: 44, border: 0, background: "#fff", fontSize: 18, color: "#06382E" }}>
                +
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 8 }}>
            {pActions.map((a) => (
              <button key={a.label} type="button" onClick={a.go} style={btn(a.primary)}>
                {a.label}
                <span style={{ fontSize: 11.5, fontWeight: 600, opacity: 0.75 }}>{a.sub}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", border: "1px solid #EEEAE2", borderRadius: 20, overflow: "hidden" }}>
            {pInfo.map((i) => (
              <div key={i.t} style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: 12, padding: "14px 16px", borderBottom: "1px solid #EEEAE2", fontSize: 14, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 800 }}>{i.t}</span>
                <span style={{ color: "#3A4A44" }}>{i.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {kitMatch && (
        <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) 0" }}>
          <div style={{ background: "#F5F1E8", borderRadius: "clamp(28px,4vw,48px)", padding: "clamp(22px,4vw,48px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(20px,3vw,44px)", alignItems: "center" }}>
            <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 24, overflow: "hidden", background: "#EFEADC" }}>
              {kitMatch.kit_items.map((it, i) => (
                <span
                  key={it.id}
                  style={{ position: "absolute", left: `${it.pin_x}%`, top: `${it.pin_y}%`, width: 40, height: 40, margin: "-20px 0 0 -20px", borderRadius: "50%", border: "3px solid #F5F1E8", background: "#D4A637", color: "#06382E", fontWeight: 800, fontSize: 14, display: "grid", placeItems: "center" }}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>SEE IT IN THE PLACE</span>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(28px,3.4vw,46px)", letterSpacing: "-0.04em", lineHeight: 1 }}>Goes in the {kitMatch.short} kit.</h2>
              <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(6,56,46,.14)" }}>
                {kitMatch.kit_items.map((it, i) => (
                  <div key={it.id} style={{ display: "grid", gridTemplateColumns: "30px minmax(0,1fr) auto", gap: 10, alignItems: "center", padding: "11px 0", borderBottom: "1px solid rgba(6,56,46,.14)" }}>
                    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#D4A637", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>{i + 1}</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{it.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#28705A" }}>{it.price ? fmt(it.price) : "Quoted"}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => openKit(kitMatch.key)}
                style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800, fontSize: 15 }}
              >
                Get the whole kit &rarr;
              </button>
            </div>
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,64px)", alignItems: "start" }}>
        {p.description && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>OVERVIEW</span>
            <p style={{ margin: 0, fontSize: "clamp(18px,1.8vw,22px)", lineHeight: 1.55, fontWeight: 500 }}>{p.description}</p>
          </div>
        )}
        {pSpecs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>SPECIFICATIONS</span>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #EEEAE2" }}>
              {pSpecs.map((s) => (
                <div key={s.k} style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr)", gap: 12, padding: "13px 0", borderBottom: "1px solid #EEEAE2", fontSize: 14.5 }}>
                  <span style={{ color: "#5E6E68", fontWeight: 600 }}>{s.k}</span>
                  <span style={{ fontWeight: 700 }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(56px,8vh,96px) clamp(18px,3vw,40px) clamp(40px,6vh,72px)" }}>
        <div id="reviews" style={{ scrollMarginTop: 130, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "clamp(24px,4vw,56px)", alignItems: "start", marginBottom: "clamp(56px,8vh,96px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ display: "inline-block", alignSelf: "flex-start", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10 }}>REVIEWS</span>
            <span style={{ fontWeight: 800, fontSize: "clamp(28px,3.2vw,44px)", letterSpacing: "-0.04em", lineHeight: 1 }}>{revHead}</span>
            <span style={{ color: "#D4A637", fontSize: 22, letterSpacing: 3 }}>{revStars}</span>
            <span style={{ fontSize: 15, lineHeight: 1.6, color: "#3A4A44" }}>Reviews come from verified D&rsquo;Source purchases. Each one is checked before it appears.</span>
            <button
              type="button"
              onClick={() => startFlow("review", "", { productId: p.id })}
              style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "14px 22px", fontWeight: 800, fontSize: 14.5 }}
            >
              Write a review
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reviews.length === 0 && (
              <div style={{ background: "#F6F4EF", borderRadius: 20, padding: 24, fontSize: 15, lineHeight: 1.6, color: "#3A4A44" }}>
                No reviews yet. Bought this from D&rsquo;Source? Tell other buyers how it went.
              </div>
            )}
            {reviews.map((r) => (
              <div key={r.id} style={{ border: "1px solid #EEEAE2", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ color: "#D4A637", letterSpacing: 2 }}>{stars(r.stars)}</span>
                {r.title && <span style={{ fontWeight: 800, fontSize: 17 }}>{r.title}</span>}
                <span style={{ fontSize: 15, lineHeight: 1.6, color: "#3A4A44" }}>{r.body}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#5E6E68" }}>{r.reviewer_name}</span>
              </div>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <>
            <h2 style={{ margin: "0 0 20px", fontWeight: 800, fontSize: "clamp(28px,3.2vw,44px)", letterSpacing: "-0.04em" }}>You might also need</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,230px),1fr))", gap: 12 }}>
              {related.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </>
        )}
      </section>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60, background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)", borderTop: "1px solid #EEEAE2" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "10px clamp(18px,3vw,40px)", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 800, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#28705A" }}>{fmt(p.price)}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              addN();
            }}
            style={{ border: 0, borderRadius: btnRad, background: emp ? "#A6F000" : "#06382E", color: emp ? "#0C1411" : "#F5F1E8", minHeight: 48, padding: "0 22px", fontWeight: 800, fontSize: 14.5, whiteSpace: "nowrap" }}
          >
            {emp ? "Add to cart" : "Add to quote"}
          </button>
        </div>
      </div>
    </main>
  );
}
