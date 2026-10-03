"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Card, PageHeader, btnGhost, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Job = { id: string; ref: string | null; kind: string; scheduled_date: string | null; time_window: string | null; address: string | null; status: string; engineer_staff_id: string | null; staff?: { name: string } };
type StaffMember = { id: string; name: string; role: string };

const JOB_COLORS: Record<string, [string, string]> = {
  install: ["#E3EEE8", "#1F5E48"],
  survey: ["#DCEBFF", "#1B4A8A"],
  oib: ["#FFF1CC", "#7A5B00"],
  repair: ["#FDE7E4", "#B42318"],
};
const KIND_LABEL: Record<string, string> = { install: "Install", survey: "Survey", oib: "Office in a Box", repair: "Repair" };

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday = 0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function InstallationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [unassigned, setUnassigned] = useState<Job[]>([]);
  const [engineers, setEngineers] = useState<StaffMember[]>([]);
  const [assign, setAssign] = useState<Record<string, { engineerId: string; date: string }>>({});
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const { say } = useToast();

  function load() {
    api.get<{ jobs: Job[]; unassigned: Job[] }>("/admin/jobs").then((d) => {
      setJobs(d.jobs);
      setUnassigned(d.unassigned);
    });
    api.get<{ staff: StaffMember[] }>("/admin/staff").then(({ staff }) => setEngineers(staff.filter((s) => s.role === "Engineer")));
  }
  useEffect(load, []);

  async function assignJob(jobId: string) {
    const a = assign[jobId];
    if (!a?.engineerId || !a?.date) return say("Pick an engineer and a date first");
    await api.patch(`/admin/jobs/${jobId}/assign`, { engineerStaffId: a.engineerId, scheduledDate: a.date });
    say("Assigned");
    load();
  }

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * 86400000)), [weekStart]);

  const jobsByEngineerDay = useMemo(() => {
    const map: Record<string, Record<string, Job[]>> = {};
    for (const j of jobs) {
      if (!j.engineer_staff_id || !j.scheduled_date) continue;
      const d = new Date(j.scheduled_date);
      if (!weekDays.some((w) => sameDay(w, d))) continue;
      const k = dateKey(d);
      map[j.engineer_staff_id] ??= {};
      (map[j.engineer_staff_id][k] ??= []).push(j);
    }
    return map;
  }, [jobs, weekDays]);

  return (
    <div>
      <PageHeader title="Installations" subtitle="Engineer calendar for set-ups, surveys and collections" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 800, fontSize: 16 }}>
          {weekDays[0].toLocaleDateString("en-NG", { day: "numeric", month: "short" })} &ndash; {weekDays[6].toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" onClick={() => setWeekStart((w) => new Date(w.getTime() - 7 * 86400000))} style={btnGhost}>
            &larr; Previous week
          </button>
          <button type="button" onClick={() => setWeekStart(startOfWeek(new Date()))} style={btnGhost}>
            This week
          </button>
          <button type="button" onClick={() => setWeekStart((w) => new Date(w.getTime() + 7 * 86400000))} style={btnGhost}>
            Next week &rarr;
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
        <div style={{ minWidth: 980 }}>
          <div style={{ display: "grid", gridTemplateColumns: "160px repeat(7,minmax(0,1fr))", gap: 1, background: "#EEEAE2" }}>
            <div style={{ background: "#fff", padding: "10px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#5E6E68" }}>ENGINEER</div>
            {weekDays.map((d) => (
              <div key={d.toISOString()} style={{ background: "#fff", padding: "10px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#5E6E68", textAlign: "center" }}>
                {d.toLocaleDateString("en-NG", { weekday: "short" }).toUpperCase()} {d.getDate()}
              </div>
            ))}
            {engineers.map((eng) => (
              <Fragment key={eng.id}>
                <div style={{ background: "#fff", padding: "12px 14px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center" }}>
                  {eng.name}
                </div>
                {weekDays.map((d) => {
                  const dayJobs = jobsByEngineerDay[eng.id]?.[dateKey(d)] ?? [];
                  return (
                    <div key={`${eng.id}-${d.toISOString()}`} style={{ background: "#fff", padding: 8, minHeight: 64, display: "flex", flexDirection: "column", gap: 4 }}>
                      {dayJobs.map((j) => {
                        const [bg, ink] = JOB_COLORS[j.kind] ?? ["#EFEADC", "#06382E"];
                        return (
                          <span key={j.id} title={`${j.address ?? ""} · ${j.ref ?? ""}`} style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 8px", borderRadius: 8, background: bg, color: ink }}>
                            {j.time_window ? `${j.time_window} · ` : ""}
                            {KIND_LABEL[j.kind] ?? j.kind}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </Fragment>
            ))}
            {!engineers.length && <div style={{ background: "#fff", padding: "20px 14px", color: "#5E6E68", gridColumn: "1 / -1" }}>No engineers yet — add one under Staff and roles.</div>}
          </div>
        </div>
      </div>

      <Card style={{ marginTop: 16 }}>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Not yet scheduled</span>
        {unassigned.map((u) => (
          <div key={u.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 160px 150px auto", gap: 10, alignItems: "center", borderTop: "1px solid #EEEAE2", padding: "10px 0" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 700 }}>{KIND_LABEL[u.kind] ?? u.kind}</span>
              <span style={{ fontSize: 13, color: "#5E6E68" }}>
                {u.address} &middot; {u.ref}
              </span>
            </span>
            <select
              value={assign[u.id]?.engineerId ?? ""}
              onChange={(e) => setAssign((a) => ({ ...a, [u.id]: { ...a[u.id], engineerId: e.target.value } }))}
              style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 10, padding: 8, fontSize: 13 }}
            >
              <option value="">Engineer…</option>
              {engineers.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={assign[u.id]?.date ?? ""}
              onChange={(e) => setAssign((a) => ({ ...a, [u.id]: { ...a[u.id], date: e.target.value } }))}
              style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 10, padding: 8, fontSize: 13 }}
            />
            <button type="button" onClick={() => assignJob(u.id)} style={btnPrimary}>
              Assign
            </button>
          </div>
        ))}
        {!unassigned.length && <span style={{ fontSize: 14, color: "#5E6E68" }}>Everything is scheduled.</span>}
      </Card>
    </div>
  );
}
