"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import Receipt, { type ReceiptLine } from "@/components/Receipt";
import { Kicker, PageTitle, STAGES, TrackingStages, btn, field, pagePad } from "@/components/ui";
import { api } from "@/lib/api";

type Tracked = { ref: string; placed_at: string; status: string; stageIndex: number; check_battery?: string | null; check_imei?: string | null; check_condition?: string | null; check_media?: string | null; order_lines: (ReceiptLine & { used: boolean })[] };

function TrackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const ref = (params.get("ref") ?? "").toUpperCase();
  const [input, setInput] = useState(ref);
  const [res, setRes] = useState<{ ref: string; order: Tracked | null; error: string } | null>(null);

  useEffect(() => {
    if (!ref) return;
    api
      .get<{ order: Tracked }>(`/track/${encodeURIComponent(ref)}`)
      .then(({ order }) => setRes({ ref, order, error: "" }))
      .catch((e) => setRes({ ref, order: null, error: e instanceof Error ? e.message : "No order with that reference" }));
  }, [ref]);

  const r = res?.ref === ref ? res : null;
  const order = r?.order ?? null;
  const stage = order?.stageIndex ?? -1;
  const date = order ? new Date(order.placed_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : undefined;

  return (
    <main style={pagePad}>
      <Kicker>TRACKING</Kicker>
      <PageTitle>Order {order?.ref ?? (ref || "DS-[ number ]")}</PageTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) router.replace(`/track?ref=${encodeURIComponent(input.trim().toUpperCase())}`);
        }}
        style={{ display: "flex", gap: 8, maxWidth: 520, margin: "0 0 18px" }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="DS-XXXXXX" aria-label="Order reference" style={{ ...field, fontFamily: "var(--font-mono)" }} />
        <button type="submit" style={btn("deep", { padding: "12px 18px" })}>
          Track
        </button>
      </form>

      {ref && !r && <p style={{ color: "var(--muted)" }}>Looking up {ref}…</p>}
      {r?.error && <p style={{ color: "var(--fail)", fontWeight: 700 }}>{r.error}. Check the reference on your confirmation, or reach us 8am–8pm daily.</p>}
      {order && stage === -1 && <p style={{ fontWeight: 700 }}>{order.status === "returned" ? "This order was returned. Our team will contact you." : "This order was cancelled. Our team will contact you."}</p>}

      {(!ref || order) && <TrackingStages stage={Math.max(0, stage)} />}

      {order && stage >= 2 && (
        <section style={{ border: "2px solid var(--d)", borderRadius: 24, overflow: "hidden", marginBottom: 20, background: "#fff" }}>
          <div style={{ background: "var(--d)", color: "#fff", padding: "14px 18px", fontWeight: 800, display: "inline-flex", gap: 8, alignItems: "center", width: "100%" }}>
            <Icon name="seal" size={22} />
            Checked: results for your unit, before dispatch
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 16, padding: 18 }}>
            {order.check_media ? (
              <a href={order.check_media} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 14, overflow: "hidden", background: "var(--t)", display: "block" }}>
                <ImageSlot src={order.check_media} alt="Your unit, checked before dispatch" placeholder="Photo / video of your unit" sizes="400px" />
              </a>
            ) : (
              <div style={{ aspectRatio: "4/3", background: "repeating-linear-gradient(135deg,var(--t) 0 12px,var(--t2) 12px 24px)", borderRadius: 14, display: "flex", alignItems: "flex-end", padding: 10, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "var(--m)" }}>PHOTO / VIDEO OF YOUR UNIT</div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              {(
                [
                  ["IMEI / serial", order.check_imei],
                  ["Battery health", order.check_battery ? `${order.check_battery}%` : null],
                  ["Condition", order.check_condition],
                ] as [string, string | null | undefined][]
              ).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
                  <span>{k}</span>
                  <b style={{ color: v === "Failed" ? "var(--fail)" : "var(--pass)" }}>{v || "[ result ]"}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {order && <Receipt refNo={order.ref} date={date} lines={order.order_lines} />}
      {!ref && <p style={{ color: "var(--muted)", fontSize: 14 }}>Enter the reference from your order confirmation. Stages: {STAGES.join(", ")}.</p>}
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackInner />
    </Suspense>
  );
}
