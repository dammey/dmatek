"use client";

import { useEffect, useState } from "react";
import { PageHeader, Row, Table } from "@/components/ui";
import { api } from "@/lib/api";

type Customer = { id: string; type: string; full_name: string; company_name: string | null; email: string; orders: { id: string }[] };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    api.get<{ customers: Customer[] }>("/admin/customers").then(({ customers }) => setCustomers(customers));
  }, []);

  return (
    <div>
      <PageHeader title="Customers" subtitle="Everyone who has bought, quoted or applied" />
      <Table cols="minmax(180px,1fr) 110px minmax(160px,1fr) 80px" head={["NAME", "TYPE", "EMAIL", "ORDERS"]} minWidth="760px">
        {customers.map((c) => (
          <Row key={c.id} cols="minmax(180px,1fr) 110px minmax(160px,1fr) 80px">
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
            <span style={{ color: "#3A4A44" }}>{c.email}</span>
            <span>{c.orders?.length ?? 0}</span>
          </Row>
        ))}
        {!customers.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No customers yet.</div>}
      </Table>
    </div>
  );
}
