"use client";

import { useEffect, useState } from "react";
import { GenChips, GenDrawer, GenNote, GenTable, cB, cM, cP, cT } from "@/components/generic";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Discount = { id: string; code: string; applies_to: string; value: string; starts_at: string | null; ends_at: string; active: boolean };
const day = shortDate;
type Key = "code" | "value" | "appliesTo" | "startsAt" | "endsAt" | "reason";

export default function DiscountsPage() {
  const [list, setList] = useState<Discount[] | null>(null);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<Record<string, string>>({});
  const { say } = useToast();

  function load() {
    api.get<{ discounts: Discount[] }>("/admin/discounts").then(({ discounts }) => setList(discounts)).catch(() => setList([]));
  }
  useEffect(load, []);

  const fld = (k: Key, label: string, ph: string) => ({ label, ph, value: f[k] ?? "", onChange: (v: string) => setF((x) => ({ ...x, [k]: v })) });
  const close = () => setOpen(false);

  async function save() {
    if (!f.code || !f.endsAt || !f.reason) return say("Code, end date and the real offer behind it are required");
    if (Number.isNaN(Date.parse(f.endsAt)) || (f.startsAt && Number.isNaN(Date.parse(f.startsAt)))) return say("Dates as YYYY-MM-DD, e.g. 2026-11-30");
    await api.post("/admin/discounts", { code: f.code, value: f.value ?? "", appliesTo: f.appliesTo ?? "", startsAt: f.startsAt || undefined, endsAt: f.endsAt, reason: f.reason });
    close();
    say("Discount saved as draft");
    load();
  }

  return (
    <>
      <GenChips chips={[]} actions={[{ label: "New discount code", go: () => (setF({}), setOpen(true)) }]} />
      <GenNote>The storefront shows discounts only when a real offer exists. Every code needs a reason and an end date.</GenNote>
      <GenTable
        cols="140px minmax(160px,1fr) 120px 120px 120px 100px"
        head={["CODE", "APPLIES TO", "VALUE", "STARTS", "ENDS", "STATUS"]}
        minW="780px"
        empty={list ? "No discount codes. The storefront doesn’t need them to sell." : "Loading…"}
        rows={(list ?? []).map((d) => ({
          key: d.id,
          cells: [cM(d.code), cT(d.applies_to), cB(d.value), cT(day(d.starts_at)), cT(day(d.ends_at)), d.active ? cP("Active", "#D9F0E3", "#1F7A5A") : cP("Draft", "#EFEADC", "#06382E")],
        }))}
      />
      {open && (
        <GenDrawer
          kicker="DISCOUNT"
          title="New discount code"
          onClose={close}
          meta={[]}
          fields={[
            fld("code", "CODE", "e.g. BACKTOSCHOOL"),
            fld("value", "VALUE", "e.g. 10% or ₦20,000"),
            fld("appliesTo", "APPLIES TO", "Category, product or whole store"),
            fld("startsAt", "STARTS", ""),
            fld("endsAt", "ENDS", "Required"),
            fld("reason", "THE REAL OFFER BEHIND IT", "e.g. supplier price drop on laptops"),
          ]}
          actions={[
            { label: "Save as draft", go: save, primary: true },
            { label: "Cancel", go: close },
          ]}
        />
      )}
    </>
  );
}
