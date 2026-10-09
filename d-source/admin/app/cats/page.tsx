"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Placement = { id: string; store: "emporium" | "provision"; slug: string; label: string; sortOrder: number; isActive: boolean; categoryId: string | null; categoryName: string; productCount: number };
type Store = Placement["store"];

const STORES: { key: Store; title: string }[] = [
  { key: "emporium", title: "D’Emporium · Home" },
  { key: "provision", title: "D’Provision · Business" },
];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Categories publish to the storefront: order, labels and visibility here
 * drive the category bar, and hidden categories' products stay off the store. */
export default function CategoriesPage() {
  const [list, setList] = useState<Placement[]>([]);
  const [newCat, setNewCat] = useState<Record<Store, string>>({ emporium: "", provision: "" });
  const { say } = useToast();

  function load() {
    api.get<{ placements: Placement[] }>("/admin/categories").then(({ placements }) => setList(placements));
  }
  useEffect(load, []);

  async function move(id: string, direction: "up" | "down") {
    await api.patch(`/admin/categories/${id}/move`, { direction });
    load();
  }
  async function toggle(p: Placement) {
    setList((l) => l.map((x) => (x.id === p.id ? { ...x, isActive: !x.isActive } : x)));
    await api.patch(`/admin/categories/${p.id}`, { isActive: !p.isActive });
  }
  async function add(store: Store) {
    const v = newCat[store].trim();
    if (!v) return;
    const { placement } = await api.post<{ placement: { id: string } }>("/admin/categories", { store, categoryName: v, slug: slugify(v), label: v });
    await api.patch(`/admin/categories/${placement.id}`, { isActive: false });
    setNewCat((n) => ({ ...n, [store]: "" }));
    say(`${v} added (hidden until it has products)`);
    load();
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: 16, alignItems: "start" }}>
        {STORES.map((g) => {
          const rows = list.filter((p) => p.store === g.key).sort((a, b) => a.sortOrder - b.sortOrder);
          return (
            <section key={g.key} style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{g.title}</span>
              {rows.map((c, i) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) auto auto", gap: 12, alignItems: "center", borderTop: "1px solid #EEEAE2", padding: "11px 0" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#5E6E68" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, opacity: c.isActive ? 1 : 0.45 }}>{c.label}</span>
                    <span style={{ fontSize: 12.5, color: "#5E6E68" }}>{c.productCount} products</span>
                  </span>
                  <span style={{ display: "flex", gap: 4 }}>
                    <button type="button" onClick={() => move(c.id, "up")} aria-label="Move up" style={arrow}>
                      ↑
                    </button>
                    <button type="button" onClick={() => move(c.id, "down")} aria-label="Move down" style={arrow}>
                      ↓
                    </button>
                  </span>
                  <button type="button" onClick={() => toggle(c)} style={{ border: "1px solid rgba(6,56,46,.2)", background: c.isActive ? "#E3EEE8" : "#fff", color: "#06382E", borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {c.isActive ? "Visible" : "Hidden"}
                  </button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, borderTop: "1px solid #EEEAE2", paddingTop: 12, marginTop: 4 }}>
                <input
                  value={newCat[g.key]}
                  onChange={(e) => setNewCat((n) => ({ ...n, [g.key]: e.target.value }))}
                  placeholder="New category name"
                  style={{ flex: 1, border: "1px solid rgba(6,56,46,.18)", borderRadius: 999, padding: "10px 14px", fontSize: 14, background: "#fff", color: "#06382E" }}
                />
                <button type="button" onClick={() => add(g.key)} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "10px 16px", fontWeight: 800, fontSize: 13.5 }}>
                  Add
                </button>
              </div>
            </section>
          );
        })}
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: "#5E6E68" }}>Order here is the order on the storefront category bar and the All categories page. Hidden categories stay in the catalogue but don’t show to customers.</p>
    </>
  );
}

const arrow: React.CSSProperties = { width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(6,56,46,.18)", background: "#fff", color: "#06382E" };
