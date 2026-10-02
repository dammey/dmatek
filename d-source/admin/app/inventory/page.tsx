"use client";

import { useEffect, useState } from "react";
import { PageHeader, Row, Table, btnGhost } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Product = { id: string; name: string; store: string; inventory?: { quantity_on_hand: number }[] };

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ products: Product[] }>("/admin/products").then(({ products }) => setProducts([...products].sort((a, b) => (a.inventory?.[0]?.quantity_on_hand ?? 0) - (b.inventory?.[0]?.quantity_on_hand ?? 0))));
  }
  useEffect(load, []);

  async function receive(id: string) {
    await api.patch(`/admin/products/${id}/stock`, { delta: 10 });
    say("+10 received");
    load();
  }

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Stock on hand, per product" />
      <Table cols="minmax(200px,1fr) 110px 90px 100px" head={["PRODUCT", "STORE", "ON HAND", ""]} minWidth="700px">
        {products.map((p) => {
          const stock = p.inventory?.[0]?.quantity_on_hand ?? 0;
          return (
            <Row key={p.id} cols="minmax(200px,1fr) 110px 90px 100px">
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", padding: "4px 8px", borderRadius: 4, background: p.store === "emporium" ? "#0C1411" : "#06382E", color: p.store === "emporium" ? "#A6F000" : "#D4A637", justifySelf: "start" }}>
                {p.store === "emporium" ? "EMPORIUM" : "PROVISION"}
              </span>
              <span style={{ fontWeight: 800, color: stock < 3 ? "#B42318" : "#06382E" }}>{stock}</span>
              <button type="button" onClick={() => receive(p.id)} style={btnGhost}>
                +10 stock
              </button>
            </Row>
          );
        })}
        {!products.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No products yet.</div>}
      </Table>
    </div>
  );
}
