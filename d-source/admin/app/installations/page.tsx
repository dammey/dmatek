"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Row, Table, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Job = { id: string; ref: string | null; kind: string; scheduled_date: string | null; time_window: string | null; address: string | null; status: string; staff?: { name: string } };
type StaffMember = { id: string; name: string; role: string };

export default function InstallationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [unassigned, setUnassigned] = useState<Job[]>([]);
  const [engineers, setEngineers] = useState<StaffMember[]>([]);
  const [assign, setAssign] = useState<Record<string, { engineerId: string; date: string }>>({});
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

  return (
    <div>
      <PageHeader title="Installations" subtitle="Engineer calendar for set-ups, surveys and collections" />
      <Table cols="120px 100px 130px minmax(160px,1fr) 130px 110px" head={["REF", "KIND", "DATE", "ADDRESS", "ENGINEER", "STATUS"]} minWidth="900px">
        {jobs.map((j) => (
          <Row key={j.id} cols="120px 100px 130px minmax(160px,1fr) 130px 110px">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{j.ref ?? "—"}</span>
            <span style={{ textTransform: "capitalize" }}>{j.kind}</span>
            <span>{j.scheduled_date ? new Date(j.scheduled_date).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "—"} {j.time_window}</span>
            <span style={{ color: "#3A4A44" }}>{j.address}</span>
            <span>{j.staff?.name ?? "Unassigned"}</span>
            <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: "#EFEADC", justifySelf: "start" }}>{j.status}</span>
          </Row>
        ))}
        {!jobs.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>Nothing scheduled yet.</div>}
      </Table>

      <Card style={{ marginTop: 16 }}>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Not yet scheduled</span>
        {unassigned.map((u) => (
          <div key={u.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 160px 150px auto", gap: 10, alignItems: "center", borderTop: "1px solid #EEEAE2", padding: "10px 0" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 700 }}>{u.kind}</span>
              <span style={{ fontSize: 13, color: "#5E6E68" }}>{u.address} · {u.ref}</span>
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
