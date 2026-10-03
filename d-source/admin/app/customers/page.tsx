"use client";

import { useEffect, useState } from "react";
import { Chip, PageHeader, Row, Table, btnGhost } from "@/components/ui";
import DrawerShell from "@/components/DrawerShell";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";

type Customer = {
  id: string;
  type: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  account_status: string | null;
  city: string | null;
  orderCount: number;
  spent: number;
  lastOrder: string | null;
};

const ACCOUNT_LABEL: Record<string, string> = { approved: "Approved", pending: "Pending", declined: "Declined" };

export default function CustomersPage() {
  const [filter, setFilter] = useState<"All" | "Home" | "Business">("All");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const qs = filter === "Home" ? "?type=retail" : filter === "Business" ? "?type=business" : "";
    api.get<{ customers: Customer[] }>(`/admin/customers${qs}`).then(({ customers }) => setCustomers(customers));
  }, [filter]);

  const open = customers.find((c) => c.id === openId);

  return (
    <div>
      <PageHeader title="Customers" subtitle="Everyone who has bought, quoted or applied" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {(["All", "Home", "Business"] as const).map((f) => (
          <Chip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>
      <Table cols="minmax(180px,1fr) 110px minmax(140px,1fr) 80px 140px 100px 150px 90px" head={["NAME", "TYPE", "LOCATION", "ORDERS", "SPENT", "LAST ORDER", "ACCOUNT", ""]} minWidth="960px">
        {customers.map((c) => (
          <Row key={c.id} cols="minmax(180px,1fr) 110px minmax(140px,1fr) 80px 140px 100px 150px 90px">
            <span style={{ fontWeight: 700 }}>{c.company_name || c.full_name}</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                padding: "4px 8px",
                borderRadius: 4,
                background: c.type === "business" ? "#06382E" : "#0C1411",
                color: c.type === "business" ? "#D4A637" : "#A6F000",
                justifySelf: "start",
              }}
            >
              {c.type === "business" ? "BUSINESS" : "HOME"}
            </span>
            <span style={{ color: "#3A4A44" }}>{c.city || "—"}</span>
            <span>{c.orderCount}</span>
            <span style={{ fontWeight: 800 }}>{fmt(c.spent)}</span>
            <span style={{ color: "#5E6E68" }}>{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString("en-NG") : "—"}</span>
            <span style={{ color: "#5E6E68" }}>{c.account_status ? ACCOUNT_LABEL[c.account_status] ?? c.account_status : "—"}</span>
            <button type="button" onClick={() => setOpenId(c.id)} style={btnGhost}>
              Open
            </button>
          </Row>
        ))}
        {!customers.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No customers yet.</div>}
      </Table>

      {open && (
        <DrawerShell kicker={open.type === "business" ? "BUSINESS" : "HOME"} title={open.company_name || open.full_name} onClose={() => setOpenId(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: "10px 12px", fontSize: 14 }}>
            <span style={{ color: "#5E6E68" }}>Email</span>
            <span>{open.email}</span>
            <span style={{ color: "#5E6E68" }}>Phone</span>
            <span>{open.phone || "—"}</span>
            <span style={{ color: "#5E6E68" }}>Location</span>
            <span>{open.city || "—"}</span>
            <span style={{ color: "#5E6E68" }}>Orders</span>
            <span>{open.orderCount}</span>
            <span style={{ color: "#5E6E68" }}>Spent</span>
            <span style={{ fontWeight: 800 }}>{fmt(open.spent)}</span>
            <span style={{ color: "#5E6E68" }}>Last order</span>
            <span>{open.lastOrder ? new Date(open.lastOrder).toLocaleDateString("en-NG") : "—"}</span>
            <span style={{ color: "#5E6E68" }}>Account</span>
            <span>{open.account_status ? ACCOUNT_LABEL[open.account_status] ?? open.account_status : "—"}</span>
          </div>
        </DrawerShell>
      )}
    </div>
  );
}
