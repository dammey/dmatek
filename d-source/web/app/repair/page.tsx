"use client";

import { useState } from "react";
import { PageTitle, btn, field, labelS, pagePad } from "@/components/ui";
import { api } from "@/lib/api";

const STEPS: [string, string][] = [
  ["Describe the problem", "Tell us what’s wrong. Add one device or several."],
  ["Book pickup", "Choose a pickup time and address. We collect the device."],
  ["Diagnosis and quote", "We diagnose the device and send a quote before any work."],
  ["Approve or decline", "Nothing is repaired until you approve. Decline and we return the device."],
  ["Repaired and returned", "Repaired, checked and returned to you."],
];

/** Pickup repair booking. Steps 1–2 collect the booking and send it to the
 * team; steps 3–5 explain what happens next (diagnosis, approval, return). */
export default function RepairPage() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ problem: "", address: "", when: "", name: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [title, body] = STEPS[step];

  async function book() {
    if (!f.problem.trim()) {
      setStep(0);
      return setErr("Describe what’s wrong first.");
    }
    if (!f.address.trim() || !f.name.trim() || !f.phone.trim()) return setErr("Add your name, phone and the pickup address.");
    setErr("");
    setBusy(true);
    try {
      await api.post("/enquiries", {
        type: "Repair collection",
        fromName: f.name.trim(),
        fromContact: f.phone.trim(),
        message: `${f.problem.trim()}\nPickup address: ${f.address.trim()}${f.when.trim() ? `\nPreferred pickup time: ${f.when.trim()}` : ""}`,
      });
      setSent(true);
      setStep(2);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "We couldn’t book that. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ ...pagePad, maxWidth: 760 }}>
      <PageTitle>Pickup repairs</PageTitle>
      <p style={{ margin: "0 0 18px", color: "var(--muted)" }}>One personal device, or several company devices. No work starts until you approve the quote.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {STEPS.map(([l], i) => (
          <button key={l} type="button" onClick={() => setStep(i)} aria-current={step === i ? "step" : undefined} style={{ border: 0, borderRadius: 99, padding: "9px 14px", fontWeight: 700, fontSize: 13, background: step === i ? "var(--d)" : "var(--t)", color: step === i ? "#fff" : "var(--d)" }}>
            {i + 1}. {l}
          </button>
        ))}
      </div>
      <div style={{ border: "1px solid var(--line)", borderRadius: 18, padding: 22, display: "flex", flexDirection: "column", gap: 12, background: "#fff" }}>
        <b style={{ fontSize: 19 }}>{title}</b>
        <span style={{ lineHeight: 1.6, fontSize: 15 }}>{body}</span>

        {step === 0 && (
          <textarea value={f.problem} onChange={(e) => setF({ ...f, problem: e.target.value })} placeholder="What’s wrong? Add devices if there are several." aria-label="What’s wrong" style={{ ...field, padding: 14, minHeight: 90 }} />
        )}
        {step === 1 && !sent && (
          <>
            <label style={labelS}>
              Pickup address
              <input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} autoComplete="street-address" style={field} />
            </label>
            <label style={labelS}>
              Preferred pickup time
              <input value={f.when} onChange={(e) => setF({ ...f, when: e.target.value })} placeholder="e.g. Thursday morning" style={field} />
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <label style={{ ...labelS, flex: "1 1 180px" }}>
                Your name
                <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" style={field} />
              </label>
              <label style={{ ...labelS, flex: "1 1 180px" }}>
                Phone / WhatsApp
                <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" style={field} />
              </label>
            </div>
          </>
        )}
        {sent && step <= 2 && <div style={{ background: "var(--t)", borderRadius: 14, padding: 14, fontWeight: 700 }}>Pickup requested. Our team will contact you to confirm the pickup time.</div>}
        {step === 3 && (
          <div style={{ background: "var(--t)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Diagnosis</span>
              <b>[ finding ]</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Quote</span>
              <b>₦ [ amount ]</b>
            </div>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>You’ll approve or decline once your diagnosis is ready; we send it to you before any work.</span>
          </div>
        )}

        {err && <span style={{ color: "var(--fail)", fontWeight: 700 }}>{err}</span>}
        {step === 0 && (
          <button type="button" onClick={() => setStep(1)} style={btn("buy", { alignSelf: "flex-start", borderRadius: 12 })}>
            Next: book pickup
          </button>
        )}
        {step === 1 && !sent && (
          <button type="button" disabled={busy} onClick={book} style={btn("buy", { alignSelf: "flex-start", borderRadius: 12 })}>
            {busy ? "Booking…" : "Book pickup"}
          </button>
        )}
        {step === 2 && (
          <button type="button" onClick={() => setStep(3)} style={btn("deep", { alignSelf: "flex-start", borderRadius: 12 })}>
            Next: approval
          </button>
        )}
        {step === 4 && (
          <button type="button" onClick={() => setStep(0)} style={btn("deep", { alignSelf: "flex-start", borderRadius: 12 })}>
            Start over
          </button>
        )}
      </div>
    </main>
  );
}
