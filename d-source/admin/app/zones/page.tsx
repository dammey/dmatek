"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Zone = { id: string; name: string; fee: number | null; delivery_time: string | null; pay_on_delivery: boolean; installation_available: boolean; _new?: boolean; _gone?: boolean };
const COLS = "minmax(160px,1fr) 150px minmax(180px,1fr) 120px 120px 50px";
const input: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: "10px 12px", fontSize: 14, background: "#fff", color: "#06382E" };

function Toggle({ on, go, label }: { on: boolean; go: () => void; label: string }) {
  return (
    <button type="button" onClick={go} aria-label={label} style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: on ? "#1F7A5A" : "#D9D4C8", position: "relative", padding: 0, flex: "0 0 auto" }}>
      <span style={{ position: "absolute", top: 4, left: on ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s ease" }} />
    </button>
  );
}

/** Delivery zones publish to checkout: fee, time, pay on delivery and installation by zone. */
export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ zones: Zone[] }>("/admin/zones").then(({ zones }) => setZones(zones));
  }
  useEffect(load, []);

  const up = (id: string, patch: Partial<Zone>) => setZones((zs) => zs.map((z) => (z.id === id ? { ...z, ...patch } : z)));

  async function save() {
    for (const z of zones) {
      if (z._gone) {
        if (!z._new) await api.delete(`/admin/zones/${z.id}`);
        continue;
      }
      let id = z.id;
      if (z._new) id = (await api.post<{ zone: { id: string } }>("/admin/zones", {})).zone.id;
      await api.patch(`/admin/zones/${id}`, { name: z.name, fee: z.fee, deliveryTime: z.delivery_time, payOnDelivery: z.pay_on_delivery, installationAvailable: z.installation_available });
    }
    say("Delivery zones published");
    load();
  }

  return (
    <>
      <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
        <div style={{ minWidth: 860 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
            <span>ZONE</span>
            <span>FEE (₦)</span>
            <span>DELIVERY TIME</span>
            <span>PAY ON DELIVERY</span>
            <span>INSTALLATION</span>
            <span />
          </div>
          {zones
            .filter((z) => !z._gone)
            .map((z) => (
              <div key={z.id} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "10px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                <input value={z.name} onChange={(e) => up(z.id, { name: e.target.value })} style={{ ...input, fontWeight: 700 }} />
                <input
                  value={z.fee != null ? z.fee.toLocaleString("en-NG") : ""}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d]/g, "");
                    up(z.id, { fee: v ? Number(v) : null });
                  }}
                  placeholder="[ FEE ]"
                  inputMode="numeric"
                  style={input}
                />
                <input value={z.delivery_time ?? ""} onChange={(e) => up(z.id, { delivery_time: e.target.value })} placeholder="e.g. 1–2 working days" style={input} />
                <Toggle on={z.pay_on_delivery} go={() => up(z.id, { pay_on_delivery: !z.pay_on_delivery })} label={`Pay on delivery · ${z.name}`} />
                <Toggle on={z.installation_available} go={() => up(z.id, { installation_available: !z.installation_available })} label={`Installation · ${z.name}`} />
                <button type="button" onClick={() => up(z.id, { _gone: true })} aria-label="Remove zone" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(6,56,46,.18)", background: "#fff", color: "#06382E" }}>
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setZones((zs) => [...zs, { id: `new-${Date.now()}`, name: "New zone", fee: null, delivery_time: "", pay_on_delivery: false, installation_available: false, _new: true }])}
          style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "12px 20px", fontWeight: 800, fontSize: 14 }}
        >
          Add zone
        </button>
        <button type="button" onClick={save} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "12px 20px", fontWeight: 800, fontSize: 14 }}>
          Save and publish
        </button>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: "#5E6E68" }}>Checkout picks the zone from the delivery address and shows its fee before payment. Pay on delivery only appears where it’s switched on.</p>
    </>
  );
}
