"use client";

import { useEffect, useState } from "react";
import DrawerShell from "@/components/DrawerShell";
import { api } from "@/lib/api";
import { fmt } from "@/lib/format";
import { useSearch } from "@/lib/search-context";
import { useToast } from "@/lib/toast-context";

type Placement = { store: "emporium" | "provision"; label: string; sort_order: number; category_id: string };
type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  store: "emporium" | "provision";
  category_id: string | null;
  is_active: boolean;
  images: string[] | null;
  categories?: { name: string } | null;
  product_prices: { price_list: string; unit_price: number }[];
  inventory?: { quantity_on_hand: number }[];
  specs?: { brand?: string; spec?: string; free?: boolean; cond?: string; mode?: string } | null;
  condition: string;
  mode: string;
};

const COLS = "52px minmax(200px,1fr) 110px 130px 120px 80px 100px 100px 70px";
const tag = (store: string) => (store === "emporium" ? { label: "FOR YOU", bg: "#EFEADC", ink: "#06382E" } : { label: "BUSINESS", bg: "#06382E", ink: "#D4A637" });
const priceOf = (p: Product) => p.product_prices.find((x) => x.price_list === (p.store === "provision" ? "business" : "retail"))?.unit_price ?? null;
/** Units held, or null when the item is sourced on order (no stock held). */
const stockOf = (p: Product): number | null => p.inventory?.[0]?.quantity_on_hand ?? null;
/** Condition label as the admin edits it: "New" or "UK-used · Grade B". */
const condLabel = (p: Product) => p.specs?.cond || (p.condition.startsWith("Grade") ? `UK-used · ${p.condition}` : p.condition);
/** Spec line as the prototype shows it: spec · condition · buying mode. */
const specLine = (p: Product) => [p.specs?.spec, condLabel(p), p.mode === "Quote" ? "Price on quote" : "Buy now"].filter(Boolean).join(" · ");

function Toggle({ on }: { on: boolean }) {
  return (
    <span style={{ width: 44, height: 26, borderRadius: 999, background: on ? "#1F7A5A" : "#D9D4C8", position: "relative", display: "inline-block", flex: "0 0 auto" }}>
      <span style={{ position: "absolute", top: 4, left: on ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s ease" }} />
    </span>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [pCat, setPCat] = useState("all");
  const [edit, setEdit] = useState<Product | null>(null);
  const { q } = useSearch();

  function load() {
    api
      .get<{ products: Product[]; placements: Placement[] }>("/admin/products")
      .then((d) => {
        setProducts(d.products);
        setPlacements(d.placements);
      })
      .catch(() => setProducts([]));
  }
  useEffect(load, []);

  const labelFor = (p: Product) => placements.find((x) => x.store === p.store && x.category_id === p.category_id)?.label ?? p.categories?.name ?? "—";
  const opts = [{ v: "all", l: "All categories" }, ...placements.map((x) => ({ v: `${x.store}|${x.category_id}`, l: `${x.store === "emporium" ? "For you" : "Business"} · ${x.label}` }))];
  const needle = q.trim().toLowerCase();
  const list = (products ?? []).filter(
    (p) => (pCat === "all" || `${p.store}|${p.category_id}` === pCat) && (!needle || `${p.name} ${p.specs?.brand ?? ""} ${specLine(p)}`.toLowerCase().includes(needle)),
  );
  // Long catalogues render in pages of 200 so the table stays quick.
  const [limit, setLimit] = useState(200);

  async function toggleLive(p: Product) {
    setProducts((ps) => (ps ?? []).map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
    await api.patch(`/admin/products/${p.id}`, { isActive: !p.is_active });
  }

  const blank = (): Product => ({
    id: "",
    sku: "",
    name: "",
    slug: "",
    store: "emporium",
    category_id: placements.find((x) => x.store === "emporium")?.category_id ?? null,
    is_active: false,
    images: [],
    product_prices: [],
    inventory: [],
    specs: { brand: "", spec: "", free: false, cond: "New", mode: "Buy now" },
    condition: "New",
    mode: "Buy now",
  });

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={pCat} onChange={(e) => setPCat(e.target.value)} style={{ border: "1px solid rgba(6,56,46,.18)", borderRadius: 999, padding: "10px 14px", fontSize: 14, background: "#fff", color: "#06382E" }}>
          {opts.map((o) => (
            <option key={o.v} value={o.v}>
              {o.l}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 13.5, color: "#5E6E68", flex: 1 }}>{products ? `${list.length} products` : "Loading…"}</span>
        <button type="button" onClick={() => setEdit(blank())} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "12px 20px", fontWeight: 800, fontSize: 14 }}>
          Add product
        </button>
      </div>
      <div style={{ background: "#fff", border: "1px solid rgba(6,56,46,.1)", borderRadius: 22, overflowX: "auto" }}>
        <div style={{ minWidth: 900 }}>
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "12px 18px", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#5E6E68", borderBottom: "1px solid #EEEAE2" }}>
            <span />
            <span>PRODUCT</span>
            <span>JOURNEY</span>
            <span>CATEGORY</span>
            <span>PRICE</span>
            <span>STOCK</span>
            <span>SET-UP</span>
            <span>LIVE</span>
            <span />
          </div>
          {list.slice(0, limit).map((p) => {
            const t = tag(p.store);
            const stock = stockOf(p);
            const price = priceOf(p);
            return (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "10px 18px", alignItems: "center", borderBottom: "1px solid #F3F0E9", fontSize: 14 }}>
                <span style={{ width: 44, height: 44, position: "relative", borderRadius: 10, overflow: "hidden", background: "#F6F4EF", display: "block" }}>
                  {p.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
                  )}
                </span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ fontWeight: 700 }}>{p.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "#5E6E68" }}>
                    {p.specs?.brand || "[ BRAND ]"} · {specLine(p)}
                  </span>
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: ".1em", padding: "4px 8px", borderRadius: 4, background: t.bg, color: t.ink, justifySelf: "start" }}>{t.label}</span>
                <span style={{ color: "#3A4A44" }}>{labelFor(p)}</span>
                <span style={{ fontWeight: 800 }}>{price != null ? fmt(price) : "[ price ]"}</span>
                {stock == null ? <span style={{ color: "#5E6E68" }}>On order</span> : <span style={{ fontWeight: 800, color: stock < 3 ? "#B42318" : "#06382E" }}>{stock}</span>}
                <span style={{ fontSize: 12.5, fontWeight: 700, color: p.specs?.free ? "#1F7A5A" : "#5E6E68" }}>{p.specs?.free ? "Free" : "Paid add-on"}</span>
                <button type="button" onClick={() => toggleLive(p)} aria-label="Toggle live" style={{ width: 44, height: 26, borderRadius: 999, border: 0, background: p.is_active ? "#1F7A5A" : "#D9D4C8", position: "relative", padding: 0 }}>
                  <span style={{ position: "absolute", top: 4, left: p.is_active ? 22 : 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s ease" }} />
                </button>
                <button type="button" onClick={() => setEdit(p)} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "7px 12px", fontSize: 13, fontWeight: 700 }}>
                  Edit
                </button>
              </div>
            );
          })}
          {products && !list.length && <div style={{ padding: "28px 18px", color: "#5E6E68" }}>No products match.</div>}
          {list.length > limit && (
            <button type="button" onClick={() => setLimit((l) => l + 200)} style={{ display: "block", margin: "14px auto", border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "9px 16px", fontSize: 13, fontWeight: 700 }}>
              Show more ({list.length - limit} left)
            </button>
          )}
        </div>
      </div>
      {edit && <ProductDrawer product={edit} opts={opts.slice(1)} onClose={() => setEdit(null)} onSaved={load} />}
    </>
  );
}

const field: React.CSSProperties = { border: "1px solid rgba(6,56,46,.2)", borderRadius: 12, padding: 12, fontSize: 14.5, letterSpacing: 0, fontWeight: 500, background: "#fff", color: "#06382E" };
const label: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".14em" };

function ProductDrawer({ product, opts, onClose, onSaved }: { product: Product; opts: { v: string; l: string }[]; onClose: () => void; onSaved: () => void }) {
  const { say } = useToast();
  const [e, setE] = useState({
    name: product.name,
    brand: product.specs?.brand ?? "",
    spec: product.specs?.spec ?? "",
    cond: condLabel(product),
    mode: product.mode,
    price: priceOf(product) ?? 0,
    stock: stockOf(product)?.toString() ?? "",
    catKey: `${product.store}|${product.category_id ?? ""}`,
    free: !!product.specs?.free,
    live: product.is_active,
    img: product.images?.[0] ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const used = /used|grade/i.test(e.cond);
  const kick = `${(e.cond || "New").toUpperCase()} · ${e.mode === "Quote" ? "QUOTE" : "BUY NOW"} · D’SOURCE WARRANTY ${used ? "7 DAYS" : "1 MONTH"}`;
  const num = (v: string) => parseInt(v.replace(/\D/g, ""), 10) || 0;

  async function save() {
    const [store, categoryId] = e.catKey.split("|") as ["emporium" | "provision", string];
    const slug = product.slug || `${e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36)}`;
    const body = {
      name: e.name,
      sku: product.sku || slug,
      slug,
      store,
      categoryId: categoryId || undefined,
      price: e.price || undefined,
      stock: e.stock.trim() === "" ? null : num(e.stock),
      specs: { ...(product.specs ?? {}), brand: e.brand, spec: e.spec, cond: e.cond, mode: e.mode, free: e.free },
      isActive: e.live,
    };
    let id = product.id;
    if (id) await api.patch(`/admin/products/${id}`, body);
    else id = (await api.post<{ id: string }>("/admin/products", body)).id;
    if (file) await api.upload(`/admin/products/${id}/image`, file);
    say(`${e.name || "Product"} saved`);
    onSaved();
    onClose();
  }

  const fields: [keyof typeof e, string, string, boolean?][] = [
    ["name", "PRODUCT NAME", "1/-1"],
    ["brand", "BRAND", "auto"],
    ["spec", "KEY SPEC", "auto"],
    ["cond", "CONDITION (New, UK-used · Grade A / B / C)", "auto"],
    ["mode", "BUYING (Buy now or Quote)", "auto"],
    ["price", "PRICE (₦)", "auto", true],
    ["stock", "STOCK (blank = sourced on order)", "auto"],
  ];

  return (
    <DrawerShell kicker={kick} title={e.name || "New product"} onClose={onClose}>
      <label style={{ position: "relative", aspectRatio: "16/10", borderRadius: 18, overflow: "hidden", background: "#F6F4EF", display: "block", cursor: "pointer" }}>
        {e.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#5E6E68" }}>Drop the main product photo</span>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Drop the main product photo"
          onChange={(ev) => {
            const f = ev.target.files?.[0];
            if (!f) return;
            setFile(f);
            setE((x) => ({ ...x, img: URL.createObjectURL(f) }));
          }}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
        />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
        {fields.map(([key, l, span, isNum]) => (
          <label key={key} style={{ ...label, gridColumn: span }}>
            {l}
            <input value={String(e[key] ?? "")} onChange={(ev) => setE((x) => ({ ...x, [key]: isNum ? num(ev.target.value) : ev.target.value }))} style={field} />
          </label>
        ))}
        <label style={{ ...label, gridColumn: "1/-1" }}>
          CATEGORY
          <select value={e.catKey} onChange={(ev) => setE((x) => ({ ...x, catKey: ev.target.value }))} style={{ ...field, letterSpacing: undefined, fontWeight: undefined }}>
            {opts.map((c) => (
              <option key={c.v} value={c.v}>
                {c.l}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(
          [
            ["Free set-up", "free"],
            ["Live on the storefront", "live"],
          ] as const
        ).map(([l, k]) => (
          <button
            key={k}
            type="button"
            onClick={() => setE((x) => ({ ...x, [k]: !x[k] }))}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, border: "1px solid #EEEAE2", background: "#fff", borderRadius: 14, padding: "12px 14px", fontSize: 14.5, fontWeight: 700, color: "#06382E", textAlign: "left" }}
          >
            <span>{l}</span>
            <Toggle on={e[k]} />
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={save} style={{ border: 0, background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "13px 22px", fontWeight: 800, fontSize: 14.5 }}>
          Save product
        </button>
        <button type="button" onClick={onClose} style={{ border: "1px solid rgba(6,56,46,.2)", background: "#fff", color: "#06382E", borderRadius: 999, padding: "12px 20px", fontWeight: 700, fontSize: 14.5 }}>
          Cancel
        </button>
      </div>
    </DrawerShell>
  );
}
