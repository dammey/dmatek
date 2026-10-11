"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/content";

/** Floating "WhatsApp us" button, shared across the main site and business
 * pages. Appears once the visitor has scrolled past most of the first screen. */
export default function WhatsAppFab() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <a
      href={CONTACT.whatsappHref}
      data-track="whatsapp_click"
      aria-label="Chat with D’Matek on WhatsApp"
      className="fixed bottom-5 right-5 z-[150] items-center gap-2.5 whitespace-nowrap rounded-full border-[1.5px] border-gold bg-forest px-5.5 py-3.5 text-[14px] font-bold tracking-[0.02em] text-cream shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-gold hover:text-forest"
      style={{ display: show ? "flex" : "none" }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: "#3DFFA8" }} aria-hidden="true" />
      WhatsApp us
    </a>
  );
}
