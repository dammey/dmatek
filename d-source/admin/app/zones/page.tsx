"use client";

import { useEffect, useState } from "react";
import { PageHeader, btnGhost, btnPrimary, inputStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Zone = { id: string; name: string; fee: number | null; delivery_time: string | null; pay_on_delivery: boolean; installation_available: boolean };

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ zones: Zone[] }>("/admin/zones").then(({ zones }) => setZones(zones));
  }
  useEffect(load, []);

  function patchLocal(id: string, patch: Partial<Zone>) {
    setZones((zs) => zs.map((z) => (z.id === id ? { ...z, ...patch } : z)));
  }

  async function save(z: Zone) {
    await api.patch(`/admin/zones/${z.id}`, { name: z.name, fee: z.fee, deliveryTime: z.delivery_time, payOnDelivery: z.pay_on_delivery, installationAvailable: z.installation_available });
  }

  async function addZone() {
    await api.post("/admin/zones", {});
    load();
  }

  async function remove(id: string) {
    await api.delete(`/admin/zones/${id}`);
    load();
  }

  return (
    <div>
      <PageHeader title="Delivery zones" subtitle="Fees, times and pay on delivery by zone" />
      <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
        <div style={{ minWidth: 900 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(160px,1fr) 140px minmax(180px,1fr) 110px 110px 50px", gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
            <span>ZONE</span>
            <span>FEE (₦)</span>
            <span>DELIVERY TIME</span>
            <span>POD</span>
            <span>INSTALL</span>
            <span />
          </div>
          {zones.map((z) => (
            <div key={z.id} style={{ display: "grid", gridTemplateColumns: "minmax(160px,1fr) 140px minmax(180px,1fr) 110px 110px 50px", gap: 12, padding: "10px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9" }}>
              <input value={z.name} onChange={(e) => patchLocal(z.id, { name: e.target.value })} onBlur={() => save(z)} style={{ ...inputStyle, fontWeight: 700 }} />
              <input value={z.fee ?? ""} onChange={(e) => patchLocal(z.id, { fee: Number(e.target.value.replace(/\D/g, "")) || null })} onBlur={() => save(z)} placeholder="[ FEE ]" inputMode="numeric" style={inputStyle} />
              <input value={z.delivery_time ?? ""} onChange={(e) => patchLocal(z.id, { delivery_time: e.target.value })} onBlur={() => save(z)} placeholder="e.g. 1–2 working days" style={inputStyle} />
              <button
                type="button"
                onClick={() => {
                  patchLocal(z.id, { pay_on_delivery: !z.pay_on_delivery });
                  save({ ...z, pay_on_delivery: !z.pay_on_delivery });
                }}
                style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: z.pay_on_delivery ? "#1F7A5A" : "#D9D4C8", position: "relative" }}
              >
                <span style={{ position: "absolute", top: 4, left: z.pay_on_delivery ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
              </button>
              <button
                type="button"
                onClick={() => {
                  patchLocal(z.id, { installation_available: !z.installation_available });
                  save({ ...z, installation_available: !z.installation_available });
                }}
                style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: z.installation_available ? "#1F7A5A" : "#D9D4C8", position: "relative" }}
              >
                <span style={{ position: "absolute", top: 4, left: z.installation_available ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
              </button>
              <button type="button" onClick={() => remove(z.id)} aria-label="Remove zone" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(6,56,46,.18)", background: "#fff" }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button type="button" onClick={addZone} style={btnGhost}>
          Add zone
        </button>
        <button type="button" onClick={() => say("Zones saved")} style={btnPrimary}>
          Save and publish
        </button>
      </div>
    </div>
  );
}
