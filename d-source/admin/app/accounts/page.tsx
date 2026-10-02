"use client";

import { useEffect, useState } from "react";
import { PageHeader, btnGhost, btnPrimary, inputStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Account = { id: string; company_name: string | null; tax_id: string | null; expected_activity: string | null; account_status: string; applied_at: string | null };

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [credit, setCredit] = useState<Record<string, string>>({});
  const { say } = useToast();

  function load() {
    api.get<{ accounts: Account[] }>("/admin/accounts").then(({ accounts }) => setAccounts(accounts));
  }
  useEffect(load, []);

  async function approve(id: string) {
    await api.patch(`/admin/accounts/${id}/approve`, { creditTermsDays: Number(credit[id]) || 30 });
    say("Approved · 30-day invoice");
    load();
  }

  async function decline(id: string) {
    await api.patch(`/admin/accounts/${id}/decline`);
    say("Declined");
    load();
  }

  const STATUS: Record<string, [string, string]> = { pending: ["#FFF1CC", "#7A5B00"], approved: ["#D9F0E3", "#1F7A5A"], declined: ["#FDE7E4", "#B42318"] };

  return (
    <div>
      <PageHeader title="Business accounts" subtitle="Approve accounts for 30-day invoice" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,380px),1fr))", gap: 12 }}>
        {accounts.map((a) => (
          <article key={a.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 17 }}>{a.company_name}</span>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: STATUS[a.account_status]?.[0], color: STATUS[a.account_status]?.[1] }}>{a.account_status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: "6px 12px", fontSize: 13.5 }}>
              <span style={{ color: "#5E6E68" }}>Tax ID</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{a.tax_id || "—"}</span>
              <span style={{ color: "#5E6E68" }}>Expected activity</span>
              <span>{a.expected_activity || "—"}</span>
              <span style={{ color: "#5E6E68" }}>Applied</span>
              <span>{a.applied_at ? new Date(a.applied_at).toLocaleDateString("en-NG") : "—"}</span>
            </div>
            {a.account_status === "pending" && (
              <>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em" }}>
                  CREDIT LIMIT DAYS
                  <input value={credit[a.id] ?? "30"} onChange={(e) => setCredit((c) => ({ ...c, [a.id]: e.target.value }))} style={inputStyle} />
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => approve(a.id)} style={{ ...btnPrimary, flex: 1 }}>
                    Approve · 30-day invoice
                  </button>
                  <button type="button" onClick={() => decline(a.id)} style={btnGhost}>
                    Decline
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
        {!accounts.length && <div style={{ background: "#fff", borderRadius: 20, padding: 24, color: "#5E6E68" }}>No applications yet.</div>}
      </div>
    </div>
  );
}
