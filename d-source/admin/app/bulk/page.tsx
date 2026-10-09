"use client";

import { useEffect, useState } from "react";
import { Card, Row, Table, btnPrimary } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

const COLS = ["sku", "name", "brand", "store", "category", "spec", "price", "stock", "free_setup"];

type BulkRow = { sku: string; name: string; brand?: string; store: "home" | "business"; category: string; spec?: string; price: number; stock: number; freeSetup?: boolean };

function parseCsv(text: string): BulkRow[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const cols = header.split(",").map((c) => c.trim());
  return lines.filter(Boolean).map((line) => {
    const cells = line.split(",");
    const row: Record<string, string> = {};
    cols.forEach((c, i) => (row[c] = cells[i]?.trim() ?? ""));
    return {
      sku: row.sku,
      name: row.name,
      brand: row.brand || undefined,
      store: row.store === "business" ? "business" : "home",
      category: row.category,
      spec: row.spec || undefined,
      price: Number(row.price) || 0,
      stock: Number(row.stock) || 0,
      freeSetup: row.free_setup === "true" || row.free_setup === "1",
    };
  });
}

export default function BulkUploadPage() {
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [existingSkus, setExistingSkus] = useState<Set<string>>(new Set());
  const { say } = useToast();

  useEffect(() => {
    api.get<{ products: { sku: string }[] }>("/admin/products").then(({ products }) => setExistingSkus(new Set(products.map((p) => p.sku))));
  }, []);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => setRows(parseCsv(text)));
  }

  async function doImport() {
    const { imported } = await api.post<{ imported: number }>("/admin/products/bulk", { rows });
    say(`${imported} rows imported · new products hidden until checked`);
    setRows([]);
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16, marginBottom: 16 }}>
        <section style={{ border: "2px dashed rgba(6,56,46,.3)", borderRadius: 22, background: "#fff", padding: 28, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontWeight: 800, fontSize: 20 }}>Upload a spreadsheet</span>
          <span style={{ fontSize: 14, lineHeight: 1.55, color: "#3A4A44" }}>CSV with a header row: {COLS.join(",")}. New SKUs land hidden until checked; existing SKUs update price and stock.</span>
          <input type="file" accept=".csv" onChange={onFile} />
        </section>
        <Card>
          <span style={{ fontWeight: 800, fontSize: 18, display: "block", marginBottom: 10 }}>Columns</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {COLS.map((c) => (
              <span key={c} style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "#F5F1E8", borderRadius: 4, padding: "6px 10px" }}>
                {c}
              </span>
            ))}
          </div>
        </Card>
      </div>
      {rows.length > 0 && (
        <>
          <Table cols="90px 110px minmax(160px,1fr) 90px 120px 110px 80px" head={["CHECK", "SKU", "NAME", "STORE", "CATEGORY", "PRICE", "STOCK"]} minWidth="820px">
            {rows.map((r) => {
              const isNew = !existingSkus.has(r.sku);
              return (
                <Row key={r.sku} cols="90px 110px minmax(160px,1fr) 90px 120px 110px 80px">
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: isNew ? "#EFEADC" : "#D9F0E3",
                      color: isNew ? "#06382E" : "#1F7A5A",
                      justifySelf: "start",
                    }}
                  >
                    {isNew ? "NEW · HIDDEN" : "UPDATE"}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.sku}</span>
                  <span style={{ fontWeight: 700 }}>{r.name}</span>
                  <span>{r.store}</span>
                  <span>{r.category}</span>
                  <span style={{ fontWeight: 800 }}>{fmt(r.price)}</span>
                  <span>{r.stock}</span>
                </Row>
              );
            })}
          </Table>
          <button type="button" onClick={doImport} style={{ ...btnPrimary, marginTop: 16 }}>
            Import {rows.length} rows
          </button>
        </>
      )}
    </div>
  );
}
