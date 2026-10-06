import type { Metadata } from "next";
import { Kicker, PageTitle } from "@/components/ui";
import { PROMISE } from "@/lib/promises";

export const metadata: Metadata = { title: "Our guarantee", description: "What we check, inspect on delivery, 7-day returns, D’Source warranty and manufacturer warranty, in plain words." };

const ROWS: [string, string][] = [
  ["What we check", "Phones: IMEI, battery health, replaced parts. Laptops: battery cycles, screen, keyboard, ports, charger, specs. Networking, servers, storage, printers: genuine unit, serial, manufacturer warranty status, specs, firmware."],
  ["Inspect on delivery", "Check the item at your door. If it fails inspection, we take it back and you pay nothing."],
  ["7-day returns", "Return within 7 days."],
  ["D’Source warranty", PROMISE.warrantyLine],
  ["Manufacturer warranty", "We’re a reseller. Where a device has a manufacturer’s warranty, you claim it directly with the manufacturer or its authorised service centre. Our warranty is separate."],
  ["What isn’t covered", "[ To be confirmed with D’Matek ]"],
  ["If something goes wrong", `Reach a person, ${PROMISE.hours}, by phone or WhatsApp (${PROMISE.phone}), or email ${PROMISE.email}.`],
];

export default function GuaranteePage() {
  return (
    <main style={{ padding: "clamp(18px,3vw,36px) var(--gut) clamp(28px,4vw,48px)", maxWidth: 820 }}>
      <Kicker>THE GUARANTEE</Kicker>
      <PageTitle>Our guarantee, in plain words</PageTitle>
      <p style={{ margin: "0 0 22px", color: "var(--muted)", lineHeight: 1.6 }}>We’re a reseller. We buy from vetted suppliers once you order, check the item, and deliver it. Here is exactly what we promise.</p>
      {ROWS.map(([k, v]) => (
        <div key={k} style={{ borderTop: "1px solid var(--line)", padding: "18px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: "8px 24px" }}>
          <b style={{ fontSize: 17 }}>{k}</b>
          <span style={{ lineHeight: 1.6, fontSize: 15, gridColumn: "span 2" }}>{v}</span>
        </div>
      ))}
    </main>
  );
}
