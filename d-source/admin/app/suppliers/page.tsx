"use client";

import { useEffect, useState } from "react";
import { Card, Chip, PageHeader, Row, Table, btnGhost, btnPrimary, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Supplier = { id: string; name: string; supplies: string | null; contact_email: string | null; contact_phone: string | null; lead_time_days: number | null };
type PO = { ref: string; value: number; expected_date: string | null; status: string; itemCount: number; suppliers?: { name: string } };

export default function SuppliersPage() {
  const [tab, setTab] = useState<"suppliers" | "pos">("suppliers");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pos, setPos] = useState<PO[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", supplies: "", contactEmail: "", contactPhone: "", leadTimeDays: "" });
  const { say } = useToast();

  function load() {
    api.get<{ suppliers: Supplier[] }>("/admin/suppliers").then(({ suppliers }) => setSuppliers(suppliers));
    api.get<{ purchaseOrders: PO[] }>("/admin/suppliers/pos").then(({ purchaseOrders }) => setPos(purchaseOrders));
  }
  useEffect(load, []);

  async function advance(ref: string) {
    await api.patch(`/admin/suppliers/pos/${ref}/advance`);
    say("Advanced");
    load();
  }

  async function addSupplier() {
    if (!form.name.trim()) return say("Name is required");
    await api.post("/admin/suppliers", {
      name: form.name,
      supplies: form.supplies || undefined,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
      leadTimeDays: form.leadTimeDays ? Number(form.leadTimeDays) : undefined,
    });
    say(`${form.name} added`);
    setForm({ name: "", supplies: "", contactEmail: "", contactPhone: "", leadTimeDays: "" });
    setAdding(false);
    load();
  }

  return (
    <div>
      <PageHeader title="Suppliers and POs" subtitle="Where stock comes from" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Chip label="Suppliers" active={tab === "suppliers"} onClick={() => setTab("suppliers")} />
          <Chip label="Purchase orders" active={tab === "pos"} onClick={() => setTab("pos")} />
        </div>
        {tab === "suppliers" && (
          <button type="button" onClick={() => setAdding((a) => !a)} style={btnPrimary}>
            Add supplier
          </button>
        )}
      </div>

      {tab === "suppliers" ? (
        <>
          {adding && (
            <Card style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
              <span style={{ fontWeight: 800, fontSize: 18 }}>New supplier</span>
              <label style={labelStyle}>
                NAME
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                SUPPLIES
                <input value={form.supplies} onChange={(e) => setForm((f) => ({ ...f, supplies: e.target.value }))} placeholder="e.g. Networking" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                CONTACT
                <input value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} placeholder="Email" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                PHONE
                <input value={form.contactPhone} onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                LEAD TIME (DAYS)
                <input value={form.leadTimeDays} onChange={(e) => setForm((f) => ({ ...f, leadTimeDays: e.target.value }))} placeholder="e.g. 5" style={inputStyle} />
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={addSupplier} style={btnPrimary}>
                  Save
                </button>
                <button type="button" onClick={() => setAdding(false)} style={btnGhost}>
                  Cancel
                </button>
              </div>
            </Card>
          )}
          <Table cols="minmax(160px,1fr) minmax(160px,1fr) 120px" head={["SUPPLIER", "SUPPLIES", "LEAD TIME"]} minWidth="700px">
            {suppliers.map((s) => (
              <Row key={s.id} cols="minmax(160px,1fr) minmax(160px,1fr) 120px">
                <span style={{ fontWeight: 700 }}>{s.name}</span>
                <span style={{ color: "#3A4A44" }}>{s.supplies || "—"}</span>
                <span>{s.lead_time_days != null ? `${s.lead_time_days} days` : "—"}</span>
              </Row>
            ))}
            {!suppliers.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No suppliers yet.</div>}
          </Table>
        </>
      ) : (
        <Table cols="100px minmax(140px,1fr) 80px 130px 100px 110px" head={["PO", "SUPPLIER", "ITEMS", "VALUE", "EXPECTED", "STATUS"]} minWidth="900px">
          {pos.map((p) => (
            <Row key={p.ref} cols="100px minmax(140px,1fr) 80px 130px 100px 110px">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{p.ref}</span>
              <span style={{ fontWeight: 700 }}>{p.suppliers?.name}</span>
              <span>{p.itemCount}</span>
              <span style={{ fontWeight: 800 }}>{fmt(p.value)}</span>
              <span>{p.expected_date ? new Date(p.expected_date).toLocaleDateString("en-NG") : "—"}</span>
              <button type="button" onClick={() => advance(p.ref)} disabled={p.status === "received"} style={p.status === "draft" ? btnPrimary : btnGhost}>
                {p.status === "draft" ? "Send" : p.status === "ordered" ? "Receive" : "Received"}
              </button>
            </Row>
          ))}
          {!pos.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No purchase orders yet.</div>}
        </Table>
      )}
    </div>
  );
}
