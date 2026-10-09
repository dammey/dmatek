"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

type Survey = { ref: string; organisation: string | null; site_type: string | null; address: string; preferred_date: string | null; time_window: string | null; stage: string; engineer_staff_id: string | null };
type Engineer = { id: string; name: string };

const KEYS = ["requested", "date_confirmed", "surveyed", "quote_sent"];
const SV: [string, string, string][] = [["Requested", "#FFF1CC", "#7A5B00"], ["Date confirmed", "#DCEBFF", "#1B4A8A"], ["Surveyed", "#E3EEE8", "#1F5E48"], ["Quote sent", "#06382E", "#D4A637"]];
const COLS = "110px minmax(160px,1fr) 130px minmax(160px,1fr) 150px 150px 110px";

export default function SurveysPage() {
  const [list, setList] = useState<Survey[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const { q } = useSearch();
  const { say } = useToast();

  function load() {
    api.get<{ surveys: Survey[] }>("/admin/surveys").then(({ surveys }) => setList(surveys));
  }
  useEffect(() => {
    load();
    api.get<{ engineers: Engineer[] }>("/admin/engineer").then((d) => setEngineers(d.engineers)).catch(() => setEngineers([]));
  }, []);

  async function advance(s: Survey) {
    if (KEYS.indexOf(s.stage) >= 3) return;
    await api.patch(`/admin/surveys/${s.ref}/advance`);
    load();
  }
  async function assign(s: Survey, id: string) {
    if (!id) return;
    await api.patch(`/admin/surveys/${s.ref}/assign`, { engineerStaffId: id });
    say(`${s.ref} assigned to ${engineers.find((e) => e.id === id)?.name ?? "engineer"}`);
    load();
  }

  const needle = q.trim().toLowerCase();
  const rows = list.filter((s) => !needle || `${s.ref} ${s.organisation} ${s.address}`.toLowerCase().includes(needle));

  return (
    <>
      <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
        <div style={{ minWidth: 900 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
            <span>REFERENCE</span>
            <span>ORGANISATION</span>
            <span>SITE</span>
            <span>ADDRESS</span>
            <span>PREFERRED</span>
            <span>ENGINEER</span>
            <span>STATUS</span>
          </div>
          {rows.map((s) => {
            const st = SV[Math.max(0, KEYS.indexOf(s.stage))];
            return (
              <div key={s.ref} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{s.ref}</span>
                <span style={{ fontWeight: 700 }}>{s.organisation ?? "[ ORGANISATION ]"}</span>
                <span style={{ color: "#3A4A44" }}>{s.site_type ?? "—"}</span>
                <span style={{ color: "#3A4A44" }}>{s.address}</span>
                <span>{s.preferred_date ? `${shortDate(s.preferred_date)} · ${s.time_window ?? "Either"}` : "[ DATE ]"}</span>
                <select value={s.engineer_staff_id ?? ""} onChange={(e) => assign(s, e.target.value)} style={{ border: "1px solid rgba(6,56,46,.18)", borderRadius: 10, padding: 8, fontSize: 13, background: "#fff", color: "#06382E" }}>
                  <option value="">Unassigned</option>
                  {engineers.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => advance(s)} style={{ border: 0, borderRadius: 999, padding: "7px 10px", fontSize: 12, fontWeight: 800, background: st[1], color: st[2], whiteSpace: "nowrap" }}>
                  {st[0]}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: "#5E6E68" }}>Tap a status to move it on: Requested → Date confirmed → Surveyed → Quote sent.</p>
    </>
  );
}
