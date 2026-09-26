"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { useFlow } from "@/lib/flow-context";
import type { Product } from "@/lib/types";

type Review = { id: string; stars: number; title: string | null; body: string; reviewer_name: string | null; created_at: string };

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, addToQuote } = useCart();
  const { startFlow } = useFlow();
  const [product, setProduct] = useState<Product | null | "loading">("loading");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);

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

  if (product === null) notFound();
  if (product === "loading") return <main style={{ padding: 60 }} />;

  const emp = product.store === "emporium";
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.stars, 0) / reviews.length : 0;

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 40 }}>
        <div style={{ aspectRatio: "4/3", background: "#F6F4EF", borderRadius: emp ? 6 : 28 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              alignSelf: "flex-start",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              padding: "5px 9px",
              borderRadius: 4,
              background: emp ? "#0C1411" : "#06382E",
              color: emp ? "#A6F000" : "#D4A637",
            }}
          >
            {emp ? "D’EMPORIUM" : "D’PROVISION"}
          </span>
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.7 }}>{(product.specs?.brand as string) ?? ""}</span>
            <h1 style={{ margin: "6px 0 8px", fontWeight: 800, fontSize: "clamp(28px,3.2vw,42px)", letterSpacing: "-0.03em" }}>{product.name}</h1>
            <p style={{ margin: 0, fontSize: 15, color: "#5E6E68" }}>{(product.specs?.spec as string) ?? product.description ?? ""}</p>
          </div>
          <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: "-0.03em" }}>{fmt(product.price)}</span>

          {reviews.length > 0 && (
            <span style={{ fontSize: 14, color: "#5E6E68" }}>
              <span style={{ color: "#D4A637" }}>{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</span> {avg.toFixed(1)} out of 5 ({reviews.length})
            </span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} style={{ width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "transparent" }}>−</button>
            <span style={{ minWidth: 24, textAlign: "center", fontWeight: 800 }}>{qty}</span>
            <button type="button" onClick={() => setQty((n) => n + 1)} style={{ width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "transparent" }}>+</button>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => (emp ? addToCart({ productId: product.id, name: product.name, price: product.price, quantity: qty, channel: "emporium" }) : addToQuote({ productId: product.id, name: product.name, price: product.price, quantity: qty, channel: "provision" }))}
              style={{ flex: "1 1 220px", border: 0, borderRadius: emp ? 4 : 999, background: emp ? "#A6F000" : "#06382E", color: emp ? "#0C1411" : "#F5F1E8", minHeight: 56, fontWeight: 800, fontSize: 16 }}
            >
              {emp ? "Add to cart" : "Add to quote list"}
            </button>
            <button
              type="button"
              onClick={() => startFlow("enquiry", `About: ${product.name}`)}
              style={{ flex: "1 1 220px", border: "1px solid rgba(6,56,46,.2)", borderRadius: emp ? 4 : 999, background: "#fff", minHeight: 56, fontWeight: 700, fontSize: 15 }}
            >
              Ask a question
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#3A4A44", borderTop: "1px solid rgba(6,56,46,.1)", paddingTop: 16 }}>
            <span>Delivered nationwide. [ DELIVERY TIMES AND FEES TO CONFIRM ]</span>
            <span>{(product.specs?.free as boolean) ? "Free set-up, by D’Matek engineers." : "Installed by D’Matek engineers as a paid add-on."}</span>
            <span>{emp ? "Card (Paystack or Flutterwave), bank transfer, USSD or pay on delivery." : "Quote within 4 working hours. Approved accounts pay on 30-day invoice."}</span>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(18px,3vw,40px) clamp(56px,7vh,96px)" }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 16 }}>Reviews</h2>
        {reviews.length === 0 && <p style={{ color: "#5E6E68", marginBottom: 16 }}>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r.id} style={{ padding: "14px 0", borderBottom: "1px solid rgba(6,56,46,.08)" }}>
            <span style={{ color: "#D4A637" }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
            <p style={{ margin: "6px 0 4px", fontWeight: 700 }}>{r.title}</p>
            <p style={{ margin: 0, color: "#3A4A44", fontSize: 14.5 }}>{r.body}</p>
            <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{r.reviewer_name} · verified purchase, checked before publishing</span>
          </div>
        ))}
        <button type="button" onClick={() => startFlow("review", "", { productId: product.id })} style={{ marginTop: 16, border: "1px solid rgba(6,56,46,.2)", borderRadius: 999, padding: "12px 20px", fontWeight: 700, background: "#fff" }}>
          Write a review
        </button>
      </section>
    </main>
  );
}
