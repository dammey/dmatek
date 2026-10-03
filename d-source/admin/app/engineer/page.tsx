"use client";

import { useEffect, useState } from "react";
import { PageHeader, btnGhost, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type JobKind = "install" | "survey" | "oib" | "repair";
type Job = { id: string; ref: string | null; kind: JobKind; time_window: string | null; address: string | null; status: string; engineer_staff_id: string | null; customerName: string | null; customerPhone: string | null };
type StaffMember = { id: string; name: string; role: string };

const CHECKLISTS: Record<JobKind, string[]> = {
  install: ["Confirm the job with the customer", "Install and test", "Show the customer how it works", "Photo of the finished job"],
  survey: ["Walk the site with the contact", "Measure and photograph", "Note power and cabling", "Agree next steps"],
  oib: ["Unbox and label devices", "Network and internet with backup", "Email, files, MFA and backup", "Hand over documentation"],
  repair: ["Check the device and accessories", "Photo of its condition", "Collection receipt signed"],
};

export default function EngineerAppPage() {
  const [engineers, setEngineers] = useState<StaffMember[]>([]);
  const [picked, setPicked] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean[]>>({});
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

  function toggleCheck(jobId: string, kind: JobKind, idx: number) {
    setChecked((c) => {
      const current = c[jobId] ?? CHECKLISTS[kind].map(() => false);
      const next = current.map((v, i) => (i === idx ? !v : v));
      return { ...c, [jobId]: next };
    });
  }

  async function advance(j: Job) {
    if (j.status === "scheduled") {
      await api.patch(`/admin/jobs/${j.id}/status`, { status: "in_progress" });
      say("Job started");
      load();
      return;
    }
    const checks = checked[j.id] ?? CHECKLISTS[j.kind].map(() => false);
    if (!checks.every(Boolean)) {
      say("Tick every checklist item first");
      return;
    }
    await api.patch(`/admin/jobs/${j.id}/status`, { status: "done" });
    say("Job completed · review request sent");
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
            {jobs.map((j) => {
              const checklist = CHECKLISTS[j.kind];
              const checks = checked[j.id] ?? checklist.map(() => false);
              return (
                <article key={j.id} style={{ background: "#fff", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 10, border: `2px solid ${j.status === "done" ? "#1F7A5A" : j.status === "in_progress" ? "#D4A637" : "transparent"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, textTransform: "capitalize" }}>
                      {j.time_window} · {j.kind}
                    </span>
                  </div>
                  <span style={{ fontSize: 13.5, color: "#3A4A44" }}>
                    {j.customerName ?? "—"} · {j.address}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "#5E6E68" }}>{j.ref}</span>
                  {j.status === "in_progress" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {checklist.map((label, i) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleCheck(j.id, j.kind, i)}
                          style={{ display: "flex", alignItems: "center", gap: 10, border: 0, background: "transparent", padding: 0, minHeight: 36, fontSize: 14, color: "#06382E", textAlign: "left" }}
                        >
                          <span
                            style={{
                              flex: "0 0 auto",
                              width: 24,
                              height: 24,
                              borderRadius: 7,
                              border: "2px solid #06382E",
                              background: checks[i] ? "#06382E" : "transparent",
                              color: "#F5F1E8",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 12,
                            }}
                          >
                            {checks[i] ? "✓" : ""}
                          </span>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => say(j.customerPhone ? `Calling ${j.customerPhone}…` : "No phone number on file")}
                      style={btnGhost}
                    >
                      Call customer
                    </button>
                    <button
                      type="button"
                      onClick={() => advance(j)}
                      disabled={j.status === "done"}
                      style={{ ...btnPrimary, background: j.status === "done" ? "#D9F0E3" : "#06382E", color: j.status === "done" ? "#1F7A5A" : "#F5F1E8" }}
                    >
                      {j.status === "done" ? "Completed ✓" : j.status === "in_progress" ? "Complete job" : "Start job"}
                    </button>
                  </div>
                </article>
              );
            })}
            {!jobs.length && <p style={{ color: "#5E6E68", fontSize: 14 }}>Nothing scheduled for this engineer.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
