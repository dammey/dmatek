"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Kicker, PageTitle, Stepper, btn, field, labelS, pagePad } from "@/components/ui";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { PROMISE } from "@/lib/promises";

type Pay = "online" | "pod";
const ADDR: [keyof Addr, string, string][] = [
  ["name", "Full name", "name"],
  ["phone", "Phone", "tel"],
  ["email", "Email (for your receipt)", "email"],
  ["street", "Street address", "street-address"],
  ["city", "Area / city", "address-level2"],
];
type Addr = { name: string; phone: string; email: string; street: string; city: string };

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clear } = useCart();
  const items = cart?.cart_items ?? [];
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState<Pay>("online");
  const [a, setA] = useState<Addr>({ name: "", phone: "", email: "", street: "", city: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function next() {
    setErr("");
    if (step === 0) {
      if (!a.name.trim() || !a.phone.trim() || !a.street.trim() || !a.city.trim()) return setErr("Fill in your name, phone and delivery address.");
      if (a.email && !/^\S+@\S+\.\S+$/.test(a.email)) return setErr("That email doesn’t look right.");
    }
    if (step === 1 && pay === "online" && !a.email.trim()) return setErr("Paying online needs an email for the payment receipt. Add one in Address, or pay on delivery.");
    if (step < 2) return setStep(step + 1);
    placeOrder();
  }

  async function placeOrder() {
    if (!cart || !items.length) return setErr("Your cart is empty.");
    setBusy(true);
    try {
      const r = await api.post<{ ref: string; payment: { authorizationUrl: string | null } }>("/checkout", {
        cartId: cart.id,
        channel: "emporium",
        contact: { name: a.name.trim(), phone: a.phone.trim(), email: a.email.trim() || undefined },
        address: { line1: a.street.trim(), city: a.city.trim() },
        paymentMethod: pay === "online" ? "card" : "pod",
      });
      clear("cart");
      if (pay === "online" && r.payment?.authorizationUrl) {
        window.location.href = r.payment.authorizationUrl;
        return;
      }
      router.push(`/confirmation?ref=${encodeURIComponent(r.ref)}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "We couldn’t place the order. Please try again.");
      setBusy(false);
    }
  }

  if (!items.length && !busy)
    return (
      <main style={{ ...pagePad, maxWidth: 760 }}>
        <Kicker>CHECKOUT</Kicker>
        <PageTitle>Almost yours.</PageTitle>
        <p style={{ color: "var(--muted)" }}>Your cart is empty.</p>
        <Link href="/shop" style={btn("deep")}>
          Shop devices →
        </Link>
      </main>
    );

  return (
    <main style={{ ...pagePad, maxWidth: 760 }}>
      <Kicker>CHECKOUT</Kicker>
      <PageTitle style={{ marginBottom: 22 }}>Almost yours.</PageTitle>
      <Stepper steps={["Address", "Payment", "Confirm"]} current={step} />

      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <b style={{ fontSize: 20 }}>Delivery address</b>
          {ADDR.map(([k, l, ac]) => (
            <label key={k} style={labelS}>
              {l}
              <input value={a[k]} onChange={(e) => setA({ ...a, [k]: e.target.value })} autoComplete={ac} style={field} />
            </label>
          ))}
          <div style={{ fontSize: 14, background: "var(--t)", borderRadius: 12, padding: 12 }}>{PROMISE.delivery}</div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <b style={{ fontSize: 20 }}>Payment</b>
          {(
            [
              ["online", "Pay online", "Card or transfer."],
              ["pod", "Pay on delivery", "Available, subject to terms and conditions."],
            ] as [Pay, string, string][]
          ).map(([k, t, d]) => (
            <button key={k} type="button" onClick={() => setPay(k)} aria-pressed={pay === k} style={{ textAlign: "left", border: `2px solid ${pay === k ? "var(--d)" : "var(--line)"}`, background: "#fff", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 4, color: "var(--ink)" }}>
              <b>{t}</b>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{d}</span>
            </button>
          ))}
          <Link href="/terms#pay-on-delivery" style={{ fontSize: 14, fontWeight: 700, textDecoration: "underline" }}>
            Pay on delivery terms and conditions
          </Link>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <b style={{ fontSize: 20 }}>Confirm your order</b>
          <div style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 16, fontSize: 14, lineHeight: 1.7, background: "#fff" }}>
            Payment: <b>{pay === "online" ? "Pay online" : "Pay on delivery (subject to terms and conditions)"}</b>
            <br />
            Deliver to: {a.name}, {a.street}, {a.city}
            <br />
            Delivery: {PROMISE.delivery}
            <br />
            Prices confirmed at checkout.
          </div>
          <div style={{ background: "var(--t)", borderRadius: 14, padding: 16, fontWeight: 700, lineHeight: 1.5 }}>{PROMISE.inspectFail}</div>
          <Link href="/guarantee" style={{ alignSelf: "flex-start", fontWeight: 700, textDecoration: "underline" }}>
            Read the guarantee
          </Link>
        </div>
      )}

      {err && <p style={{ color: "var(--fail)", fontWeight: 700, marginTop: 14 }}>{err}</p>}
      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        <button type="button" onClick={() => (step ? setStep(step - 1) : router.push("/cart"))} style={{ ...btn("ghost"), borderRadius: 12, padding: "14px 20px" }}>
          Back
        </button>
        <button type="button" disabled={busy} onClick={next} style={{ ...btn("buy"), flex: 1, borderRadius: 12, padding: 14 }}>
          {busy ? "Placing order…" : step < 2 ? "Continue" : "Place order"}
        </button>
      </div>
    </main>
  );
}
