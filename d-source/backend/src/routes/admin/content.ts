import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminContentRouter = Router();
adminContentRouter.use(requireStaff("Content"));

async function getValue<T>(key: string, fallback: T): Promise<T> {
  const { data } = await db.from("storefront_content").select("value").eq("key", key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

async function setValue(key: string, value: unknown) {
  await db.from("storefront_content").upsert({ key, value, updated_at: new Date().toISOString() });
}

adminContentRouter.get("/", async (_req, res) => {
  res.json({
    heroWords: await getValue("heroWords", []),
    bestSellers: await getValue("bestSellers", []),
    help: await getValue("help", {}),
    about: await getValue("about", ""),
    promo: await getValue("promo", ""),
    // Best-seller options: live products, as "For you · …" / "Business · …".
    products: ((await db.from("products").select("id, name, store").eq("is_active", true).order("name")).data ?? []),
  });
});

/** PUT /admin/content — "Publish content": hero words, best-seller slots,
 * top bar line, about intro and the delivery help text, all at once. */
adminContentRouter.put("/", async (req, res) => {
  const body = z
    .object({ heroWords: z.array(z.string().trim().min(1).max(40)).max(20), bestSellers: z.array(z.string()).max(12), promo: z.string().max(300), about: z.string().max(2000), helpDelivery: z.string().max(2000) })
    .parse(req.body);
  const help = await getValue<Record<string, string>>("help", {});
  await Promise.all([
    setValue("heroWords", body.heroWords),
    setValue("bestSellers", body.bestSellers.filter(Boolean)),
    setValue("promo", body.promo),
    setValue("about", body.about),
    setValue("help", { ...help, helpDelivery: body.helpDelivery }),
  ]);
  res.json({ ok: true });
});

adminContentRouter.put("/hero-words", async (req, res) => {
  const words = z.array(z.string()).parse(req.body.words);
  await setValue("heroWords", words);
  res.json({ ok: true });
});

const HERO_KITS = ["home", "office", "server-room", "shop", "hotel", "classroom"] as const;

/** Hero background images: one wide landscape image URL per kit; an empty
 * value clears it and the storefront shows the placeholder caption. */
adminContentRouter.put("/hero-images", async (req, res) => {
  const images = z.record(z.enum(HERO_KITS), z.string().trim().max(2000)).parse(req.body.images);
  const clean = Object.fromEntries(Object.entries(images).filter(([, v]) => v));
  await setValue("heroImages", clean);
  res.json({ ok: true });
});

adminContentRouter.put("/best-sellers", async (req, res) => {
  const ids = z.array(z.string()).min(1).max(12).parse(req.body.productIds);
  await setValue("bestSellers", ids);
  res.json({ ok: true });
});

adminContentRouter.put("/text", async (req, res) => {
  const body = z.object({ key: z.enum(["helpDelivery", "about", "promo"]), value: z.string() }).parse(req.body);
  const help = await getValue<Record<string, string>>("help", {});
  if (body.key === "about") await setValue("about", body.value);
  else {
    help[body.key] = body.value;
    await setValue("help", help);
  }
  res.json({ ok: true });
});
