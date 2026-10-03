"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Chip, PageHeader, Row, Table, btnGhost, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Inv = { quantity_on_hand: number; quantity_reserved: number; reorder_level: number };
type Product = { id: string; name: string; store: string; inventory?: Inv[] };

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowOnly, setLowOnly] = useState(false);
  const [qty, setQty] = useState<Record<string, string>>({});
  const { say } = useToast();

  function load() {
    api.get<{ products: Product[] }>("/admin/products").then(({ products }) => setProducts([...products].sort((a, b) => (a.inventory?.[0]?.quantity_on_hand ?? 0) - (b.inventory?.[0]?.quantity_on_hand ?? 0))));
  }
  useEffect(load, []);

  async function receive(id: string, name: string) {
    const n = Number(qty[id]);
    if (!n || n <= 0) return;
    await api.patch(`/admin/products/${id}/stock`, { delta: n });
    say(`${name}: +${n} received`);
    setQty((q) => ({ ...q, [id]: "" }));
    load();
  }

  async function setReorderLevel(id: string, level: number) {
    await api.patch(`/admin/products/${id}/reorder-level`, { reorderLevel: level });
    load();
  }

  const lowCount = products.filter((p) => (p.inventory?.[0]?.quantity_on_hand ?? 0) < (p.inventory?.[0]?.reorder_level ?? 3)).length;
  const shown = lowOnly ? products.filter((p) => (p.inventory?.[0]?.quantity_on_hand ?? 0) < (p.inventory?.[0]?.reorder_level ?? 3)) : products;

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Stock on hand, reserved, and reorder levels" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Chip label="All" active={!lowOnly} onClick={() => setLowOnly(false)} />
          <Chip label={`Low stock (${lowCount})`} active={lowOnly} onClick={() => setLowOnly(true)} />
        </div>
        <Link href="/suppliers" style={btnPrimary}>
          Receive stock
        </Link>
      </div>
      <Table cols="minmax(200px,1fr) 110px 90px 90px 100px 90px 110px" head={["PRODUCT", "STORE", "ON HAND", "RESERVED", "REORDER AT", "QTY", ""]} minWidth="920px">
        {shown.map((p) => {
          const inv = p.inventory?.[0];
          const stock = inv?.quantity_on_hand ?? 0;
          const reorderLevel = inv?.reorder_level ?? 3;
          const enteredQty = qty[p.id] ?? "";
          const canReceive = Number(enteredQty) > 0;
          return (
            <Row key={p.id} cols="minmax(200px,1fr) 110px 90px 90px 100px 90px 110px">
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", padding: "4px 8px", borderRadius: 4, background: p.store === "emporium" ? "#0C1411" : "#06382E", color: p.store === "emporium" ? "#A6F000" : "#D4A637", justifySelf: "start" }}>
                {p.store === "emporium" ? "EMPORIUM" : "PROVISION"}
              </span>
              <span style={{ fontWeight: 800, color: stock < reorderLevel ? "#B42318" : "#06382E" }}>{stock}</span>
              <span style={{ color: "#3A4A44" }}>{inv?.quantity_reserved ?? 0}</span>
              <input
                type="number"
                min={0}
                defaultValue={reorderLevel}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v !== reorderLevel && v >= 0) setReorderLevel(p.id, v);
                }}
                style={{ width: 56, border: "1px solid rgba(6,56,46,.2)", borderRadius: 8, padding: "6px 8px", fontSize: 13 }}
              />
              <input
                type="number"
                min={0}
                placeholder="0"
                value={enteredQty}
                onChange={(e) => setQty((q) => ({ ...q, [p.id]: e.target.value }))}
                style={{ width: 56, border: "1px solid rgba(6,56,46,.2)", borderRadius: 8, padding: "6px 8px", fontSize: 13 }}
              />
              <button type="button" onClick={() => receive(p.id, p.name)} disabled={!canReceive} style={{ ...btnGhost, opacity: canReceive ? 1 : 0.45 }}>
                Receive
              </button>
            </Row>
          );
        })}
        {!shown.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No products yet.</div>}
      </Table>
    </div>
  );
}
