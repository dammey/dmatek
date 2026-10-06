"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Scroll reveals: any [data-rv] element fades and rises 30px over .8s as it
 * enters the viewport. Watches the DOM so tiles that load later reveal too.
 * Hides with opacity/transform only (never clip-path; see CLAUDE.md).
 * Off under prefers-reduced-motion. */
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            io.unobserve(el);
          }
        }),
      { threshold: 0.1 }
    );
    const arm = () =>
      document.querySelectorAll<HTMLElement>("[data-rv]:not([data-rvd])").forEach((el) => {
        el.setAttribute("data-rvd", "1");
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity .8s ease, transform .8s cubic-bezier(.2,.7,.2,1), box-shadow .35s";
        io.observe(el);
      });
    arm();
    const mo = new MutationObserver(arm);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);
  return null;
}
