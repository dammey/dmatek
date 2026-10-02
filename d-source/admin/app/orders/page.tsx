"use client";

import { useEffect, useState } from "react";
import DrawerShell from "@/components/DrawerShell";
import { Chip, PageHeader, Row, Table, btnGhost, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

const STAGES = ["Received", "Confirmed", "Packed", "Out for delivery", "Delivered", "Installed"];
const ST_COL: [string, string][] = [["#EFEADC", "#06382E"], ["#FFF1CC", "#7A5B00"], ["#E3EEE8", "#1F5E48"], ["#DCEBFF", "#1B4A8A"], ["#D9F0E3", "#1F7A5A"], ["#06382E", "#D4A637"]];

type Order = {
  ref: string;
  status: string;
  placed_at: string;
  channel: string;
  customers?: { full_name: string; company_name: string | null };
  addresses?: { city: string; state: string | null };
  order_lines: { quantity: number; unit_price: number }[];
  payments?: { method: string; status: string }[];
};

type OrderDetail = {
  ref: string;
  status: string;
  placed_at: string;
  channel: string;
  internal_note: string | null;
  customers?: { full_name: string; company_name: string | null };
  addresses?: { city: string; state: string | null };
  order_lines: { id: string; quantity: number; unit_price: number; description: string }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const { say } = useToast();

  function load() {
    const qs = filter ? `?status=${filter}` : "";
    api.get<{ orders: Order[] }>(`/admin/orders${qs}`).then(({ orders }) => setOrders(orders)).catch(() => {});
  }

  useEffect(load, [filter]);

  const total = (o: Order) => o.order_lines.reduce((a, l) => a + l.quantity * l.unit_price, 0);
  const stageIndex = (status: string) => ["pending", "confirmed", "fulfilling", "shipped", "completed"].indexOf(status);

  return (
    <div>
      <PageHeader title="Orders" subtitle="Home orders and business orders on account" />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        <Chip label={`All (${orders.length})`} active={!filter} onClick={() => setFilter(null)} />
        {["pending", "confirmed", "fulfilling", "shipped", "completed", "cancelled"].map((s) => (
          <Chip key={s} label={s} active={filter === s} onClick={() => setFilter(s)} />
        ))}
      </div>
      <Table cols="130px 100px minmax(160px,1fr) 100px 120px 140px 90px" head={["REFERENCE", "DATE", "CUSTOMER", "STORE", "TOTAL", "PAYMENT", ""]} minWidth="920px">
        {orders.map((o) => {
          const idx = Math.max(0, stageIndex(o.status));
          return (
            <Row key={o.ref} cols="130px 100px minmax(160px,1fr) 100px 140px 140px 90px">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{o.ref}</span>
              <span style={{ color: "#5E6E68" }}>{new Date(o.placed_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
              <span style={{ fontWeight: 700 }}>{o.customers?.company_name || o.customers?.full_name}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  padding: "4px 8px",
                  borderRadius: 4,
                  background: o.channel === "emporium" ? "#0C1411" : "#06382E",
                  color: o.channel === "emporium" ? "#A6F000" : "#D4A637",
                  justifySelf: "start",
                }}
              >
                {o.channel === "emporium" ? "EMPORIUM" : "PROVISION"}
              </span>
              <span style={{ fontWeight: 800 }}>{fmt(total(o))}</span>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: ST_COL[idx][0], color: ST_COL[idx][1], justifySelf: "start" }}>
                {STAGES[idx]}
              </span>
              <button type="button" onClick={() => setSelected(o.ref)} style={btnGhost}>
                Open
              </button>
            </Row>
          );
        })}
      </Table>

      {selected && (
        <OrderDrawer
          ref={selected}
          onClose={() => setSelected(null)}
          onChanged={() => {
            load();
            say("Order updated");
          }}
        />
      )}
    </div>
  );
}

function OrderDrawer({ ref, onClose, onChanged }: { ref: string; onClose: () => void; onChanged: () => void }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    api.get<{ order: OrderDetail }>(`/admin/orders/${ref}`).then(({ order }) => {
      setOrder(order);
      setNote(order.internal_note ?? "");
    });
  }, [ref]);

  if (!order) return null;

  async function setStatus(status: string) {
    await api.patch(`/admin/orders/${ref}/status`, { status });
    onChanged();
    onClose();
  }

  async function saveNote() {
    await api.patch(`/admin/orders/${ref}/note`, { note });
    onChanged();
  }

  const statusKeys = ["pending", "confirmed", "fulfilling", "shipped", "completed"];

  return (
    <DrawerShell kicker={order.ref} title={order.customers?.full_name ?? order.customers?.company_name ?? ""} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "130px minmax(0,1fr)", gap: "8px 12px", fontSize: 14 }}>
        <span style={{ color: "#5E6E68" }}>Placed</span>
        <span style={{ fontWeight: 700 }}>{new Date(order.placed_at).toLocaleDateString("en-NG")}</span>
        <span style={{ color: "#5E6E68" }}>Store</span>
        <span style={{ fontWeight: 700 }}>{order.channel === "emporium" ? "D’Emporium · Home" : "D’Provision · Business"}</span>
        <span style={{ color: "#5E6E68" }}>Deliver to</span>
        <span style={{ fontWeight: 700 }}>{order.addresses?.city}</span>
      </div>
      <div style={{ borderTop: "1px solid #EEEAE2" }}>
        {order.order_lines.map((l) => (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
            <span>
              {l.quantity} × {l.description}
            </span>
            <span style={{ fontWeight: 700 }}>{fmt(l.quantity * l.unit_price)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#28705A" }}>STATUS</span>
        {statusKeys.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${order.status === s ? "#D4A637" : "#EEEAE2"}`,
              background: order.status === s ? "#F5F1E8" : "#fff",
              borderRadius: 12,
              padding: "10px 12px",
              fontSize: 14,
              fontWeight: order.status === s ? 800 : 600,
              textAlign: "left",
              color: "#06382E",
            }}
          >
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: i <= statusKeys.indexOf(order.status) ? "#D4A637" : "#fff", border: "2px solid #D4A637" }} />
            {STAGES[i]}
          </button>
        ))}
      </div>
      <label style={labelStyle}>
        INTERNAL NOTE
        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
      </label>
      <button type="button" onClick={saveNote} style={btnGhost}>
        Save note
      </button>
    </DrawerShell>
  );
}
