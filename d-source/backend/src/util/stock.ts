import { db } from "../supabase.js";

/** Live products whose held stock is below their reorder level. Items with no
 * inventory record are sourced on order and never count as low. */
export async function lowStockCount(): Promise<number> {
  const { data } = await db.from("inventory").select("quantity_on_hand, reorder_level, products!inner(is_active)").eq("products.is_active", true);
  return (data ?? []).filter((r) => r.quantity_on_hand < (r.reorder_level ?? 3)).length;
}
