"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useNow } from "@/lib/useNow";
import { useToast } from "@/lib/toast-context";

type Kind = "install" | "survey" | "oib" | "repair";
type Job = { id: string; ref: string | null; kind: Kind; title: string | null; scheduled_date: string | null; time_window: string | null; address: string | null; engineer_staff_id: string | null };
type Engineer = { id: string; name: string };

const JOBCOL: Record<Kind, [string, string]> = { install: ["#E3EEE8", "#1F5E48"], survey: ["#DCEBFF", "#1B4A8A"], oib: ["#FFF1CC", "#7A5B00"], repair: ["#FDE7E4", "#B42318"] };
const LEGEND: [Kind, string][] = [["install", "Installation"], ["survey", "Site survey"], ["oib", "Office in a Box"], ["repair", "Repair collection"]];
const KIND: Record<Kind, string> = { install: "Installation", survey: "Site survey", oib: "Office in a Box", repair: "Repair collection" };
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COLS = "170px repeat(7,minmax(120px,1fr))";

/** Monday of the current week in Lagos time, or ?week=YYYY-MM-DD. */
function weekStart(param: string | null) {
  if (param && /^\d{4}-\d{2}-\d{2}$/.test(param)) return new Date(`${param}T00:00:00Z`);
  const now = new Date(Date.now() + 3600e3);
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
}
const iso = (d: Date) => d.toISOString().slice(0, 10);
/** "9:00" → 540, so 9:00 sorts before 12:30; unknown times go last. */
const mins = (t: string | null) => {
  const m = /^(\d{1,2}):(\d{2})/.exec(t ?? "");
  return m ? Number(m[1]) * 60 + Number(m[2]) : 1e4;
};

function Schedule() {
  const params = useSearchParams();
  const start = weekStart(params.get("week"));
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 86400e3));
  const dayKeys = days.map(iso);
  const labels = days.map((d, i) => `${DOW[i]} ${d.getUTCDate()}`);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [unassigned, setUnassigned] = useState<Job[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const { say } = useToast();
  const now = useNow();

  function load() {
    api.get<{ jobs: Job[]; unassigned: Job[] }>("/admin/jobs").then((d) => {
      setJobs(d.jobs.filter((j) => j.engineer_staff_id));
      setUnassigned(d.unassigned);
    });
    api.get<{ engineers: Engineer[] }>("/admin/engineer").then((d) => setEngineers(d.engineers)).catch(() => setEngineers([]));
  }
  useEffect(load, []);

  const week = jobs.filter((j) => j.scheduled_date && dayKeys.includes(j.scheduled_date));
  const load7 = (e: Engineer) => week.filter((j) => j.engineer_staff_id === e.id).length;
  const todayIdx = Math.max(0, dayKeys.indexOf(iso(new Date(now + 3600e3))));

  /** Suggested slot: the engineer with the fewest jobs this week, on the first weekday from today with fewer than 3 of their jobs. */
  function slotFor(i: number) {
    if (!engineers.length) return null;
    const ranked = [...engineers].sort((a, b) => load7(a) - load7(b));
    const e = ranked[i % ranked.length];
    for (let d = todayIdx; d < 5; d++) {
      const n = week.filter((j) => j.engineer_staff_id === e.id && j.scheduled_date === dayKeys[d]).length;
      if (n < 3) return { e, d };
    }
    return { e, d: Math.min(todayIdx, 6) };
  }

  async function assign(u: Job, i: number) {
    const s = slotFor(i);
    if (!s) return say("Add an engineer in Staff and roles first");
    await api.patch(`/admin/jobs/${u.id}/assign`, { engineerStaffId: s.e.id, scheduledDate: dayKeys[s.d], timeWindow: "10:00" });
    say(`${u.title ?? KIND[u.kind]} assigned to ${s.e.name}`);
    load();
  }

  const rows: Engineer[] = engineers.length ? engineers : [{ id: "", name: "[ ENGINEER 1 ]" }];

  return (
    <>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12.5, color: "#3A4A44" }}>
        {LEGEND.map(([k, t]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: JOBCOL[k][0], border: "1px solid rgba(6,56,46,.3)" }} />
            {t}
          </span>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
        <div style={{ minWidth: 1080 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
            <span>ENGINEER</span>
            {labels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          {rows.map((e) => (
            <div key={e.id || e.name} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", borderBottom: "1px solid #F3F0E9", minHeight: 96 }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>{e.name}</span>
                <span style={{ fontSize: 12, color: "#5E6E68" }}>{load7(e)} jobs this week</span>
              </span>
              {dayKeys.map((dk, di) => (
                <div key={dk} style={{ display: "flex", flexDirection: "column", gap: 6, background: di >= 5 ? "#FAF8F3" : "transparent", borderRadius: 10, padding: 4 }}>
                  {week
                    .filter((j) => j.engineer_staff_id === e.id && j.scheduled_date === dk)
                    .sort((a, b) => mins(a.time_window) - mins(b.time_window))
                    .map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => say(`${j.ref ?? ""} · ${j.title ?? KIND[j.kind]} · ${e.name}`)}
                        style={{ border: 0, textAlign: "left", background: JOBCOL[j.kind][0], color: JOBCOL[j.kind][1], borderRadius: 8, padding: "7px 8px", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}
                      >
                        {j.time_window ?? "[ time ]"} · {j.title ?? KIND[j.kind]}
                        <span style={{ display: "block", fontWeight: 500, opacity: 0.8 }}>{j.address ?? "[ ADDRESS ]"}</span>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Not yet scheduled</span>
        {unassigned.map((u, i) => {
          const s = slotFor(i);
          return (
            <div key={u.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center", borderTop: "1px solid #EEEAE2", padding: "10px 0" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 700 }}>{u.title ?? KIND[u.kind]}</span>
                <span style={{ fontSize: 13, color: "#5E6E68" }}>
                  {u.address ?? "[ ADDRESS ]"} · {u.ref}
                </span>
              </span>
              <button type="button" onClick={() => assign(u, i)} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "9px 14px", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>
                Assign · {s ? `${s.e.name} · ${labels[s.d]}` : "[ ENGINEER ]"}
              </button>
            </div>
          );
        })}
        {!unassigned.length && <span style={{ fontSize: 14, color: "#5E6E68" }}>Everything is scheduled.</span>}
      </section>
    </>
  );
}

export default function InstallationsPage() {
  return (
    <Suspense>
      <Schedule />
    </Suspense>
  );
}
