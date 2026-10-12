"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/sites";

/** Floating WhatsApp button (Hero v2): appears once the visitor scrolls past
 * most of the first screen. */
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
      className="df-wa-fab"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 150,
        display: show ? "flex" : "none",
        alignItems: "center",
        gap: 10,
        background: "#06382E",
        color: "#F5F1E8",
        border: "1.5px solid #D4A637",
        borderRadius: 999,
        padding: "14px 22px",
        fontFamily: "'Manrope',system-ui,sans-serif",
        fontSize: 14,
        fontWeight: 700,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3DFFA8" }} />
      WhatsApp us
      <style>{`.df-wa-fab:hover{background:#D4A637!important;color:#06382E!important}`}</style>
    </a>
  );
}
