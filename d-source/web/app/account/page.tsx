"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { fmt } from "@/lib/format";

type Order = { ref: string; status: string; placed_at: string; order_lines: { quantity: number; unit_price: number }[] };
type Quote = { ref: string; status: string; created_at: string; quote_lines: { quantity: number; unit_price: number | null }[] };
type Review = { id: string; stars: number; body: string; products?: { name: string } };

export default function AccountPage() {
  const { signedIn, loading, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"orders" | "quotes" | "reviews" | "biz">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bizForm, setBizForm] = useState({ companyName: "", taxId: "", expectedActivity: "" });
  const [bizStatus, setBizStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!signedIn) return;
    api.get<{ orders: Order[] }>("/account/orders").then(({ orders }) => setOrders(orders)).catch(() => {});
    api.get<{ quotes: Quote[] }>("/account/quotes").then(({ quotes }) => setQuotes(quotes)).catch(() => {});
    api.get<{ reviews: Review[] }>("/account/reviews").then(({ reviews }) => setReviews(reviews)).catch(() => {});
  }, [signedIn]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password, name);
    if (result.error) setError(result.error);
  }

  async function applyBusiness(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/account/business", bizForm);
    setBizStatus("pending");
  }

  if (loading) return <main style={{ padding: 60 }} />;

  if (!signedIn) {
    return (
      <main style={{ background: "#FFFFFF", color: "#06382E" }}>
        <section style={{ maxWidth: 480, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-0.04em", marginBottom: 24 }}>
            {mode === "signin" ? "Sign in" : "Create an account"}
          </h1>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Work email" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} />
            {error && <p style={{ color: "#B42318", fontSize: 14 }}>{error}</p>}
            <button type="submit" style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800 }}>
              {mode === "signin" ? "Sign in →" : "Create account →"}
            </button>
          </form>
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={{ marginTop: 14, background: "transparent", border: 0, color: "#28705A", fontWeight: 700 }}>
            {mode === "signin" ? "No account yet? Create one →" : "Already have an account? Sign in →"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-0.04em", margin: 0 }}>My account</h1>
          <button type="button" onClick={signOut} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 999, padding: "10px 18px", background: "#fff", fontWeight: 700 }}>
            Sign out
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {(["orders", "quotes", "reviews", "biz"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{ border: `1px solid ${tab === id ? "#06382E" : "#E6E2D8"}`, background: tab === id ? "#06382E" : "#fff", color: tab === id ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "10px 18px", fontWeight: 700 }}
            >
              {id === "biz" ? "Business account" : id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        {tab === "orders" && (orders.length === 0 ? <p style={{ color: "#5E6E68" }}>No orders yet.</p> : orders.map((o) => (
          <div key={o.ref} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(6,56,46,.08)" }}>
            <span style={{ fontFamily: "var(--font-mono)" }}>{o.ref}</span>
            <span>{o.status}</span>
            <span style={{ fontWeight: 800 }}>{fmt(o.order_lines.reduce((a, l) => a + l.quantity * l.unit_price, 0))}</span>
          </div>
        )))}

        {tab === "quotes" && (quotes.length === 0 ? <p style={{ color: "#5E6E68" }}>No quotes yet.</p> : quotes.map((q) => (
          <div key={q.ref} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(6,56,46,.08)" }}>
            <span style={{ fontFamily: "var(--font-mono)" }}>{q.ref}</span>
            <span>{q.status}</span>
          </div>
        )))}

        {tab === "reviews" && (reviews.length === 0 ? <p style={{ color: "#5E6E68" }}>No reviews yet.</p> : reviews.map((r) => (
          <div key={r.id} style={{ padding: "14px 0", borderBottom: "1px solid rgba(6,56,46,.08)" }}>
            <span style={{ color: "#D4A637" }}>{"★".repeat(r.stars)}</span>
            <p style={{ margin: "4px 0 0", fontWeight: 700 }}>{r.products?.name}</p>
            <p style={{ margin: 0, color: "#3A4A44" }}>{r.body}</p>
          </div>
        )))}

        {tab === "biz" && (
          bizStatus === "pending" ? (
            <p style={{ color: "#3A4A44" }}>Application received. Business accounts are approved after a check.</p>
          ) : (
            <form onSubmit={applyBusiness} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
              <p style={{ margin: 0, fontSize: 14, color: "#3A4A44" }}>Business accounts order against a PO and pay on 30-day invoice, once approved.</p>
              <input value={bizForm.companyName} onChange={(e) => setBizForm((f) => ({ ...f, companyName: e.target.value }))} placeholder="Company name" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} />
              <input value={bizForm.taxId} onChange={(e) => setBizForm((f) => ({ ...f, taxId: e.target.value }))} placeholder="Tax ID (optional)" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} />
              <textarea value={bizForm.expectedActivity} onChange={(e) => setBizForm((f) => ({ ...f, expectedActivity: e.target.value }))} placeholder="What will you typically order?" rows={3} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14, resize: "vertical" }} />
              <button type="submit" style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800, alignSelf: "flex-start" }}>
                Apply for a business account →
              </button>
            </form>
          )
        )}
      </section>
    </main>
  );
}
