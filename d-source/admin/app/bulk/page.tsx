"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

const COLS = ["sku", "name", "brand", "store", "category", "spec", "price", "stock", "free_setup"];
const GRID = "110px minmax(180px,1fr) 110px 130px 120px 80px 160px";

type Check = "" | "Updates existing" | "Missing price" | "Unknown category";
type Row = { sku: string; name: string; brand: string; store: "home" | "business"; category: string; spec: string; price: number; stock: number; freeSetup: boolean; check: Check };
const BCK: Record<Check, [string, string, string]> = {
  "": ["Ready", "#D9F0E3", "#1F7A5A"],
  "Updates existing": ["Updates existing", "#DCEBFF", "#1B4A8A"],
  "Missing price": ["Missing price", "#FDE7E4", "#B42318"],
  "Unknown category": ["Unknown category", "#FDE7E4", "#B42318"],
};

/** Splits one CSV line, honouring quoted cells ("a, b"). */
function cells(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && line[i + 1] === '"' && q) {
      cur += '"';
      i++;
    } else if (c === '"') q = !q;
    else if (c === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}

const yes = (v: string) => /^(yes|y|true|1)$/i.test(v.trim());
const num = (v: unknown) => Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0;

export default function BulkUploadPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [skus, setSkus] = useState<Set<string>>(new Set());
  const [cats, setCats] = useState<Set<string>>(new Set());
  const { say } = useToast();

  useEffect(() => {
    api.get<{ products: { sku: string }[]; placements: { label: string }[] }>("/admin/products").then(({ products, placements }) => {
      setSkus(new Set(products.map((p) => p.sku)));
      setCats((c) => new Set([...c, ...placements.map((p) => p.label.toLowerCase())]));
    });
    api.get<{ categories: { name: string }[] }>("/catalogue/categories").then(({ categories }) => setCats((c) => new Set([...c, ...categories.map((x) => x.name.toLowerCase())])));
  }, []);

  function toRows(table: string[][]) {
    const [head, ...body] = table;
    const idx = (k: string) => head.findIndex((h) => String(h).trim().toLowerCase() === k);
    const get = (r: string[], k: string) => String(r[idx(k)] ?? "").trim();
    return body
      .filter((r) => r.some((c) => String(c ?? "").trim()))
      .map((r): Row => {
        const row = {
          sku: get(r, "sku"),
          name: get(r, "name"),
          brand: get(r, "brand"),
          store: (/business/i.test(get(r, "store")) ? "business" : "home") as Row["store"],
          category: get(r, "category"),
          spec: get(r, "spec"),
          price: num(get(r, "price")),
          stock: num(get(r, "stock")),
          freeSetup: yes(get(r, "free_setup")),
          check: "" as Check,
        };
        row.check = !row.price ? "Missing price" : !cats.has(row.category.toLowerCase()) ? "Unknown category" : skus.has(row.sku) ? "Updates existing" : "";
        return row;
      });
  }

  async function onFile(f: File) {
    try {
      if (/\.xlsx?$/i.test(f.name)) {
        const { default: readXlsx } = await import("read-excel-file");
        const sheet = await readXlsx(f);
        setRows(toRows(sheet.map((r) => r.map((c) => (c == null ? "" : String(c))))));
      } else {
        const text = await f.text();
        setRows(toRows(text.split(/\r?\n/).filter((l) => l.trim()).map(cells)));
      }
    } catch {
      say("Couldn’t read that file. Use CSV or Excel with a header row.");
    }
  }

  /** "Load a sample file": downloads a template with the right columns. */
  function sample() {
    const csv = `${COLS.join(",")}\n[ SKU ],[ PRODUCT NAME ],[ BRAND ],home,Laptops,[ KEY SPEC ],[ PRICE ],[ STOCK ],no\n`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "dsource-bulk-upload-sample.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const ok = (rows ?? []).filter((r) => r.check === "" || r.check === "Updates existing");

  async function doImport() {
    const { imported } = await api.post<{ imported: number }>("/admin/products/bulk", {
      rows: ok.map((r) => ({ sku: r.sku, name: r.name, brand: r.brand || undefined, store: r.store, category: r.category, spec: r.spec || undefined, price: r.price, stock: r.stock, freeSetup: r.freeSetup })),
    });
    say(`${imported} rows imported · new products hidden until checked`);
    setRows(null);
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 16, alignItems: "start" }}>
        <section style={{ border: "2px dashed rgba(6,56,46,.3)", borderRadius: 22, background: "#fff", padding: 28, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontWeight: 800, fontSize: 20 }}>Upload a spreadsheet</span>
          <span style={{ fontSize: 14, lineHeight: 1.55, color: "#3A4A44" }}>CSV or Excel. One row per product. New products are added as hidden until you check them; existing products (same SKU) get the new price and stock.</span>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} style={{ fontSize: 14 }} />
          <button type="button" onClick={sample} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "10px 16px", fontWeight: 800, fontSize: 13.5 }}>
            Load a sample file
          </button>
        </section>
        <section style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, padding: 22, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Columns</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {COLS.map((c) => (
              <span key={c} style={{ fontFamily: "var(--font-mono)", fontSize: 12, background: "#F5F1E8", borderRadius: 4, padding: "6px 10px" }}>
                {c}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 13, color: "#5E6E68" }}>Store is “home” or “business”. Free set-up is yes or no.</span>
        </section>
      </div>
      {rows && rows.length > 0 && (
        <>
          <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
            <div style={{ minWidth: 820 }}>
              <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
                <span>SKU</span>
                <span>NAME</span>
                <span>JOURNEY</span>
                <span>CATEGORY</span>
                <span>PRICE</span>
                <span>STOCK</span>
                <span>CHECK</span>
              </div>
              {rows.map((b, i) => (
                <div key={`${b.sku}-${i}`} style={{ display: "grid", gridTemplateColumns: GRID, gap: 12, padding: "11px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{b.sku}</span>
                  <span style={{ fontWeight: 700 }}>{b.name}</span>
                  <span>{b.store}</span>
                  <span>{b.category}</span>
                  <span>{b.price ? fmt(b.price) : "—"}</span>
                  <span>{b.stock}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, padding: "5px 10px", borderRadius: 999, background: BCK[b.check][1], color: BCK[b.check][2], justifySelf: "start" }}>{BCK[b.check][0]}</span>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={doImport} disabled={!ok.length} style={{ alignSelf: "flex-start", border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "14px 24px", fontWeight: 800, fontSize: 14.5 }}>
            Import {ok.length} rows · skip {rows.length - ok.length}
          </button>
        </>
      )}
    </>
  );
}
