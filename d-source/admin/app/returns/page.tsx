"use client";

import { useEffect, useState } from "react";
import { GenChips, GenDrawer, GenNote, GenTable, GenTiles, cB, cM, cP, cW } from "@/components/generic";
import { api } from "@/lib/api";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

type Ret = { ref: string; order_ref: string | null; customer_name: string | null; item: string | null; reason: string | null; state: "Open" | "Refunded" | "Replaced" | "Rejected"; day: number };
const RS: Record<string, [string, string]> = { Open: ["#FFF1CC", "#7A5B00"], Refunded: ["#D9F0E3", "#1F7A5A"], Replaced: ["#D9F0E3", "#1F7A5A"], Rejected: ["#FDE7E4", "#9E1B32"] };
const FILTERS = ["All", "Open", "Refunded", "Replaced", "Rejected"];

export default function ReturnsPage() {
  const [rows, setRows] = useState<Ret[] | null>(null);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const { q } = useSearch();
  const { say } = useToast();

  function load() {
    api.get<{ returns: Ret[] }>("/admin/returns").then(({ returns }) => setRows(returns)).catch(() => setRows([]));
  }
  useEffect(load, []);

  const all = rows ?? [];
  const needle = q.trim().toLowerCase();
  const list = all.filter((x) => (filter === "All" || x.state === filter) && (!needle || `${x.ref} ${x.order_ref} ${x.customer_name} ${x.item}`.toLowerCase().includes(needle)));
  const x = open ? all.find((r) => r.ref === open) : null;

  async function setR(state: "Refunded" | "Replaced" | "Rejected", msg: string) {
    if (!x) return;
    await api.patch(`/admin/returns/${x.ref}`, { state });
    setOpen(null);
    say(`${x.ref} ${msg}`);
    load();
  }

  return (
    <>
      <GenChips chips={FILTERS.map((f) => ({ label: f, on: filter === f, go: () => setFilter(f) }))} />
      <GenNote>Returns: 7 days. If an item fails inspection at the door, we take it back and the customer pays nothing. D’Source warranty (1 month new, 7 days used) is separate from the manufacturer warranty, which the customer claims with the manufacturer.</GenNote>
      <GenTiles
        tiles={[
          { label: "OPEN", value: String(all.filter((r) => r.state === "Open").length), sub: "Decide refund or replacement", ink: "#06382E" },
          { label: "FAILED AT THE DOOR", value: String(all.filter((r) => /inspection/.test(r.reason ?? "")).length), sub: "Nothing charged", ink: "#9E1B32" },
          { label: "PAST 7 DAYS", value: String(all.filter((r) => r.day > 7 && r.state === "Open").length), sub: "Outside the return window", ink: "#7A5B00" },
        ]}
      />
      <GenTable
        cols="90px 120px minmax(140px,1fr) minmax(160px,1.2fr) minmax(180px,1.2fr) 110px 110px"
        head={["REF", "ORDER", "CUSTOMER", "ITEM", "REASON", "WINDOW", "STATUS", ""]}
        minW="1100px"
        empty={rows ? "Nothing here yet." : "Loading…"}
        rows={list.map((r) => ({
          key: r.ref,
          cells: [
            cM(r.ref),
            cM(r.order_ref ?? "—"),
            cB(r.customer_name ?? "[ CUSTOMER ]"),
            cW(r.item ?? ""),
            cW(r.reason ?? ""),
            r.day > 7 ? cP("Past 7 days", "#FDE7E4", "#9E1B32") : cP(`Day ${r.day} of 7`, "#D9F0E3", "#1F7A5A"),
            cP(r.state, RS[r.state][0], RS[r.state][1]),
          ],
          btn: r.state === "Open" ? "Resolve" : "Open",
          go: () => setOpen(r.ref),
        }))}
      />
      {x && (
        <GenDrawer
          kicker={`RETURN · ${x.ref}`}
          title={x.customer_name ?? "[ CUSTOMER ]"}
          onClose={() => setOpen(null)}
          meta={[
            { k: "Order", v: x.order_ref ?? "—" },
            { k: "Item", v: x.item ?? "" },
            { k: "Reason", v: x.reason ?? "" },
            { k: "Window", v: x.day > 7 ? "Past 7 days" : `Day ${x.day} of 7` },
            { k: "Status", v: x.state },
          ]}
          actions={
            x.state === "Open"
              ? [
                  { label: "Refund", go: () => setR("Refunded", "refunded"), primary: true },
                  { label: "Replace", go: () => setR("Replaced", "replacement sent") },
                  { label: "Reject (outside policy)", go: () => setR("Rejected", "rejected") },
                  { label: "Close", go: () => setOpen(null) },
                ]
              : [{ label: "Close", go: () => setOpen(null) }]
          }
        />
      )}
    </>
  );
}
