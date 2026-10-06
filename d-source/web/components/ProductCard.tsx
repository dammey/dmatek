"use client";

import Link from "next/link";
import { useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { captureFlipOrigin } from "@/lib/flipTransition";
import type { Product } from "@/lib/types";
import ImageSlot from "@/components/ImageSlot";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, addToQuote } = useCart();
  const articleRef = useRef<HTMLElement>(null);
  const emp = product.store === "emporium";
  const brand = (product.specs?.brand as string) ?? "";
  const spec = (product.specs?.spec as string) ?? product.description ?? "";
  const free = (product.specs?.free as boolean) ?? false;

  function onView() {
    captureFlipOrigin(articleRef.current?.querySelector("[data-pimg]") ?? null);
  }

  return (
    <article
      ref={articleRef}
      style={{
        background: "#FFFFFF",
        color: "#06382E",
        border: "1px solid #E6E2D8",
        borderRadius: emp ? 6 : 20,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <Link href={`/p/${product.id}`} onClick={onView} data-pimg="1" style={{ position: "relative", display: "block", aspectRatio: "1/1", borderRadius: emp ? 3 : 14, overflow: "hidden", background: "#F6F4EF" }}>
        <ImageSlot src={product.images?.[0]} alt={product.name} placeholder={product.name} sizes="(max-width: 600px) 100vw, 300px" />
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#5E6E68" }}>{brand}</span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            padding: "4px 8px",
            borderRadius: 4,
            background: emp ? "#0C1411" : "#06382E",
            color: emp ? "#A6F000" : "#D4A637",
          }}
        >
          {emp ? "D’EMPORIUM" : "D’PROVISION"}
        </span>
      </div>
      <Link href={`/p/${product.id}`} onClick={onView} style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.25, color: "#06382E" }}>
        {product.name}
      </Link>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#5E6E68" }}>{spec}</span>
      {free && (
        <span style={{ alignSelf: "flex-start", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.12em", color: "#06382E", background: "rgba(212,166,55,.3)", padding: "5px 9px", borderRadius: 4 }}>
          FREE SET-UP
        </span>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "auto" }}>
        <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>{fmt(product.price)}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#28705A" }}>{emp ? "Delivered nationwide" : "Per unit ex. VAT · volume pricing"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6 }}>
        <button
          type="button"
          onClick={() =>
            emp
              ? addToCart({ productId: product.id, name: product.name, price: product.price, channel: product.store })
              : addToQuote({ productId: product.id, name: product.name, price: product.price, channel: product.store })
          }
          style={{ border: 0, borderRadius: emp ? 4 : 999, background: emp ? "#A6F000" : "#06382E", color: emp ? "#0C1411" : "#F5F1E8", minHeight: 44, fontWeight: 800, fontSize: 14 }}
        >
          {emp ? "Add to cart" : "Add to quote"}
        </button>
        <Link
          href={`/p/${product.id}`}
          onClick={onView}
          style={{ border: "1px solid #E6E2D8", borderRadius: emp ? 4 : 999, background: "#fff", color: "#06382E", minHeight: 44, padding: "0 14px", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          View
        </Link>
      </div>
    </article>
  );
}
