"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GenChips, GenDrawer, GenTable, cB, cT, cTag } from "@/components/generic";
import { api } from "@/lib/api";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

type Item = {
  id: string;
  name: string;
  store: "emporium" | "provision";
  is_active: boolean;
  categories?: { name: string } | null;
  inventory?: { quantity_on_hand: number; quantity_reserved: number; reorder_level: number | null }[];
  product_suppliers?: { suppliers?: { name: string } | null }[];
  stock_serials?: { serial: string }[];
};

const SERIAL_CATS = ["Laptops", "Phones", "Tablets", "TV & Audio", "Computing", "Displays"];
/** Stock is held only for items with an inventory record (from the dealer
 * lists' stock column, receiving, or a set stock count). Everything else is
 * sourced on order, so it is never "0" or "low". */
const held = (p: Item) => !!p.inventory?.length;
const onHand = (p: Item) => p.inventory?.[0]?.quantity_on_hand ?? 0;
const reorderAt = (p: Item) => p.inventory?.[0]?.reorder_level ?? 3;
const isLow = (p: Item) => held(p) && onHand(p) < reorderAt(p) && p.is_active;
type View = "all" | "held" | "low" | "order";

export default function InventoryPage() {
  const router = useRouter();
  const [list, setList] = useState<Item[] | null>(null);
  const [view, setView] = useState<View>("held");
  const [open, setOpen] = useState<string | null>(null);
  const [qty, setQty] = useState("");
  const [serials, setSerials] = useState("");
  const [limit, setLimit] = useState(200);
  const { q } = useSearch();
  const { say } = useToast();

  function load() {
    api.get<{ products: Item[] }>("/admin/inventory").then(({ products }) => setList(products)).catch(() => setList([]));
  }
  useEffect(load, []);

  const needle = q.trim().toLowerCase();
  const all = list ?? [];
  const inView = (p: Item) => (view === "all" ? true : view === "held" ? held(p) : view === "low" ? isLow(p) : !held(p));
  const rows = all
    .filter((p) => (!needle || p.name.toLowerCase().includes(needle)) && inView(p))
    .sort((a, b) => Number(held(b)) - Number(held(a)) || (held(a) ? onHand(a) - onHand(b) : a.name.localeCompare(b.name)));
  const p = open ? all.find((x) => x.id === open) : null;
  const close = () => setOpen(null);
  const n = parseInt(qty.replace(/\D/g, ""), 10) || 10;

  return (
    <>
      <GenChips
        chips={[
          { label: `In stock (${all.filter(held).length})`, on: view === "held", go: () => setView("held") },
          { label: `Low stock (${all.filter(isLow).length})`, on: view === "low", go: () => setView("low") },
          { label: `Sourced on order (${all.filter((p) => !held(p)).length})`, on: view === "order", go: () => setView("order") },
          { label: `All (${all.length})`, on: view === "all", go: () => setView("all") },
        ]}
        actions={[{ label: "Receive stock", go: () => router.push("/suppliers?tab=po") }]}
      />
      <GenTable
        cols="minmax(200px,1fr) 110px 90px 90px 100px 100px"
        head={["PRODUCT", "STORE", "ON HAND", "RESERVED", "REORDER AT", "SERIALS", ""]}
        minW="860px"
        empty={list ? "Nothing here yet." : "Loading…"}
        rows={rows.slice(0, limit).map((x) => ({
          key: x.id,
          cells: [cB(x.name), cTag(x.store === "provision"), held(x) ? { ...cB(String(onHand(x))), ink: isLow(x) ? "#B42318" : "#06382E" } : cT("On order"), cT(held(x) ? x.inventory?.[0]?.quantity_reserved ?? 0 : "—"), cT(held(x) ? reorderAt(x) : "—"), cT(SERIAL_CATS.includes(x.categories?.name ?? "") || x.stock_serials?.length ? "Tracked" : "—")],
          btn: "Adjust",
          go: () => {
            setQty("");
            setSerials("");
            setOpen(x.id);
          },
        }))}
      />
      {rows.length > limit && (
        <button type="button" onClick={() => setLimit((l) => l + 200)} style={{ alignSelf: "center", border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "9px 16px", fontSize: 13, fontWeight: 700 }}>
          Show more ({rows.length - limit} left)
        </button>
      )}
      {p && (
        <GenDrawer
          kicker="INVENTORY"
          title={p.name}
          onClose={close}
          meta={[
            { k: "On hand", v: held(p) ? String(onHand(p)) : "Sourced on order · no stock held" },
            { k: "Reorder at", v: held(p) ? String(reorderAt(p)) : "—" },
            { k: "Supplier", v: p.product_suppliers?.map((s) => s.suppliers?.name).filter(Boolean).join(", ") || "[ SUPPLIER ]" },
          ]}
          linesTitle="SERIAL NUMBERS"
          lines={p.stock_serials?.length ? p.stock_serials.map((s) => ({ a: s.serial, b: "" })) : [{ a: "[ RECORDED WHEN STOCK IS RECEIVED ]", b: "" }]}
          fields={[
            { label: "QUANTITY RECEIVED", ph: "e.g. 10", value: qty, onChange: setQty },
            { label: "SERIAL NUMBERS", ph: "Scan or type, comma-separated", value: serials, onChange: setSerials },
          ]}
          actions={[
            {
              label: `Add ${n} to stock`,
              primary: true,
              go: async () => {
                const list = serials.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
                await api.post(`/admin/inventory/${p.id}/receive`, { quantity: n, serials: list });
                close();
                say(`${p.name}: +${n} received`);
                load();
              },
            },
            { label: "Close", go: close },
          ]}
        />
      )}
    </>
  );
}
