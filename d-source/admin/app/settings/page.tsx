"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Settings = Record<string, string>;

/** Field groups, labels and placeholders exactly as Settings in v3. */
const GROUPS: { title: string; fields: [string, string, string][] }[] = [
  {
    title: "Delivery",
    fields: [
      ["feeLagos", "FEE · LAGOS", "e.g. ₦5,000"],
      ["feeAbuja", "FEE · ABUJA", "e.g. ₦8,000"],
      ["feeOther", "FEE · OTHER STATES", "e.g. from ₦10,000"],
      ["times", "DELIVERY TIMES", "e.g. Lagos 1–2 days, other states 3–5 working days"],
    ],
  },
  {
    title: "Payment and policies",
    fields: [
      ["pod", "PAY ON DELIVERY AREAS", "e.g. Lagos and Abuja"],
      ["returns", "RETURNS POLICY (SUMMARY)", "7 days"],
      ["reviewTime", "BUSINESS ACCOUNT CHECK TIME", "e.g. 2 working days"],
    ],
  },
  {
    title: "Contact details",
    fields: [
      ["phone", "PHONE", "+234 …"],
      ["email", "EMAIL", "hello@…"],
      ["whatsapp", "WHATSAPP NUMBER", "+234 …"],
      ["address", "ADDRESS", "Street, city"],
    ],
  },
  {
    title: "Promises shown on the storefront",
    fields: [
      ["sla", "QUOTE REPLY (HOURS)", "24"],
      ["invoiceDays", "INVOICE TERMS (DAYS)", "30"],
    ],
  },
];

export default function SettingsPage() {
  const [s, setS] = useState<Settings>({});
  const { say } = useToast();

  useEffect(() => {
    api.get<{ settings: Settings }>("/admin/settings").then(({ settings }) => setS(settings));
  }, []);

  async function save() {
    try {
      await api.put("/admin/settings", s);
      say("Saved. The storefront will show these details.");
    } catch (e) {
      say(e instanceof Error ? e.message : "Couldn’t save");
    }
  }

  return (
    <>
      <div style={{ background: "#EFEADC", borderRadius: 16, padding: "14px 18px", fontSize: 14, color: "#3A4A44" }}>
        These fill every <strong>[ TO CONFIRM ]</strong> on the storefront. Saving publishes them to help pages, checkout and product pages.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16, alignItems: "start" }}>
        {GROUPS.map((g) => (
          <section key={g.title} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontWeight: 800, fontSize: 18 }}>{g.title}</span>
            {g.fields.map(([key, label, ph]) => (
              <label key={key} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>
                {label}
                <input
                  value={s[key] ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setS((x) => ({ ...x, [key]: v }));
                  }}
                  placeholder={ph}
                  style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 12, fontSize: 14.5, letterSpacing: 0, fontWeight: 500, background: "#fff", color: "#06382E" }}
                />
              </label>
            ))}
          </section>
        ))}
      </div>
      <button type="button" onClick={save} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "15px 26px", fontWeight: 800, fontSize: 15 }}>
        Save and publish
      </button>
    </>
  );
}
