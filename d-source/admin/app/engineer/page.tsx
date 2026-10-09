"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

type JobKind = "install" | "survey" | "oib" | "repair";
type Job = { id: string; ref: string | null; kind: JobKind; title: string | null; time_window: string | null; address: string | null; status: "scheduled" | "in_progress" | "done"; checklist: boolean[]; customerName: string | null; customerPhone: string | null };
type Engineer = { id: string; name: string };

const CHK: Record<JobKind, string[]> = {
  install: ["Confirm the job with the customer", "Install and test", "Show the customer how it works", "Photo of the finished job"],
  survey: ["Walk the site with the contact", "Measure and photograph", "Note power and cabling", "Agree next steps"],
  oib: ["Unbox and label devices", "Network and internet with backup", "Email, files, MFA and backup", "Hand over documentation"],
  repair: ["Check the device and accessories", "Photo of its condition", "Collection receipt signed"],
};
const KIND: Record<JobKind, string> = { install: "Installation", survey: "Site survey", oib: "Office in a Box", repair: "Repair collection" };

export default function EngineerAppPage() {
  const { staff } = useAuth();
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [picked, setPicked] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const { say } = useToast();
  const isEngineer = staff?.role === "Engineer";

  function load(pick = picked) {
    api
      .get<{ engineers: Engineer[]; picked?: string; jobs: Job[] }>(`/admin/engineer${pick ? `?staff=${pick}` : ""}`)
      .then((d) => {
        setEngineers(d.engineers);
        if (d.picked) setPicked(d.picked);
        setJobs(d.jobs.map((j) => ({ ...j, checklist: Array.isArray(j.checklist) ? j.checklist : [] })));
      })
      .catch(() => setJobs([]));
  }
  useEffect(() => load(""), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function tick(j: Job, i: number) {
    if (j.status === "done") return;
    const list = CHK[j.kind].map((_, k) => (k === i ? !j.checklist[k] : !!j.checklist[k]));
    setJobs((js) => js.map((x) => (x.id === j.id ? { ...x, checklist: list, status: "in_progress" } : x)));
    await api.patch(`/admin/engineer/jobs/${j.id}/checklist`, { checklist: list });
  }

  async function go(j: Job) {
    if (j.status === "done") return;
    if (j.status === "scheduled") {
      setJobs((js) => js.map((x) => (x.id === j.id ? { ...x, status: "in_progress" } : x)));
      await api.patch(`/admin/engineer/jobs/${j.id}/status`, { status: "in_progress" });
      return;
    }
    if (!CHK[j.kind].every((_, k) => j.checklist[k])) return say("Tick every checklist item first");
    await api.patch(`/admin/engineer/jobs/${j.id}/status`, { status: "done" });
    say(`${j.ref ?? "Job"} completed · review request sent`);
    load();
  }

  const name = engineers.find((e) => e.id === picked)?.name ?? (isEngineer ? staff?.name : null) ?? "[ ENGINEER 1 ]";
  const done = jobs.filter((j) => j.status === "done").length;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
      <div style={{ width: 390, maxWidth: "100%", height: 780, borderRadius: 44, background: "#0C1411", padding: 12, boxShadow: "0 30px 70px rgba(6,56,46,.25)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 34, background: "#F5F1E8", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#06382E", color: "#F5F1E8", padding: "22px 20px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".16em", color: "#D4A637" }}>D’SOURCE · ENGINEER</span>
            <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-.03em" }}>Today · {name}</span>
            <span style={{ fontSize: 13, color: "rgba(245,241,232,.75)" }}>
              {jobs.length} jobs · {done} done
            </span>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map((j) => {
              const started = j.status !== "scheduled";
              const isDone = j.status === "done";
              const cust = j.customerName ?? "Customer";
              return (
                <article key={j.id} style={{ background: "#fff", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 10, border: `2px solid ${isDone ? "#1F7A5A" : started ? "#D4A637" : "transparent"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>
                      {j.time_window ?? "[ time ]"} · {j.title ?? KIND[j.kind]}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 9px", borderRadius: 999, background: isDone ? "#D9F0E3" : started ? "#FFF1CC" : "#EFEADC", color: isDone ? "#1F7A5A" : started ? "#7A5B00" : "#06382E" }}>
                      {isDone ? "Done" : started ? "On site" : "Scheduled"}
                    </span>
                  </div>
                  <span style={{ fontSize: 13.5, color: "#3A4A44" }}>
                    {cust} · {j.address ?? "[ ADDRESS ]"}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "#5E6E68" }}>{j.ref}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {CHK[j.kind].map((t, i) => (
                      <button key={t} type="button" onClick={() => tick(j, i)} style={{ display: "flex", alignItems: "center", gap: 10, border: 0, background: "transparent", padding: 0, minHeight: 36, fontSize: 14, color: "#06382E", textAlign: "left" }}>
                        <span style={{ flex: "0 0 auto", width: 24, height: 24, borderRadius: 7, border: "2px solid #06382E", background: j.checklist[i] ? "#06382E" : "transparent", color: "#F5F1E8", display: "grid", placeItems: "center", fontSize: 12 }}>{j.checklist[i] ? "✓" : ""}</span>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {j.customerPhone ? (
                      <a href={`tel:${j.customerPhone}`} style={{ minHeight: 46, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", fontWeight: 800, fontSize: 14, display: "grid", placeItems: "center" }}>
                        Call customer
                      </a>
                    ) : (
                      <button type="button" onClick={() => say(`Calling ${cust} · [ CUSTOMER PHONE ]`)} style={{ minHeight: 46, borderRadius: 999, border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", fontWeight: 800, fontSize: 14 }}>
                        Call customer
                      </button>
                    )}
                    <button type="button" onClick={() => go(j)} style={{ minHeight: 46, borderRadius: 999, border: 0, background: isDone ? "#D9F0E3" : "#06382E", color: isDone ? "#1F7A5A" : "#F5F1E8", fontWeight: 800, fontSize: 14 }}>
                      {isDone ? "Completed ✓" : started ? "Complete job" : "Start job"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
      {!isEngineer && (
        <div style={{ flex: "1 1 320px", maxWidth: 520, display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 20 }}>The engineer’s phone view</span>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#3A4A44" }}>
            Engineers see only today’s jobs, the address, the checklist for that job type and a button to call the customer. Completing a job moves the order to “Installed” and sends the customer a review request.
          </p>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>
            PREVIEW AS
            <select
              value={picked}
              onChange={(e) => {
                setPicked(e.target.value);
                load(e.target.value);
              }}
              style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: "10px 12px", fontSize: 14, background: "#fff", color: "#06382E" }}
            >
              {engineers.length ? (
                engineers.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))
              ) : (
                <option>[ ENGINEER 1 ]</option>
              )}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
