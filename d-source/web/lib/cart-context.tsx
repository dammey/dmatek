"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { Cart, Store } from "./types";

type Basket = "cart" | "quote" | null;

type CartContextValue = {
  cart: Cart | null;
  quote: Cart | null;
  cartCount: number;
  quoteCount: number;
  cartTotal: number;
  quoteTotal: number;
  basket: Basket;
  openBasket: (which: Exclude<Basket, null>) => void;
  closeBasket: () => void;
  addToCart: (args: { productId: string; name: string; price: number | null; quantity?: number; channel: Store }) => Promise<void>;
  addToQuote: (args: { productId: string; name: string; price: number | null; quantity?: number; channel: Store }) => Promise<void>;
  bump: (which: "cart" | "quote", itemId: string, quantity: number) => Promise<void>;
  clear: (which: "cart" | "quote") => void;
  toast: string;
  say: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(kind: "cart" | "quote") {
  return kind === "cart" ? "ds-cart-id" : "ds-quote-id";
}

async function ensureCart(kind: "cart" | "quote", channel: Store): Promise<Cart> {
  const existingId = typeof window !== "undefined" ? window.localStorage.getItem(storageKey(kind)) : null;
  if (existingId) {
    try {
      const { cart } = await api.get<{ cart: Cart }>(`/cart/${existingId}`);
      return cart;
    } catch {
      // Fall through and create a fresh one — the stored id no longer resolves.
    }
  }
  const { cart } = await api.post<{ cart: Cart }>("/cart", { kind, channel });
  window.localStorage.setItem(storageKey(kind), cart.id);
  return cart;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [quote, setQuote] = useState<Cart | null>(null);
  const [basket, setBasket] = useState<Basket>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const id = window.localStorage.getItem(storageKey("cart"));
    if (id) api.get<{ cart: Cart }>(`/cart/${id}`).then(({ cart }) => setCart(cart)).catch(() => {});
    const qid = window.localStorage.getItem(storageKey("quote"));
    if (qid) api.get<{ cart: Cart }>(`/cart/${qid}`).then(({ cart }) => setQuote(cart)).catch(() => {});
  }, []);

  const say = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  }, []);

  const addToCart = useCallback(
    async ({ productId, name, price, quantity = 1, channel }: { productId: string; name: string; price: number | null; quantity?: number; channel: Store }) => {
      const active = cart ?? (await ensureCart("cart", channel));
      const { cart: updated } = await api.post<{ cart: Cart }>(`/cart/${active.id}/items`, { productId, name, price, quantity });
      setCart(updated);
      say(`${name} added to cart`);
    },
    [cart, say]
  );

  const addToQuote = useCallback(
    async ({ productId, name, price, quantity = 1, channel }: { productId: string; name: string; price: number | null; quantity?: number; channel: Store }) => {
      const active = quote ?? (await ensureCart("quote", channel));
      const { cart: updated } = await api.post<{ cart: Cart }>(`/cart/${active.id}/items`, { productId, name, price, quantity });
      setQuote(updated);
      say(`${name} added to quote list`);
    },
    [quote, say]
  );

  const bump = useCallback(
    async (which: "cart" | "quote", itemId: string, quantity: number) => {
      const active = which === "cart" ? cart : quote;
      if (!active) return;
      const { cart: updated } = await api.patch<{ cart: Cart }>(`/cart/${active.id}/items/${itemId}`, { quantity });
      if (which === "cart") setCart(updated);
      else setQuote(updated);
    },
    [cart, quote]
  );

  const clear = useCallback((which: "cart" | "quote") => {
    window.localStorage.removeItem(storageKey(which));
    if (which === "cart") setCart(null);
    else setQuote(null);
  }, []);

  const totals = useMemo(() => {
    const sum = (c: Cart | null) => (c?.cart_items ?? []).reduce((a, i) => a + (i.price ?? 0) * i.quantity, 0);
    const count = (c: Cart | null) => (c?.cart_items ?? []).reduce((a, i) => a + i.quantity, 0);
    return { cartTotal: sum(cart), quoteTotal: sum(quote), cartCount: count(cart), quoteCount: count(quote) };
  }, [cart, quote]);

  const value: CartContextValue = {
    cart,
    quote,
    ...totals,
    basket,
    openBasket: setBasket,
    closeBasket: () => setBasket(null),
    addToCart,
    addToQuote,
    bump,
    clear,
    toast,
    say,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
