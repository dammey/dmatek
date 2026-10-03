"use client";

import { useEffect, useState } from "react";
import { Chip, PageHeader, btnGhost } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Template = { id: string; name: string; trigger_desc: string; channels: string[]; body: string; variables: string[]; audience: string; enabled: boolean };

export default function NotificationsPage() {
  const [audience, setAudience] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const { say } = useToast();

  function load() {
    const qs = audience ? `?audience=${audience}` : "";
    api.get<{ templates: Template[] }>(`/admin/notifications${qs}`).then(({ templates }) => {
      setTemplates(templates);
      setBodies(Object.fromEntries(templates.map((t) => [t.id, t.body])));
    });
  }
  useEffect(load, [audience]);

  async function toggle(t: Template) {
    await api.patch(`/admin/notifications/${t.id}`, { enabled: !t.enabled });
    load();
  }

  async function saveBody(id: string) {
    await api.patch(`/admin/notifications/${id}`, { body: bodies[id] });
    say("Saved");
  }

  async function test(id: string) {
    await api.post(`/admin/notifications/${id}/test`);
    say("Test sent to [ YOUR NUMBER ]");
  }

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Messages to customers and alerts to staff" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <Chip label="All" active={!audience} onClick={() => setAudience(null)} />
        <Chip label="To customers" active={audience === "customer"} onClick={() => setAudience("customer")} />
        <Chip label="Staff alerts" active={audience === "staff"} onClick={() => setAudience("staff")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,400px),1fr))", gap: 12 }}>
        {templates.map((t) => (
          <article key={t.id} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 18, display: "flex", flexDirection: "column", gap: 10, opacity: t.enabled ? 1 : 0.55 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</span>
                <span style={{ fontSize: 12.5, color: "#5E6E68" }}>When: {t.trigger_desc}</span>
              </span>
              <button type="button" onClick={() => toggle(t)} style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: t.enabled ? "#1F7A5A" : "#D9D4C8", position: "relative", flex: "0 0 auto" }}>
                <span style={{ position: "absolute", top: 4, left: t.enabled ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {t.channels.map((c) => (
                <span key={c} style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", padding: "4px 8px", borderRadius: 4, background: "#EFEADC" }}>
                  {c}
                </span>
              ))}
            </div>
            <textarea rows={4} value={bodies[t.id] ?? ""} onChange={(e) => setBodies((b) => ({ ...b, [t.id]: e.target.value }))} onBlur={() => saveBody(t.id)} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 10, fontSize: 14, resize: "vertical" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#5E6E68" }}>{t.variables.join(" ")}</span>
              <button type="button" onClick={() => test(t.id)} style={btnGhost}>
                Send test
              </button>
            </div>
          </article>
        ))}
        {!templates.length && <div style={{ background: "#fff", borderRadius: 20, padding: 24, color: "#5E6E68" }}>No templates.</div>}
      </div>
    </div>
  );
}
