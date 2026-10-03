"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

const DSOURCE_URL = process.env.NEXT_PUBLIC_DSOURCE_URL ?? "https://source.dmatek.com";

type NavCounts = { orders: number; quotes: number; quotesOverdue: boolean; payments: number; invoices: number; reviews: number; accounts: number; surveys: number; inventory: number; enquiries: number };

const BADGE_KEY: Record<string, keyof NavCounts> = {
  orders: "orders",
  quotes: "quotes",
  payments: "payments",
  invoices: "invoices",
  surveys: "surveys",
  inventory: "inventory",
  reviews: "reviews",
  accounts: "accounts",
  enquiries: "enquiries",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { staff, can } = useAuth();
  const [counts, setCounts] = useState<NavCounts | null>(null);

  useEffect(() => {
    if (!staff) return;
    api.get<NavCounts>("/admin/nav-counts").then(setCounts).catch(() => {});
  }, [staff]);

  return (
    <aside
      style={{
        flex: "0 0 244px",
        background: "#06382E",
        color: "#F5F1E8",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px 14px",
        gap: 18,
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px 10px 14px", borderBottom: "1px solid rgba(245,241,232,.14)" }}>
        <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.04em" }}>D&rsquo;Source</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.18em", color: "#D4A637" }}>ADMIN</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {NAV.map((group) => {
          const visible = group.items.filter((item) => can(item.module));
          if (!visible.length) return null;
          return (
            <div key={group.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "rgba(245,241,232,.45)", padding: "0 12px 4px" }}>
                {group.label}
              </span>
              {visible.map((item) => {
                const active = pathname === `/${item.path}`;
                const badgeKey = BADGE_KEY[item.path];
                const badgeValue = badgeKey ? counts?.[badgeKey] : undefined;
                const badgeN = typeof badgeValue === "number" ? badgeValue : 0;
                const overdue = item.path === "quotes" && counts?.quotesOverdue;
                return (
                  <Link
                    key={item.path}
                    href={`/${item.path}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      borderRadius: 10,
                      padding: "9px 12px",
                      background: active ? "rgba(212,166,55,.22)" : "transparent",
                      color: active ? "#F5F1E8" : "rgba(245,241,232,.82)",
                      fontSize: 14,
                      fontWeight: active ? 800 : 600,
                    }}
                  >
                    {item.label}
                    {badgeN > 0 && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10.5,
                          fontWeight: 800,
                          minWidth: 20,
                          height: 20,
                          padding: "0 5px",
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          background: overdue ? "#B42318" : "#D4A637",
                          color: overdue ? "#F5F1E8" : "#06382E",
                        }}
                      >
                        {badgeN}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "14px 10px 0", borderTop: "1px solid rgba(245,241,232,.14)" }}>
        <a href={DSOURCE_URL} style={{ color: "#D4A637", fontWeight: 700, fontSize: 14 }}>
          View storefront ↗
        </a>
        <span style={{ fontSize: 12.5, color: "rgba(245,241,232,.6)" }}>Signed in as {staff?.name ?? "[ STAFF ]"}</span>
      </div>
    </aside>
  );
}
