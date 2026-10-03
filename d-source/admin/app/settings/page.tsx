"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, btnPrimary, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Settings = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  returnsPolicy?: string;
  businessAccountReviewTime?: string;
  deliveryTimesAndFees?: string;
  podAreas?: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const { say } = useToast();

  useEffect(() => {
    api.get<{ settings: Settings }>("/admin/settings").then(({ settings }) => setSettings(settings));
  }, []);

  async function save() {
    await api.put("/admin/settings", settings);
    say("Saved. The storefront will show these details.");
  }

  function field(key: keyof Settings, label: string, ph?: string) {
    return (
      <label style={labelStyle}>
        {label}
        <input value={(settings[key] as string) ?? ""} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} placeholder={ph} style={inputStyle} />
      </label>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Delivery, payment, policies and contact details" />
      <Card style={{ marginBottom: 16, fontSize: 14, color: "#3A4A44" }}>
        These fill every <strong>[ TO CONFIRM ]</strong> on the storefront. Saving publishes them to help pages, checkout and product pages.
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16 }}>
        <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Delivery and payment</span>
          {field("deliveryTimesAndFees", "DELIVERY TIMES AND FEES", "e.g. 1–3 working days nationwide, ₦ varies by zone")}
          {field("podAreas", "PAY ON DELIVERY — AREAS COVERED", "e.g. Lagos and Abuja only")}
          {field("returnsPolicy", "RETURNS POLICY (SUMMARY)", "e.g. 7 days, unopened, with receipt")}
          {field("businessAccountReviewTime", "BUSINESS ACCOUNT CHECK TIME", "e.g. 2 working days")}
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Contact details</span>
          {field("phone", "PHONE", "+234 …")}
          {field("email", "EMAIL", "hello@…")}
          {field("whatsapp", "WHATSAPP NUMBER", "+234 …")}
          {field("address", "ADDRESS", "Street, city")}
        </Card>
      </div>
      <button type="button" onClick={save} style={{ ...btnPrimary, marginTop: 16 }}>
        Save and publish
      </button>
    </div>
  );
}
