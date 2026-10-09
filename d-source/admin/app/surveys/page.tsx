"use client";

import { useEffect, useState } from "react";
import { Row, Table, btnGhost, inputStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const STAGES = ["Requested", "Date confirmed", "Surveyed", "Quote sent"];

type Survey = { ref: string; organisation: string | null; site_type: string | null; address: string; stage: string; engineer_staff_id: string | null; staff?: { name: string } };
type StaffMember = { id: string; name: string; role: string };

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [engineers, setEngineers] = useState<StaffMember[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ surveys: Survey[] }>("/admin/surveys").then(({ surveys }) => setSurveys(surveys));
  }
  useEffect(load, []);
  useEffect(() => {
    api.get<{ staff: StaffMember[] }>("/admin/staff").then(({ staff }) => setEngineers(staff.filter((s) => s.role === "Engineer")));
  }, []);

  async function advance(ref: string) {
    await api.patch(`/admin/surveys/${ref}/advance`);
    say("Moved to next stage");
    load();
  }

  async function assign(ref: string, engineerStaffId: string) {
    if (!engineerStaffId) return;
    await api.patch(`/admin/surveys/${ref}/assign`, { engineerStaffId });
    say("Engineer assigned");
    load();
  }

  return (
    <div>
      <Table cols="110px minmax(140px,1fr) 120px minmax(140px,1fr) 150px 130px" head={["REFERENCE", "ORGANISATION", "SITE", "ADDRESS", "ENGINEER", "STATUS"]} minWidth="1060px">
        {surveys.map((s) => {
          const idx = STAGES.findIndex((x) => x.toLowerCase().replace(" ", "_") === s.stage);
          return (
            <Row key={s.ref} cols="110px minmax(140px,1fr) 120px minmax(140px,1fr) 150px 130px">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{s.ref}</span>
              <span style={{ fontWeight: 700 }}>{s.organisation}</span>
              <span style={{ color: "#3A4A44" }}>{s.site_type}</span>
              <span style={{ color: "#3A4A44" }}>{s.address}</span>
              <select value={s.engineer_staff_id ?? ""} onChange={(e) => assign(s.ref, e.target.value)} style={{ ...inputStyle, padding: "8px 10px", fontSize: 13 }}>
                <option value="">Unassigned</option>
                {engineers.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
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
