import { Router } from "express";
import { db } from "../supabase.js";

export const contentRouter = Router();

async function getValue<T>(key: string, fallback: T): Promise<T> {
  const { data } = await db.from("storefront_content").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

/** GET /content — public, read-only: the storefront's CMS-driven bits
 * (hero words, best-seller product ids, help/about text). */
type PublicSettings = { address?: string; returnsPolicy?: string; businessAccountReviewTime?: string; deliveryTimesAndFees?: string; podAreas?: string };

contentRouter.get("/", async (_req, res) => {
  const heroWords = await getValue<string[]>("heroWords", []);
  const bestSellerIds = await getValue<string[]>("bestSellers", []);
  const help = await getValue<Record<string, string>>("help", {});
  const about = await getValue<string>("about", "");
  const settings = await getValue<PublicSettings>("settings", {});

  let bestSellers: unknown[] = [];
  if (bestSellerIds.length) {
    // Same row shape as /catalogue/products so ProductCard gets price, store and specs.
    const { data } = await db
      .from("products")
      .select("id, sku, name, slug, unit, specs, images, category_id, store, categories(id, name, slug), product_prices(price_list, unit_price)")
      .in("id", bestSellerIds)
      .eq("is_active", true);
    const rows = (data ?? []).map((p) => {
      const priceList = p.store === "provision" ? "business" : "retail";
      const priceRow = (p.product_prices as unknown as { price_list: string; unit_price: number }[]).find((pp) => pp.price_list === priceList);
      return { ...p, price: priceRow?.unit_price ?? null };
    });
    // Keep the order the admin chose.
    bestSellers = bestSellerIds.map((id) => rows.find((r) => r.id === id)).filter(Boolean);
  }

  res.json({ heroWords, bestSellers, help, about, settings });
});
