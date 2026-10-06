"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Toast() {
  const { toast } = useCart();
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 28,
        transform: "translateX(-50%)",
        zIndex: 95,
        background: "#06382E",
        color: "#F5F1E8",
        borderRadius: 999,
        padding: "12px 20px",
        fontSize: 14,
        fontWeight: 700,
        boxShadow: "0 14px 40px rgba(0,0,0,.25)",
        whiteSpace: "nowrap",
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      {toast}
      <Link href={/quote/i.test(toast) ? "/cart?tab=quote" : "/cart"} style={{ background: "#fff", color: "#06382E", borderRadius: 999, padding: "6px 12px", fontWeight: 800, fontSize: 12.5 }}>
        View
      </Link>
    </div>
  );
}
