"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/auth-context";
import { TITLES, moduleFor, searchPlaceholder } from "@/lib/nav";
import { SearchProvider, useSearch } from "@/lib/search-context";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { staff, loading, can, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/")[1] || "dash";
  const engineerOnly = staff?.role === "Engineer";

  // Engineers see only the engineer app (the API refuses everything else).
  useEffect(() => {
    if (engineerOnly && id !== "engineer") router.replace("/engineer");
  }, [engineerOnly, id, router]);

  if (loading) return null;
  if (!staff) return <SignIn />;

  if (engineerOnly)
    return (
      <div style={{ fontFamily: "var(--font-sans)", background: "#F5F1E8", color: "#06382E", minHeight: "100vh" }}>
        <main style={{ padding: "clamp(18px,2.4vw,32px) clamp(14px,2.4vw,36px) 64px", display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          {id === "engineer" ? children : null}
          <button type="button" onClick={signOut} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "11px 18px", fontWeight: 700, fontSize: 14 }}>
            Sign out
          </button>
        </main>
      </div>
    );

  const mod = moduleFor(id);
  const allowed = !mod || can(mod);

  return (
    <SearchProvider>
      <div style={{ fontFamily: "var(--font-sans)", background: "#F5F1E8", color: "#06382E", minHeight: "100vh", display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Header id={id} />
          <main style={{ padding: "clamp(18px,2.4vw,32px) clamp(18px,2.4vw,36px) 64px", display: "flex", flexDirection: "column", gap: 22 }}>
            {allowed ? children : <p style={{ margin: 0, color: "#5E6E68" }}>Your role doesn’t include {mod}. Ask the owner to change it in Staff and roles.</p>}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}

function Header({ id }: { id: string }) {
  const { q, setQ } = useSearch();
  const [title, subtitle] = TITLES[id] ?? ["", ""];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(245,241,232,.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,56,46,.1)" }}>
      <div style={{ padding: "14px clamp(18px,2.4vw,36px)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 220 }}>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 26, letterSpacing: "-.035em" }}>{title}</h1>
          <span style={{ fontSize: 13.5, color: "#5E6E68" }}>{subtitle}</span>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder(id)}
          aria-label="Search"
          style={{ flex: "0 1 280px", minWidth: 180, border: "1px solid rgba(6,56,46,.18)", borderRadius: 999, padding: "11px 16px", fontSize: 14, background: "#fff", color: "#06382E", outline: "none" }}
        />
      </div>
    </header>
  );
}
