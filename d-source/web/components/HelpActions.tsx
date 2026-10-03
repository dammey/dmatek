"use client";

import Link from "next/link";
import { useFlow } from "@/lib/flow-context";

type Cta = { label: string; primary: boolean; go: () => void; href?: string };

export default function HelpActions({ topic }: { topic: string }) {
  const { startFlow } = useFlow();

  const ctas: Cta[] =
    topic === "biz"
      ? [
          { label: "Apply for a business account", primary: true, go: () => {}, href: "/account?tab=biz" },
          { label: "Request a quote", primary: false, go: () => startFlow("quote") },
        ]
      : topic === "warranty"
        ? [
            { label: "Book a repair collection", primary: true, go: () => startFlow("enquiry", "Repair — please collect my device: ") },
            { label: "Join the care plan pilot", primary: false, go: () => startFlow("enquiry", "I’d like to talk about joining the device care plan pilot.") },
          ]
        : [
            { label: "Send an enquiry", primary: true, go: () => startFlow("enquiry") },
            { label: "Track an order", primary: false, go: () => {}, href: "/track" },
          ];

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
      {ctas.map((c) =>
        c.href ? (
          <Link
            key={c.label}
            href={c.href}
            style={{
              border: c.primary ? "0" : "1px solid rgba(6,56,46,.25)",
              background: c.primary ? "#06382E" : "#fff",
              color: c.primary ? "#F5F1E8" : "#06382E",
              borderRadius: 999,
              padding: "14px 22px",
              fontWeight: 800,
              fontSize: 14.5,
              whiteSpace: "nowrap",
            }}
          >
            {c.label}
          </Link>
        ) : (
          <button
            key={c.label}
            type="button"
            onClick={c.go}
            style={{
              border: c.primary ? "0" : "1px solid rgba(6,56,46,.25)",
              background: c.primary ? "#06382E" : "#fff",
              color: c.primary ? "#F5F1E8" : "#06382E",
              borderRadius: 999,
              padding: "14px 22px",
              fontWeight: 800,
              fontSize: 14.5,
              whiteSpace: "nowrap",
            }}
          >
            {c.label}
          </button>
        )
      )}
    </div>
  );
}
