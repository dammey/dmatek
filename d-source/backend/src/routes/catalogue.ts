import { Router } from "express";
import { db } from "../supabase.js";
import { SHOP_GROUPS, groupOf, shape } from "../shop.js";

export const catalogueRouter = Router();

/** Categories hidden in Admin › Categories: their products stay in the
 * catalogue but don't show to customers. Keyed "store|category_id". */
async function hiddenCategories() {
  const { data } = await db.from("category_placements").select("store, category_id").eq("is_active", false);
  return new Set((data ?? []).map((p) => `${p.store}|${p.category_id}`));
}
const visible = (hidden: Set<string>) => (p: { store: string; category_id?: string | null }) => !hidden.has(`${p.store}|${p.category_id}`);

const hasPhoto = (p: { images: unknown }) => (Array.isArray(p.images) && p.images.length > 0 ? 1 : 0);

/** GET /catalogue/products?q=&group=&cond=&mode=&brand=&sort=&limit=&offset=
 * (legacy: store=, category=, categoryName=, priceMin=, priceMax=, freeSetup=)
 * One catalogue: each row carries its shop group, condition and buying mode.
 * `brands` lists the brands in scope (search or group) before the
 * condition/mode/brand filters, so the brand row doesn't collapse. */
catalogueRouter.get("/products", async (req, res) => {
  const { store, category, categoryName, group, cond, mode, q, brand, priceMin, priceMax, freeSetup, sort, limit, offset } = req.query as Record<string, string | undefined>;

  let query = db
    .from("products")
    .select("id, sku, name, slug, unit, specs, images, category_id, store, categories(id, name, slug), product_prices(price_list, unit_price)")
    .eq("is_active", true);

  if (store) query = query.eq("store", store);
  if (category) query = query.eq("category_id", category);
  if (categoryName) {
    const { data: cat } = await db.from("categories").select("id").eq("name", categoryName).maybeSingle();
    if (!cat) return res.json({ items: [], total: 0, brands: [] });
    query = query.eq("category_id", cat.id);
  }

  const [{ data, error }, hidden] = await Promise.all([query, hiddenCategories()]);
  if (error) return res.status(500).json({ error: error.message });

  let items = (data ?? []).filter(visible(hidden)).map((p) => {
    const priceList = p.store === "provision" ? "business" : "retail";
    const priceRow = (p.product_prices as unknown as { price_list: string; unit_price: number }[]).find((pp) => pp.price_list === priceList);
    return shape({ ...p, price: priceRow?.unit_price ?? null });
  });

  const brandOf = (p: (typeof items)[number]) => String((p.specs as Record<string, unknown>)?.brand ?? "").trim();
  if (q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    items = items.filter((p) => {
      const hay = `${p.name} ${brandOf(p)} ${(p.categories as unknown as { name?: string } | null)?.name ?? ""} ${SHOP_GROUPS.find((g) => g.slug === p.group)?.name ?? ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }
  if (group) items = items.filter((p) => p.group === group);
  const brands = [...new Set(items.map(brandOf).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  if (cond) items = items.filter((p) => p.condition === cond);
  if (mode) items = items.filter((p) => p.mode === mode);
  if (brand) items = items.filter((p) => brandOf(p).toLowerCase() === brand.toLowerCase());
  if (freeSetup === "true") items = items.filter((p) => (p.specs as Record<string, unknown>)?.free === true);
  if (priceMin) items = items.filter((p) => (p.price ?? 0) >= Number(priceMin));
  if (priceMax) items = items.filter((p) => (p.price ?? 0) < Number(priceMax));
  // Unpriced rows sort last either way.
  const pv = (p: { price: number | null }, dir: number) => (p.price == null ? Infinity : dir * p.price);
  if (sort === "low") items.sort((a, b) => pv(a, 1) - pv(b, 1));
  else if (sort === "high") items.sort((a, b) => pv(a, -1) - pv(b, -1));
  else items.sort((a, b) => hasPhoto(b) - hasPhoto(a));

  const total = items.length;
  const start = Math.max(0, Number(offset) || 0);
  const size = limit ? Math.min(Math.max(1, Number(limit) || 1), 1000) : undefined;
  res.json({ items: size ? items.slice(start, start + size) : items.slice(start), total, brands });
});

/** GET /catalogue/groups — the ten shop groups with live product counts. */
catalogueRouter.get("/groups", async (_req, res) => {
  const [{ data, error }, hidden] = await Promise.all([db.from("products").select("name, store, specs, category_id, categories(name)").eq("is_active", true), hiddenCategories()]);
  if (error) return res.status(500).json({ error: error.message });
  const counts: Record<string, number> = {};
  for (const row of (data ?? []).filter(visible(hidden))) {
    const g = groupOf(row as unknown as { name: string; store: string; specs: unknown; categories?: unknown });
    counts[g] = (counts[g] ?? 0) + 1;
  }
  res.json({ groups: SHOP_GROUPS.map((g) => ({ ...g, count: counts[g.slug] ?? 0 })) });
});

/** GET /catalogue/category-counts?store= — live product count per category
 * name, so category grids don't have to download the whole catalogue. */
catalogueRouter.get("/category-counts", async (req, res) => {
  const { store } = req.query as { store?: string };
  let query = db.from("products").select("categories(name)").eq("is_active", true);
  if (store) query = query.eq("store", store);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const name = (row.categories as unknown as { name: string } | null)?.name;
    if (name) counts[name] = (counts[name] ?? 0) + 1;
  }
  res.json({ counts });
});

catalogueRouter.get("/products/:id", async (req, res) => {
  const { data, error } = await db
    .from("products")
    .select("*, categories(id, name, slug), product_prices(price_list, currency, unit_price), inventory(quantity_on_hand, quantity_reserved)")
    .eq("id", req.params.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  const priceList = data.store === "provision" ? "business" : "retail";
  const priceRow = (data.product_prices as { price_list: string; unit_price: number }[]).find((pp) => pp.price_list === priceList);
  res.json({ product: shape({ ...data, price: priceRow?.unit_price ?? null }) });
});

catalogueRouter.get("/categories", async (req, res) => {
  const { data, error } = await db.from("categories").select("id, name, slug, parent_id").order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ categories: data });
});

/** GET /catalogue/category-placements?store=emporium|provision — the live,
 * admin-managed category bar for a store: slug/label/order/show-hide,
 * plus the canonical category name products are filed under. */
catalogueRouter.get("/category-placements", async (req, res) => {
  const { store } = req.query as { store?: string };
  let query = db.from("category_placements").select("slug, label, sort_order, categories(name)").eq("is_active", true);
  if (store) query = query.eq("store", store);
  const { data, error } = await query.order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  const placements = (data ?? []).map((p) => ({ slug: p.slug, label: p.label, canonical: (p.categories as unknown as { name: string } | null)?.name ?? p.label }));
  res.json({ placements });
});

catalogueRouter.get("/kits", async (req, res) => {
  const { store } = req.query as { store?: string };
  let query = db.from("kits").select("id, key, name, short, store, photo_ref, is_chooser, live, kit_items(*)").eq("live", true);
  if (store) query = query.eq("store", store);
  const { data, error } = await query.order("sort_order");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ kits: data });
});

catalogueRouter.get("/kits/:key", async (req, res) => {
  const { data, error } = await db
    .from("kits")
    .select("id, key, name, short, store, photo_ref, is_chooser, kit_items(id, product_id, name, note, price, pin_x, pin_y, position)")
    .eq("key", req.params.key)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ kit: data });
});
