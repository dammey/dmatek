"use client";

import Script from "next/script";
import { useEffect } from "react";
import { eventFor, track } from "./analytics";

/**
 * One listener per site: every click on an element with `data-track` fires an
 * event with that name and the page path (handoff v3.6 §Analytics), plus
 * call / email / WhatsApp links. Google Analytics loads only when a
 * measurement ID is supplied; until then events queue in window.dataLayer.
 */
export default function Analytics({ gaId }: { gaId?: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      const ev = eventFor(t);
      if (!ev || !ev.name) return;
      const href = ev.el.getAttribute("href") || undefined;
      const label = (ev.el.getAttribute("aria-label") || ev.el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
      track(ev.name, { link_url: href, label });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)},{anonymize_ip:true});`}
      </Script>
    </>
  );
}
