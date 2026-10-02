"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, btnPrimary, inputStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

type Category = { id: string; name: string; slug: string };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const { say } = useToast();

  function load() {
    api.get<{ categories: Category[] }>("/admin/categories").then(({ categories }) => setCategories(categories));
  }
  useEffect(load, []);

  async function add() {
    if (!newName.trim()) return;
    await api.post("/admin/categories", { name: newName, slug: newName.toLowerCase().replace(/\W+/g, "-") });
    setNewName("");
    say(`${newName} added`);
    load();
  }

  return (
    <div>
      <PageHeader title="Categories" subtitle="What customers see in the category bar" />
      <Card>
        {categories.map((c, i) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr)", gap: 12, alignItems: "center", borderTop: i ? "1px solid #EEEAE2" : undefined, padding: "11px 0" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#5E6E68" }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
          </div>
        ))}
        {!categories.length && <p style={{ color: "#5E6E68" }}>No categories yet.</p>}
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #EEEAE2", paddingTop: 12, marginTop: 4 }}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category name" style={{ ...inputStyle, flex: 1, borderRadius: 999 }} />
          <button type="button" onClick={add} style={btnPrimary}>
            Add
          </button>
        </div>
      </Card>
    </div>
  );
}
