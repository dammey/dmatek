"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageTitle, Tabs, btn, field, labelS, pagePad } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Order = { id: string; ref: string; status: string; placed_at: string };
type Quote = { id: string; ref: string; status: string };
type Me = { full_name: string | null; company_name: string | null; account_status: string | null };
const TABS = ["Personal", "Business"] as const;

function Card({ t, d, x, children }: { t: string; d: string; x: string; children?: React.ReactNode }) {
  return (
    <div data-rv="1" style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 8, background: "#fff" }}>
      <b>{t}</b>
      <span style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{d}</span>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--m)" }}>{x}</div>
      {children}
    </div>
  );
}

function AccountInner() {
  const { signedIn, loading, signOut } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const tab = params.get("tab") === "business" ? "Business" : "Personal";
  const [data, setData] = useState<{ orders: Order[]; quotes: Quote[]; me: Me | null } | null>(null);

  useEffect(() => {
    if (!signedIn) return;
    Promise.all([
      api.get<{ orders: Order[] }>("/account/orders").catch(() => ({ orders: [] })),
      api.get<{ quotes: Quote[] }>("/account/quotes").catch(() => ({ quotes: [] })),
      api.get<{ customer: Me }>("/account/me").catch(() => ({ customer: null })),
    ]).then(([o, q, m]) => setData({ orders: o.orders ?? [], quotes: q.quotes ?? [], me: m.customer }));
  }, [signedIn]);

  if (loading) return <main style={pagePad} />;
  if (!signedIn)
    return (
      <main style={pagePad}>
        <PageTitle>Account</PageTitle>
        <SignIn />
      </main>
    );

  const orders = data?.orders ?? [];
  const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const openQuotes = (data?.quotes ?? []).filter((q) => !["accepted", "declined", "expired", "converted"].includes(q.status));
  const n = (v: number | undefined) => (data ? String(v) : "[ n ]");

  return (
    <main style={pagePad}>
      <PageTitle>Account</PageTitle>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
        <Tabs items={TABS} value={tab} onChange={(t) => router.replace(t === "Business" ? "/account?tab=business" : "/account", { scroll: false })} />
        <button type="button" onClick={signOut} style={btn("ghost", { padding: "9px 16px", fontSize: 14 })}>
          Sign out
        </button>
      </div>
      {tab === "Personal" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 14 }}>
          <Card t="Orders" d="Your orders and tracking." x={`${n(active.length)} active`}>
            {active.slice(0, 3).map((o) => (
              <Link key={o.id} href={`/track?ref=${o.ref}`} style={{ fontSize: 13, fontWeight: 700, textDecoration: "underline" }}>
                Track {o.ref}
              </Link>
            ))}
          </Card>
          <Card t="Repairs" d="Pickups and diagnosis approvals." x="[ n ] open">
            <Link href="/repair" style={{ fontSize: 13, fontWeight: 700, textDecoration: "underline" }}>
              Book a pickup
            </Link>
          </Card>
          <Card t="Saved items" d="Devices you’ve saved." x="[ n ] saved" />
          <Card t="Warranty end dates" d="D’Source warranty per item." x="Next: [ date ]" />
        </div>
      ) : (
        <>
          {data?.me?.account_status && (
            <p style={{ margin: "0 0 14px", fontWeight: 700 }}>
              Business account: {data.me.company_name ?? "your company"} · {data.me.account_status === "pending" ? "application under review" : data.me.account_status}
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 14 }}>
            <Card t="Quotes" d="Requested and received quotes." x={`${n(openQuotes.length)} open`} />
            <Card t="Orders" d="Purchases and installations." x={`${n(active.length)} active`} />
            <Card t="Invoices" d="Download and pay invoices." x="[ n ] unpaid" />
            <Card t="Repair tickets" d="Company device repairs." x="[ n ] open" />
            <Card t="Reorder" d="Repeat a previous order." x={`${n(orders.length)} recent`} />
          </div>
          {!data?.me?.account_status && (
            <p style={{ marginTop: 16 }}>
              <Link href="/provision#account" style={{ fontWeight: 700, textDecoration: "underline" }}>
                Apply for a business account with invoicing →
              </Link>
            </p>
          )}
        </>
      )}
    </main>
  );
}

function SignIn() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    setMsg("");
    const r = mode === "in" ? await signIn(f.email, f.password) : await signUp(f.email, f.password, f.name);
    setBusy(false);
    if (r.error) setMsg(r.error);
    else if (mode === "up") setMsg("Account created. If we asked you to confirm your email, check your inbox, then sign in.");
  }
  return (
    <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 12 }}>
      <Tabs items={["Sign in", "Create account"] as const} value={mode === "in" ? "Sign in" : "Create account"} onChange={(v) => setMode(v === "Sign in" ? "in" : "up")} />
      {mode === "up" && (
        <label style={labelS}>
          Full name
          <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" style={field} />
        </label>
      )}
      <label style={labelS}>
        Email
        <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" style={field} />
      </label>
      <label style={labelS}>
        Password
        <input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete={mode === "in" ? "current-password" : "new-password"} style={field} />
      </label>
      {msg && <span style={{ fontWeight: 700, color: msg.startsWith("Account created") ? "var(--pass)" : "var(--fail)" }}>{msg}</span>}
      <button type="button" disabled={busy} onClick={go} style={btn("deep", { borderRadius: 12 })}>
        {busy ? "One moment…" : mode === "in" ? "Sign in" : "Create account"}
      </button>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>Personal: orders, tracking, repairs, warranty dates. Business: quotes, orders, invoices, repair tickets, reorder.</span>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountInner />
    </Suspense>
  );
}
