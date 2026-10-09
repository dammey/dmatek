"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderDrawer, OrderTable, STAGES, stageOf, type Order } from "@/components/orders";
import { Chip } from "@/components/ui";
import { api } from "@/lib/api";
import { useSearch } from "@/lib/search-context";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState(-1);
  const [selected, setSelected] = useState<string | null>(null);
  const { q } = useSearch();

  function load() {
    api.get<{ orders: Order[] }>("/admin/orders").then(({ orders }) => setOrders(orders)).catch(() => setOrders([]));
  }
  useEffect(load, []);

  const all = useMemo(() => (orders ?? []).filter((o) => stageOf(o.status) >= 0), [orders]);
  const needle = q.trim().toLowerCase();
  const rows = all.filter(
    (o) => (filter < 0 || stageOf(o.status) === filter) && (!needle || `${o.ref} ${o.customers?.company_name || o.customers?.full_name} ${o.addresses?.city}`.toLowerCase().includes(needle)),
  );

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Chip label={`All (${all.length})`} active={filter < 0} onClick={() => setFilter(-1)} />
        {STAGES.map((l, i) => (
          <Chip key={l} label={`${l} (${all.filter((o) => stageOf(o.status) === i).length})`} active={filter === i} onClick={() => setFilter(i)} />
        ))}
      </div>
      <OrderTable rows={rows} onOpen={setSelected} empty={orders ? "No orders match." : "Loading…"} />
      {selected && <OrderDrawer orderRef={selected} onClose={() => setSelected(null)} onChanged={load} />}
    </>
  );
}

