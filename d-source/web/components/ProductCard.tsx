"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import type { Product, Store } from "@/lib/types";

export default function ProductCard({ product, store }: { product: Product; store: Store }) {
  const { addToCart, addToQuote } = useCart();
  const emp = store === "emporium";

  return (
    <article
      style={{
        background: emp ? "#131D19" : "#fff",
        color: emp ? "#F2F2EC" : "#06382E",
        border: emp ? "none" : "1px solid rgba(6,56,46,.1)",
        borderRadius: emp ? 6 : 20,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <Link href={`/p/${product.id}`} style={{ display: "block" }}>
        <div style={{ aspectRatio: "4/3", background: emp ? "#0C1411" : "#F6F4EF", borderRadius: emp ? 3 : 14, marginBottom: 10 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", opacity: 0.7 }}>{(product.specs?.brand as string) ?? ""}</span>
        <p style={{ margin: "4px 0 2px", fontWeight: 800, fontSize: 16 }}>{product.name}</p>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>{product.description ?? ""}</p>
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 800, fontSize: 17 }}>{fmt(product.price)}</span>
        <button
          type="button"
          onClick={() =>
            emp
              ? addToCart({ productId: product.id, name: product.name, price: product.price, channel: store })
              : addToQuote({ productId: product.id, name: product.name, price: product.price, channel: store })
          }
          style={{
            border: 0,
            borderRadius: emp ? 4 : 999,
            background: emp ? "#A6F000" : "#06382E",
            color: emp ? "#0C1411" : "#F5F1E8",
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: 13.5,
          }}
        >
          {emp ? "Add to cart" : "Add to quote"}
        </button>
      </div>
    </article>
  );
}
