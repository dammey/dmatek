"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Adire } from "./ui";
import { useCart } from "@/lib/cart-context";
import { config } from "@/lib/config";

const NAV: [string, string][] = [
  ["Shop", "/shop"],
  ["For your business", "/provision"],
  ["We’ll source it", "/source"],
  ["Pickup repairs", "/repair"],
  ["Help", "/help"],
  ["Account", "/account"],
];

const pill: React.CSSProperties = { whiteSpace: "nowrap", border: "1px solid var(--line)", background: "#fff", borderRadius: 99, padding: "9px 14px", fontWeight: 700, fontSize: 13, color: "var(--ink)" };

export default function Header() {
  const { cartCount, quoteCount } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Close the mobile menu on navigation (render-time reset, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  const active = (href: string) => pathname === href || (href === "/shop" && (pathname.startsWith("/shop") || pathname === "/search"));

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", padding: "14px var(--gut)", borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-.04em", color: "var(--d)" }}>
          D’Source
        </Link>
        <nav className="ds-nav" aria-label="Main" style={{ gap: 4, flex: 1, justifyContent: "center" }}>
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="ds-navlink" aria-current={active(href) ? "page" : undefined} style={{ padding: "9px 14px", borderRadius: 99, fontWeight: 700, fontSize: 14, color: "var(--d)", whiteSpace: "nowrap", background: active(href) ? "var(--t)" : "transparent" }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="ds-menubtn" onClick={() => setOpen((o) => !o)} aria-expanded={open} style={pill}>
            {open ? "Close" : "Menu"}
          </button>
          <Link href="/cart?tab=quote" style={pill}>
            Quote · {quoteCount}
          </Link>
          <Link href="/cart" style={{ ...pill, border: 0, background: "var(--d)", color: "#fff" }}>
            Cart · {cartCount}
          </Link>
        </div>
        {open && (
          <nav aria-label="Menu" style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 2, borderTop: "1px solid var(--line)", paddingTop: 8 }}>
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} style={{ padding: "12px 4px", fontWeight: 700, fontSize: 17, color: "var(--d)" }}>
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      {config.adire && <Adire h={10} />}
    </>
  );
}
