"use client";

import { useEffect, useState } from "react";
import { GenChips, GenDrawer, GenNote, GenTable, cB, cM, cP, cT, cW } from "@/components/generic";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

const KEYS = ["requested", "collected", "diagnosed", "quote_sent", "approved", "fixing", "returned"];
const RSTAGES = ["Requested", "Collected", "Diagnosed", "Quote sent", "Approved", "Fixing", "Returned"];
const RC: [string, string][] = [["#FFF1CC", "#7A5B00"], ["#DCEBFF", "#1B4A8A"], ["#E3EEE8", "#1F5E48"], ["#FDE7E4", "#9E1B32"], ["#D9F0E3", "#1F7A5A"], ["#E3EEE8", "#1F5E48"], ["#06382E", "#D4A637"]];

type Repair = {
  ref: string;
  device_desc: string;
  how: string | null;
  stage: string;
  quote_amount: number | null;
  device_count: number;
  company: boolean;
  customers?: { full_name: string; company_name: string | null } | null;
};

const typeOf = (r: Repair) => (r.company ? `Company, ${r.device_count} device${r.device_count === 1 ? "" : "s"}` : `Personal, ${r.device_count} device${r.device_count === 1 ? "" : "s"}`);
const who = (r: Repair) => r.customers?.company_name || r.customers?.full_name || "[ CUSTOMER ]";

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[] | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const { q } = useSearch();
  const { say } = useToast();

  function load() {
    api.get<{ repairs: Repair[] }>("/admin/repairs").then(({ repairs }) => setRepairs(repairs)).catch(() => setRepairs([]));
  }
  useEffect(load, []);

  const st = (r: Repair) => Math.max(0, KEYS.indexOf(r.stage));
  const needle = q.trim().toLowerCase();
  const list = (repairs ?? []).filter((r) => (!filter || RSTAGES[st(r)] === filter) && (!needle || `${r.ref} ${who(r)} ${r.device_desc}`.toLowerCase().includes(needle)));
  const r = open ? (repairs ?? []).find((x) => x.ref === open) : null;

  async function next(x: Repair) {
    try {
      await api.patch(`/admin/repairs/${x.ref}/advance`);
      say(`${x.ref} → ${RSTAGES[st(x) + 1]}`);
      load();
    } catch (e) {
      say(e instanceof Error ? e.message : "Couldn’t move this repair");
    }
  }
  async function act(path: string, msg: string, body?: unknown) {
    if (!r) return;
    await api.post(`/admin/repairs/${r.ref}/${path}`, body);
    setOpen(null);
    say(`${r.ref} ${msg}`);
    load();
  }

  const quoteF = (x: Repair) => (x.quote_amount != null ? fmt(x.quote_amount) : "₦ [ quote ]");

  return (
    <>
      <GenChips chips={[{ label: "All", on: !filter, go: () => setFilter(null) }, ...RSTAGES.map((l) => ({ label: l, on: filter === l, go: () => setFilter(l) }))]} />
      <GenNote>We diagnose and quote before any work. Nothing is fixed until the customer approves the quote, and no surprise bills. One personal device or several company devices.</GenNote>
      <GenTable
        cols="100px minmax(140px,1fr) minmax(200px,1.4fr) 130px 110px 130px"
        head={["REF", "CUSTOMER", "DEVICE AND FAULT", "TYPE", "HOW", "STAGE", ""]}
        minW="1000px"
        empty={repairs ? "Nothing here yet." : "Loading…"}
        rows={list.map((x) => {
          const i = st(x);
          // Diagnosed needs a quote amount, so it opens the drawer like "Quote sent".
          const viaDrawer = i === 2 || i === 3 || i === 6;
          return {
            key: x.ref,
            cells: [cM(x.ref), cB(who(x)), cW(x.device_desc), cT(typeOf(x)), cT(x.how ?? "—"), cP(RSTAGES[i], RC[i][0], RC[i][1])],
            btn: i === 3 ? "Open quote" : i < 6 ? "Next stage" : "Open",
            go: viaDrawer
              ? () => {
                  setQuote(x.quote_amount != null ? String(x.quote_amount) : "");
                  setOpen(x.ref);
                }
              : () => next(x),
          };
        })}
      />
      {r && (
        <GenDrawer
          kicker={`REPAIR · ${r.ref}`}
          title={who(r)}
          onClose={() => setOpen(null)}
          meta={[
            { k: "Device", v: r.device_desc },
            { k: "Type", v: typeOf(r) },
            { k: "How", v: r.how ?? "—" },
            { k: "Stage", v: RSTAGES[st(r)] },
            { k: "Quote", v: quoteF(r) },
            { k: "Rule", v: "No work starts until the customer approves the quote" },
          ]}
          fields={st(r) === 2 ? [{ label: "QUOTE (₦)", ph: "From the diagnosis", value: quote, onChange: (v) => setQuote(v.replace(/\D/g, "")) }] : []}
          actions={
            st(r) === 3
              ? [
                  { label: "Customer approved", go: () => act("approve", "approved. Work can start."), primary: true },
                  { label: "Customer declined", go: () => act("decline", "declined. Device returned unrepaired.") },
                  { label: "Close", go: () => setOpen(null) },
                ]
              : st(r) === 2
                ? [
                    { label: "Send quote to customer", go: () => (quote ? act("quote", "quote sent", { amount: Number(quote) }) : say("Enter the quote from the diagnosis")), primary: true },
                    { label: "Close", go: () => setOpen(null) },
                  ]
                : [{ label: "Close", go: () => setOpen(null) }]
          }
        />
      )}
    </>
  );
}
