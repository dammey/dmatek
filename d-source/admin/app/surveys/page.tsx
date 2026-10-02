"use client";

import { useEffect, useState } from "react";
import { PageHeader, Row, Table, btnGhost } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const STAGES = ["Requested", "Date confirmed", "Surveyed", "Quote sent"];

type Survey = { ref: string; organisation: string | null; site_type: string | null; address: string; stage: string; staff?: { name: string } };

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ surveys: Survey[] }>("/admin/surveys").then(({ surveys }) => setSurveys(surveys));
  }
  useEffect(load, []);

  async function advance(ref: string) {
    await api.patch(`/admin/surveys/${ref}/advance`);
    say("Moved to next stage");
    load();
  }

  return (
    <div>
      <PageHeader title="Site surveys" subtitle="Free site surveys booked from the storefront" />
      <Table cols="110px minmax(160px,1fr) 130px minmax(160px,1fr) 130px" head={["REFERENCE", "ORGANISATION", "SITE", "ADDRESS", "STATUS"]} minWidth="900px">
        {surveys.map((s) => {
          const idx = STAGES.findIndex((x) => x.toLowerCase().replace(" ", "_") === s.stage);
          return (
            <Row key={s.ref} cols="110px minmax(160px,1fr) 130px minmax(160px,1fr) 130px">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{s.ref}</span>
              <span style={{ fontWeight: 700 }}>{s.organisation}</span>
              <span style={{ color: "#3A4A44" }}>{s.site_type}</span>
              <span style={{ color: "#3A4A44" }}>{s.address}</span>
              <button type="button" onClick={() => advance(s.ref)} disabled={idx === STAGES.length - 1} style={btnGhost}>
                {STAGES[idx] ?? s.stage} →
              </button>
            </Row>
          );
        })}
        {!surveys.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>Nothing here yet.</div>}
      </Table>
    </div>
  );
}
