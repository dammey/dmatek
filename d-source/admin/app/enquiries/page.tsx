"use client";

import { useEffect, useState } from "react";
import { Chip, PageHeader, btnGhost } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Enquiry = { id: string; type: string; from_name: string | null; from_contact: string | null; message: string; done: boolean; created_at: string };
const TYPES = ["Repair collection", "Pilot interest", "WhatsApp order", "General"];

export default function EnquiriesPage() {
  const [type, setType] = useState<string | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const { say } = useToast();

  function load() {
    const qs = type ? `?type=${encodeURIComponent(type)}` : "";
    api.get<{ enquiries: Enquiry[] }>(`/admin/enquiries${qs}`).then(({ enquiries }) => setEnquiries(enquiries));
  }
  useEffect(load, [type]);

  async function toggle(id: string) {
    await api.patch(`/admin/enquiries/${id}/toggle`);
    say("Updated");
    load();
  }

  return (
    <div>
      <PageHeader title="Enquiries" subtitle="Repairs, pilot interest, WhatsApp and general" />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        <Chip label="All" active={!type} onClick={() => setType(null)} />
        {TYPES.map((t) => (
          <Chip key={t} label={t} active={type === t} onClick={() => setType(t)} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {enquiries.map((e) => (
          <article key={e.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 18, padding: "16px 18px", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 14, alignItems: "center", opacity: e.done ? 0.55 : 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", padding: "4px 8px", borderRadius: 4, background: "#EFEADC" }}>{e.type.toUpperCase()}</span>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{e.from_name || e.from_contact}</span>
              </div>
              <span style={{ fontSize: 14.5, lineHeight: 1.55, color: "#3A4A44" }}>{e.message}</span>
            </div>
            <button type="button" onClick={() => toggle(e.id)} style={btnGhost}>
              {e.done ? "Handled ✓" : "Mark handled"}
            </button>
          </article>
        ))}
        {!enquiries.length && <p style={{ color: "#5E6E68" }}>Nothing here.</p>}
      </div>
      <p style={{ marginTop: 16, fontSize: 13.5, color: "#5E6E68" }}>Pilot interest is the pilot demand log: every &ldquo;join the pilot&rdquo; request from the storefront lands here.</p>
    </div>
  );
}
