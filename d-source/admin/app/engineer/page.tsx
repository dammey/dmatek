"use client";

import { useEffect, useState } from "react";
import { PageHeader, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Job = { id: string; ref: string | null; kind: string; time_window: string | null; address: string | null; status: string; engineer_staff_id: string | null };
type StaffMember = { id: string; name: string; role: string };

export default function EngineerAppPage() {
  const [engineers, setEngineers] = useState<StaffMember[]>([]);
  const [picked, setPicked] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const { say } = useToast();

  useEffect(() => {
    api.get<{ staff: StaffMember[] }>("/admin/staff").then(({ staff }) => {
      const engs = staff.filter((s) => s.role === "Engineer");
      setEngineers(engs);
      if (engs[0]) setPicked(engs[0].id);
    });
  }, []);

  function load() {
    api.get<{ jobs: Job[] }>("/admin/jobs").then(({ jobs }) => setJobs(jobs.filter((j) => j.engineer_staff_id === picked)));
  }
  useEffect(() => {
    if (picked) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  async function setStatus(id: string, status: string) {
    await api.patch(`/admin/jobs/${id}/status`, { status });
    say(status === "done" ? "Job completed · review request sent" : "Job started");
    load();
  }

  return (
    <div>
      <PageHeader title="Engineer app" subtitle="What engineers see on their phones" />
      <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 20, maxWidth: 260 }}>
        PREVIEW AS
        <select value={picked} onChange={(e) => setPicked(e.target.value)} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 12, fontSize: 14 }}>
          {engineers.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </label>

      <div style={{ width: 390, maxWidth: "100%", borderRadius: 44, background: "#0C1411", padding: 12, boxShadow: "0 30px 70px rgba(6,56,46,.25)" }}>
        <div style={{ borderRadius: 34, background: "#F5F1E8", overflow: "hidden" }}>
          <div style={{ background: "#06382E", color: "#F5F1E8", padding: "22px 20px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.16em", color: "#D4A637" }}>D&rsquo;SOURCE · ENGINEER</span>
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em" }}>Today</span>
            <span style={{ fontSize: 13, color: "rgba(245,241,232,.75)" }}>{jobs.length} jobs</span>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map((j) => (
              <article key={j.id} style={{ background: "#fff", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 10, border: `2px solid ${j.status === "done" ? "#1F7A5A" : j.status === "in_progress" ? "#D4A637" : "transparent"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, textTransform: "capitalize" }}>{j.time_window} · {j.kind}</span>
                </div>
                <span style={{ fontSize: 13.5, color: "#3A4A44" }}>{j.address}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "#5E6E68" }}>{j.ref}</span>
                <button
                  type="button"
                  onClick={() => setStatus(j.id, j.status === "scheduled" ? "in_progress" : "done")}
                  disabled={j.status === "done"}
                  style={{ ...btnPrimary, background: j.status === "done" ? "#D9F0E3" : "#06382E", color: j.status === "done" ? "#1F7A5A" : "#F5F1E8" }}
                >
                  {j.status === "done" ? "Completed ✓" : j.status === "in_progress" ? "Complete job" : "Start job"}
                </button>
              </article>
            ))}
            {!jobs.length && <p style={{ color: "#5E6E68", fontSize: 14 }}>Nothing scheduled for this engineer.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
