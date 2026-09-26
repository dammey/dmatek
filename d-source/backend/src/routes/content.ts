import { Router } from "express";
import { db } from "../supabase.js";

export const contentRouter = Router();

async function getValue<T>(key: string, fallback: T): Promise<T> {
  const { data } = await db.from("storefront_content").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

/** GET /content — public, read-only: the storefront's CMS-driven bits
 * (hero words, best-seller product ids, help/about text). */
contentRouter.get("/", async (_req, res) => {
  const heroWords = await getValue<string[]>("heroWords", []);
  const bestSellerIds = await getValue<string[]>("bestSellers", []);
  const help = await getValue<Record<string, string>>("help", {});
  const about = await getValue<string>("about", "");

  let bestSellers: unknown[] = [];
  if (bestSellerIds.length) {
    const { data } = await db.from("products").select("id, name, slug, images, category_id, product_prices(price_list, unit_price)").in("id", bestSellerIds);
    bestSellers = data ?? [];
  }

  res.json({ heroWords, bestSellers, help, about });
});
