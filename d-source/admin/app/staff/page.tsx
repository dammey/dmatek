"use client";

import { useEffect, useState } from "react";
import { Chip, PageHeader, btnPrimary, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const ROLES = ["Owner", "Sales", "Warehouse", "Engineer", "Support"];
const PERM_MODULES = [
  "Dashboard", "Reports", "Orders", "Quotes", "Payments", "Invoices", "Customers",
  "Installations", "Returns and repairs", "Site surveys", "Inventory",
  "Suppliers and POs", "Products", "Categories", "Kits", "Bulk upload", "Discounts",
  "Content", "Reviews", "Delivery zones", "Notifications", "Business accounts",
  "Enquiries", "Staff and roles", "Settings",
];

type StaffMember = { id: string; name: string; role: string; active: boolean; last_active_at: string | null };
type Permission = { role: string; module: string; allowed: boolean };

export default function StaffPage() {
  const [tab, setTab] = useState<"users" | "perms">("users");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [perms, setPerms] = useState<Permission[]>([]);
  const [invite, setInvite] = useState({ name: "", inviteEmail: "", role: "Support" });
  const { say } = useToast();

  function load() {
    api.get<{ staff: StaffMember[] }>("/admin/staff").then(({ staff }) => setStaff(staff));
    api.get<{ permissions: Permission[] }>("/admin/staff/permissions").then(({ permissions }) => setPerms(permissions));
  }
  useEffect(load, []);

  async function changeRole(id: string, role: string) {
    await api.patch(`/admin/staff/${id}`, { role });
    load();
  }

  async function toggleActive(id: string) {
    await api.patch(`/admin/staff/${id}`, { active: !staff.find((s) => s.id === id)?.active });
    load();
  }

  async function invitePerson() {
    if (!invite.name || !invite.inviteEmail) return say("Name and email are required");
    await api.post("/admin/staff", invite);
    setInvite({ name: "", inviteEmail: "", role: "Support" });
    say("Invite created");
    load();
  }

  function allowed(role: string, mod: string) {
    return role === "Owner" || perms.find((p) => p.role === role && p.module === mod)?.allowed;
  }

  async function togglePerm(role: string, mod: string) {
    if (role === "Owner") return;
    await api.patch(`/admin/staff/permissions/${role}/${encodeURIComponent(mod)}`, { allowed: !allowed(role, mod) });
    load();
  }

  return (
    <div>
      <PageHeader title="Staff and roles" subtitle="Who can see and change what" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <Chip label="Staff" active={tab === "users"} onClick={() => setTab("users")} />
        <Chip label="Permissions" active={tab === "perms"} onClick={() => setTab("perms")} />
      </div>

      {tab === "users" && (
        <>
          <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto", marginBottom: 16 }}>
            <div style={{ minWidth: 700 }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) 180px 140px 120px", gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
                <span>NAME</span>
                <span>ROLE</span>
                <span>LAST ACTIVE</span>
                <span>STATUS</span>
              </div>
              {staff.map((s) => (
                <div key={s.id} style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) 180px 140px 120px", gap: 12, padding: "12px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                  <span style={{ fontWeight: 700 }}>{s.name}</span>
                  <select value={s.role} onChange={(e) => changeRole(s.id, e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }}>
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <span style={{ color: "#5E6E68" }}>{s.last_active_at ? new Date(s.last_active_at).toLocaleDateString("en-NG") : "Invited"}</span>
                  <button
                    type="button"
                    onClick={() => toggleActive(s.id)}
                    disabled={s.role === "Owner"}
                    style={{ border: 0, borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 800, background: s.active ? "#D9F0E3" : "#FDE7E4", color: s.active ? "#1F7A5A" : "#B42318", justifySelf: "start" }}
                  >
                    {s.active ? "Active" : "Suspended"}
                  </button>
                </div>
              ))}
              {!staff.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No staff yet.</div>}
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Invite staff member</span>
            <label style={labelStyle}>
              NAME
              <input value={invite.name} onChange={(e) => setInvite((f) => ({ ...f, name: e.target.value }))} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              EMAIL
              <input value={invite.inviteEmail} onChange={(e) => setInvite((f) => ({ ...f, inviteEmail: e.target.value }))} type="email" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              ROLE
              <select value={invite.role} onChange={(e) => setInvite((f) => ({ ...f, role: e.target.value }))} style={inputStyle}>
                {ROLES.filter((r) => r !== "Owner").map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <button type="button" onClick={invitePerson} style={btnPrimary}>
              Invite staff member
            </button>
          </div>
        </>
      )}

      {tab === "perms" && (
        <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) repeat(5,110px)", gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
              <span>SECTION</span>
              {ROLES.map((r) => (
                <span key={r} style={{ textAlign: "center" }}>
                  {r}
                </span>
              ))}
            </div>
            {PERM_MODULES.map((mod) => (
              <div key={mod} style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) repeat(5,110px)", gap: 12, padding: "10px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                <span style={{ fontWeight: 700 }}>{mod}</span>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => togglePerm(r, mod)}
                    aria-label={`${mod} · ${r}`}
                    disabled={r === "Owner"}
                    style={{ justifySelf: "center", width: 30, height: 30, borderRadius: 8, border: `1px solid ${allowed(r, mod) ? "#06382E" : "rgba(6,56,46,.25)"}`, background: allowed(r, mod) ? "#06382E" : "#fff", color: "#F5F1E8", fontSize: 14, fontWeight: 800 }}
                  >
                    {allowed(r, mod) ? "✓" : ""}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
