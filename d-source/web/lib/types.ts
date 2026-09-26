export type Store = "emporium" | "provision";

export type Category = { id: string; name: string; slug: string; parent_id: string | null };

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  unit: string;
  store: Store;
  specs: Record<string, unknown>;
  images: string[];
  category_id: string | null;
  categories?: Category;
  price: number | null;
};

export type KitItem = { id: string; product_id: string | null; name: string; note: string | null; price: number | null; pin_x: number; pin_y: number; position: number };
export type Kit = { id: string; key: string; name: string; short: string; store: Store; photo_ref: string | null; is_chooser: boolean; kit_items: KitItem[] };

export type CartItem = { id: string; product_id: string | null; name: string; price: number | null; quantity: number };
export type Cart = { id: string; kind: "cart" | "quote"; channel: Store; cart_items: CartItem[] };

export type DeliveryZone = { id: string; name: string; fee: number | null; delivery_time: string | null; pay_on_delivery: boolean; installation_available: boolean };
