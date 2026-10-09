import { Router } from "express";
import { z } from "zod";
import { requireStaff } from "../../auth/middleware.js";
import { db } from "../../supabase.js";

export const adminCustomersRouter = Router();
adminCustomersRouter.use(requireStaff("Customers"));

adminCustomersRouter.get("/", async (req, res) => {
  const { type } = req.query as { type?: string };
  let query = db
    .from("customers")
    .select("*, orders(ref, placed_at, status, order_lines(quantity, unit_price)), addresses(city, state, is_default_shipping)");
  if (type) query = query.eq("type", type);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const customers = (data ?? []).map((c) => {
    const orders = (c.orders ?? []) as { ref: string; placed_at: string; order_lines: { quantity: number; unit_price: number }[] }[];
    const spent = orders.reduce((a, o) => a + o.order_lines.reduce((b, l) => b + l.quantity * l.unit_price, 0), 0);
    const lastOrder = orders.reduce<string | null>((latest, o) => (!latest || o.placed_at > latest ? o.placed_at : latest), null);
    const addresses = (c.addresses ?? []) as { city: string | null; state: string | null; is_default_shipping: boolean }[];
    const a = addresses.find((x) => x.is_default_shipping) ?? addresses[0];
    const city = a ? [a.city, a.state].filter(Boolean).join(", ") || null : null;
    const recent = [...orders].sort((x, y) => (x.placed_at < y.placed_at ? 1 : -1)).map((o) => ({ ref: o.ref, placed_at: o.placed_at, status: (o as { status?: string }).status ?? "pending", total: o.order_lines.reduce((b, l) => b + l.quantity * l.unit_price, 0) }));
    return { ...c, orders: recent, orderCount: orders.length, spent, lastOrder, city };
  });

  res.json({ customers });
});

adminCustomersRouter.get("/:id", async (req, res) => {
  const { data, error } = await db.from("customers").select("*, orders(*), addresses(*)").eq("id", req.params.id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Not found" });
  res.json({ customer: data });
});

adminCustomersRouter.patch("/:id/note", async (req, res) => {
  const { note } = z.object({ note: z.string().max(2000) }).parse(req.body);
  const { error } = await db.from("customers").update({ admin_note: note }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
