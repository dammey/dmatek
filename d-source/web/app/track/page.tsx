"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { fmt } from "@/lib/format";

const STEPS = ["Order received", "Confirmed by phone", "Packed", "Out for delivery", "Delivered", "Installed"];

type Order = { ref: string; status: string; placed_at: string; channel: string; total: number; stageIndex: number };

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackPageInner />
    </Suspense>
  );
}

function TrackPageInner() {
  const params = useSearchParams();
  const [refInput, setRefInput] = useState(params.get("ref") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function lookup(ref: string) {
    if (!ref.trim()) return;
    try {
      const { order } = await api.get<{ order: Order }>(`/track/${ref.trim().toUpperCase()}`);
      setOrder(order);
      setError("");
    } catch (e) {
      setOrder(null);
      setError(e instanceof ApiError ? e.message : "Something went wrong");
    }
  }

  useEffect(() => {
    const initialRef = params.get("ref");
    // lookup is async — the eventual setState happens after the awaited
    // fetch resolves, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialRef) void lookup(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)" }}>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px,4.4vw,52px)", letterSpacing: "-0.04em", marginBottom: 20 }}>Track an order</h1>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="DS-XXXXXX"
            style={{ flex: 1, border: "1px solid rgba(6,56,46,.2)", borderRadius: 999, padding: "14px 20px", fontSize: 15 }}
          />
          <button type="button" onClick={() => lookup(refInput)} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "0 24px", fontWeight: 800 }}>
            Track
          </button>
        </div>
        {error && <p style={{ color: "#B42318" }}>{error}</p>}
        {order && (
          <div style={{ background: "#EFEADC", borderRadius: 20, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--font-mono)" }}>{order.ref}</span>
              <span style={{ fontWeight: 800 }}>{fmt(order.total)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i <= order.stageIndex ? 1 : 0.4 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: i <= order.stageIndex ? "#D4A637" : "#D9D4C8" }} />
                  <span style={{ fontWeight: i === order.stageIndex ? 800 : 600 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
