import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { pagePad } from "@/lib/styles";
import { PROMISE } from "@/lib/promises";

export const metadata: Metadata = { title: "Help", description: "Delivery, payment, installation, returns, warranty, contact and order tracking." };

const HELP: [string, React.ReactNode][] = [
  ["Delivery", `${PROMISE.delivery}.`],
  ["Payment", <>Pay online, or pay on delivery. Pay on delivery is subject to <Link href="/terms#pay-on-delivery">terms and conditions</Link>.</>],
  ["Installation", "For business equipment, D’Matek engineers install and configure it."],
  ["Returns", `${PROMISE.returnsLong} ${PROMISE.inspectFail.replace("If it fails", "If an item fails")}`],
  ["Warranty", `D’Source warranty: ${PROMISE.warrantyLine} ${PROMISE.manufacturerShort}`],
  [
    "Contact",
    <>
      Phone <a href={`tel:${PROMISE.phone}`}>{PROMISE.phone}</a>, email <a href={`mailto:${PROMISE.email}`}>{PROMISE.email}</a> and <a href={PROMISE.whatsapp}>WhatsApp</a>, {PROMISE.hours}. Personal sourcing requests: reply within 1 hour (8am–8pm). Business requests and quotes: within 24 hours.
    </>,
  ],
  ["Track an order", <>Open <Link href="/track">Tracking</Link> to see Ordered, Sourced, Checked, Out for delivery and Delivered.</>],
];

export default function HelpPage() {
  return (
    <main style={{ ...pagePad, maxWidth: 760 }}>
      <PageTitle>Help</PageTitle>
      {HELP.map(([k, v]) => (
        <details key={k} style={{ borderTop: "1px solid var(--line)", padding: "14px 0" }}>
          <summary style={{ fontWeight: 800, fontSize: 17, cursor: "pointer" }}>{k}</summary>
          <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>{v}</div>
        </details>
      ))}
    </main>
  );
}
