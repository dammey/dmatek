"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Account = { id: string; company_name: string | null; full_name: string | null; cac_number: string | null; accounts_contact: string | null; accounts_email: string | null; expected_activity: string | null; account_status: "pending" | "approved" | "declined" | null; applied_at: string | null; created_at: string };

const ST: Record<string, [string, string, string]> = { pending: ["To review", "#FFF1CC", "#7A5B00"], approved: ["Approved", "#D9F0E3", "#1F7A5A"], declined: ["Declined", "#FDE7E4", "#B42318"] };

export default function AccountsPage() {
  const [list, setList] = useState<Account[]>([]);
  const [limit, setLimit] = useState<Record<string, string>>({});
  const { say } = useToast();

  function load() {
    api.get<{ accounts: Account[] }>("/admin/accounts").then(({ accounts }) => setList(accounts.filter((a) => a.account_status)));
  }
  useEffect(load, []);

  async function approve(a: Account) {
    const n = parseInt((limit[a.id] ?? "").replace(/\D/g, ""), 10);
    await api.patch(`/admin/accounts/${a.id}/approve`, { creditTermsDays: 30, creditLimit: Number.isFinite(n) ? n : undefined });
    say(`${a.company_name} approved for 30-day invoice`);
    load();
  }
  async function decline(a: Account) {
    await api.patch(`/admin/accounts/${a.id}/decline`);
    say(`${a.company_name} declined`);
    load();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,380px),1fr))", gap: 12 }}>
      {list.map((a) => {
        const st = ST[a.account_status ?? "pending"];
        const contact = [a.accounts_contact, a.accounts_email].filter(Boolean).join(" · ") || "[ CONTACT ]";
        return (
          <article key={a.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 17 }}>{a.company_name ?? a.full_name}</span>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: st[1], color: st[2] }}>{st[0]}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr)", gap: "6px 12px", fontSize: 13.5 }}>
              <span style={{ color: "#5E6E68" }}>CAC</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>{a.cac_number ?? "[ CAC ]"}</span>
              <span style={{ color: "#5E6E68" }}>Accounts contact</span>
              <span>{contact}</span>
              <span style={{ color: "#5E6E68" }}>Expected orders</span>
              <span>{a.expected_activity ?? "—"}</span>
              <span style={{ color: "#5E6E68" }}>Applied</span>
              <span>{shortDate(a.applied_at ?? a.created_at)}</span>
            </div>
            {a.account_status === "pending" && (
              <>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>
                  CREDIT LIMIT (₦)
                  <input value={limit[a.id] ?? ""} onChange={(e) => setLimit((l) => ({ ...l, [a.id]: e.target.value }))} placeholder="e.g. 5,000,000" inputMode="numeric" style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 11, fontSize: 14, background: "#fff", color: "#06382E" }} />
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => approve(a)} style={{ flex: 1, border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: 11, fontWeight: 800, fontSize: 13.5 }}>
                    Approve · 30-day invoice
                  </button>
                  <button type="button" onClick={() => decline(a)} style={{ flex: "0 0 auto", border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "10px 16px", fontWeight: 700, fontSize: 13.5 }}>
                    Decline
                  </button>
                </div>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
