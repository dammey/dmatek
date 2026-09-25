"use client";

import { useState } from "react";

const PROBLEMS = [
  {
    text: "A core process still runs on paper and three spreadsheets.",
    plan: [
      { step: "01 DIAGNOSE", title: "Map the paperwork", body: "Who touches each sheet, and when." },
      { step: "02 BUILD", title: "One web app", body: "Roles, approvals and an audit trail." },
      { step: "03 SHIP", title: "Pilot with one team", body: "Rollout after two weeks of real use." },
      { step: "04 RUN", title: "Hosted and supported", body: "On D’Matek Cloud, backed up." },
    ],
  },
  {
    text: "Two systems we rely on refuse to talk to each other.",
    plan: [
      { step: "01 DIAGNOSE", title: "Map the re-keying", body: "Who copies what between systems." },
      { step: "02 BUILD", title: "One integration", body: "Data moves once, validated." },
      { step: "03 SHIP", title: "Shadow mode", body: "Runs beside the manual process until it matches." },
      { step: "04 RUN", title: "Monitored", body: "Failures alert a person, not a log file." },
    ],
  },
  {
    text: "We have an idea that needs to become a real product.",
    plan: [
      { step: "01 DIAGNOSE", title: "Find the core", body: "Who pays, for what, and how often." },
      { step: "02 BUILD", title: "The first version", body: "Web and mobile, payments, admin." },
      { step: "03 SHIP", title: "First customers", body: "Measure, fix, repeat." },
      { step: "04 GROW", title: "Into a product", body: "Project, then reusable solution, then product." },
    ],
  },
];

export default function ProblemFix() {
  const [p, setP] = useState(0);

  return (
    <section data-screen-label="Problem → fix" style={{ background: "#06382E", color: "#F5F1E8", padding: "clamp(24px,4vh,48px) clamp(18px,3vw,40px) clamp(72px,12vh,140px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
          <h2 data-rv="rise" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px,7vw,120px)", lineHeight: 0.9, letterSpacing: "-.055em", maxWidth: "12ch" }}>
            Pick the one that <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#D4A637" }}>sounds like you.</span>
          </h2>
          <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#A9BBB3" }}>01 &middot; PROBLEM &rarr; FIX</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PROBLEMS.map((x, i) => {
            const on = i === p;
            return (
              <div key={i} data-rv="pill">
                <button
                  onClick={() => setP(i)}
                  className="df-problem-btn"
                  style={{
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    borderRadius: 999,
                    padding: "clamp(16px,2.4vh,26px) clamp(20px,3vw,40px)",
                    border: `2px solid ${on ? "#D4A637" : "#28705A"}`,
                    background: on ? "#D4A637" : "transparent",
                    color: on ? "#06382E" : "#F5F1E8",
                    fontWeight: 700,
                    fontSize: "clamp(18px,2.2vw,34px)",
                    letterSpacing: "-.03em",
                    lineHeight: 1.15,
                    transition: "background .35s,color .35s,border-color .35s",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 13, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ flex: 1 }}>{x.text}</span>
                  <span style={{ fontSize: ".9em" }}>{on ? "●" : "○"}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ background: "#F5F1E8", color: "#06382E", borderRadius: 28, padding: "clamp(24px,4vw,48px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "clamp(20px,3vw,40px)" }}>
          {PROBLEMS[p].plan.map((st, i) => (
            <div key={i} data-rv="up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ alignSelf: "flex-start", background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "6px 12px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, fontWeight: 600 }}>{st.step}</span>
              <span style={{ fontWeight: 800, fontSize: "clamp(22px,2vw,30px)", letterSpacing: "-.035em", lineHeight: 1.05 }}>{st.title}</span>
              <span style={{ fontSize: 16, lineHeight: 1.5, color: "#28705A" }}>{st.body}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .df-problem-btn:hover {
          border-color: #d4a637;
        }
      `}</style>
    </section>
  );
}
