"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Row, Table, btnGhost, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Payment = { id: string; method: string; status: string; amount: number; orders?: { ref: string; customers?: { full_name: string } } };
const PST: Record<string, [string, string]> = { paid: ["#D9F0E3", "#1F7A5A"], pending: ["#FFF1CC", "#7A5B00"], refunded: ["#E6E2D8", "#3A4A44"] };

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { say } = useToast();

  function load() {
    api.get<{ payments: Payment[] }>("/admin/payments").then(({ payments }) => setPayments(payments));
  }
  useEffect(load, []);

  async function confirm(id: string) {
    await api.patch(`/admin/payments/${id}/confirm`);
    say("Marked paid");
    load();
  }

  async function refund(id: string) {
    await api.patch(`/admin/payments/${id}/refund`);
    say("Marked refunded");
    load();
  }

  return (
    <div>
      <PageHeader title="Payments" subtitle="Confirm transfers and pay on delivery, refund when needed" />
      <Card style={{ marginBottom: 16, fontSize: 14, color: "#3A4A44" }}>
        Card payments confirm themselves through Paystack or Flutterwave. Bank transfers and pay on delivery need a person to confirm the money has arrived.
      </Card>
      <Table cols="130px minmax(160px,1fr) 150px 130px 150px" head={["ORDER", "CUSTOMER", "METHOD", "AMOUNT", "STATUS"]} minWidth="820px">
        {payments.map((p) => (
          <Row key={p.id} cols="130px minmax(160px,1fr) 150px 130px 150px">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{p.orders?.ref}</span>
            <span style={{ fontWeight: 700 }}>{p.orders?.customers?.full_name}</span>
            <span>{p.method}</span>
            <span style={{ fontWeight: 800 }}>{fmt(p.amount)}</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: (PST[p.status] ?? PST.pending)[0], color: (PST[p.status] ?? PST.pending)[1] }}>{p.status}</span>
              {p.status === "pending" && (
                <button type="button" onClick={() => confirm(p.id)} style={btnPrimary}>
                  Confirm
                </button>
              )}
              {p.status === "paid" && (
                <button type="button" onClick={() => refund(p.id)} style={btnGhost}>
                  Refund
                </button>
              )}
            </span>
          </Row>
        ))}
        {!payments.length && (
          <div style={{ padding: "28px 18px", color: "#5E6E68" }}>Nothing here yet.</div>
        )}
      </Table>
    </div>
  );
}
