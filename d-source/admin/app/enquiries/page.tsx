"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/ui";
import { api } from "@/lib/api";
import { REQUEST_TYPES, requestDue, requestTag, when, type Enquiry } from "@/lib/requests";
import { useSearch } from "@/lib/search-context";

export default function RequestsPage() {
  const [filter, setFilter] = useState("all");
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const { q } = useSearch();

  function load() {
    api.get<{ enquiries: Enquiry[] }>("/admin/enquiries").then(({ enquiries }) => setEnquiries(enquiries)).catch(() => setEnquiries([]));
  }
  useEffect(load, []);

  async function toggle(id: string) {
    setEnquiries((list) => (list ?? []).map((e) => (e.id === id ? { ...e, done: !e.done } : e)));
    await api.patch(`/admin/enquiries/${id}/toggle`);
  }

  const all = enquiries ?? [];
  const needle = q.trim().toLowerCase();
  const rows = all.filter((e) => (filter === "all" || e.type === filter) && (!needle || `${e.from_name ?? ""} ${e.from_contact ?? ""} ${e.message}`.toLowerCase().includes(needle)));
  const now = Date.now();

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Chip label={`All (${all.length})`} active={filter === "all"} onClick={() => setFilter("all")} />
        {REQUEST_TYPES.map((t) => (
          <Chip key={t} label={`${t} (${all.filter((e) => e.type === t).length})`} active={filter === t} onClick={() => setFilter(t)} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((e) => {
          const [bg, ink] = requestTag(e.type);
          const [due, dueInk] = requestDue(e, now);
          return (
            <article key={e.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 18, padding: "16px 18px", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 14, alignItems: "center", opacity: e.done ? 0.55 : 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: ".12em", padding: "4px 8px", borderRadius: 4, background: bg, color: ink }}>{e.type.toUpperCase()}</span>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{e.from_name || e.from_contact || "[ NAME ]"}</span>
                  <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{when(e.created_at, now)}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", color: dueInk }}>{due}</span>
                </div>
                <span style={{ fontSize: 14.5, lineHeight: 1.55, color: "#3A4A44", whiteSpace: "pre-line" }}>{e.message}</span>
              </div>
              <button
                type="button"
                onClick={() => toggle(e.id)}
                style={{ border: "1px solid rgba(6,56,46,.2)", background: e.done ? "#E3EEE8" : "#fff", color: "#06382E", borderRadius: 999, padding: "9px 14px", fontSize: 13, fontWeight: 800, whiteSpace: "nowrap" }}
              >
                {e.done ? "Handled ✓" : "Mark handled"}
              </button>
            </article>
          );
        })}
        {enquiries && !rows.length && <p style={{ margin: 0, color: "#5E6E68" }}>Nothing here yet.</p>}
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: "#5E6E68" }}>Pilot interest is the pilot demand log: every “join the pilot” request from the storefront lands here with the pilot it’s for.</p>
    </>
  );
}
