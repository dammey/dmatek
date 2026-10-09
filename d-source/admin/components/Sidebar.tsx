"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { NAV } from "@/lib/nav";

const DSOURCE_URL = process.env.NEXT_PUBLIC_DSOURCE_URL ?? "https://source.dmatek.com";

type NavCounts = Record<string, number | boolean>;

export default function Sidebar() {
  const pathname = usePathname();
  const { staff, can } = useAuth();
  const [counts, setCounts] = useState<NavCounts | null>(null);

  useEffect(() => {
    if (!staff) return;
    api.get<NavCounts>("/admin/nav-counts").then(setCounts).catch(() => {});
  }, [staff, pathname]);

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
        <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-.04em" }}>D’Source</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".18em", color: "#D4A637" }}>ADMIN</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {NAV.map((group) => {
          const visible = group.items.filter((item) => can(item.module));
          if (!visible.length) return null;
          return (
            <div key={group.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", color: "rgba(245,241,232,.45)", padding: "0 12px 4px" }}>{group.label}</span>
              {visible.map((item) => {
                const active = pathname === `/${item.id}` || pathname.startsWith(`/${item.id}/`);
                const raw = item.badge ? counts?.[item.badge] : undefined;
                const n = typeof raw === "number" ? raw : 0;
                return (
                  <Link
                    key={item.id}
                    href={`/${item.id}`}
                    className="ds-nav"
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
                      textAlign: "left",
                    }}
                  >
                    <span>{item.label}</span>
                    {n > 0 && (
                      <span
                        style={{
                          minWidth: 22,
                          height: 22,
                          padding: "0 7px",
                          borderRadius: 999,
                          background: item.id === "quotes" || item.id === "invoices" ? "#D4A637" : "#E3EEE8",
                          color: "#06382E",
                          fontSize: 11.5,
                          fontWeight: 800,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {n}
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
        <span style={{ fontSize: 12.5, color: "rgba(245,241,232,.6)" }}>Signed in as {staff?.name ?? "[ ADMIN NAME ]"}</span>
      </div>
    </aside>
  );
}
