"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, Row, Table, btnPrimary, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Discount = { id: string; code: string; applies_to: string; value: string; ends_at: string; active: boolean };

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [form, setForm] = useState({ code: "", appliesTo: "", value: "", endsAt: "", reason: "" });
  const { say } = useToast();

  function load() {
    api.get<{ discounts: Discount[] }>("/admin/discounts").then(({ discounts }) => setDiscounts(discounts));
  }
  useEffect(load, []);

  async function create() {
    if (!form.code || !form.endsAt || !form.reason) return say("Code, end date and a reason are required");
    await api.post("/admin/discounts", form);
    setForm({ code: "", appliesTo: "", value: "", endsAt: "", reason: "" });
    say("Discount saved as draft");
    load();
  }

  return (
    <div>
      <PageHeader title="Discounts" subtitle="Only for real offers" />
      <Card style={{ marginBottom: 16, fontSize: 14, color: "#3A4A44" }}>
        The storefront shows discounts only when a real offer exists. Every code needs a reason and an end date.
      </Card>
      <Table cols="140px minmax(160px,1fr) 120px 120px 100px" head={["CODE", "APPLIES TO", "VALUE", "ENDS", "STATUS"]} minWidth="780px">
        {discounts.map((d) => (
          <Row key={d.id} cols="140px minmax(160px,1fr) 120px 120px 100px">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{d.code}</span>
            <span>{d.applies_to}</span>
            <span style={{ fontWeight: 800 }}>{d.value}</span>
            <span>{new Date(d.ends_at).toLocaleDateString("en-NG")}</span>
            <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: d.active ? "#D9F0E3" : "#EFEADC", color: d.active ? "#1F7A5A" : "#06382E", justifySelf: "start" }}>
              {d.active ? "Active" : "Draft"}
            </span>
          </Row>
        ))}
        {!discounts.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No discount codes. The storefront doesn’t need them to sell.</div>}
      </Table>

      <Card style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
        <span style={{ fontWeight: 800, fontSize: 18 }}>New discount code</span>
        <label style={labelStyle}>
          CODE
          <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. BACKTOSCHOOL" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          VALUE
          <input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="e.g. 10% or ₦20,000" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          APPLIES TO
          <input value={form.appliesTo} onChange={(e) => setForm((f) => ({ ...f, appliesTo: e.target.value }))} placeholder="Category, product or whole store" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          ENDS
          <input type="date" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          THE REAL OFFER BEHIND IT
          <input value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. supplier price drop on laptops" style={inputStyle} />
        </label>
        <button type="button" onClick={create} style={btnPrimary}>
          Save as draft
        </button>
      </Card>
    </div>
  );
}
