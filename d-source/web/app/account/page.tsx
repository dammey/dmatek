"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useFlow } from "@/lib/flow-context";
import { useKitOverlay } from "@/lib/kit-overlay-context";
import { fmt } from "@/lib/format";
import { playStoreTransition } from "@/lib/storeTransition";
import { getSavedKits, removeSavedKit } from "@/lib/savedKits";
import SettingsValue from "@/components/SettingsValue";
import type { Kit } from "@/lib/types";

type Order = { ref: string; status: string; placed_at: string; channel: string; order_lines: { quantity: number; unit_price: number }[] };
type Quote = { ref: string; status: string; created_at: string; quote_lines: { quantity: number; unit_price: number | null }[] };
type Review = { id: string; stars: number; body: string; products?: { id: string; name: string } };
type Customer = {
  company_name: string | null;
  cac_number: string | null;
  accounts_contact: string | null;
  accounts_email: string | null;
  phone: string | null;
  expected_activity: string | null;
  delivery_sites: string | null;
  type: string;
  account_status: string | null;
};

const TABS = [
  ["orders", "Orders"],
  ["quotes", "Quotes"],
  ["kits", "Saved kits"],
  ["reviews", "Reviews"],
  ["biz", "Business account"],
] as const;

function input(): React.CSSProperties {
  return { border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14, fontSize: 15, background: "#fff", color: "#06382E" };
}
function label(): React.CSSProperties {
  return { display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" };
}
function primaryBtn(): React.CSSProperties {
  return { border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap", alignSelf: "flex-start" };
}
function ghostBtn(): React.CSSProperties {
  return { background: "#fff", color: "#06382E", border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "14px 22px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" };
}
function emptyBox(): React.CSSProperties {
  return { background: "#F6F4EF", borderRadius: 20, padding: 22, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" };
}
function rowCard(): React.CSSProperties {
  return { display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center", border: "1px solid #EEEAE2", borderRadius: 18, padding: "16px 18px" };
}

export default function AccountPage() {
  const router = useRouter();
  const { signedIn, loading, signIn, signUp, signOut } = useAuth();
  const { startFlow } = useFlow();
  const { openKit } = useKitOverlay();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const [tab, setTab] = useState<(typeof TABS)[number][0]>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [kitKeys, setKitKeys] = useState<string[]>(() => getSavedKits());
  const [savedKits, setSavedKits] = useState<Kit[]>([]);

  const [bizForm, setBizForm] = useState({ companyName: "", cacNumber: "", accountsContact: "", accountsEmail: "", phone: "", expectedActivity: "Occasional", deliverySites: "" });

  useEffect(() => {
    if (!signedIn) return;
    api.get<{ orders: Order[] }>("/account/orders").then(({ orders }) => setOrders(orders)).catch(() => setOrders([]));
    api.get<{ quotes: Quote[] }>("/account/quotes").then(({ quotes }) => setQuotes(quotes)).catch(() => setQuotes([]));
    api.get<{ reviews: Review[] }>("/account/reviews").then(({ reviews }) => setReviews(reviews)).catch(() => setReviews([]));
    api
      .get<{ customer: Customer }>("/account/me")
      .then(({ customer }) => {
        setCustomer(customer);
        setBizForm((f) => ({
          ...f,
          companyName: customer.company_name ?? f.companyName,
          cacNumber: customer.cac_number ?? f.cacNumber,
          accountsContact: customer.accounts_contact ?? f.accountsContact,
          accountsEmail: customer.accounts_email ?? f.accountsEmail,
          phone: customer.phone ?? f.phone,
          expectedActivity: customer.expected_activity ?? f.expectedActivity,
          deliverySites: customer.delivery_sites ?? f.deliverySites,
        }));
      })
      .catch(() => setCustomer(null));
  }, [signedIn]);

  useEffect(() => {
    if (!signedIn || kitKeys.length === 0) return;
    Promise.all(kitKeys.map((k) => api.get<{ kit: Kit }>(`/catalogue/kits/${k}`).then(({ kit }) => kit).catch(() => null))).then((kits) => {
      setSavedKits(kits.filter((k): k is Kit => k !== null));
    });
  }, [signedIn, kitKeys]);

  function removeKit(key: string) {
    removeSavedKit(key);
    setKitKeys((ks) => ks.filter((k) => k !== key));
    setSavedKits((ks) => ks.filter((k) => k.key !== key));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password, name);
    if (result.error) setError(result.error);
  }

  async function applyBusiness(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/account/business", bizForm);
    setCustomer((c) => (c ? { ...c, type: "business", account_status: "pending" } : c));
  }

  if (loading) return <main style={{ padding: 60 }} />;

  const Breadcrumb = (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
      <button type="button" onClick={() => router.push("/")} style={{ border: 0, background: "transparent", padding: 0, fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
        D’Source
      </button>
      <span style={{ color: "#B9B3A6" }}>›</span>
      <span style={{ fontWeight: 700, color: "#06382E" }}>My account</span>
    </div>
  );

  if (!signedIn) {
    return (
      <main style={{ background: "#FFFFFF", color: "#06382E" }}>
        {Breadcrumb}
        <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
          <h1 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>My account</h1>
          <p style={{ margin: "0 0 28px", fontSize: 17, lineHeight: 1.6, color: "#3A4A44" }}>Orders, quotes, saved kits and reviews in one place.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: 14 }}>
            <form
              onSubmit={(e) => {
                setMode("signin");
                submit(e);
              }}
              style={{ border: "1px solid #EEEAE2", borderRadius: 24, padding: 26, display: "flex", flexDirection: "column", gap: 12 }}
            >
              <span style={{ fontWeight: 800, fontSize: 22 }}>Sign in</span>
              <label style={label()}>
                EMAIL OR PHONE
                <input value={email} onChange={(e) => setEmail(e.target.value)} style={input()} />
              </label>
              <label style={label()}>
                PASSWORD
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={input()} />
              </label>
              {error && mode === "signin" && <p style={{ color: "#B42318", fontSize: 14, margin: 0 }}>{error}</p>}
              <button type="submit" style={primaryBtn()}>
                Sign in →
              </button>
              <span style={{ fontSize: 13, color: "#5E6E68" }}>Forgot your password? [ RESET FLOW ]</span>
            </form>
            <form
              onSubmit={(e) => {
                setMode("signup");
                submit(e);
              }}
              style={{ background: "#F5F1E8", borderRadius: 24, padding: 26, display: "flex", flexDirection: "column", gap: 12 }}
            >
              <span style={{ fontWeight: 800, fontSize: 22 }}>Create an account</span>
              <label style={label()}>
                FULL NAME
                <input value={name} onChange={(e) => setName(e.target.value)} style={input()} />
              </label>
              <label style={label()}>
                EMAIL OR PHONE
                <input value={email} onChange={(e) => setEmail(e.target.value)} style={input()} />
              </label>
              <label style={label()}>
                PASSWORD
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={input()} />
              </label>
              {error && mode === "signup" && <p style={{ color: "#B42318", fontSize: 14, margin: 0 }}>{error}</p>}
              <button type="submit" style={primaryBtn()}>
                Create account →
              </button>
              <span style={{ fontSize: 13, color: "#5E6E68" }}>Buying for a business? Create an account, then apply for a business account inside.</span>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const noOrders = orders.length === 0;
  const noQuotes = quotes.length === 0;
  const noKits = kitKeys.length === 0;
  const noMyReviews = reviews.length === 0;
  const bizApplied = customer?.type === "business";

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      {Breadcrumb}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>My account</h1>
          <button type="button" onClick={signOut} style={ghostBtn()}>
            Sign out
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,40px)", alignItems: "flex-start", marginTop: 28 }}>
          <nav style={{ flex: "0 1 240px", minWidth: "min(100%,200px)", display: "flex", flexDirection: "column", gap: 4 }}>
            {TABS.map(([id, tlabel]) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  style={{
                    textAlign: "left",
                    border: 0,
                    borderLeft: `3px solid ${active ? "#D4A637" : "transparent"}`,
                    background: active ? "#F5F1E8" : "transparent",
                    color: "#06382E",
                    padding: "12px 16px",
                    fontSize: 15,
                    fontWeight: active ? 800 : 600,
                    borderRadius: "0 12px 12px 0",
                  }}
                >
                  {tlabel}
                </button>
              );
            })}
          </nav>

          <div style={{ flex: "1 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {tab === "orders" && (
              <>
                <h2 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>Orders</h2>
                {noOrders && (
                  <div style={emptyBox()}>
                    <span style={{ fontSize: 15, color: "#3A4A44" }}>No orders yet.</span>
                    <button type="button" onClick={(e) => playStoreTransition(router, "emporium", e.currentTarget)} style={primaryBtn()}>
                      Start shopping
                    </button>
                  </div>
                )}
                {orders.map((o) => {
                  const count = o.order_lines.reduce((a, l) => a + l.quantity, 0);
                  const total = o.order_lines.reduce((a, l) => a + l.quantity * l.unit_price, 0);
                  return (
                    <div key={o.ref} style={rowCard()}>
                      <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.08em" }}>{o.ref}</span>
                        <span style={{ fontSize: 14, color: "#5E6E68" }}>
                          {new Date(o.placed_at).toLocaleDateString("en-NG")} · {count} · {o.channel === "emporium" ? "Home" : "Business"}
                        </span>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#28705A" }}>{o.status}</span>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <span style={{ fontWeight: 800 }}>{fmt(total)}</span>
                        <button
                          type="button"
                          onClick={() => router.push(`/track?ref=${o.ref}`)}
                          style={{ border: 0, background: "transparent", padding: 0, fontSize: 13.5, fontWeight: 800, color: "#06382E", borderBottom: "2px solid #D4A637" }}
                        >
                          Track →
                        </button>
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            {tab === "quotes" && (
              <>
                <h2 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>Quotes</h2>
                {noQuotes && (
                  <div style={emptyBox()}>
                    <span style={{ fontSize: 15, color: "#3A4A44" }}>No quote requests yet.</span>
                    <button type="button" onClick={() => startFlow("quote")} style={primaryBtn()}>
                      Request a quote
                    </button>
                  </div>
                )}
                {quotes.map((q) => {
                  const count = q.quote_lines.reduce((a, l) => a + l.quantity, 0);
                  const total = q.quote_lines.reduce((a, l) => a + l.quantity * (l.unit_price ?? 0), 0);
                  return (
                    <div key={q.ref} style={rowCard()}>
                      <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.08em" }}>{q.ref}</span>
                        <span style={{ fontSize: 14, color: "#5E6E68" }}>
                          {new Date(q.created_at).toLocaleDateString("en-NG")} · {count}
                        </span>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#28705A" }}>Sent · reply within 4 working hours</span>
                      </span>
                      <span style={{ fontWeight: 800 }}>{total ? fmt(total) : "Pending"}</span>
                    </div>
                  );
                })}
              </>
            )}

            {tab === "kits" && (
              <>
                <h2 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>Saved kits</h2>
                {noKits && <div style={{ background: "#F6F4EF", borderRadius: 20, padding: 22, fontSize: 15, color: "#3A4A44" }}>No saved kits. Open any place kit and tap “Save kit”.</div>}
                {savedKits.map((k) => {
                  const count = k.kit_items.length;
                  const total = k.kit_items.reduce((a, it) => a + (it.price ?? 0), 0);
                  return (
                    <div key={k.key} style={rowCard()}>
                      <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontWeight: 800, fontSize: 17 }}>{k.name}</span>
                        <span style={{ fontSize: 14, color: "#5E6E68" }}>
                          {count} · {fmt(total)}
                        </span>
                      </span>
                      <span style={{ display: "flex", gap: 8 }}>
                        <button type="button" onClick={() => openKit(k.key)} style={{ ...primaryBtn(), padding: "11px 18px", fontSize: 14 }}>
                          Open kit
                        </button>
                        <button type="button" onClick={() => removeKit(k.key)} style={{ ...ghostBtn(), padding: "10px 16px", fontSize: 14 }}>
                          Remove
                        </button>
                      </span>
                    </div>
                  );
                })}
              </>
            )}

            {tab === "reviews" && (
              <>
                <h2 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>Your reviews</h2>
                {noMyReviews && <div style={{ background: "#F6F4EF", borderRadius: 20, padding: 22, fontSize: 15, color: "#3A4A44" }}>You haven’t written any reviews yet.</div>}
                {reviews.map((r) => (
                  <div key={r.id} style={{ border: "1px solid #EEEAE2", borderRadius: 18, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => r.products?.id && router.push(`/p/${r.products.id}`)}
                        style={{ border: 0, background: "transparent", padding: 0, fontWeight: 800, fontSize: 16, color: "#06382E", textAlign: "left" }}
                      >
                        {r.products?.name}
                      </button>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.12em", background: "#EFEADC", padding: "4px 8px", borderRadius: 4 }}>PENDING CHECK</span>
                    </div>
                    <span style={{ color: "#D4A637", letterSpacing: 2 }}>{"★".repeat(r.stars)}</span>
                    <span style={{ fontSize: 14.5, color: "#3A4A44" }}>{r.body}</span>
                  </div>
                ))}
              </>
            )}

            {tab === "biz" && (
              <>
                <h2 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>Business account</h2>
                <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "#3A4A44" }}>
                  Business accounts are approved after a check. Approved accounts order against a PO and pay on 30-day invoice.
                </p>
                {bizApplied ? (
                  <div style={{ background: "#F5F1E8", borderRadius: 20, padding: 22, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 18 }}>Application received</span>
                    <span style={{ fontSize: 15, color: "#3A4A44" }}>
                      We’ll check the details and come back to you. <SettingsValue field="businessAccountReviewTime" placeholder="[ REVIEW TIME TO CONFIRM ]" />
                    </span>
                    <span style={{ fontSize: 13, color: "#5E6E68" }}>Status: {customer?.account_status ?? "pending"}</span>
                  </div>
                ) : (
                  <form onSubmit={applyBusiness} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
                      <label style={label()}>
                        REGISTERED COMPANY NAME
                        <input value={bizForm.companyName} onChange={(e) => setBizForm((f) => ({ ...f, companyName: e.target.value }))} style={input()} />
                      </label>
                      <label style={label()}>
                        CAC NUMBER
                        <input value={bizForm.cacNumber} onChange={(e) => setBizForm((f) => ({ ...f, cacNumber: e.target.value }))} style={input()} />
                      </label>
                      <label style={label()}>
                        ACCOUNTS CONTACT
                        <input value={bizForm.accountsContact} onChange={(e) => setBizForm((f) => ({ ...f, accountsContact: e.target.value }))} style={input()} />
                      </label>
                      <label style={label()}>
                        ACCOUNTS EMAIL
                        <input type="email" value={bizForm.accountsEmail} onChange={(e) => setBizForm((f) => ({ ...f, accountsEmail: e.target.value }))} style={input()} />
                      </label>
                      <label style={label()}>
                        PHONE
                        <input type="tel" value={bizForm.phone} onChange={(e) => setBizForm((f) => ({ ...f, phone: e.target.value }))} style={input()} />
                      </label>
                      <label style={label()}>
                        EXPECTED ORDERS
                        <select value={bizForm.expectedActivity} onChange={(e) => setBizForm((f) => ({ ...f, expectedActivity: e.target.value }))} style={input()}>
                          <option>Occasional</option>
                          <option>Monthly</option>
                          <option>Project-based</option>
                        </select>
                      </label>
                      <label style={{ ...label(), gridColumn: "1/-1" }}>
                        DELIVERY SITES
                        <textarea rows={3} value={bizForm.deliverySites} onChange={(e) => setBizForm((f) => ({ ...f, deliverySites: e.target.value }))} style={{ ...input(), resize: "vertical" }} />
                      </label>
                    </div>
                    <button type="submit" style={primaryBtn()}>
                      Apply for a business account →
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
