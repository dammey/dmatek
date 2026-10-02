"use client";

import { useEffect, useState } from "react";
import DrawerShell from "@/components/DrawerShell";
import { PageHeader, Row, Table, btnGhost, btnPrimary, inputStyle, labelStyle } from "@/components/ui";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

type Category = { id: string; name: string };
type Product = {
  id: string;
  sku: string;
  name: string;
  store: string;
  category_id: string | null;
  is_active: boolean;
  categories?: { name: string };
  product_prices: { price_list: string; unit_price: number }[];
  inventory?: { quantity_on_hand: number }[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const { say } = useToast();

  function load() {
    api.get<{ products: Product[] }>("/admin/products").then(({ products }) => setProducts(products));
  }
  useEffect(() => {
    load();
    api.get<{ categories: Category[] }>("/catalogue/categories").then(({ categories }) => setCategories(categories));
  }, []);

  async function toggleLive(p: Product) {
    await api.patch(`/admin/products/${p.id}`, { isActive: !p.is_active });
    load();
  }

  function newProduct(): Product {
    return { id: "", sku: "", name: "", store: "emporium", category_id: null, is_active: false, product_prices: [], inventory: [{ quantity_on_hand: 0 }] };
  }

  return (
    <div>
      <PageHeader title="Products" subtitle="The catalogue on D’Emporium and D’Provision" />
      <button type="button" onClick={() => setEditing(newProduct())} style={{ ...btnPrimary, marginBottom: 16 }}>
        Add product
      </button>
      <Table cols="minmax(200px,1fr) 110px 120px 80px 100px 70px" head={["PRODUCT", "STORE", "PRICE", "STOCK", "LIVE", ""]} minWidth="820px">
        {products.map((p) => {
          const priceList = p.store === "provision" ? "business" : "retail";
          const price = p.product_prices.find((pp) => pp.price_list === priceList)?.unit_price ?? null;
          const stock = p.inventory?.[0]?.quantity_on_hand ?? 0;
          return (
            <Row key={p.id} cols="minmax(200px,1fr) 110px 120px 80px 100px 70px">
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", padding: "4px 8px", borderRadius: 4, background: p.store === "emporium" ? "#0C1411" : "#06382E", color: p.store === "emporium" ? "#A6F000" : "#D4A637", justifySelf: "start" }}>
                {p.store === "emporium" ? "EMPORIUM" : "PROVISION"}
              </span>
              <span style={{ fontWeight: 800 }}>{fmt(price)}</span>
              <span style={{ fontWeight: 800, color: stock < 3 ? "#B42318" : "#06382E" }}>{stock}</span>
              <button type="button" onClick={() => toggleLive(p)} style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: p.is_active ? "#1F7A5A" : "#D9D4C8", position: "relative" }}>
                <span style={{ position: "absolute", top: 4, left: p.is_active ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s ease" }} />
              </button>
              <button type="button" onClick={() => setEditing(p)} style={btnGhost}>
                Edit
              </button>
            </Row>
          );
        })}
        {!products.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No products yet.</div>}
      </Table>

      {editing && (
        <ProductDrawer
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            load();
            say("Product saved");
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProductDrawer({ product, categories, onClose, onSaved }: { product: Product; categories: Category[]; onClose: () => void; onSaved: () => void }) {
  const priceList = product.store === "provision" ? "business" : "retail";
  const [form, setForm] = useState({
    name: product.name,
    sku: product.sku,
    store: product.store,
    categoryId: product.category_id ?? "",
    price: String(product.product_prices.find((p) => p.price_list === priceList)?.unit_price ?? ""),
  });

  async function save() {
    const body = { name: form.name, sku: form.sku || form.name.toLowerCase().replace(/\W+/g, "-"), slug: form.name.toLowerCase().replace(/\W+/g, "-"), store: form.store as "emporium" | "provision", categoryId: form.categoryId || undefined, price: Number(form.price) || undefined };
    if (product.id) await api.patch(`/admin/products/${product.id}`, body);
    else await api.post("/admin/products", body);
    onSaved();
  }

  return (
    <DrawerShell kicker={form.store === "emporium" ? "D’EMPORIUM" : "D’PROVISION"} title={form.name || "New product"} onClose={onClose}>
      <label style={labelStyle}>
        PRODUCT NAME
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        SKU
        <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        STORE
        <select value={form.store} onChange={(e) => setForm((f) => ({ ...f, store: e.target.value }))} style={inputStyle}>
          <option value="emporium">D’Emporium · Home</option>
          <option value="provision">D’Provision · Business</option>
        </select>
      </label>
      <label style={labelStyle}>
        CATEGORY
        <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} style={inputStyle}>
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label style={labelStyle}>
        PRICE (₦)
        <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value.replace(/\D/g, "") }))} inputMode="numeric" style={inputStyle} />
      </label>
      <button type="button" onClick={save} style={btnPrimary}>
        Save product
      </button>
    </DrawerShell>
  );
}
