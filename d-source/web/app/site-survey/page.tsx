"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function SiteSurveyPage() {
  const [form, setForm] = useState({ organisation: "", siteType: "Office", address: "", preferredDate: "", timeWindow: "Either", contactName: "", contact: "", purpose: "" });
  const [ref, setRef] = useState("");

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { ref } = await api.post<{ ref: string }>("/surveys", form);
    setRef(ref);
  }

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", borderTop: "2px solid #D4A637", paddingTop: 10, marginBottom: 18 }}>
          D&rsquo;PROVISION · FREE
        </span>
        <h1 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "clamp(38px,5.6vw,72px)", letterSpacing: "-0.05em", lineHeight: 0.98 }}>Book a free site survey</h1>
        <p style={{ margin: "0 0 28px", fontSize: 16, lineHeight: 1.6, color: "#3A4A44" }}>We survey the site before we specify anything, so what you buy fits the building. Site surveys are free.</p>

        {ref ? (
          <div style={{ background: "#F5F1E8", borderRadius: 24, padding: 28 }}>
            <span style={{ width: 52, height: 52, borderRadius: "50%", background: "#D4A637", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 800 }}>✓</span>
            <p style={{ fontWeight: 800, fontSize: 26, letterSpacing: "-0.03em", marginTop: 12 }}>Survey request received.</p>
            <p style={{ fontSize: 16, color: "#3A4A44" }}>
              We&rsquo;ll call to confirm the date. Reference <strong style={{ fontFamily: "var(--font-mono)" }}>{ref}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 12 }}>
            <input value={form.organisation} onChange={set("organisation")} placeholder="Organisation" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} />
            <select value={form.siteType} onChange={set("siteType")} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }}>
              {["Office", "Hotel or hospitality", "School", "Clinic", "Retail or restaurant", "Event venue", "Estate or building", "Home", "Other"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <div style={{ gridColumn: "1/-1" }}>
              <input value={form.address} onChange={set("address")} placeholder="Site address" style={{ width: "100%", border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} required />
            </div>
            <input type="date" value={form.preferredDate} onChange={set("preferredDate")} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} />
            <select value={form.timeWindow} onChange={set("timeWindow")} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }}>
              {["Morning", "Afternoon", "Either"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <input value={form.contactName} onChange={set("contactName")} placeholder="Your name" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} required />
            <input value={form.contact} onChange={set("contact")} placeholder="Email or phone" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14 }} required />
            <div style={{ gridColumn: "1/-1" }}>
              <textarea
                value={form.purpose}
                onChange={set("purpose")}
                rows={4}
                placeholder="e.g. Wi-Fi for three floors, cameras on two entrances"
                style={{ width: "100%", border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14, resize: "vertical" }}
              />
            </div>
            <button type="submit" style={{ gridColumn: "1/-1", justifySelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800, marginTop: 8 }}>
              Book the survey →
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
