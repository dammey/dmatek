import { Router } from "express";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminCustomersRouter = Router();
adminCustomersRouter.use(requireStaff("Customers"));

adminCustomersRouter.get("/", async (req, res) => {
  const { type } = req.query as { type?: string };
  let query = db
    .from("customers")
    .select("*, orders(ref, placed_at, order_lines(quantity, unit_price)), addresses(city, is_default_shipping)");
  if (type) query = query.eq("type", type);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const customers = (data ?? []).map((c) => {
    const orders = (c.orders ?? []) as { ref: string; placed_at: string; order_lines: { quantity: number; unit_price: number }[] }[];
    const spent = orders.reduce((a, o) => a + o.order_lines.reduce((b, l) => b + l.quantity * l.unit_price, 0), 0);
    const lastOrder = orders.reduce<string | null>((latest, o) => (!latest || o.placed_at > latest ? o.placed_at : latest), null);
    const addresses = (c.addresses ?? []) as { city: string | null; is_default_shipping: boolean }[];
    const city = addresses.find((a) => a.is_default_shipping)?.city ?? addresses[0]?.city ?? null;
    return { ...c, orderCount: orders.length, spent, lastOrder, city };
  });

  res.json({ customers });
});

adminCustomersRouter.get("/:id", async (req, res) => {
  const { data, error } = await db.from("customers").select("*, orders(*), addresses(*)").eq("id", req.params.id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ customer: data });
});
