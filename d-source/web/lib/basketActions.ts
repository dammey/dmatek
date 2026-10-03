"use client";

import { useCart } from "./cart-context";
import { useFlow } from "./flow-context";

export type BasketAction = { label: string; sub: string; go: () => void; primary: boolean };

/** The basket drawer's and basket page's three action buttons per kind —
 * ported from the source's actsFor(). Always shown; the primary action's
 * own handler checks for an empty list and shows a toast instead of
 * navigating, same as the source. */
export function useBasketActions(kind: "cart" | "quote"): BasketAction[] {
  const { cart, quote, say } = useCart();
  const { startFlow } = useFlow();

  if (kind === "cart") {
    const items = cart?.cart_items ?? [];
    return [
      { label: "Check out", sub: "Delivery details and payment", primary: true, go: () => (items.length ? startFlow("checkout") : say("Your cart is empty")) },
      { label: "Order on WhatsApp", sub: "Send your cart as a message", primary: false, go: () => startFlow("whatsapp") },
      { label: "Send an enquiry", sub: "Ask before you buy", primary: false, go: () => startFlow("enquiry", items.length ? `About: ${items.map((i) => i.name).join(", ")}` : "") },
    ];
  }

  const items = quote?.cart_items ?? [];
  return [
    { label: "Request a quote", sub: "Back within 4 working hours", primary: true, go: () => startFlow("quote") },
    { label: "Order on account", sub: "Approved accounts, 30-day invoice", primary: false, go: () => (items.length ? startFlow("account") : say("Your quote list is empty")) },
    { label: "Describe what you need", sub: "No list? Tell us the place", primary: false, go: () => startFlow("quote", "We need equipment for: ") },
  ];
}
