"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, btnGhost, btnPrimary, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Placement = { id: string; store: "emporium" | "provision"; slug: string; label: string; sortOrder: number; isActive: boolean; categoryId: string | null; categoryName: string };

const STORES: { key: "emporium" | "provision"; title: string }[] = [
  { key: "emporium", title: "D’Emporium · For home" },
  { key: "provision", title: "D’Provision · For business" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [addFor, setAddFor] = useState<"emporium" | "provision" | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const { say } = useToast();

  function load() {
    api.get<{ placements: Placement[] }>("/admin/categories").then(({ placements }) => setPlacements(placements));
  }
  useEffect(load, []);

  async function move(id: string, direction: "up" | "down") {
    await api.patch(`/admin/categories/${id}/move`, { direction });
    load();
  }

  async function toggleActive(p: Placement) {
    await api.patch(`/admin/categories/${p.id}`, { isActive: !p.isActive });
    say(p.isActive ? `${p.label} hidden from the category bar` : `${p.label} shown in the category bar`);
    load();
  }

  async function add(store: "emporium" | "provision") {
    if (!newCategoryName.trim() || !newLabel.trim()) return;
    await api.post("/admin/categories", { store, categoryName: newCategoryName.trim(), slug: slugify(newLabel.trim()), label: newLabel.trim() });
    say(`${newLabel} added to ${store === "emporium" ? "D’Emporium" : "D’Provision"}`);
    setNewCategoryName("");
    setNewLabel("");
    setAddFor(null);
    load();
  }

  return (
    <div>
      <PageHeader title="Categories" subtitle="What customers see in the category bar" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {STORES.map((s) => {
          const rows = placements.filter((p) => p.store === s.key).sort((a, b) => a.sortOrder - b.sortOrder);
          return (
            <Card key={s.key}>
              <span style={{ fontWeight: 800, fontSize: 17, display: "block", marginBottom: 12 }}>{s.title}</span>
              {rows.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 28px minmax(0,1fr) minmax(0,1fr) auto",
                    gap: 12,
                    alignItems: "center",
                    borderTop: i ? "1px solid #EEEAE2" : undefined,
                    padding: "11px 0",
                    opacity: p.isActive ? 1 : 0.45,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button
                      type="button"
                      onClick={() => move(p.id, "up")}
                      disabled={i === 0}
                      aria-label="Move up"
                      style={{ width: 22, height: 18, border: "1px solid rgba(6,56,46,.2)", background: "#fff", borderRadius: 4, fontSize: 11, lineHeight: 1, opacity: i === 0 ? 0.3 : 1 }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(p.id, "down")}
                      disabled={i === rows.length - 1}
                      aria-label="Move down"
                      style={{ width: 22, height: 18, border: "1px solid rgba(6,56,46,.2)", background: "#fff", borderRadius: 4, fontSize: 11, lineHeight: 1, opacity: i === rows.length - 1 ? 0.3 : 1 }}
                    >
                      ↓
                    </button>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#5E6E68" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{p.label}</span>
                  <span style={{ fontSize: 13, color: "#5E6E68" }}>
                    /{s.key}/{p.slug} · filed under &ldquo;{p.categoryName}&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleActive(p)}
                    style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: p.isActive ? "#1F7A5A" : "#D9D4C8", position: "relative", justifySelf: "end" }}
                    aria-label={p.isActive ? "Hide" : "Show"}
                  >
                    <span style={{ position: "absolute", top: 4, left: p.isActive ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
                  </button>
                </div>
              ))}
              {!rows.length && <p style={{ color: "#5E6E68" }}>No categories yet.</p>}

              {addFor === s.key ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #EEEAE2", paddingTop: 12, marginTop: 4, alignItems: "flex-end" }}>
                  <label style={{ ...labelStyle, flex: "1 1 200px" }}>
                    LABEL SHOWN IN NAV
                    <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} style={inputStyle} placeholder="e.g. Audio" />
                  </label>
                  <label style={{ ...labelStyle, flex: "1 1 200px" }}>
                    FILED UNDER (CATEGORY)
                    <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} style={inputStyle} placeholder="e.g. TV & Audio" />
                  </label>
                  <button type="button" onClick={() => add(s.key)} style={btnPrimary}>
                    Add
                  </button>
                  <button type="button" onClick={() => setAddFor(null)} style={btnGhost}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setAddFor(s.key)} style={{ ...btnGhost, marginTop: 12 }}>
                  Add category
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
