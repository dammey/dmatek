"use client";

import Link from "next/link";
import { useFlow } from "@/lib/flow-context";

export default function HelpActions({ topic }: { topic: string }) {
  const { startFlow } = useFlow();
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
      {topic === "biz" ? (
        <Link href="/account?tab=biz" style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "13px 22px", fontWeight: 800 }}>
          Apply for a business account
        </Link>
      ) : topic === "warranty" ? (
        <button type="button" onClick={() => startFlow("enquiry", "Repair — please collect my device: ")} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "13px 22px", fontWeight: 800 }}>
          Book a repair collection
        </button>
      ) : (
        <button type="button" onClick={() => startFlow("enquiry")} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "13px 22px", fontWeight: 800 }}>
          Send an enquiry
        </button>
      )}
      <Link href="/track" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 999, padding: "12px 20px", fontWeight: 700 }}>
        Track an order
      </Link>
    </div>
  );
}
