"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { GenChips, GenDrawer, GenTable, cB, cM, cP, cT } from "@/components/generic";
import { api } from "@/lib/api";
import { fmt, shortDate } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Supplier = { id: string; name: string; supplies: string | null; brands: string | null; contact: string | null; contact_email: string | null; contact_phone: string | null; lead_time: string | null; lead_time_days: number | null };
type PO = { id: string; ref: string; value: number; expected_date: string | null; status: "draft" | "ordered" | "received"; suppliers?: { name: string } | null; po_lines: { description: string; quantity: number }[] };

const POC: Record<string, [string, string]> = { Draft: ["#EFEADC", "#06382E"], Ordered: ["#FFF1CC", "#7A5B00"], Received: ["#D9F0E3", "#1F7A5A"] };
const label = (s: PO["status"]) => (s === "draft" ? "Draft" : s === "ordered" ? "Ordered" : "Received");
const items = (p: PO) => p.po_lines.map((l) => `${Number(l.quantity)} × ${l.description}`).join(", ") || "[ ITEMS ]";
const day = shortDate;
const lead = (s: Supplier) => s.lead_time || (s.lead_time_days != null ? `${s.lead_time_days} days` : "—");

type Drawer = { mod: "suppliers" | "po"; id: string } | null;

function SuppliersInner() {
  const params = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") === "po" ? "po" : "sup");
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [pos, setPos] = useState<PO[] | null>(null);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [f, setF] = useState<Record<string, string>>({});
  const { say } = useToast();

  function load() {
    api.get<{ suppliers: Supplier[] }>("/admin/suppliers").then(({ suppliers }) => setSuppliers(suppliers)).catch(() => setSuppliers([]));
    api.get<{ purchaseOrders: PO[] }>("/admin/suppliers/pos").then(({ purchaseOrders }) => setPos(purchaseOrders)).catch(() => setPos([]));
  }
  useEffect(load, []);

  const tabs = [
    { label: "Suppliers", on: tab === "sup", go: () => setTab("sup") },
    { label: "Purchase orders", on: tab === "po", go: () => setTab("po") },
  ];
  const close = () => setDrawer(null);
  const openG = (mod: "suppliers" | "po", id: string, init: Record<string, string> = {}) => () => {
    setF(init);
    setDrawer({ mod, id });
  };
  const field = (key: string, l: string, ph: string) => ({ label: l, ph, value: f[key] ?? "", onChange: (v: string) => setF((x) => ({ ...x, [key]: v })) });

  async function advance(p: PO) {
    await api.patch(`/admin/suppliers/pos/${p.ref}/advance`);
    say(p.ref + (p.status === "draft" ? " sent to supplier" : " received into stock"));
    load();
  }

  async function save() {
    if (!drawer) return;
    try {
      if (drawer.mod === "po") {
        const sup = (suppliers ?? []).find((s) => s.name.toLowerCase() === (f.supplier ?? "").trim().toLowerCase());
        if (!sup) return say("Add the supplier first, then name it here exactly");
        await api.post("/admin/suppliers/pos", { supplierId: sup.id, items: f.items ?? "", value: parseInt((f.value ?? "").replace(/\D/g, ""), 10) || 0, expectedDate: f.expected || undefined });
      } else {
        const body = { name: f.name, supplies: f.supplies, contact: f.contact, leadTime: f.lead, brands: f.brands };
        if (drawer.id === "new") await api.post("/admin/suppliers", body);
        else await api.patch(`/admin/suppliers/${drawer.id}`, body);
      }
      say("Saved");
      close();
      load();
    } catch (e) {
      say(e instanceof Error ? e.message : "Couldn’t save");
    }
  }

  const sup = drawer?.mod === "suppliers" && drawer.id !== "new" ? (suppliers ?? []).find((s) => s.id === drawer.id) : null;
  const po = drawer?.mod === "po" && drawer.id !== "new" ? (pos ?? []).find((p) => p.ref === drawer.id) : null;

  return (
    <>
      {tab === "sup" ? (
        <>
          <GenChips chips={tabs} actions={[{ label: "Add supplier", go: openG("suppliers", "new") }]} />
          <GenTable
            cols="minmax(160px,1fr) minmax(160px,1fr) minmax(180px,1fr) 110px"
            head={["SUPPLIER", "SUPPLIES", "BRANDS", "LEAD TIME", ""]}
            minW="820px"
            empty={suppliers ? "No suppliers yet." : "Loading…"}
            rows={(suppliers ?? []).map((s) => ({
              key: s.id,
              cells: [cB(s.name), cT(s.supplies || "—"), cT(s.brands || "—"), cT(lead(s))],
              btn: "Open",
              go: openG("suppliers", s.id, { name: s.name, supplies: s.supplies ?? "", contact: s.contact || s.contact_phone || s.contact_email || "", lead: s.lead_time ?? "", brands: s.brands ?? "" }),
            }))}
          />
        </>
      ) : (
        <>
          <GenChips chips={tabs} actions={[{ label: "New purchase order", go: openG("po", "new") }]} />
          <GenTable
            cols="100px minmax(140px,1fr) minmax(180px,1fr) 130px 100px 110px"
            head={["PO", "SUPPLIER", "ITEMS", "VALUE", "EXPECTED", "STATUS", ""]}
            minW="900px"
            empty={pos ? "No purchase orders yet." : "Loading…"}
            rows={(pos ?? []).map((p) => {
              const st = label(p.status);
              return {
                key: p.ref,
                cells: [cM(p.ref), cB(p.suppliers?.name ?? "[ SUPPLIER ]"), cT(items(p)), cB(fmt(p.value)), cT(day(p.expected_date)), cP(st, POC[st][0], POC[st][1])],
                btn: p.status === "received" ? "Open" : p.status === "draft" ? "Send" : "Receive",
                go: p.status === "received" ? openG("po", p.ref) : () => advance(p),
              };
            })}
          />
        </>
      )}
      {drawer && (
        <GenDrawer
          kicker={drawer.mod === "po" ? "PURCHASE ORDER" : "SUPPLIER"}
          title={drawer.id === "new" ? (drawer.mod === "po" ? "New purchase order" : "New supplier") : (sup?.name ?? po?.ref ?? drawer.id)}
          onClose={close}
          meta={po ? [{ k: "Supplier", v: po.suppliers?.name ?? "[ SUPPLIER ]" }, { k: "Items", v: items(po) }, { k: "Value", v: fmt(po.value) }, { k: "Expected", v: day(po.expected_date) }, { k: "Status", v: label(po.status) }] : []}
          fields={
            po
              ? []
              : drawer.mod === "po"
                ? [field("supplier", "SUPPLIER", "[ SUPPLIER ]"), field("items", "ITEMS", "e.g. 10 × Latitude 5550"), field("value", "VALUE (₦)", ""), field("expected", "EXPECTED DATE", "")]
                : [field("name", "NAME", ""), field("supplies", "SUPPLIES", "e.g. Networking"), field("contact", "CONTACT", ""), field("lead", "LEAD TIME", "e.g. 3–5 days")]
          }
          actions={po ? [{ label: "Close", go: close }] : [{ label: "Save", go: save, primary: true }, { label: "Cancel", go: close }]}
        />
      )}
    </>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense>
      <SuppliersInner />
    </Suspense>
  );
}
