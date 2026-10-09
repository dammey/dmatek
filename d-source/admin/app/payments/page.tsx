"use client";

import { useEffect, useState } from "react";
import { GenDrawer, GenNote, GenTable, GenTiles, cB, cM, cP, cT } from "@/components/generic";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { payLabel } from "@/components/orders";
import { PST, payState, type Payment } from "@/lib/payments";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

const who = (p: Payment) => p.orders?.customers?.company_name || p.orders?.customers?.full_name || "[ CUSTOMER ]";

export default function PaymentsPage() {
  const [list, setList] = useState<Payment[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [bankRef, setBankRef] = useState("");
  const { q } = useSearch();
  const { say } = useToast();

  function load() {
    api.get<{ payments: Payment[] }>("/admin/payments").then(({ payments }) => setList(payments)).catch(() => setList([]));
  }
  useEffect(load, []);

  const needle = q.trim().toLowerCase();
  const rows = (list ?? []).filter((p) => !needle || `${p.orders?.ref ?? ""}${who(p)}`.toLowerCase().includes(needle));
  const count = (s: string) => String(rows.filter((p) => payState(p) === s).length);
  const p = open ? (list ?? []).find((x) => x.id === open) : null;
  const st = p ? payState(p) : "";
  const close = () => setOpen(null);
  const ref = p?.orders?.ref ?? "";

  async function act(path: string, msg: string) {
    await api.patch(`/admin/payments/${p!.id}/${path}`);
    close();
    say(msg);
    load();
  }

  return (
    <>
      <GenNote>Card payments confirm themselves through Paystack or Flutterwave. Bank transfers and pay on delivery need a person to confirm the money has arrived.</GenNote>
      <GenTiles
        tiles={[
          { label: "AWAITING TRANSFER", value: count("Awaiting transfer"), sub: "Check the bank account", ink: "#7A5B00" },
          { label: "PAY ON DELIVERY", value: count("Pay on delivery"), sub: "Collect at the door", ink: "#06382E" },
          { label: "FAILED", value: count("Failed"), sub: "Contact the customer", ink: "#B42318" },
        ]}
      />
      <GenTable
        cols="130px minmax(160px,1fr) 150px 130px 150px"
        head={["ORDER", "CUSTOMER", "METHOD", "AMOUNT", "STATUS", ""]}
        minW="820px"
        empty={list ? "Nothing here yet." : "Loading…"}
        rows={rows.map((x) => {
          const s = payState(x);
          return { key: x.id, cells: [cM(x.orders?.ref ?? "—"), cB(who(x)), cT(payLabel(x)), cB(fmt(x.amount)), cP(s, PST[s][0], PST[s][1])], btn: "Manage", go: () => setOpen(x.id) };
        })}
      />
      {p && (
        <GenDrawer
          kicker={`PAYMENT · ${ref}`}
          title={who(p)}
          onClose={close}
          meta={[
            { k: "Method", v: payLabel(p) },
            { k: "Amount", v: fmt(p.amount) },
            { k: "Status", v: st },
            { k: "Gateway ref", v: p.method === "card" ? p.provider_ref || "[ PAYSTACK / FLUTTERWAVE REF ]" : "—" },
          ]}
          fields={st === "Awaiting transfer" ? [{ label: "BANK REFERENCE", ph: "From the bank statement", value: bankRef, onChange: setBankRef }] : []}
          actions={[
            ...(st === "Awaiting transfer" || st === "Pay on delivery" ? [{ label: "Confirm money received", primary: true, go: () => act("confirm", `${ref} marked paid`) }] : []),
            ...(st === "Failed"
              ? [
                  {
                    label: "Send payment link again",
                    primary: true,
                    go: async () => {
                      const { link } = await api.post<{ link: string | null }>(`/admin/payments/${p.id}/resend-link`);
                      if (link) await navigator.clipboard?.writeText(link).catch(() => {});
                      say(link ? `Payment link for ${ref} copied` : `Payment link sent for ${ref}`);
                      close();
                      load();
                    },
                  },
                ]
              : []),
            ...(st === "Paid" ? [{ label: "Refund", go: () => act("refund", `${ref} refunded`) }] : []),
            { label: "Close", go: close },
          ]}
        />
      )}
    </>
  );
}
