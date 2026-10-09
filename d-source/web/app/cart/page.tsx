"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { IconLabel } from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import { Kicker, PageTitle, QuoteListRow, Tabs, btn, field, labelS, pagePad } from "@/components/ui";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { PROMISE } from "@/lib/promises";
import { clearQuoteMeta, readQuoteMeta, setQuoteMeta, type QuoteMeta } from "@/lib/quoteMeta";
import { conditionLine, warrantyFor } from "@/lib/shop";
import type { Product } from "@/lib/types";
import { StoreText } from "@/lib/settings-context";

const TABS = ["Cart", "Quote"] as const;

function CartInner() {
  const params = useSearchParams();
  const router = useRouter();
  const tab = params.get("tab") === "quote" ? "Quote" : "Cart";
  return (
    <main style={pagePad}>
      <Kicker>YOUR BASKET</Kicker>
      <PageTitle style={{ marginBottom: 20 }}>Cart and quote</PageTitle>
      <div style={{ marginBottom: 18 }}>
        <Tabs items={TABS} value={tab} onChange={(t) => router.replace(t === "Quote" ? "/cart?tab=quote" : "/cart", { scroll: false })} />
      </div>
      {tab === "Cart" ? <CartTab /> : <QuoteTab />}
    </main>
  );
}

function useProducts(ids: string[]) {
  const [map, setMap] = useState<Record<string, Product>>({});
  const key = ids.join(",");
  useEffect(() => {
    key
      .split(",")
      .filter(Boolean)
      .forEach((id) =>
        api
          .get<{ product: Product }>(`/catalogue/products/${id}`)
          .then(({ product }) => setMap((m) => ({ ...m, [id]: product })))
          .catch(() => {})
      );
  }, [key]);
  return map;
}

function CartTab() {
  const { cart, cartTotal, bump } = useCart();
  const items = cart?.cart_items ?? [];
  const products = useProducts(items.map((i) => i.product_id ?? "").filter(Boolean));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "clamp(18px,3vw,32px)", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.length === 0 && (
          <div style={{ background: "var(--t)", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <b style={{ fontSize: 20 }}>Your cart is empty.</b>
            <Link href="/shop" style={btn("deep")}>
              Shop devices →
            </Link>
          </div>
        )}
        {items.map((it) => {
          const p = it.product_id ? products[it.product_id] : undefined;
          return (
            <div key={it.id} style={{ display: "grid", gridTemplateColumns: "96px minmax(0,1fr) auto", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ position: "relative", aspectRatio: "1", background: "var(--t)", borderRadius: 12, overflow: "hidden", fontSize: 10, fontWeight: 700, padding: 6, color: "var(--m)", display: "flex", alignItems: "flex-end" }}>
                {p?.images?.[0] ? <ImageSlot src={p.images[0]} alt={it.name} placeholder="" sizes="96px" /> : "PHOTO"}
              </div>
              <div>
                <b>{it.name}</b>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  {p ? `${conditionLine(p)} · ${warrantyFor(p).replace(/ \((new|used)\)/, "")} D’Source warranty` : " "}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--m)", marginTop: 4 }}>✓ CHECKED BEFORE DELIVERY</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8, fontSize: 13 }}>
                  <button type="button" aria-label="Fewer" onClick={() => bump("cart", it.id, it.quantity - 1)} style={qtyBtn}>
                    −
                  </button>
                  <b>{it.quantity}</b>
                  <button type="button" aria-label="More" onClick={() => bump("cart", it.id, it.quantity + 1)} style={qtyBtn}>
                    +
                  </button>
                  <button type="button" onClick={() => bump("cart", it.id, 0)} style={{ ...btn("link"), fontSize: 13, marginLeft: 6 }}>
                    Remove
                  </button>
                </div>
              </div>
              <b>{it.price != null ? fmt(it.price * it.quantity) : "₦ [ price ]"}</b>
            </div>
          );
        })}
      </div>
      <div style={{ background: "var(--t)", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
        <b style={{ fontSize: 17 }}>Order summary</b>
        {items.length > 0 && (
          <span style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
            <span>Subtotal</span>
            <span>{fmt(cartTotal)}</span>
          </span>
        )}
        <span>Prices are confirmed at checkout.</span>
        <span style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <IconLabel name="inspect" size={18}>
            {PROMISE.inspect}
          </IconLabel>
          <IconLabel name="returns" size={18}>
            {PROMISE.returns}
          </IconLabel>
        </span>
        <span><StoreText k="delivery" /></span>
        {items.length > 0 ? (
          <Link href="/checkout" style={{ ...btn("buy"), borderRadius: 12, padding: 15 }}>
            Checkout
          </Link>
        ) : (
          <span style={{ ...btn("buy"), borderRadius: 12, padding: 15, opacity: 0.45, cursor: "not-allowed" }} aria-disabled="true">
            Checkout
          </span>
        )}
        <Link href="/guarantee" style={{ fontWeight: 700, textDecoration: "underline" }}>
          Read the guarantee
        </Link>
      </div>
    </div>
  );
}

const qtyBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 8, border: "1px solid var(--line)", background: "#fff", fontWeight: 700 };

function QuoteTab() {
  const { quote, bump, clear } = useCart();
  const items = quote?.cart_items ?? [];
  const [meta, setMeta] = useState<Record<string, QuoteMeta>>({});
  const [form, setForm] = useState({ name: "", contact: "", company: "", notes: "" });
  const [sent, setSent] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const m = readQuoteMeta();
    // Notes typed on a product page join the request notes.
    const n = Object.entries(m)
      .filter(([, v]) => v.notes)
      .map(([k, v]) => `${k}: ${v.notes}`)
      .join("\n");
    queueMicrotask(() => {
      setMeta(m);
      if (n) setForm((f) => (f.notes ? f : { ...f, notes: n }));
    });
  }, []);

  function setInstall(name: string, v: boolean) {
    setQuoteMeta(name, { install: v });
    setMeta((m) => ({ ...m, [name]: { ...m[name], install: v } }));
  }

  async function send() {
    if (!form.name.trim() || !form.contact.trim()) return setErr("Add your name and a phone number or email so we can send the quote.");
    setErr("");
    setBusy(true);
    try {
      const install = items.filter((i) => meta[i.name]?.install).map((i) => i.name);
      const note = [form.notes.trim(), install.length ? `Installation by D’Matek engineers requested for: ${install.join("; ")}` : ""].filter(Boolean).join("\n\n");
      const { ref } = await api.post<{ ref: string }>("/quotes", {
        cartId: quote?.id,
        organisation: form.company.trim() || "Personal",
        contactName: form.name.trim(),
        contact: form.contact.trim(),
        setup: install.length ? "Installation requested" : undefined,
        note: note || undefined,
      });
      clear("quote");
      clearQuoteMeta();
      setSent(ref);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div style={{ boxSizing: "content-box", background: "var(--t)", borderRadius: 18, padding: 28, maxWidth: 560 }}>
        <b style={{ fontSize: 22, letterSpacing: "-.03em" }}>Quote request received.</b>
        <p style={{ lineHeight: 1.6 }}>
          {PROMISE.quote24} Reference <b>{sent}</b>.
        </p>
        <Link href="/shop" style={btn("outline", { padding: "10px 16px" })}>
          Back to the shop
        </Link>
      </div>
    );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "clamp(18px,3vw,32px)", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.length === 0 && (
          <div style={{ background: "var(--t)", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <b style={{ fontSize: 20 }}>Your quote list is empty.</b>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>Add equipment from the shop or a kit from the home page, or just describe what you need below.</span>
            <Link href="/provision" style={btn("deep")}>
              Explore Provision →
            </Link>
          </div>
        )}
        {items.map((q) => (
          <QuoteListRow
            key={q.id}
            name={q.name}
            note={q.price != null ? `From ${fmt(q.price)} · price on quote` : "Price on quote"}
            qty={q.quantity}
            install={!!meta[q.name]?.install}
            onInstall={(v) => setInstall(q.name, v)}
            onQty={(n) => bump("quote", q.id, n)}
          />
        ))}
      </div>
      <div style={{ background: "var(--t)", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
        <b style={{ fontSize: 17 }}>Request a quote</b>
        <label style={labelS}>
          Your name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={field} autoComplete="name" />
        </label>
        <label style={labelS}>
          Phone or email
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} style={field} />
        </label>
        <label style={labelS}>
          Company (optional)
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={field} autoComplete="organization" />
        </label>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes: site, deadline, anything we should know" style={{ ...field, fontSize: 14, minHeight: 90 }} />
        <span>{PROMISE.quote24}</span>
        {err && <span style={{ color: "var(--fail)", fontWeight: 700 }}>{err}</span>}
        <button type="button" disabled={busy || (items.length === 0 && !form.notes.trim())} onClick={send} style={{ ...btn("buy"), borderRadius: 12, padding: 15 }}>
          {busy ? "Sending…" : "Request quote"}
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense>
      <CartInner />
    </Suspense>
  );
}
