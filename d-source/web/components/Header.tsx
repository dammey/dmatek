"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { chromeFor } from "@/lib/chrome";
import { useCart } from "@/lib/cart-context";

const DMATEK_URL = process.env.NEXT_PUBLIC_DMATEK_URL ?? "https://dmatek.ng";

const EMPORIUM_CATS: [string, string][] = [
  ["Laptops", "Laptops"],
  ["Phones", "Phones"],
  ["Networking", "Wi-Fi"],
  ["TV & Audio", "TV & Audio"],
  ["Power", "Power"],
  ["Security", "Security"],
];
const PROVISION_CATS = ["Networking", "Computing", "Security", "Displays"];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { tone, subBrand } = chromeFor(pathname);
  const { cartCount, quoteCount, openBasket } = useCart();
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");

  const dark = tone === "emporium-front";
  const bg = dark ? "#0C1411" : tone === "source" ? "#F5F1E8" : tone === "provision-front" ? "#F5F1E8" : "#FFFFFF";
  const ink = dark ? "#F2F2EC" : "#06382E";
  const line = dark ? "#22322B" : "rgba(6,56,46,.12)";

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setSearch(false);
  }

  const catBar = subBrand === "emporium" ? EMPORIUM_CATS.map(([, l]) => l) : subBrand === "provision" ? PROVISION_CATS : [];
  const catHrefBase = subBrand === "emporium" ? "/emporium" : subBrand === "provision" ? "/provision" : "";

  return (
    <>
      <div style={{ background: dark ? "#0C1411" : "#06382E", color: "#F5F1E8", fontSize: 12.5 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "8px 18px", display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>Delivered nationwide · genuine, warranty-backed</span>
          <a href={DMATEK_URL} style={{ fontWeight: 700 }}>
            D&rsquo;Matek ↗
          </a>
        </div>
      </div>
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: bg, borderBottom: `1px solid ${line}`, backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: 10, color: ink, fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em" }}>
            D&rsquo;Source
            {subBrand && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  padding: "5px 9px",
                  borderRadius: 4,
                  background: subBrand === "emporium" ? "#0C1411" : "#06382E",
                  color: subBrand === "emporium" ? "#A6F000" : "#D4A637",
                }}
              >
                {subBrand === "emporium" ? "D’EMPORIUM" : "D’PROVISION"}
              </span>
            )}
          </Link>

          <nav style={{ display: "flex", gap: 18, flex: 1, flexWrap: "wrap", fontSize: 14, fontWeight: 600, color: ink }}>
            <Link href="/emporium">D&rsquo;Emporium · Home</Link>
            <Link href="/provision">D&rsquo;Provision · Business</Link>
            <Link href="/office-in-a-box">Office in a Box</Link>
            <Link href="/categories">All categories</Link>
          </nav>

          <button
            type="button"
            onClick={() => setSearch((s) => !s)}
            aria-label="Search"
            style={{ width: 44, height: 44, borderRadius: 999, border: `1px solid ${line}`, background: "transparent", color: ink }}
          >
            ⌕
          </button>
          <Link href="/account" style={{ fontSize: 14, fontWeight: 700, color: ink }}>
            Account
          </Link>
          <button
            type="button"
            onClick={() => openBasket("cart")}
            style={{ position: "relative", border: "none", background: "transparent", color: ink, fontSize: 14, fontWeight: 700 }}
          >
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </button>
          <button
            type="button"
            onClick={() => openBasket("quote")}
            style={{ position: "relative", border: "none", background: "transparent", color: ink, fontSize: 14, fontWeight: 700 }}
          >
            Quote{quoteCount > 0 ? ` (${quoteCount})` : ""}
          </button>
        </div>

        {search && (
          <form onSubmit={runSearch} style={{ maxWidth: 1400, margin: "0 auto", padding: "0 18px 14px", display: "flex", gap: 8 }}>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              style={{ flex: 1, border: `1px solid ${line}`, borderRadius: 999, padding: "12px 18px", fontSize: 15, background: dark ? "#131D19" : "#fff", color: ink }}
            />
            <button type="submit" style={{ border: 0, borderRadius: 999, background: "#D4A637", color: "#06382E", padding: "0 22px", fontWeight: 800 }}>
              Search
            </button>
          </form>
        )}

        {catBar.length > 0 && (
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 18px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
            {catBar.map((c) => (
              <Link
                key={c}
                href={`${catHrefBase}/${c.replace(/\W/g, "").toLowerCase()}`}
                style={{ whiteSpace: "nowrap", fontSize: 13.5, fontWeight: 700, color: ink, opacity: 0.82, padding: "6px 10px" }}
              >
                {c}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
