"use client";

import { useEffect, useState } from "react";
import { PageHeader, Row, Table, btnGhost } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const STAGES = ["Requested", "Collected", "Diagnosing", "Fixing", "Ready", "Returned"];

type Repair = { ref: string; device_desc: string; kind: string; how: string | null; stage: string; customers?: { full_name: string } };

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ repairs: Repair[] }>("/admin/repairs").then(({ repairs }) => setRepairs(repairs));
  }
  useEffect(load, []);

  async function advance(ref: string) {
    await api.patch(`/admin/repairs/${ref}/advance`);
    say("Moved to next stage");
    load();
  }

  return (
    <div>
      <PageHeader title="Returns and repairs" subtitle="From collection to returned" />
      <Table cols="100px minmax(140px,1fr) minmax(200px,1.4fr) 90px 110px 130px" head={["REF", "CUSTOMER", "DEVICE AND FAULT", "TYPE", "HOW", "STAGE"]} minWidth="960px">
        {repairs.map((r) => {
          const idx = STAGES.findIndex((s) => s.toLowerCase() === r.stage);
          return (
            <Row key={r.ref} cols="100px minmax(140px,1fr) minmax(200px,1.4fr) 90px 110px 130px">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{r.ref}</span>
              <span style={{ fontWeight: 700 }}>{r.customers?.full_name}</span>
              <span style={{ color: "#3A4A44" }}>{r.device_desc}</span>
              <span>{r.kind}</span>
              <span>{r.how}</span>
              <button type="button" onClick={() => advance(r.ref)} disabled={idx === STAGES.length - 1} style={btnGhost}>
                {STAGES[idx] ?? r.stage} →
              </button>
            </Row>
          );
        })}
        {!repairs.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>Nothing here yet.</div>}
      </Table>
    </div>
  );
}
