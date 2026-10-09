"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type KitItem = { id: string; name: string; note: string | null; price: number | null; pin_x: number; pin_y: number };
type Kit = { id: string; key: string; name: string; store: string; live: boolean; kit_items: KitItem[] };

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [placingItem, setPlacingItem] = useState<string | null>(null);
  const { say } = useToast();

  function load() {
    api.get<{ kits: Kit[] }>("/admin/kits").then(({ kits }) => {
      setKits(kits);
      if (!selected && kits[0]) setSelected(kits[0].id);
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only load on mount; load() reads `selected` to pick a default without re-fetching on every selection change.
  useEffect(load, []);

  const kit = kits.find((k) => k.id === selected);

  async function toggleLive() {
    if (!kit) return;
    await api.patch(`/admin/kits/${kit.id}`, { live: !kit.live });
    load();
  }

  async function placePin(e: React.MouseEvent<HTMLDivElement>) {
    if (!placingItem) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round((100 * (e.clientX - r.left)) / r.width);
    const y = Math.round((100 * (e.clientY - r.top)) / r.height);
    await api.patch(`/admin/kits/items/${placingItem}/pin`, { x, y });
    setPlacingItem(null);
    say("Pin moved");
    load();
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
        <nav style={{ flex: "0 1 240px", minWidth: 200, background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          {kits.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setSelected(k.id)}
              style={{ display: "flex", justifyContent: "space-between", gap: 8, border: 0, borderRadius: 12, padding: "10px 12px", background: k.id === selected ? "#F5F1E8" : "transparent", color: "#06382E", fontWeight: k.id === selected ? 800 : 600, textAlign: "left" }}
            >
              <span>{k.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: k.live ? "#1F7A5A" : "#9AA59F" }}>{k.live ? "LIVE" : "HIDDEN"}</span>
            </button>
          ))}
          {!kits.length && <span style={{ padding: 12, fontSize: 13, color: "#5E6E68" }}>No kits yet.</span>}
        </nav>
        {kit && (
          <section style={{ flex: "1 1 560px", minWidth: 0, background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em" }}>{kit.name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700 }}>
                Live
                <button type="button" onClick={toggleLive} style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: kit.live ? "#1F7A5A" : "#D9D4C8", position: "relative" }}>
                  <span style={{ position: "absolute", top: 4, left: kit.live ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s ease" }} />
                </button>
              </span>
            </div>
            <div onClick={placePin} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 20, background: "#EFEADC", cursor: placingItem ? "crosshair" : "default" }}>
              {kit.kit_items.map((it, i) => (
                <span
                  key={it.id}
                  style={{ position: "absolute", left: `${it.pin_x}%`, top: `${it.pin_y}%`, width: 40, height: 40, margin: "-20px 0 0 -20px", borderRadius: "50%", border: "3px solid #F5F1E8", background: "#D4A637", color: "#06382E", fontWeight: 800, fontSize: 14, display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(0,0,0,.2)" }}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <span style={{ fontSize: 13, color: "#5E6E68" }}>{placingItem ? "Click the photo to place the pin." : "Pick “Move pin” on an item, then click the photo where it goes."}</span>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #EEEAE2" }}>
              {kit.kit_items.map((it, i) => (
                <div key={it.id} style={{ display: "grid", gridTemplateColumns: "30px minmax(0,1fr) auto auto", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#D4A637", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>{i + 1}</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 700 }}>{it.name}</span>
                    <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{it.note}</span>
                  </span>
                  <span style={{ fontWeight: 800 }}>{fmt(it.price)}</span>
                  <button
                    type="button"
                    onClick={() => setPlacingItem(placingItem === it.id ? null : it.id)}
                    style={{ border: `1px solid ${placingItem === it.id ? "#06382E" : "rgba(6,56,46,.2)"}`, background: placingItem === it.id ? "#06382E" : "#fff", color: placingItem === it.id ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "7px 12px", fontSize: 12.5, fontWeight: 800 }}
                  >
                    {placingItem === it.id ? "Click the photo…" : "Move pin"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
