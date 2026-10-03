"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useFlow } from "@/lib/flow-context";
import { fmt } from "@/lib/format";

const STEPS: [string, string][] = [
  ["Order received", "We have your order."],
  ["Confirmed by phone", "We call to confirm delivery and set-up."],
  ["Packed", "Checked and packed."],
  ["Out for delivery", "On its way to you."],
  ["Delivered", "Signed for."],
  ["Installed", "Set up by D’Matek engineers, where booked."],
];

type Order = { ref: string; status: string; placed_at: string; channel: string; total: number; stageIndex: number; order_lines: { quantity: number }[] };
type RecentOrder = { ref: string };

function nItems(n: number) {
  return `${n} ${n === 1 ? "item" : "items"}`;
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackPageInner />
    </Suspense>
  );
}

function TrackPageInner() {
  const params = useSearchParams();
  const { signedIn } = useAuth();
  const { startFlow } = useFlow();
  const [refInput, setRefInput] = useState(params.get("ref") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  async function lookup(ref: string) {
    if (!ref.trim()) return;
    try {
      const { order } = await api.get<{ order: Order }>(`/track/${ref.trim().toUpperCase()}`);
      setOrder(order);
    } catch {
      setOrder(null);
    }
    setSearched(true);
  }

  useEffect(() => {
    const initialRef = params.get("ref");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialRef) void lookup(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    api
      .get<{ orders: { ref: string }[] }>("/account/orders")
      .then(({ orders }) => setRecent(orders.slice(0, 4)))
      .catch(() => setRecent([]));
  }, [signedIn]);

  const trackFound = searched && !!order;
  const trackMissing = searched && !order;

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D’Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>›</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>Track an order</span>
      </div>
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <h1 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>Track an order</h1>
        <p style={{ margin: "0 0 24px", fontSize: 17, lineHeight: 1.6, color: "#3A4A44" }}>Enter the reference from your order confirmation. It starts with DS-.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 620 }}>
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") lookup(refInput);
            }}
            placeholder="DS-XXXXXX"
            style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 14, padding: 14, fontSize: 15, background: "#fff", color: "#06382E", flex: "1 1 260px", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
          />
          <button type="button" onClick={() => lookup(refInput)} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 24px", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}>
            Find order
          </button>
        </div>

        {recent.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#5E6E68" }}>Your recent orders:</span>
            {recent.map((o) => (
              <button
                key={o.ref}
                type="button"
                onClick={() => {
                  setRefInput(o.ref);
                  lookup(o.ref);
                }}
                style={{ border: "1px solid #E6E2D8", background: "#fff", color: "#06382E", borderRadius: 4, padding: "7px 11px", fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}
              >
                {o.ref}
              </button>
            ))}
          </div>
        )}

        {trackFound && order && (
          <div style={{ marginTop: 32, border: "1px solid #EEEAE2", borderRadius: 24, padding: "clamp(20px,3vw,32px)", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.1em" }}>{order.ref}</span>
                <span style={{ fontSize: 14, color: "#5E6E68" }}>
                  Placed {new Date(order.placed_at).toLocaleDateString("en-NG")} · {nItems(order.order_lines.reduce((a, l) => a + l.quantity, 0))}
                </span>
              </span>
              <span style={{ fontWeight: 800, fontSize: 22 }}>{fmt(order.total)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STEPS.map(([stepLabel, note], i) => {
                const done = i < order.stageIndex;
                const cur = i === order.stageIndex - 1;
                const dot = done ? "#D4A637" : "#fff";
                const ring = done ? "#D4A637" : "#D9D4C8";
                const line = i === STEPS.length - 1 ? "transparent" : i < order.stageIndex - 1 ? "#D4A637" : "#EEEAE2";
                const fw = cur ? 800 : 600;
                const ink = done ? "#06382E" : "#9AA59F";
                return (
                  <div key={stepLabel} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr)", gap: 14, alignItems: "start" }}>
                    <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: dot, border: `2px solid ${ring}` }} />
                      <span style={{ width: 2, height: 34, background: line }} />
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontWeight: fw, fontSize: 15.5, color: ink }}>{stepLabel}</span>
                      <span style={{ fontSize: 13, color: "#5E6E68" }}>{note}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: 13, color: "#5E6E68" }}>[ LIVE STATUS CONNECTS TO THE ORDER SYSTEM ]</span>
          </div>
        )}

        {trackMissing && (
          <div style={{ marginTop: 28, background: "#F6F4EF", borderRadius: 20, padding: 22, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontWeight: 800, fontSize: 19 }}>We couldn’t find that reference.</span>
            <span style={{ fontSize: 15, lineHeight: 1.6, color: "#3A4A44" }}>Check the reference in your confirmation, or ask us and we’ll look it up.</span>
            <button
              type="button"
              onClick={() => startFlow("enquiry")}
              style={{ background: "#fff", color: "#06382E", border: "1px solid rgba(6,56,46,.25)", borderRadius: 999, padding: "14px 22px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}
            >
              Ask about my order
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
