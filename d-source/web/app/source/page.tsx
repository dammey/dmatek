"use client";

import { useState } from "react";
import { Kicker, PageTitle, Tabs, btn, field, labelS, pagePad } from "@/components/ui";
import { api } from "@/lib/api";

const TYPES = ["Personal", "Business"] as const;

/** Hour of day in Lagos (WAT, UTC+1), whatever the visitor's clock says. */
function lagosHour() {
  return Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Lagos" }).format(new Date()));
}

export default function SourcePage() {
  const [type, setType] = useState<(typeof TYPES)[number]>("Personal");
  const [f, setF] = useState({ item: "", qty: "1", budget: "", name: "", contact: "" });
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  async function attach(list: FileList | null) {
    if (!list?.length) return;
    setUploading(true);
    setErr("");
    try {
      for (const file of Array.from(list)) {
        const { url } = await api.upload<{ url: string }>("/enquiries/attachment", file);
        setFiles((fs) => [...fs, { name: file.name, url }]);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "That file didn’t upload. Try a JPG, PNG or PDF.");
    } finally {
      setUploading(false);
    }
  }
  const biz = type === "Business";

  async function send() {
    if (!f.item.trim()) return setErr("Describe the item, or paste a link.");
    if (!f.contact.trim()) return setErr("Add a phone number (WhatsApp) or email so we can reply.");
    setErr("");
    setBusy(true);
    try {
      await api.post("/enquiries", {
        type: biz ? "Business sourcing" : "Sourcing request",
        fromName: f.name.trim() || undefined,
        fromContact: f.contact.trim(),
        message: `${f.item.trim()}\nQuantity: ${f.qty || "1"}${f.budget.trim() ? `\nBudget: ₦${f.budget.trim()}` : ""}${files.map((x) => `\nAttachment: ${x.url}`).join("")}`,
      });
      const h = lagosHour();
      setDone(biz ? "We’ll reply within 24 hours." : h >= 8 && h < 20 ? "We’ll reply within the hour." : h >= 20 ? "We’ll reply from 8am tomorrow." : "We’ll reply from 8am.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "We couldn’t send that. Please try again or WhatsApp us.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ ...pagePad, boxSizing: "content-box", maxWidth: 720 }}>
      <Kicker>SOURCING REQUEST</Kicker>
      <PageTitle>We’ll source it.</PageTitle>
      {done ? (
        <div style={{ background: "var(--t)", borderRadius: 18, padding: 28, marginTop: 12 }}>
          <b style={{ fontSize: 22, letterSpacing: "-.03em" }}>Request sent.</b>
          <p style={{ lineHeight: 1.6, fontSize: 16 }}>{done}</p>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setF({ item: "", qty: "1", budget: "", name: f.name, contact: f.contact });
              setFiles([]);
            }}
            style={btn("outline", { padding: "10px 16px" })}
          >
            New request
          </button>
        </div>
      ) : (
        <>
          <p style={{ margin: "0 0 16px", color: "var(--muted)", lineHeight: 1.6 }}>Tell us what you need. A real person confirms price and timeline on WhatsApp.</p>
          <div style={{ marginBottom: 14 }}>
            <Tabs items={TYPES} value={type} onChange={setType} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <textarea value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })} placeholder="Describe the item, or paste a link" aria-label="Describe the item" style={{ ...field, padding: 14, minHeight: 100 }} />
            <label style={{ border: "1px dashed var(--m)", borderRadius: 12, padding: 16, fontSize: 14, color: "var(--m)", fontWeight: 700, cursor: "pointer" }}>
              {uploading ? "Uploading…" : "Upload a photo or spec sheet"}
              {files.map((x) => (
                <span key={x.url} style={{ display: "block", fontWeight: 600, fontSize: 13, marginTop: 6 }}>
                  ✓ {x.name}
                </span>
              ))}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,application/pdf" multiple hidden onChange={(e) => attach(e.target.files)} />
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <label style={{ ...labelS, flex: "1 1 120px" }}>
                Quantity
                <input inputMode="numeric" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} style={field} />
              </label>
              <label style={{ ...labelS, flex: "2 1 180px" }}>
                Budget
                <input inputMode="numeric" value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })} placeholder="₦" style={field} />
              </label>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <label style={{ ...labelS, flex: "1 1 180px" }}>
                Your name
                <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" style={field} />
              </label>
              <label style={{ ...labelS, flex: "1 1 180px" }}>
                WhatsApp number or email
                <input value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} style={field} />
              </label>
            </div>
            <div style={{ background: "var(--t)", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>
              {biz ? "Business and bulk requests: reply within 24 hours." : "Personal devices: reply within 1 hour, 8am–8pm daily. Requests sent after 8pm are answered from 8am."}
            </div>
            {err && <span style={{ color: "var(--fail)", fontWeight: 700 }}>{err}</span>}
            <button type="button" disabled={busy || uploading} onClick={send} style={{ ...btn("buy"), borderRadius: 12, padding: 15 }}>
              {busy ? "Sending…" : "Send request"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
