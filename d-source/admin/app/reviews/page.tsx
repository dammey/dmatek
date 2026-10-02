"use client";

import { useEffect, useState } from "react";
import { Chip, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Review = { id: string; stars: number; title: string | null; body: string; reviewer_name: string | null; created_at: string; state: string; products?: { name: string }; orders?: { ref: string } };

export default function ReviewsPage() {
  const [state, setState] = useState("pending");
  const [reviews, setReviews] = useState<Review[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ reviews: Review[] }>(`/admin/reviews?state=${state}`).then(({ reviews }) => setReviews(reviews));
  }
  useEffect(load, [state]);

  async function act(id: string, action: "approve" | "reject") {
    await api.patch(`/admin/reviews/${id}/${action}`);
    say(action === "approve" ? "Review approved and published" : "Review rejected");
    load();
  }

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Check each review against a real purchase" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["pending", "approved", "rejected"].map((s) => (
          <Chip key={s} label={s === "pending" ? "To check" : s} active={state === s} onClick={() => setState(s)} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,360px),1fr))", gap: 12 }}>
        {reviews.map((r) => (
          <article key={r.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 15.5 }}>{r.products?.name}</span>
              <span style={{ color: "#D4A637", letterSpacing: 2 }}>{"★".repeat(r.stars)}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{r.title}</span>
            <span style={{ fontSize: 14.5, lineHeight: 1.55, color: "#3A4A44" }}>{r.body}</span>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12.5, color: "#5E6E68" }}>
              <span>{r.reviewer_name}</span>
              <span style={{ fontWeight: 800, color: r.orders ? "#1F7A5A" : "#B42318" }}>{r.orders ? `Verified · ${r.orders.ref}` : "No matching order"}</span>
            </div>
            {r.state === "pending" && (
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button type="button" onClick={() => act(r.id, "approve")} style={{ flex: 1, border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: 11, fontWeight: 800, fontSize: 13.5 }}>
                  Approve
                </button>
                <button type="button" onClick={() => act(r.id, "reject")} style={{ flex: 1, border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: 10, fontWeight: 700, fontSize: 13.5 }}>
                  Reject
                </button>
              </div>
            )}
          </article>
        ))}
        {!reviews.length && <div style={{ background: "#fff", borderRadius: 20, padding: 24, color: "#5E6E68" }}>Nothing here.</div>}
      </div>
    </div>
  );
}
