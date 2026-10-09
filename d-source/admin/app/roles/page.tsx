"use client";

import { useEffect, useState } from "react";
import DrawerShell from "@/components/DrawerShell";
import { Chip } from "@/components/ui";
import { api } from "@/lib/api";
import { shortDate } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

const ROLES = ["Owner", "Sales", "Warehouse", "Engineer", "Support"] as const;
type Role = (typeof ROLES)[number];
const MODULES = [
  "Dashboard", "Reports", "Orders", "Quotes", "Payments", "Invoices", "Customers",
  "Installations", "Returns and repairs", "Site surveys", "Inventory", "Suppliers and POs",
  "Products", "Categories", "Kits", "Bulk upload", "Discounts", "Content", "Reviews",
  "Delivery zones", "Notifications", "Business accounts", "Enquiries", "Staff and roles", "Settings",
];

type Staff = { id: string; name: string; role: Role; active: boolean; last_active_at: string | null };
type Perm = { role: string; module: string; allowed: boolean };
type Log = { text: string; who: string | null; created_at: string };

/** "Now", "12 min ago", "1h ago", "Today", "Yesterday", "26 Sep"; "Invited" until first sign-in. */
function lastActive(iso: string | null) {
  if (!iso) return "Invited";
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 5) return "Now";
  if (m < 60) return `${m} min ago`;
  if (m < 180) return `${Math.floor(m / 60)}h ago`;
  const day = (t: number) => Math.floor((t + 3600e3) / 86400e3);
  const d = day(Date.now()) - day(new Date(iso).getTime());
  return d === 0 ? "Today" : d === 1 ? "Yesterday" : shortDate(iso);
}

const sel: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, fontSize: 14, background: "#fff", color: "#06382E", padding: "8px 10px" };

export default function StaffRolesPage() {
  const [tab, setTab] = useState<"users" | "perms" | "log">("users");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [perms, setPerms] = useState<Perm[]>([]);
  const [log, setLog] = useState<Log[]>([]);
  const [invite, setInvite] = useState<{ name: string; email: string; role: Role } | null>(null);
  const { say } = useToast();

  function load() {
    api.get<{ staff: Staff[] }>("/admin/staff").then(({ staff }) => setStaff(staff));
    api.get<{ permissions: Perm[] }>("/admin/staff/permissions").then(({ permissions }) => setPerms(permissions));
    api.get<{ log: Log[] }>("/admin/staff/log").then(({ log }) => setLog(log)).catch(() => setLog([]));
  }
  useEffect(load, []);

  const allowed = (role: string, mod: string) => role === "Owner" || !!perms.find((p) => p.role === role && p.module === mod)?.allowed;

  async function setRole(s: Staff, role: Role) {
    setStaff((l) => l.map((x) => (x.id === s.id ? { ...x, role } : x)));
    await api.patch(`/admin/staff/${s.id}`, { role });
    say(`${s.name} is now ${role}`);
  }
  async function toggleActive(s: Staff) {
    if (s.role === "Owner") return;
    setStaff((l) => l.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
    await api.patch(`/admin/staff/${s.id}`, { active: !s.active });
  }
  async function togglePerm(role: Role, mod: string) {
    if (role === "Owner") return;
    const next = !allowed(role, mod);
    setPerms((ps) => (ps.some((p) => p.role === role && p.module === mod) ? ps.map((p) => (p.role === role && p.module === mod ? { ...p, allowed: next } : p)) : [...ps, { role, module: mod, allowed: next }]));
    await api.patch(`/admin/staff/permissions/${role}/${encodeURIComponent(mod)}`, { allowed: next });
  }
  async function sendInvite() {
    if (!invite?.name.trim() || !/\S+@\S+\.\S+/.test(invite.email)) return say("Add a name and an email address");
    await api.post("/admin/staff", { name: invite.name.trim(), inviteEmail: invite.email.trim(), role: invite.role });
    setInvite(null);
    setTab("users");
    say("Invite sent");
    load();
  }

  const head: React.CSSProperties = { gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2", display: "grid" };

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
          {(
            [
              ["users", "Staff"],
              ["perms", "Permissions"],
              ["log", "Activity log"],
            ] as const
          ).map(([id, l]) => (
            <Chip key={id} label={l} active={tab === id} onClick={() => setTab(id)} />
          ))}
        </div>
        <button type="button" onClick={() => setInvite({ name: "", email: "", role: "Support" })} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "11px 18px", fontWeight: 800, fontSize: 14 }}>
          Invite staff member
        </button>
      </div>

      {tab === "users" && (
        <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
          <div style={{ minWidth: 760 }}>
            <div style={{ ...head, gridTemplateColumns: "minmax(180px,1fr) 180px 140px 120px" }}>
              <span>NAME</span>
              <span>ROLE</span>
              <span>LAST ACTIVE</span>
              <span>STATUS</span>
            </div>
            {staff.map((u) => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) 180px 140px 120px", gap: 12, padding: "12px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                <span style={{ fontWeight: 700 }}>{u.name}</span>
                <select value={u.role} onChange={(e) => setRole(u, e.target.value as Role)} style={sel}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <span style={{ color: "#5E6E68" }}>{lastActive(u.last_active_at)}</span>
                <button type="button" onClick={() => toggleActive(u)} style={{ border: 0, borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 800, background: u.active ? "#D9F0E3" : "#FDE7E4", color: u.active ? "#1F7A5A" : "#B42318", justifySelf: "start" }}>
                  {u.active ? "Active" : "Suspended"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "perms" && (
        <>
          <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
            <div style={{ minWidth: 820 }}>
              <div style={{ ...head, gridTemplateColumns: "minmax(180px,1fr) repeat(5,110px)" }}>
                <span>SECTION</span>
                {ROLES.map((r) => (
                  <span key={r} style={{ textAlign: "center" }}>
                    {r}
                  </span>
                ))}
              </div>
              {MODULES.map((m) => (
                <div key={m} style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) repeat(5,110px)", gap: 12, padding: "10px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                  <span style={{ fontWeight: 700 }}>{m}</span>
                  {ROLES.map((r) => {
                    const on = allowed(r, m);
                    return (
                      <button key={r} type="button" onClick={() => togglePerm(r, m)} aria-label={`${m} · ${r}`} style={{ justifySelf: "center", width: 30, height: 30, borderRadius: 8, border: `1px solid ${on ? "#06382E" : "rgba(6,56,46,.25)"}`, background: on ? "#06382E" : "#fff", color: "#F5F1E8", fontSize: 14, fontWeight: 800 }}>
                        {on ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: "#5E6E68" }}>Owner access can’t be removed. Changes apply the next time a staff member signs in.</p>
        </>
      )}

      {tab === "log" && (
        <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: "6px 20px" }}>
          {log.map((l, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "110px minmax(0,1fr) 180px", gap: 12, padding: "12px 0", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
              <span style={{ color: "#5E6E68" }}>{lastActive(l.created_at) === "Now" ? "Just now" : lastActive(l.created_at)}</span>
              <span style={{ fontWeight: 600 }}>{l.text}</span>
              <span style={{ color: "#5E6E68", textAlign: "right" }}>{l.who ?? "[ STAFF ]"}</span>
            </div>
          ))}
          {!log.length && <div style={{ padding: "12px 0", fontSize: 14, color: "#5E6E68" }}>Nothing yet.</div>}
        </div>
      )}

      {invite && (
        <DrawerShell kicker="STAFF" title="Invite staff member" onClose={() => setInvite(null)}>
          {(
            [
              ["name", "NAME", "[ NEW STAFF MEMBER ]"],
              ["email", "EMAIL", "name@…"],
            ] as const
          ).map(([k, l, ph]) => (
            <label key={k} style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>
              {l}
              <input value={invite[k]} onChange={(e) => setInvite({ ...invite, [k]: e.target.value })} placeholder={ph} style={{ border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 12, fontSize: 14.5, letterSpacing: 0, fontWeight: 500, background: "#fff", color: "#06382E" }} />
            </label>
          ))}
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" }}>
            ROLE
            <select value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value as Role })} style={{ ...sel, padding: 12, fontSize: 14.5 }}>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={sendInvite} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "12px 20px", fontWeight: 800, fontSize: 14 }}>
              Send invite
            </button>
            <button type="button" onClick={() => setInvite(null)} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "12px 20px", fontWeight: 800, fontSize: 14 }}>
              Cancel
            </button>
          </div>
        </DrawerShell>
      )}
    </>
  );
}
