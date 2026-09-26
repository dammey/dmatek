import { Router } from "express";
import { db } from "../supabase.js";

export const catalogueRouter = Router();

const STORE_MAP: Record<string, "emporium" | "provision"> = { emporium: "emporium", provision: "provision" };

/** GET /catalogue/products?store=&category=&q=&brand=&priceMin=&priceMax=&freeSetup=&sort= */
catalogueRouter.get("/products", async (req, res) => {
  const { store, category, q, brand, priceMin, priceMax, freeSetup, sort } = req.query as Record<string, string | undefined>;

  let query = db
    .from("products")
    .select(
      "id, sku, name, slug, description, unit, specs, images, is_active, category_id, categories(id, name, slug), product_prices(price_list, currency, unit_price)"
    )
    .eq("is_active", true);

  if (category) query = query.eq("category_id", category);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  let rows = data ?? [];
  const priceList = store && STORE_MAP[store] === "provision" ? "business" : "retail";
  let items = rows.map((p) => {
    const priceRow = (p.product_prices as unknown as { price_list: string; unit_price: number }[]).find(
      (pp) => pp.price_list === priceList
    );
    return { ...p, price: priceRow?.unit_price ?? null };
  });

  if (brand) items = items.filter((p) => (p.specs as Record<string, unknown>)?.brand === brand);
  if (freeSetup === "true") items = items.filter((p) => (p.specs as Record<string, unknown>)?.free === true);
  if (priceMin) items = items.filter((p) => (p.price ?? 0) >= Number(priceMin));
  if (priceMax) items = items.filter((p) => (p.price ?? 0) < Number(priceMax));
  if (sort === "low") items.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  else if (sort === "high") items.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  res.json({ items });
});

catalogueRouter.get("/products/:id", async (req, res) => {
  const { data, error } = await db
    .from("products")
    .select("*, categories(id, name, slug), product_prices(price_list, currency, unit_price), inventory(quantity_on_hand, quantity_reserved)")
    .eq("id", req.params.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ product: data });
});

catalogueRouter.get("/categories", async (req, res) => {
  const { data, error } = await db.from("categories").select("id, name, slug, parent_id").order("name");
  if (error) return res.status(500).json({ error: error.message });
  res.json({ categories: data });
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
