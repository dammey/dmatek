"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/ui";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Review = { id: string; stars: number; title: string | null; body: string; reviewer_name: string | null; created_at: string; state: "pending" | "approved" | "rejected"; products?: { name: string } | null; orders?: { ref: string } | null };
const TABS: [Review["state"], string][] = [["pending", "To check"], ["approved", "Approved"], ["rejected", "Rejected"]];

export default function ReviewsPage() {
  const [all, setAll] = useState<Review[]>([]);
  const [tab, setTab] = useState<Review["state"]>("pending");
  const { say } = useToast();

  function load() {
    api.get<{ reviews: Review[] }>("/admin/reviews").then(({ reviews }) => setAll(reviews));
  }
  useEffect(load, []);

  async function act(r: Review, action: "approve" | "reject") {
    setAll((l) => l.map((x) => (x.id === r.id ? { ...x, state: action === "approve" ? "approved" : "rejected" } : x)));
    await api.patch(`/admin/reviews/${r.id}/${action}`);
    say(action === "approve" ? "Review approved and published" : "Review rejected");
  }

  const rows = all.filter((r) => r.state === tab);
  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {TABS.map(([id, l]) => (
          <Chip key={id} label={`${l} (${all.filter((r) => r.state === id).length})`} active={tab === id} onClick={() => setTab(id)} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,360px),1fr))", gap: 12 }}>
        {rows.map((r) => (
          <article key={r.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 15.5 }}>{r.products?.name ?? "[ PRODUCT ]"}</span>
              <span style={{ color: "#D4A637", letterSpacing: 2 }}>{"★".repeat(r.stars) + "☆".repeat(5 - r.stars)}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{r.title}</span>
            <span style={{ fontSize: 14.5, lineHeight: 1.55, color: "#3A4A44" }}>{r.body}</span>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap", fontSize: 12.5, color: "#5E6E68" }}>
              <span>
                {r.reviewer_name ?? "[ NAME ]"} · {shortDate(r.created_at)}
              </span>
              <span style={{ fontWeight: 800, color: r.orders?.ref ? "#1F7A5A" : "#B42318" }}>{r.orders?.ref ? `Verified purchase · ${r.orders.ref}` : "No matching order"}</span>
            </div>
            {r.state === "pending" && (
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button type="button" onClick={() => act(r, "approve")} style={{ flex: 1, border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: 11, fontWeight: 800, fontSize: 13.5 }}>
                  Approve
                </button>
                <button type="button" onClick={() => act(r, "reject")} style={{ flex: 1, border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: 10, fontWeight: 700, fontSize: 13.5 }}>
                  Reject
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {!rows.length && <div style={{ background: "#fff", borderRadius: 20, padding: 24, color: "#5E6E68" }}>Nothing here.</div>}
    </>
  );
}
