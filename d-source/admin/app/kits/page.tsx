"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type KitItem = { id: string; name: string; note: string | null; price: number | null; pin_x: number; pin_y: number; sort_order?: number };
type Kit = { id: string; key: string; name: string; store: string; live: boolean; photo_ref?: string | null; kit_items: KitItem[] };

/** Kit pin editor: pick "Move pin", then click the room photo where it goes.
 * Pins, live state and the room photo publish to the storefront kits. */
export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [pin, setPin] = useState<number | null>(null);
  const { say } = useToast();

  function load() {
    api.get<{ kits: Kit[] }>("/admin/kits").then(({ kits }) => {
      setKits(kits.map((k) => ({ ...k, kit_items: [...k.kit_items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) })));
      setSel((s) => s ?? kits[0]?.id ?? null);
    });
  }
  useEffect(load, []);

  const kit = kits.find((k) => k.id === sel);

  async function toggleLive() {
    if (!kit) return;
    setKits((ks) => ks.map((k) => (k.id === kit.id ? { ...k, live: !k.live } : k)));
    await api.patch(`/admin/kits/${kit.id}`, { live: !kit.live });
  }

  async function place(e: React.MouseEvent<HTMLDivElement>) {
    if (!kit || pin == null) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round((100 * (e.clientX - r.left)) / r.width);
    const y = Math.round((100 * (e.clientY - r.top)) / r.height);
    const it = kit.kit_items[pin];
    const pi = pin;
    setPin(null);
    setKits((ks) => ks.map((k) => (k.id === kit.id ? { ...k, kit_items: k.kit_items.map((x2, j) => (j === pi ? { ...x2, pin_x: x, pin_y: y } : x2)) } : k)));
    await api.patch(`/admin/kits/items/${it.id}/pin`, { x, y });
    say(`Pin ${pi + 1} moved`);
  }

  async function photo(f: File) {
    if (!kit) return;
    const { url } = await api.upload<{ url: string }>(`/admin/kits/${kit.id}/photo`, f);
    setKits((ks) => ks.map((k) => (k.id === kit.id ? { ...k, photo_ref: url } : k)));
    say("Room photo saved");
  }

  const total = kit ? kit.kit_items.reduce((a, x) => a + (x.price ?? 0), 0) : 0;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
      <nav style={{ flex: "0 1 240px", minWidth: 200, background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        {kits.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => {
              setSel(k.id);
              setPin(null);
            }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, border: 0, borderRadius: 12, padding: "10px 12px", background: k.id === sel ? "#F5F1E8" : "transparent", color: "#06382E", fontSize: 14, fontWeight: k.id === sel ? 800 : 600, textAlign: "left" }}
          >
            <span>{k.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: k.live ? "#1F7A5A" : "#9AA59F" }}>{k.live ? "LIVE" : "HIDDEN"}</span>
          </button>
        ))}
      </nav>
      {kit && (
        <section style={{ flex: "1 1 560px", minWidth: 0, background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-.03em" }}>{kit.name}</span>
              <span style={{ fontSize: 13, color: "#5E6E68" }}>
                {kit.store === "emporium" ? "D’Emporium" : "D’Provision"} · {fmt(total)}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700 }}>
              Live
              <button type="button" onClick={toggleLive} aria-label="Toggle live" style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: kit.live ? "#1F7A5A" : "#D9D4C8", position: "relative", padding: 0, flex: "0 0 auto" }}>
                <span style={{ position: "absolute", top: 4, left: kit.live ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s ease" }} />
              </button>
            </span>
          </div>
          <div onClick={place} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 20, overflow: "hidden", background: "#EFEADC", cursor: "crosshair" }}>
            {kit.photo_ref ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={kit.photo_ref} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <label onClick={(e) => pin != null && e.preventDefault()} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, border: "1px dashed rgba(6,56,46,.3)", borderRadius: 20, fontSize: 13, fontWeight: 600, color: "#5E6E68", cursor: pin != null ? "crosshair" : "pointer" }}>
                Drop the room photo for this kit
                <input type="file" accept="image/jpeg,image/png,image/webp" disabled={pin != null} onChange={(e) => e.target.files?.[0] && photo(e.target.files[0])} style={{ display: "none" }} />
              </label>
            )}
            {kit.kit_items.map((it, j) => (
              <span
                key={it.id}
                style={{ position: "absolute", left: `${it.pin_x}%`, top: `${it.pin_y}%`, width: 40, height: 40, margin: "-20px 0 0 -20px", borderRadius: "50%", border: `3px solid ${pin === j ? "#06382E" : "#F5F1E8"}`, background: pin === j ? "#A6F000" : "#D4A637", color: "#06382E", fontWeight: 800, fontSize: 14, display: "grid", placeItems: "center", zIndex: 2, pointerEvents: "none", boxShadow: "0 6px 16px rgba(0,0,0,.2)" }}
              >
                {j + 1}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 13, color: "#5E6E68" }}>{pin == null ? "Pick “Move pin” on an item, then click the photo where it goes." : `Click the photo to place pin ${pin + 1}.`}</span>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #EEEAE2" }}>
            {kit.kit_items.map((it, j) => (
              <div key={it.id} style={{ display: "grid", gridTemplateColumns: "30px minmax(0,1fr) auto auto", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#D4A637", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>{j + 1}</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 700 }}>{it.name}</span>
                  <span style={{ fontSize: 12.5, color: "#5E6E68" }}>
                    {it.note} · pin {it.pin_x}%, {it.pin_y}%
                  </span>
                </span>
                <span style={{ fontWeight: 800 }}>{it.price ? fmt(it.price) : "Quoted"}</span>
                <button
                  type="button"
                  onClick={() => setPin(pin === j ? null : j)}
                  style={{ border: `1px solid ${pin === j ? "#06382E" : "rgba(6,56,46,.2)"}`, background: pin === j ? "#06382E" : "#fff", color: pin === j ? "#F5F1E8" : "#06382E", borderRadius: 999, padding: "7px 12px", fontSize: 12.5, fontWeight: 800, whiteSpace: "nowrap" }}
                >
                  {pin === j ? "Click the photo…" : "Move pin"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
