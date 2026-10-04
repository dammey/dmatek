"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { chromeFor } from "@/lib/chrome";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useCategoryNav } from "@/lib/useCategoryNav";
import { playStoreTransition } from "@/lib/storeTransition";

const DMATEK_URL = process.env.NEXT_PUBLIC_DMATEK_URL ?? "https://dmatek.ng";

type NavItem = { label: string; href?: string; onClick?: (e: React.MouseEvent<HTMLElement>) => void; tag?: boolean; strong?: boolean; active?: boolean };

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { tone, subBrand } = chromeFor(pathname);
  const { cartCount, quoteCount, openBasket } = useCart();
  const { signedIn } = useAuth();
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const empCats = useCategoryNav("emporium");
  const provCats = useCategoryNav("provision");

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

  function goStore(target: "emporium" | "provision") {
    return (e: React.MouseEvent<HTMLElement>) => playStoreTransition(router, target, e.currentTarget);
  }

  // A store-front section: scroll when already on the front, link to it otherwise.
  function section(label: string, store: "emporium" | "provision", id: string): NavItem {
    return pathname === `/${store}` ? { label, onClick: () => scrollToId(id) } : { label, href: `/${store}#${id}` };
  }

  // Center nav row: store-level links only. Categories live in the bar below,
  // so they never appear twice.
  const centerNav: NavItem[] =
    subBrand === "emporium"
      ? [section("Shop", "emporium", "e-shop"), section("Kits", "emporium", "e-kits"), { label: "Track an order", href: "/track", active: pathname === "/track" }]
      : subBrand === "provision"
        ? [
            section("Ways to order", "provision", "p-ways"),
            section("Kits by place", "provision", "p-kits"),
            section("Catalogue", "provision", "p-cat"),
            { label: "Site survey", href: "/site-survey", active: pathname === "/site-survey" },
          ]
        : [
                { label: "D’Emporium · Home", onClick: goStore("emporium") },
                { label: "D’Provision · Business", onClick: goStore("provision") },
                { label: "Build a kit", onClick: () => scrollToId("pick-a-place") },
                { label: "Office in a Box", href: "/office-in-a-box" },
              ];

  // Second row: always-present category bar, varies by context.
  const catBar: NavItem[] =
    subBrand === "emporium"
      ? [
          { label: "All home products", href: "/emporium", strong: true, active: pathname === "/emporium" },
          ...empCats.map((c): NavItem => ({ label: c.label, href: `/emporium/${c.slug}`, active: pathname === `/emporium/${c.slug}` })),
          { label: "All categories", href: "/emporium/categories", active: pathname === "/emporium/categories" },
        ]
      : subBrand === "provision"
        ? [
            { label: "All business products", href: "/provision", strong: true, active: pathname === "/provision" },
            ...provCats.map((c): NavItem => ({ label: c.label, href: `/provision/${c.slug}`, active: pathname === `/provision/${c.slug}` })),
            { label: "Office in a Box", href: "/office-in-a-box", active: pathname === "/office-in-a-box" },
            { label: "All categories", href: "/provision/categories", active: pathname === "/provision/categories" },
          ]
        : [
            { label: "All products", href: "/search", strong: true, active: pathname === "/search" },
            { label: "HOME", tag: true },
            ...empCats.map((c): NavItem => ({ label: c.label, href: `/emporium/${c.slug}` })),
            { label: "BUSINESS", tag: true },
            ...provCats.map((c): NavItem => ({ label: c.label, href: `/provision/${c.slug}` })),
            { label: "All categories", href: "/categories", active: pathname === "/categories" },
          ];

  function navItemStyle(n: NavItem): React.CSSProperties {
    return {
      flex: "0 0 auto",
      background: n.active ? "rgba(212,166,55,.28)" : "transparent",
      color: "inherit",
      border: 0,
      borderRadius: 999,
      padding: "7px 12px",
      fontSize: 13,
      fontWeight: n.strong || n.tag || n.active ? 800 : 600,
      letterSpacing: n.tag ? "0.14em" : 0,
      opacity: n.tag ? 0.55 : n.active ? 1 : 0.82,
      whiteSpace: "nowrap",
    };
  }

  function renderNavItem(n: NavItem, idx: number) {
    if (n.tag) {
      return (
        <span key={`${n.label}-${idx}`} style={navItemStyle(n)}>
          {n.label}
        </span>
      );
    }
    if (n.href) {
      return (
        <Link key={`${n.label}-${idx}`} href={n.href} style={navItemStyle(n)}>
          {n.label}
        </Link>
      );
    }
    return (
      <button key={`${n.label}-${idx}`} type="button" onClick={n.onClick} style={navItemStyle(n)}>
        {n.label}
      </button>
    );
  }

  return (
    <>
      <div style={{ background: "#06382E", color: "#F5F1E8", fontSize: 12.5 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "6px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 2, background: "rgba(245,241,232,.08)", borderRadius: 999, padding: 3 }}>
            {(["emporium", "provision"] as const).map((k) => {
              const active = pathname === `/${k}`;
              const activeBg = k === "emporium" ? "#A6F000" : "#D4A637";
              const activeInk = k === "emporium" ? "#0C1411" : "#06382E";
              return (
                <button
                  key={k}
                  type="button"
                  onClick={goStore(k)}
                  style={{
                    border: 0,
                    borderRadius: 999,
                    padding: "7px 14px",
                    minHeight: 32,
                    fontSize: 12,
                    fontWeight: 700,
                    background: active ? activeBg : "transparent",
                    color: active ? activeInk : "#F5F1E8",
                    whiteSpace: "nowrap",
                  }}
                >
                  {k === "emporium" ? "For Home" : "For Business"}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <span className="ds-util-tag" style={{ whiteSpace: "nowrap", color: "rgba(245,241,232,.82)" }}>Genuine, warranty-backed devices · Delivered nationwide · Installed by D&rsquo;Matek engineers</span>
            <Link href="/account" className="ds-util-acct" style={{ whiteSpace: "nowrap", color: "#F5F1E8", fontWeight: 700 }}>
              {signedIn ? "Account ✓" : "Account"}
            </Link>
            <a href={DMATEK_URL} style={{ whiteSpace: "nowrap", color: "#D4A637", fontWeight: 700 }}>
              D&rsquo;Matek ↗
            </a>
          </div>
        </div>
      </div>
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: bg, color: ink, borderBottom: `1px solid ${line}`, backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 18px", height: 64, display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 20px)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: ink, fontWeight: 800, fontSize: 21, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
            D&rsquo;Source
          </Link>

          <nav className="ds-header-nav" style={{ display: "flex", gap: 2, flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: ink, overflowX: "auto" }}>
            {centerNav.map(renderNavItem)}
          </nav>
          <div className="ds-header-spacer" style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              type="button"
              onClick={() => setSearch((s) => !s)}
              aria-label="Search"
              style={{ width: 44, height: 44, borderRadius: 999, border: 0, background: "transparent", color: ink, fontSize: 18 }}
            >
              ⌕
            </button>
            <Link href="/account" className="ds-header-acct" style={{ border: `1px solid ${line}`, color: ink, height: 40, display: "flex", alignItems: "center", borderRadius: 999, padding: "0 14px", fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" }}>
              {signedIn ? "Account ✓" : "Account"}
            </Link>
            <button
              type="button"
              onClick={() => openBasket("cart")}
              style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${line}`, background: dark ? "#A6F000" : "transparent", color: dark ? "#0C1411" : ink, borderRadius: 999, padding: "0 14px", minHeight: 40, fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" }}
            >
              Cart <span style={{ background: ink, color: bg, borderRadius: 999, minWidth: 22, height: 22, display: "grid", placeItems: "center", fontSize: 11, padding: "0 6px" }}>{cartCount}</span>
            </button>
            <button
              type="button"
              onClick={() => openBasket("quote")}
              style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${line}`, background: tone === "provision-front" ? "#D4A637" : "transparent", color: tone === "provision-front" ? "#06382E" : ink, borderRadius: 999, padding: "0 14px", minHeight: 40, fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" }}
            >
              Quote <span style={{ background: ink, color: bg, borderRadius: 999, minWidth: 22, height: 22, display: "grid", placeItems: "center", fontSize: 11, padding: "0 6px" }}>{quoteCount}</span>
            </button>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${line}` }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 18px", height: 44, display: "flex", gap: 2, alignItems: "center", overflowX: "auto" }}>
            {catBar.map(renderNavItem)}
          </div>
        </div>

        {search && (
          <div style={{ borderTop: `1px solid ${line}` }}>
            <form onSubmit={runSearch} style={{ maxWidth: 780, margin: "0 auto", padding: "20px 18px 26px" }}>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search laptops, mesh Wi-Fi, cameras, access points…  (press Enter)"
                style={{ width: "100%", border: 0, borderBottom: `2px solid ${ink}`, padding: "12px 0", fontSize: 22, fontWeight: 700, outline: "none", background: "transparent", color: ink }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {["MacBook Air", "Mesh", "Camera", "Omada", "Signage"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setQ(p);
                      router.push(`/search?q=${encodeURIComponent(p)}`);
                      setSearch(false);
                    }}
                    style={{ border: `1px solid ${line}`, background: "transparent", color: ink, borderRadius: 999, padding: "8px 13px", fontSize: 13, fontWeight: 700 }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </form>
          </div>
        )}
      </header>
      <style jsx>{`
        .ds-header-spacer {
          display: none;
        }
        :global(.ds-util-acct) {
          display: none;
        }
        @media (max-width: 899px) {
          :global(.ds-util-tag) {
            display: none;
          }
        }
        @media (max-width: 519px) {
          :global(.ds-header-acct) {
            display: none !important;
          }
          :global(.ds-util-acct) {
            display: inline !important;
          }
        }
        @media (max-width: 1059px) {
          .ds-header-nav {
            display: none !important;
          }
          .ds-header-spacer {
            display: block;
          }
        }
      `}</style>
    </>
  );
}
