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
  });
});

adminContentRouter.put("/hero-words", async (req, res) => {
  const words = z.array(z.string()).parse(req.body.words);
  await setValue("heroWords", words);
  res.json({ ok: true });
});

adminContentRouter.put("/best-sellers", async (req, res) => {
  const ids = z.array(z.string()).length(4).parse(req.body.productIds);
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
