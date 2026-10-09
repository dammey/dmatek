"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
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
  // Home: dark forest header over the dark hero; elsewhere cream (v11.1).
  const home = pathname === "/";
  const fg = home ? "#fff" : "var(--d)";
  const active = (href: string) => pathname === href || (href === "/shop" && (pathname.startsWith("/shop") || pathname === "/search"));

  return (
    <>
      <header className="ds-header" style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", padding: "12px var(--gut)", borderBottom: `1px solid ${home ? "rgba(255,255,255,.12)" : "var(--line)"}`, background: home ? "#0B3326" : "var(--bg)" }}>
        <Link href="/" aria-label="D’Source home" style={{ color: fg }}>
          <Logo fg={fg} sub={home ? "#9BE6C5" : "var(--m)"} />
        </Link>
        <nav className="ds-nav" aria-label="Main" style={{ gap: 2, flex: 1, minWidth: 0, justifyContent: "center" }}>
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="ds-navlink" aria-current={active(href) ? "page" : undefined} style={{ padding: "9px 10px", borderRadius: 99, fontWeight: 700, fontSize: 14, color: fg, whiteSpace: "nowrap", background: active(href) ? (home ? "rgba(255,255,255,.12)" : "var(--t)") : "transparent" }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button type="button" className="ds-menubtn" onClick={() => setOpen((o) => !o)} aria-expanded={open} style={pill}>
            {open ? "Close" : "Menu"}
          </button>
          <Link href="/cart?tab=quote" style={pill}>
            Quote · {quoteCount}
          </Link>
          <Link href="/cart" style={{ ...pill, border: 0, background: home ? "var(--buy)" : "var(--d)", color: home ? "var(--onBuy)" : "#fff" }}>
            Cart · {cartCount}
          </Link>
        </div>
        {open && (
          <nav aria-label="Menu" style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 2, borderTop: `1px solid ${home ? "rgba(255,255,255,.12)" : "var(--line)"}`, paddingTop: 8 }}>
            {NAV.map(([label, href]) => (
              <Link key={href} href={href} style={{ padding: "12px 4px", fontWeight: 700, fontSize: 17, color: fg }}>
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
