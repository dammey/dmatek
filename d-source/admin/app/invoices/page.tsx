"use client";

import { useEffect, useState } from "react";
import { PageHeader, Row, Table, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Invoice = { id: string; status: string; amount: number; due_at: string | null; overdue: boolean; orders?: { ref: string; customers?: { company_name: string | null } } };
const IST: Record<string, [string, string]> = { pending: ["#EFEADC", "#06382E"], paid: ["#D9F0E3", "#1F7A5A"] };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ invoices: Invoice[] }>("/admin/invoices").then(({ invoices }) => setInvoices(invoices));
  }
  useEffect(load, []);

  async function markPaid(id: string) {
    await api.patch(`/admin/invoices/${id}/mark-paid`);
    say("Marked paid");
    load();
  }

  return (
    <div>
      <PageHeader title="Invoices" subtitle="Business accounts on 30-day invoice" />
      <Table cols="110px minmax(160px,1fr) 130px 100px 100px" head={["ORDER", "COMPANY", "AMOUNT", "DUE", "STATUS"]} minWidth="800px">
        {invoices.map((i) => (
          <Row key={i.id} cols="110px minmax(160px,1fr) 130px 100px 100px">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{i.orders?.ref}</span>
            <span style={{ fontWeight: 700 }}>{i.orders?.customers?.company_name}</span>
            <span style={{ fontWeight: 800 }}>{fmt(i.amount)}</span>
            <span style={{ color: i.overdue ? "#B42318" : "#3A4A44", fontWeight: i.overdue ? 800 : 500 }}>{i.due_at ? new Date(i.due_at).toLocaleDateString("en-NG") : "—"}</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: i.overdue ? "#FDE7E4" : (IST[i.status] ?? IST.pending)[0], color: i.overdue ? "#B42318" : (IST[i.status] ?? IST.pending)[1] }}>
                {i.overdue ? "Overdue" : i.status}
              </span>
              {i.status !== "paid" && (
                <button type="button" onClick={() => markPaid(i.id)} style={btnPrimary}>
                  Mark paid
                </button>
              )}
            </span>
          </Row>
        ))}
        {!invoices.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>Nothing here yet.</div>}
      </Table>
    </div>
  );
}
