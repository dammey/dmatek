import type { Metadata } from "next";
import { pagePad } from "@/lib/styles";

export const metadata: Metadata = { title: "Terms and conditions" };

const h2: React.CSSProperties = { margin: "0 0 6px", fontSize: 19 };

export default function TermsPage() {
  return (
    <main style={{ ...pagePad, boxSizing: "content-box", maxWidth: 760, display: "flex", flexDirection: "column", gap: 18 }}>
      <h1 style={{ margin: 0, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-.04em", fontWeight: 800 }}>Terms and conditions</h1>
      <section id="manufacturer-warranty">
        <h2 style={h2}>Manufacturer warranty</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          D’Source is a reseller. Where a device carries a manufacturer’s warranty, claiming it is the customer’s responsibility, made directly with the manufacturer or its authorised service centre. D’Source’s own warranty (1 month on new devices, 7 days on used devices) is separate.
        </p>
      </section>
      <section id="pay-on-delivery">
        <h2 style={h2}>Pay on delivery</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "var(--muted)" }}>[ Full terms to be supplied by D’Matek ]</p>
      </section>
      <section id="returns">
        <h2 style={h2}>Returns and inspection</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Inspect the item at your door. If it fails inspection, we take it back and you pay nothing. Returns: 7 days.</p>
      </section>
      <section id="privacy">
        <h2 style={h2}>Privacy and cookies</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "var(--muted)" }}>[ LEGAL TEXT TO BE SUPPLIED BY COUNSEL ]</p>
      </section>
    </main>
  );
}
