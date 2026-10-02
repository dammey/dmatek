"use client";

import { useEffect, useState } from "react";
import { Chip, PageHeader, Row, Table, btnGhost, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Supplier = { id: string; name: string; contact_email: string | null; contact_phone: string | null };
type PO = { ref: string; value: number; expected_date: string | null; status: string; suppliers?: { name: string } };

export default function SuppliersPage() {
  const [tab, setTab] = useState<"suppliers" | "pos">("suppliers");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pos, setPos] = useState<PO[]>([]);
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

  return (
    <div>
      <PageHeader title="Suppliers and POs" subtitle="Where stock comes from" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <Chip label="Suppliers" active={tab === "suppliers"} onClick={() => setTab("suppliers")} />
        <Chip label="Purchase orders" active={tab === "pos"} onClick={() => setTab("pos")} />
      </div>
      {tab === "suppliers" ? (
        <Table cols="minmax(160px,1fr) minmax(160px,1fr) minmax(160px,1fr)" head={["SUPPLIER", "EMAIL", "PHONE"]} minWidth="700px">
          {suppliers.map((s) => (
            <Row key={s.id} cols="minmax(160px,1fr) minmax(160px,1fr) minmax(160px,1fr)">
              <span style={{ fontWeight: 700 }}>{s.name}</span>
              <span style={{ color: "#3A4A44" }}>{s.contact_email}</span>
              <span style={{ color: "#3A4A44" }}>{s.contact_phone}</span>
            </Row>
          ))}
          {!suppliers.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No suppliers yet.</div>}
        </Table>
      ) : (
        <Table cols="100px minmax(140px,1fr) 130px 100px 110px" head={["PO", "SUPPLIER", "VALUE", "EXPECTED", "STATUS"]} minWidth="820px">
          {pos.map((p) => (
            <Row key={p.ref} cols="100px minmax(140px,1fr) 130px 100px 110px">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{p.ref}</span>
              <span style={{ fontWeight: 700 }}>{p.suppliers?.name}</span>
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
