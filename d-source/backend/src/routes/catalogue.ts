import { Router } from "express";
import { db } from "../supabase.js";

export const catalogueRouter = Router();

/** GET /catalogue/products?store=&category=&categoryName=&q=&brand=&priceMin=&priceMax=&freeSetup=&sort=&limit=&offset=
 * Returns a lean listing row per product (no description) plus `total`, the
 * match count before limit/offset are applied. */
catalogueRouter.get("/products", async (req, res) => {
  const { store, category, categoryName, q, brand, priceMin, priceMax, freeSetup, sort, limit, offset } = req.query as Record<string, string | undefined>;

  let query = db
    .from("products")
    .select("id, sku, name, slug, unit, specs, images, category_id, store, categories(id, name, slug), product_prices(price_list, unit_price)")
    .eq("is_active", true);

  if (store) query = query.eq("store", store);
  if (category) query = query.eq("category_id", category);
  if (categoryName) {
    const { data: cat } = await db.from("categories").select("id").eq("name", categoryName).maybeSingle();
    if (!cat) return res.json({ items: [], total: 0 });
    query = query.eq("category_id", cat.id);
  }
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  let items = (data ?? []).map((p) => {
    const priceList = p.store === "provision" ? "business" : "retail";
    const priceRow = (p.product_prices as unknown as { price_list: string; unit_price: number }[]).find((pp) => pp.price_list === priceList);
    return { ...p, price: priceRow?.unit_price ?? null };
  });

  if (brand) items = items.filter((p) => (p.specs as Record<string, unknown>)?.brand === brand);
  if (freeSetup === "true") items = items.filter((p) => (p.specs as Record<string, unknown>)?.free === true);
  if (priceMin) items = items.filter((p) => (p.price ?? 0) >= Number(priceMin));
  if (priceMax) items = items.filter((p) => (p.price ?? 0) < Number(priceMax));
  if (sort === "low") items.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  else if (sort === "high") items.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  const total = items.length;
  const start = Math.max(0, Number(offset) || 0);
  const size = limit ? Math.min(Math.max(1, Number(limit) || 1), 1000) : undefined;
  res.json({ items: size ? items.slice(start, start + size) : items.slice(start), total });
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
  res.json({ product: { ...data, price: priceRow?.unit_price ?? null } });
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
