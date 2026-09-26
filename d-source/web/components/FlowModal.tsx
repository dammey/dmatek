"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { fmt } from "@/lib/format";
import { useFlow } from "@/lib/flow-context";

const inputStyle: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14, fontSize: 15, background: "#fff", color: "#06382E" };
const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" };

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={labelStyle}>
      {label}
      <input style={inputStyle} {...props} />
    </label>
  );
}

export default function FlowModal() {
  const { flow, note, meta, closeFlow } = useFlow();
  const { cart, quote, cartTotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<{ title: string; body: string; ref?: string } | null>(null);
  const [form, setForm] = useState<Record<string, string>>({ note });
  const [payment, setPayment] = useState<"card" | "transfer" | "ussd" | "pod">("card");

  if (!flow) return null;

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function close() {
    setStep(0);
    setDone(null);
    setForm({ note: "" });
    closeFlow();
  }

  async function submitCheckout() {
    if (!cart) return;
    const { ref, payment: paymentResult } = await api.post<{ ref: string; payment: { authorizationUrl: string | null; sandbox: boolean } }>("/checkout", {
      cartId: cart.id,
      channel: "emporium",
      contact: { name: form.name, phone: form.phone, email: form.email || undefined },
      address: { line1: form.address, city: form.city, state: form.state },
      setupRequested: form.setup === "Yes, install it for me",
      paymentMethod: payment,
    });
    clear("cart");
    if (paymentResult.authorizationUrl) {
      window.location.href = paymentResult.authorizationUrl;
      return;
    }
    setDone({ title: "Thank you. We’ve got your order.", body: "We’ll call to confirm delivery and installation.", ref });
  }

  async function submitQuote() {
    const { ref } = await api.post<{ ref: string }>("/quotes", {
      cartId: quote?.id,
      organisation: form.organisation || "",
      contactName: form.name || "",
      contact: form.contact || "",
      deliveryLocation: form.location,
      neededBy: form.neededBy,
      setup: form.setup,
      siteSurveyRequested: form.survey === "Yes, book a free site survey",
      note: form.note,
    });
    if (quote) clear("quote");
    setDone({ title: "Quote request sent.", body: "We’ll come back with a quote within 4 working hours.", ref });
  }

  async function submitEnquiry() {
    await api.post("/enquiries", { type: (meta.type as string) ?? "General", fromName: form.name, fromContact: form.contact, message: form.note || note });
    setDone({ title: "Thank you. We’ve got it.", body: "Someone will read this properly and come back to you." });
  }

  async function submitReview() {
    await api.post("/reviews", {
      productId: meta.productId as string,
      stars: Number(form.stars ?? 5),
      title: form.title,
      body: form.body ?? "",
      reviewerName: form.name,
      orderRef: form.orderRef,
    });
    setDone({ title: "Thank you for the review.", body: "It appears once we’ve checked it’s from a verified D’Source purchase." });
  }

  const titles: Record<string, string> = { checkout: "Delivery details", whatsapp: "Order on WhatsApp", enquiry: "Send an enquiry", quote: "Request a quote", account: "Sign in to your account", review: "Write a review" };
  const kickers: Record<string, string> = { checkout: "D’EMPORIUM · CHECKOUT", whatsapp: "D’EMPORIUM · WHATSAPP", enquiry: "D’SOURCE · ENQUIRY", quote: "D’PROVISION · QUOTE", account: "D’PROVISION · ACCOUNT", review: "D’SOURCE · REVIEW" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(6,56,46,.55)", display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "clamp(12px,4vh,48px) 12px" }}>
      <div style={{ width: "min(720px,100%)", background: "#F5F1E8", color: "#06382E", borderRadius: 28, overflow: "hidden", animation: "dsIn .35s cubic-bezier(.2,.8,.2,1) both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "18px 24px", borderBottom: "1px solid rgba(6,56,46,.12)" }}>
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.16em", color: "#28705A" }}>{kickers[flow]}</span>
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{done ? done.title : titles[flow]}</span>
          </span>
          <button type="button" onClick={close} aria-label="Close" style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid rgba(6,56,46,.25)", background: "transparent", fontSize: 16 }}>
            ✕
          </button>
        </div>

        <div style={{ padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
          {done && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, padding: "10px 0" }}>
              <span style={{ width: 56, height: 56, borderRadius: "50%", background: "#D4A637", color: "#06382E", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 800 }}>✓</span>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "#3A4A44", margin: 0 }}>{done.body}</p>
              {done.ref && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.1em", background: "#EFEADC", borderRadius: 4, padding: "8px 12px" }}>
                  REFERENCE {done.ref}
                </span>
              )}
            </div>
          )}

          {!done && flow === "checkout" && step === 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
                <Field label="FULL NAME" value={form.name ?? ""} onChange={set("name")} />
                <Field label="PHONE" type="tel" value={form.phone ?? ""} onChange={set("phone")} />
                <div style={{ gridColumn: "1/-1" }}>
                  <Field label="DELIVERY ADDRESS" value={form.address ?? ""} onChange={set("address")} />
                </div>
                <Field label="CITY / STATE" value={form.city ?? ""} onChange={set("city")} />
                <Field label="EMAIL" type="email" value={form.email ?? ""} onChange={set("email")} />
              </div>
              <button type="button" onClick={() => setStep(1)} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
                Continue to payment →
              </button>
            </>
          )}

          {!done && flow === "checkout" && step === 1 && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {([["card", "Card", "Paystack or Flutterwave"], ["transfer", "Bank transfer", "Details sent after you order"], ["ussd", "USSD", "From any bank on your phone"], ["pod", "Pay on delivery", "Pay when it arrives"]] as const).map(([id, t, d]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayment(id)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", border: `2px solid ${payment === id ? "#06382E" : "rgba(6,56,46,.15)"}`, background: "#fff", color: "#06382E", borderRadius: 18, padding: "16px 18px" }}
                  >
                    <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{t}</span>
                      <span style={{ fontSize: 13, color: "#5E6E68" }}>{d}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(6,56,46,.12)" }}>
                <span style={{ fontWeight: 700, color: "#3A4A44" }}>Cart total</span>
                <span style={{ fontWeight: 800, fontSize: 22 }}>{fmt(cartTotal)}</span>
              </div>
              <button type="button" onClick={submitCheckout} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
                Place order · {fmt(cartTotal)}
              </button>
            </>
          )}

          {!done && flow === "quote" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
                <Field label="ORGANISATION" value={form.organisation ?? ""} onChange={set("organisation")} />
                <Field label="YOUR NAME" value={form.name ?? ""} onChange={set("name")} />
                <Field label="EMAIL OR PHONE" value={form.contact ?? ""} onChange={set("contact")} />
                <Field label="DELIVERY LOCATION" placeholder="City or site" value={form.location ?? ""} onChange={set("location")} />
              </div>
              <label style={labelStyle}>
                ANYTHING ELSE?
                <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.note ?? ""} onChange={set("note")} />
              </label>
              <button type="button" onClick={submitQuote} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
                Request quote →
              </button>
            </>
          )}

          {!done && flow === "enquiry" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
                <Field label="NAME" value={form.name ?? ""} onChange={set("name")} />
                <Field label="EMAIL OR PHONE" value={form.contact ?? ""} onChange={set("contact")} />
              </div>
              <label style={labelStyle}>
                WHAT DO YOU NEED?
                <textarea rows={5} style={{ ...inputStyle, resize: "vertical" }} value={form.note ?? note} onChange={set("note")} />
              </label>
              <button type="button" onClick={submitEnquiry} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
                Send enquiry →
              </button>
            </>
          )}

          {!done && flow === "review" && (
            <>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, stars: String(n) }))} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(6,56,46,.2)", background: "#fff", fontSize: 22, color: n <= Number(form.stars ?? 5) ? "#D4A637" : "#D9D4C8" }}>
                    ★
                  </button>
                ))}
              </div>
              <Field label="TITLE" value={form.title ?? ""} onChange={set("title")} />
              <label style={labelStyle}>
                YOUR REVIEW
                <textarea rows={5} style={{ ...inputStyle, resize: "vertical" }} value={form.body ?? ""} onChange={set("body")} />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 12 }}>
                <Field label="NAME SHOWN" value={form.name ?? ""} onChange={set("name")} />
                <Field label="ORDER REFERENCE" placeholder="DS-…" value={form.orderRef ?? ""} onChange={set("orderRef")} />
              </div>
              <button type="button" onClick={submitReview} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}>
                Submit review →
              </button>
            </>
          )}

          {!done && flow === "whatsapp" && (
            <>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#3A4A44" }}>We&rsquo;ll open WhatsApp with your cart written out.</p>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  "Hello D’Emporium, I’d like to order:\n" +
                    (cart?.cart_items ?? []).map((i) => `• ${i.quantity} × ${i.name} (${fmt((i.price ?? 0) * i.quantity)})`).join("\n") +
                    "\nTotal: " +
                    fmt(cartTotal)
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={close}
                style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 800 }}
              >
                Open WhatsApp →
              </a>
              <p style={{ fontSize: 13, color: "#5E6E68" }}>[ WHATSAPP NUMBER TO BE ADDED ]</p>
            </>
          )}

          <button type="button" onClick={close} style={{ alignSelf: "flex-start", background: "transparent", border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "13px 22px", fontWeight: 700, color: "#06382E" }}>
            {done ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
