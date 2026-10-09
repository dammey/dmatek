"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { btn, field, pagePad } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { StoreText } from "@/lib/settings-context";

type Cta = "quote" | "repair" | "survey" | "apply";
const SERVICES: [string, string, string, string, Cta][] = [
  ["Bulk device purchase", "Laptops, phones and accessories in volume, with invoice.", "Send a list, we source and quote.", "Request a quote", "quote"],
  ["IT room and server setup", "Racks, servers, storage, cabling, documented.", "Site survey, quote, installation by D’Matek engineers.", "Request a quote", "quote"],
  ["Wi-Fi and network installation", "Access points, switching, cabling, configuration.", "Survey, quote, install, test.", "Request a quote", "quote"],
  ["Security and CCTV installation", "Cameras, recorders, remote viewing.", "Survey, quote, install, handover.", "Request a quote", "quote"],
  ["Repairs for company devices", "Pickup and return for many devices at once.", "Pickup, diagnosis, quote before work, repair, return.", "Book a pickup", "repair"],
  ["Office in a Box", "Devices, network and internet with backup, domain, email and files, website, MFA and backup, set up and documented.", "One scoped quote for the whole office.", "Request a quote", "quote"],
  ["Free site survey", "An engineer visits and scopes the work.", "Book a visit, receive a written scope.", "Book a survey", "survey"],
  ["Business account", "Invoicing for repeat purchases.", "Apply with company details.", "Apply", "apply"],
];

export default function ProvisionPage() {
  const router = useRouter();
  const { addToQuote } = useCart();
  const { signedIn } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);

  async function cta(name: string, kind: Cta) {
    if (kind === "repair") return router.push("/repair");
    if (kind === "survey" || kind === "apply") return document.getElementById(kind === "survey" ? "survey" : "account")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setBusy(name);
    try {
      await addToQuote({ productId: null, name: `Service: ${name}`, price: null, channel: "provision" });
      router.push("/cart?tab=quote");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main>
      <div style={pagePad}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "var(--m)" }}>D’SOURCE PROVISION · FOR YOUR BUSINESS</span>
        <h1 style={{ margin: "6px 0 8px", fontSize: "clamp(28px,4vw,46px)", letterSpacing: "-.04em", lineHeight: 1.05, maxWidth: "20ch", fontWeight: 800 }}>Services for the whole workplace.</h1>
        <p style={{ margin: "0 0 22px", color: "var(--muted)", maxWidth: "60ch", lineHeight: 1.6 }}>Each service is quoted or booked directly. Quotes within 24 hours.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14 }}>
          {SERVICES.map(([name, inc, how, label, kind], i) => (
            <div key={name} data-rv="1" style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 8, background: i === 5 ? "var(--t)" : "#fff" }}>
              <b style={{ fontSize: 18, letterSpacing: "-.02em" }}>{name}</b>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--muted)" }}>
                <b style={{ color: "var(--ink)" }}>Included:</b> {inc}
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--muted)" }}>
                <b style={{ color: "var(--ink)" }}>How it works:</b> {how}
              </span>
              <button type="button" disabled={busy === name} onClick={() => cta(name, kind)} style={btn("deep", { marginTop: "auto", alignSelf: "flex-start", padding: "11px 16px" })}>
                {busy === name ? "Adding…" : label}
              </button>
            </div>
          ))}
        </div>
      </div>
      <section style={{ padding: "0 var(--gut) clamp(28px,4vw,48px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 14 }}>
        <BusinessAccount signedIn={signedIn} />
        <SiteSurvey />
      </section>
    </main>
  );
}

function BusinessAccount({ signedIn }: { signedIn: boolean }) {
  const [f, setF] = useState({ company: "", contact: "", email: "" });
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [err, setErr] = useState("");
  async function apply() {
    if (!f.company.trim()) return setErr("Add the company name.");
    if (!signedIn && !/\S+@\S+\.\S+/.test(f.email)) return setErr("Add the company email.");
    setErr("");
    setState("busy");
    try {
      await api.post("/account/business", { companyName: f.company.trim(), accountsContact: f.contact.trim() || undefined, accountsEmail: f.email.trim() || undefined });
      setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "We couldn’t send that.");
      setState("idle");
    }
  }
  return (
    <div id="account" style={{ background: "var(--t)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <b style={{ fontSize: 18 }}>Business account application</b>
      {state === "done" ? (
        <span style={{ fontWeight: 700, lineHeight: 1.5 }}>Application received. We’ll review it and contact you. <StoreText k="reviewTime" /></span>
      ) : (
        <>
          <input value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} placeholder="Company name" aria-label="Company name" style={{ ...field, padding: 12 }} />
          <input value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} placeholder="Contact name and phone" aria-label="Contact name and phone" style={{ ...field, padding: 12 }} />
          <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Company email" aria-label="Company email" style={{ ...field, padding: 12 }} />
          {err && <span style={{ color: "var(--fail)", fontWeight: 700 }}>{err}</span>}
          <button type="button" disabled={state === "busy"} onClick={apply} style={btn("deep", { borderRadius: 10, padding: 13 })}>
            Apply for an account with invoicing
          </button>
        </>
      )}
    </div>
  );
}

function SiteSurvey() {
  const [f, setF] = useState({ address: "", day: "", name: "", contact: "" });
  const [ref, setRef] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function book() {
    if (!f.address.trim() || !f.name.trim() || !f.contact.trim()) return setErr("Add the site address, your name and a phone number or email.");
    setErr("");
    setBusy(true);
    try {
      const r = await api.post<{ ref: string }>("/surveys", { address: f.address.trim(), preferredDate: undefined, timeWindow: f.day.trim() || undefined, contactName: f.name.trim(), contact: f.contact.trim() });
      setRef(r.ref);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "We couldn’t book that.");
    } finally {
      setBusy(false);
    }
  }
  const dark: React.CSSProperties = { ...field, border: 0, padding: 12 };
  return (
    <div id="survey" style={{ background: "var(--d)", color: "#fff", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <b style={{ fontSize: 18 }}>Free site survey</b>
      <span style={{ fontSize: 14, lineHeight: 1.5 }}>An engineer visits, scopes the work and sends a written scope. Quotes within 24 hours.</span>
      {ref ? (
        <span style={{ fontWeight: 700 }}>Survey requested · reference {ref}. Our team will contact you to confirm the visit.</span>
      ) : (
        <>
          <input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="Site address" aria-label="Site address" style={dark} />
          <input value={f.day} onChange={(e) => setF({ ...f, day: e.target.value })} placeholder="Preferred day" aria-label="Preferred day" style={dark} />
          <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" aria-label="Your name" style={dark} />
          <input value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} placeholder="Phone or email" aria-label="Phone or email" style={dark} />
          {err && <span style={{ color: "#FFB4B4", fontWeight: 700 }}>{err}</span>}
          <button type="button" disabled={busy} onClick={book} style={btn("buy", { borderRadius: 10, padding: 13 })}>
            {busy ? "Booking…" : "Book a survey"}
          </button>
        </>
      )}
    </div>
  );
}
