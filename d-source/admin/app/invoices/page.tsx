"use client";

import { useEffect, useState } from "react";
import { GenChips, GenDrawer, GenTable, GenTiles, cB, cM, cP, cT } from "@/components/generic";
import { api } from "@/lib/api";
import { fmt, shortDate } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Invoice = {
  id: string;
  status: string;
  amount: number;
  due_at: string | null;
  created_at: string;
  invoice_no: number | null;
  overdue: boolean;
  orders?: { ref: string; customers?: { full_name: string; company_name: string | null } | null } | null;
};
const IST: Record<string, [string, string]> = { Open: ["#EFEADC", "#06382E"], Overdue: ["#FDE7E4", "#B42318"], Paid: ["#D9F0E3", "#1F7A5A"] };
const st = (i: Invoice) => (i.status === "paid" ? "Paid" : i.overdue ? "Overdue" : "Open");
const day = shortDate;
const invNo = (i: Invoice) => (i.invoice_no != null ? `INV-${String(i.invoice_no).padStart(4, "0")}` : "INV-[ number ]");
const co = (i: Invoice) => i.orders?.customers?.company_name || i.orders?.customers?.full_name || "[ COMPANY ]";

export default function InvoicesPage() {
  const [list, setList] = useState<Invoice[] | null>(null);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const { say } = useToast();

  function load() {
    api.get<{ invoices: Invoice[] }>("/admin/invoices").then(({ invoices }) => setList(invoices)).catch(() => setList([]));
  }
  useEffect(load, []);

  const all = list ?? [];
  const i = open ? all.find((x) => x.id === open) : null;
  const close = () => setOpen(null);

  return (
    <>
      <GenChips chips={["All", "Open", "Overdue", "Paid"].map((x) => ({ label: x, on: filter === x, go: () => setFilter(x) }))} />
      <GenTiles
        tiles={[
          { label: "OUTSTANDING", value: fmt(all.filter((x) => st(x) !== "Paid").reduce((a, x) => a + Number(x.amount), 0)), sub: "Open and overdue", ink: "#06382E" },
          { label: "OVERDUE", value: String(all.filter((x) => st(x) === "Overdue").length), sub: "Past 30 days", ink: "#B42318" },
        ]}
      />
      <GenTable
        cols="110px minmax(160px,1fr) 120px 130px 100px 100px 100px"
        head={["INVOICE", "COMPANY", "ORDER", "AMOUNT", "ISSUED", "DUE", "STATUS", ""]}
        minW="900px"
        empty={list ? "Nothing here yet." : "Loading…"}
        rows={all
          .filter((x) => filter === "All" || st(x) === filter)
          .map((x) => ({ key: x.id, cells: [cM(invNo(x)), cB(co(x)), cM(x.orders?.ref ?? "—"), cB(fmt(x.amount)), cT(day(x.created_at)), cT(day(x.due_at)), cP(st(x), IST[st(x)][0], IST[st(x)][1])], btn: "Open", go: () => setOpen(x.id) }))}
      />
      {i && (
        <GenDrawer
          kicker={`INVOICE · ${invNo(i)}`}
          title={co(i)}
          onClose={close}
          meta={[
            { k: "Order", v: i.orders?.ref ?? "—" },
            { k: "Amount", v: fmt(i.amount) },
            { k: "Issued", v: day(i.created_at) },
            { k: "Due", v: day(i.due_at) },
            { k: "Terms", v: "30 days" },
            { k: "Status", v: st(i) },
          ]}
          actions={[
            ...(st(i) !== "Paid"
              ? [
                  {
                    label: "Mark paid",
                    primary: true,
                    go: async () => {
                      await api.patch(`/admin/invoices/${i.id}/mark-paid`);
                      close();
                      say(`${invNo(i)} marked paid`);
                      load();
                    },
                  },
                  { label: "Send reminder", go: async () => { await api.post(`/admin/invoices/${i.id}/remind`); say(`Reminder sent for ${invNo(i)}`); close(); } },
                ]
              : []),
            { label: "Download PDF", go: () => say("[ PDF FROM THE INVOICE SYSTEM ]") },
          ]}
        />
      )}
    </>
  );
}
