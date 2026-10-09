"use client";

import { useEffect, useState } from "react";
import DrawerShell from "@/components/DrawerShell";
import { inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt, shortDate } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

export const STAGES = ["Ordered", "Sourced", "Checked", "Out for delivery", "Delivered", "Returned"];
export const ST_COL: [string, string][] = [["#EFEADC", "#06382E"], ["#FFF1CC", "#7A5B00"], ["#E3EEE8", "#1F5E48"], ["#DCEBFF", "#1B4A8A"], ["#D9F0E3", "#1F7A5A"], ["#FDE7E4", "#9E1B32"]];
export const STATUS_KEYS = ["pending", "confirmed", "fulfilling", "shipped", "completed", "returned"];
export const stageOf = (status: string) => STATUS_KEYS.indexOf(status);
export const journeyTag = (channel: string) =>
  channel === "provision" ? { label: "BUSINESS", bg: "#06382E", ink: "#D4A637" } : { label: "FOR YOU", bg: "#EFEADC", ink: "#06382E" };
const PAY_LABEL: Record<string, string> = { card: "Card", transfer: "Bank transfer", invoice_terms: "30-day invoice", pod: "Pay on delivery" };
const PROVIDER: Record<string, string> = { paystack: "Paystack", flutterwave: "Flutterwave" };
/** "Card · Paystack", "Bank transfer", "30-day invoice", "Pay on delivery". */
export const payLabel = (p?: { method: string; provider?: string | null }) =>
  p ? [PAY_LABEL[p.method] ?? p.method, p.method === "card" && p.provider ? (PROVIDER[p.provider] ?? p.provider) : null].filter(Boolean).join(" · ") : "[ payment ]";

const COLS = "130px 100px minmax(160px,1fr) 100px 70px 120px 140px 130px 70px";
const mono = "var(--font-mono)";

export type Order = {
  ref: string;
  status: string;
  placed_at: string;
  channel: string;
  customers?: { full_name: string; company_name: string | null };
  addresses?: { city: string; state: string | null };
  order_lines: { quantity: number; unit_price: number }[];
  payments?: { method: string; status: string; provider?: string | null }[];
};

type OrderDetail = Omit<Order, "order_lines" | "customers"> & {
  internal_note: string | null;
  check_battery: string | null;
  check_imei: string | null;
  check_condition: string | null;
  check_media: string | null;
  customers?: { full_name: string; company_name: string | null; phone: string | null };
  order_lines: { id: string; quantity: number; unit_price: number; description: string }[];
  jobs?: { id: string; engineer_staff_id: string | null; staff?: { name: string } }[];
};

const total = (o: { order_lines: { quantity: number; unit_price: number }[] }) => o.order_lines.reduce((a, l) => a + l.quantity * l.unit_price, 0);

export function OrderTable({ rows, onOpen, empty = "No orders match." }: { rows: Order[]; onOpen: (ref: string) => void; empty?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
      <div style={{ minWidth: 860 }}>
        <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
          <span>REFERENCE</span>
          <span>DATE</span>
          <span>CUSTOMER</span>
          <span>JOURNEY</span>
          <span>ITEMS</span>
          <span>TOTAL</span>
          <span>PAYMENT</span>
          <span>STATUS</span>
          <span />
        </div>
        {rows.map((o) => {
          const idx = Math.max(0, stageOf(o.status));
          const tag = journeyTag(o.channel);
          return (
            <div key={o.ref} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "13px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
              <span style={{ fontFamily: mono, fontSize: 12.5 }}>{o.ref}</span>
              <span style={{ color: "#5E6E68" }}>{shortDate(o.placed_at)}</span>
              <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.customers?.company_name || o.customers?.full_name || "[ CUSTOMER ]"}</span>
                <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{o.addresses?.city}</span>
              </span>
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: ".1em", padding: "4px 8px", borderRadius: 4, background: tag.bg, color: tag.ink, justifySelf: "start" }}>{tag.label}</span>
              <span>{o.order_lines.reduce((a, l) => a + l.quantity, 0)}</span>
              <span style={{ fontWeight: 800 }}>{fmt(total(o))}</span>
              <span style={{ color: "#3A4A44" }}>{payLabel(o.payments?.[0])}</span>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: ST_COL[idx][0], color: ST_COL[idx][1], justifySelf: "start", whiteSpace: "nowrap" }}>{STAGES[idx]}</span>
              <button type="button" onClick={() => onOpen(o.ref)} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "7px 12px", fontSize: 13, fontWeight: 700 }}>
                Open
              </button>
            </div>
          );
        })}
        {!rows.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>{empty}</div>}
      </div>
    </div>
  );
}

const chkField: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 10, padding: 10, fontSize: 14, background: "#fff", color: "#06382E" };
const chkLabel: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" };

export function OrderDrawer({ orderRef, onClose, onChanged }: { orderRef: string; onClose: () => void; onChanged: () => void }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [note, setNote] = useState("");
  const [engineers, setEngineers] = useState<{ id: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const { say } = useToast();

  function load() {
    api.get<{ order: OrderDetail }>(`/admin/orders/${orderRef}`).then(({ order }) => {
      setOrder(order);
      setNote(order.internal_note ?? "");
    });
  }
  useEffect(() => {
    load();
    api
      .get<{ staff: { id: string; name: string; role: string }[] }>("/admin/staff")
      .then(({ staff }) => setEngineers(staff.filter((s) => s.role === "Engineer")))
      .catch(() => setEngineers([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderRef]);

  if (!order) return null;
  const stage = stageOf(order.status);
  const job = order.jobs?.[0];

  async function setStage(i: number) {
    await api.patch(`/admin/orders/${orderRef}/status`, { status: STATUS_KEYS[i] });
    say(`${orderRef} → ${STAGES[i]}`);
    load();
    onChanged();
  }
  async function saveCheck(patch: Record<string, string>) {
    await api.patch(`/admin/orders/${orderRef}/checked`, patch);
    setOrder((o) => (o ? { ...o, ...Object.fromEntries(Object.entries(patch).map(([k, v]) => [`check_${k}`, v])) } : o));
    say("Checked results saved · shown on tracking");
  }
  async function upload(file: File) {
    setUploading(true);
    try {
      const { url } = await api.upload<{ url: string }>(`/admin/orders/${orderRef}/checked/media`, file);
      setOrder((o) => (o ? { ...o, check_media: url } : o));
      say("Photo saved · shown on tracking");
    } catch (e) {
      say(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const meta: [string, string][] = [
    ["Placed", shortDate(order.placed_at)],
    ["Journey", order.channel === "provision" ? "For your business" : "For you"],
    ["Deliver to", order.addresses?.city ?? "[ ADDRESS ]"],
    ["Payment", payLabel(order.payments?.[0])],
    ["Phone", order.customers?.phone || "[ CUSTOMER PHONE ]"],
    ["D’Source warranty", "1 month on new, 7 days on used, from delivery"],
    ["Manufacturer warranty", "Claimed by the customer directly with the manufacturer"],
    ["Returns", "7 days from delivery; inspect on delivery"],
  ];
  const isVideo = order.check_media && /\.(mp4|mov|webm)$/i.test(order.check_media);

  return (
    <DrawerShell kicker={order.ref} title={order.customers?.company_name || order.customers?.full_name || ""} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "130px minmax(0,1fr)", gap: "8px 12px", fontSize: 14 }}>
        {meta.map(([k, v]) => (
          <Frag key={k} k={k} v={v} />
        ))}
      </div>
      <div style={{ borderTop: "1px solid #EEEAE2" }}>
        {order.order_lines.map((l) => (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
            <span>
              <strong>{l.quantity} ×</strong> {l.description}
            </span>
            <span style={{ fontWeight: 700 }}>{fmt(l.quantity * l.unit_price)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontWeight: 800 }}>
          <span>Total</span>
          <span>{fmt(total(order))}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#28705A" }}>STATUS</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {STAGES.map((l, i) => (
            <button
              key={l}
              type="button"
              onClick={() => setStage(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: `1px solid ${i === stage ? "#D4A637" : "#EEEAE2"}`,
                background: i === stage ? "#F5F1E8" : "#fff",
                color: "#06382E",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 14,
                fontWeight: i === stage ? 800 : 600,
                textAlign: "left",
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: "50%", background: i <= stage ? "#D4A637" : "#fff", border: `2px solid ${i <= stage ? "#D4A637" : "#D9D4C8"}` }} />
              {l}
            </button>
          ))}
        </div>
      </div>
      {stage >= 2 && stage < 5 && (
        <div style={{ border: "2px solid #06382E", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#06382E", color: "#F5F1E8", padding: "10px 14px", fontWeight: 800, fontSize: 14 }}>✓ Checked results (shown to the customer on tracking)</div>
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ position: "relative", aspectRatio: "16/9", borderRadius: 10, overflow: "hidden", background: "#EFEADC", display: "block", cursor: "pointer" }}>
              {order.check_media ? (
                isVideo ? (
                  <video src={order.check_media} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={order.check_media} alt="Checked unit" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )
              ) : (
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#5E6E68", border: "1px dashed rgba(6,56,46,.3)", borderRadius: 10 }}>
                  {uploading ? "Uploading…" : "Upload photo or video of this unit"}
                </span>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                aria-label="Upload photo or video of this unit"
              />
            </label>
            <label style={chkLabel}>
              BATTERY HEALTH %
              <input
                key={`b-${order.check_battery}`}
                defaultValue={order.check_battery ?? ""}
                inputMode="numeric"
                placeholder="e.g. 91"
                onBlur={(e) => e.target.value !== (order.check_battery ?? "") && saveCheck({ battery: e.target.value.replace(/\D/g, "") })}
                style={chkField}
              />
            </label>
            <label style={chkLabel}>
              IMEI / SERIAL RESULT
              <select value={order.check_imei ?? "Not verified yet"} onChange={(e) => saveCheck({ imei: e.target.value })} style={chkField}>
                <option>Clean, verified</option>
                <option>Not verified yet</option>
                <option>Failed</option>
              </select>
            </label>
            <label style={chkLabel}>
              CONDITION
              <select value={order.check_condition ?? "New"} onChange={(e) => saveCheck({ condition: e.target.value })} style={chkField}>
                <option>New</option>
                <option>UK-used · Grade A</option>
                <option>UK-used · Grade B</option>
                <option>UK-used · Grade C</option>
              </select>
            </label>
            <span style={{ fontSize: 12.5, color: "#5E6E68" }}>Receipt shows D’Source warranty per item (1 month new, 7 days used) and the manufacturer warranty footnote.</span>
          </div>
        </div>
      )}
      <label style={labelStyle}>
        INSTALLATION ENGINEER
        <select
          value={job?.engineer_staff_id ?? ""}
          onChange={async (e) => {
            if (!e.target.value) return;
            await api.patch(`/admin/orders/${orderRef}/engineer`, { engineerStaffId: e.target.value });
            say("Engineer assigned");
            load();
          }}
          style={{ ...inputStyle, fontSize: 14 }}
        >
          <option value="">Not needed</option>
          {engineers.length ? (
            engineers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))
          ) : (
            <>
              <option disabled>[ ENGINEER 1 ]</option>
              <option disabled>[ ENGINEER 2 ]</option>
            </>
          )}
        </select>
      </label>
      <label style={labelStyle}>
        INTERNAL NOTE
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={async () => {
            if (note === (order.internal_note ?? "")) return;
            await api.patch(`/admin/orders/${orderRef}/note`, { note });
            say("Note saved");
          }}
          style={{ ...inputStyle, fontSize: 14, resize: "vertical" }}
        />
      </label>
      <button
        type="button"
        onClick={async () => {
          await api.post(`/admin/orders/${orderRef}/notify`);
          say(`Update sent: “${STAGES[Math.max(0, stage)]}”`);
        }}
        style={{ alignSelf: "flex-start", border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "11px 18px", fontWeight: 800, fontSize: 14 }}
      >
        Send status update to customer
      </button>
    </DrawerShell>
  );
}

function Frag({ k, v }: { k: string; v: string }) {
  return (
    <>
      <span style={{ color: "#5E6E68" }}>{k}</span>
      <span style={{ fontWeight: 700 }}>{v}</span>
    </>
  );
}
