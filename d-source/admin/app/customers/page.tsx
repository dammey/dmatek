"use client";

import { useEffect, useState } from "react";
import { GenChips, GenDrawer, GenTable, cB, cT, cTag } from "@/components/generic";
import { STAGES, stageOf } from "@/components/orders";
import { api } from "@/lib/api";
import { fmt, shortDate } from "@/lib/format";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

type Customer = {
  id: string;
  type: "retail" | "business";
  full_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  account_status: string | null;
  credit_terms_days: number | null;
  admin_note: string | null;
  city: string | null;
  orderCount: number;
  spent: number;
  lastOrder: string | null;
  orders: { ref: string; placed_at: string; status: string; total: number }[];
};

const name = (c: Customer) => c.company_name || c.full_name;
const typeOf = (c: Customer) => (c.type === "business" ? "Business" : "Personal");
const day = shortDate;
const acct = (c: Customer) =>
  c.account_status === "approved" ? `Approved · ${c.credit_terms_days ?? 30}-day` : c.account_status === "pending" ? "To review" : c.account_status === "declined" ? "Declined" : "—";
const realEmail = (e: string | null) => (e && !e.endsWith("@no-email.dsource") ? e : null);

export default function CustomersPage() {
  const [list, setList] = useState<Customer[] | null>(null);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const { q } = useSearch();
  const { say } = useToast();

  function load() {
    api.get<{ customers: Customer[] }>("/admin/customers").then(({ customers }) => setList(customers)).catch(() => setList([]));
  }
  useEffect(load, []);

  const needle = q.trim().toLowerCase();
  const rows = (list ?? []).filter((c) => (filter === "All" || typeOf(c) === filter) && (!needle || `${name(c)} ${c.city ?? ""}`.toLowerCase().includes(needle)));
  const c = open ? (list ?? []).find((x) => x.id === open) : null;
  const phone = c?.phone || null;

  return (
    <>
      <GenChips chips={["All", "Personal", "Business"].map((x) => ({ label: x, on: filter === x, go: () => setFilter(x) }))} />
      <GenTable
        cols="minmax(180px,1fr) 110px minmax(140px,1fr) 80px 140px 100px 150px"
        head={["NAME", "TYPE", "LOCATION", "ORDERS", "SPENT", "LAST ORDER", "ACCOUNT", ""]}
        minW="960px"
        empty={list ? "Nothing here yet." : "Loading…"}
        rows={rows.map((x) => ({
          key: x.id,
          cells: [cB(name(x)), cTag(x.type === "business"), cT(x.city || "—"), cT(x.orderCount), cB(fmt(x.spent)), cT(x.lastOrder ? day(x.lastOrder) : "—"), cT(acct(x))],
          btn: "Open",
          go: () => {
            setNote(x.admin_note ?? "");
            setOpen(x.id);
          },
        }))}
      />
      {c && (
        <GenDrawer
          kicker={`${typeOf(c).toUpperCase()} CUSTOMER`}
          title={name(c)}
          onClose={() => setOpen(null)}
          meta={[
            { k: "Location", v: c.city || "[ LOCATION ]" },
            { k: "Phone", v: phone || "[ PHONE ]" },
            { k: "Email", v: realEmail(c.email) || "[ EMAIL ]" },
            { k: "Orders", v: String(c.orderCount) },
            { k: "Total spent", v: fmt(c.spent) },
            { k: "Account", v: acct(c) },
          ]}
          linesTitle="ORDERS"
          lines={c.orders.length ? c.orders.map((o) => ({ a: `${o.ref} · ${day(o.placed_at)}`, b: `${fmt(o.total)} · ${STAGES[Math.max(0, stageOf(o.status))]}` })) : [{ a: "No orders in this view", b: "" }]}
          fields={[{ label: "ADD A NOTE", ph: "e.g. prefers WhatsApp, deliver after 2pm", value: note, onChange: setNote }]}
          actions={[
            {
              label: "Save note",
              primary: true,
              go: async () => {
                await api.patch(`/admin/customers/${c.id}/note`, { note });
                say(`Note saved on ${name(c)}`);
                setOpen(null);
                load();
              },
            },
            {
              label: "Message on WhatsApp",
              go: () => {
                if (!phone) return say("Opening WhatsApp · [ PHONE ]");
                const digits = phone.replace(/\D/g, "").replace(/^0/, "234");
                window.open(`https://wa.me/${digits}`, "_blank", "noopener");
              },
            },
          ]}
        />
      )}
    </>
  );
}
