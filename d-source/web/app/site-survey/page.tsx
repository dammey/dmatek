"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";

function input(): React.CSSProperties {
  return { border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14, fontSize: 15, background: "#fff", color: "#06382E" };
}
function label(): React.CSSProperties {
  return { display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" };
}

export default function SiteSurveyPage() {
  const [form, setForm] = useState({ organisation: "", siteType: "Office", address: "", preferredDate: "", timeWindow: "Morning", contactName: "", contact: "", purpose: "" });
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
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D’Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>›</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>Book a site survey</span>
      </div>
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
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
            <label style={label()}>
              ORGANISATION
              <input value={form.organisation} onChange={set("organisation")} style={input()} />
            </label>
            <label style={label()}>
              SITE TYPE
              <select value={form.siteType} onChange={set("siteType")} style={input()}>
                {["Office", "Hotel or hospitality", "School", "Clinic", "Retail or restaurant", "Event venue", "Estate or building", "Home", "Other"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label style={{ ...label(), gridColumn: "1/-1" }}>
              SITE ADDRESS
              <input value={form.address} onChange={set("address")} style={input()} required />
            </label>
            <label style={label()}>
              PREFERRED DATE
              <input type="date" value={form.preferredDate} onChange={set("preferredDate")} style={input()} />
            </label>
            <label style={label()}>
              TIME WINDOW
              <select value={form.timeWindow} onChange={set("timeWindow")} style={input()}>
                {["Morning", "Afternoon", "Either"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label style={label()}>
              YOUR NAME
              <input value={form.contactName} onChange={set("contactName")} style={input()} required />
            </label>
            <label style={label()}>
              EMAIL OR PHONE
              <input value={form.contact} onChange={set("contact")} style={input()} required />
            </label>
            <label style={{ ...label(), gridColumn: "1/-1" }}>
              WHAT’S IT FOR?
              <textarea
                value={form.purpose}
                onChange={set("purpose")}
                rows={4}
                placeholder="e.g. Wi-Fi for three floors, cameras on two entrances"
                style={{ ...input(), resize: "vertical" }}
              />
            </label>
            <button type="submit" style={{ gridColumn: "1/-1", justifySelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800, marginTop: 8 }}>
              Book the survey →
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
