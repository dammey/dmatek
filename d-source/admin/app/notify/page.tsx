"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Template = { id: string; name: string; trigger_desc: string; channels: string[]; body: string; variables: string[]; audience: "customer" | "staff"; enabled: boolean };
const CHC: Record<string, [string, string]> = { WHATSAPP: ["#DCF8C6", "#1F5E2E"], SMS: ["#DCEBFF", "#1B4A8A"], EMAIL: ["#EFEADC", "#06382E"], "IN-APP": ["#FFF1CC", "#7A5B00"] };
const FILTERS: ["all" | "customer" | "staff", string][] = [["all", "All"], ["customer", "To customers"], ["staff", "Staff alerts"]];

export default function NotificationsPage() {
  const [list, setList] = useState<Template[]>([]);
  const [filter, setFilter] = useState<"all" | "customer" | "staff">("all");
  const { say } = useToast();

  useEffect(() => {
    api.get<{ templates: Template[] }>("/admin/notifications").then(({ templates }) => setList(templates));
  }, []);

  async function toggle(t: Template) {
    setList((l) => l.map((x) => (x.id === t.id ? { ...x, enabled: !x.enabled } : x)));
    await api.patch(`/admin/notifications/${t.id}`, { enabled: !t.enabled });
  }
  async function saveBody(t: Template, body: string) {
    if (body === t.body) return;
    await api.patch(`/admin/notifications/${t.id}`, { body });
    say(`“${t.name}” saved`);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FILTERS.map(([id, l]) => (
          <Chip key={id} label={l} active={filter === id} onClick={() => setFilter(id)} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,400px),1fr))", gap: 12 }}>
        {list
          .filter((n) => filter === "all" || n.audience === filter)
          .map((n) => (
            <article key={n.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 18, display: "flex", flexDirection: "column", gap: 10, opacity: n.enabled ? 1 : 0.55 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 16 }}>{n.name}</span>
                  <span style={{ fontSize: 12.5, color: "#5E6E68" }}>When: {n.trigger_desc}</span>
                </span>
                <button type="button" onClick={() => toggle(n)} aria-label={`Turn ${n.name} ${n.enabled ? "off" : "on"}`} style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: n.enabled ? "#1F7A5A" : "#D9D4C8", position: "relative", padding: 0, flex: "0 0 auto" }}>
                  <span style={{ position: "absolute", top: 4, left: n.enabled ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s ease" }} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {n.channels.map((c) => (
                  <span key={c} style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: ".12em", padding: "4px 8px", borderRadius: 4, background: (CHC[c] ?? CHC.EMAIL)[0], color: (CHC[c] ?? CHC.EMAIL)[1] }}>
                    {c}
                  </span>
                ))}
              </div>
              <textarea
                rows={4}
                defaultValue={n.body}
                onBlur={(e) => saveBody(n, e.target.value)}
                style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: "10px 12px", fontSize: 14, background: "#fff", color: "#06382E", lineHeight: 1.5, resize: "vertical" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#5E6E68" }}>{n.variables.join(" ")}</span>
                <button
                  type="button"
                  onClick={async () => {
                    await api.post(`/admin/notifications/${n.id}/test`);
                    say(`Test “${n.name}” sent to [ YOUR NUMBER ]`);
                  }}
                  style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "7px 12px", fontSize: 12.5, fontWeight: 800 }}
                >
                  Send test
                </button>
              </div>
            </article>
          ))}
      </div>
    </>
  );
}
