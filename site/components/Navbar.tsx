"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/content";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the mobile menu on route change (adjusting state during render,
  // per https://react.dev/learn/you-might-not-need-an-effect).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  // Lock body scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-[80] px-5 pt-3.5 sm:px-5">
        <div
          className="mx-auto flex max-w-[1280px] items-center gap-7 rounded-full border border-forest/10 px-3.5 py-2.5 pl-4.5 shadow-[0_10px_34px_rgba(6,56,46,0.07)] backdrop-blur-md"
          style={{ background: "rgba(245,241,232,0.82)" }}
        >
          <Link
            href="/"
            aria-label="D’Matek Technology Limited — home"
            className="flex shrink-0 items-center gap-3"
          >
            <Image src="/assets/mark-green.png" alt="" width={30} height={30} className="h-[30px] w-auto" priority />
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-extrabold tracking-[0.05em] text-forest">D&rsquo;MATEK</span>
              <span className="mt-1 text-[8px] font-semibold tracking-[0.2em] text-progress">
                TECHNOLOGY LIMITED
              </span>
            </span>
          </Link>

          <nav id="dm-desk" aria-label="Primary" className="ml-auto hidden items-center gap-1 nav:flex">
            {navItems.map((n) => {
              const current = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <Link
                  key={n.key}
                  href={n.href}
                  aria-current={current ? "page" : undefined}
                  className="rounded-full px-4 py-2.5 text-[14.5px] font-semibold text-charcoal hover:bg-forest/[0.07] hover:text-forest"
                  style={{ background: current ? "rgba(212,166,55,0.32)" : "transparent" }}
                >
                  {n.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="ml-2 rounded-full bg-gold px-6 py-3.5 text-[13px] font-bold tracking-[0.04em] text-forest transition-transform hover:-translate-y-0.5 hover:bg-forest hover:text-cream hover:shadow-[0_12px_26px_rgba(6,56,46,0.22)]"
            >
              Tell us what you need &rarr;
            </Link>
          </nav>

          <button
            id="dm-burger"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="ml-auto flex items-center rounded-full bg-forest px-5.5 py-3.5 text-[13px] font-bold tracking-[0.1em] text-cream nav:hidden"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-forest px-7 pt-6 pb-10 text-cream"
          style={{ animation: "dm-rise .4s cubic-bezier(.2,.8,.2,1) both" }}
        >
          <div className="flex items-center gap-3">
            <Image src="/assets/mark-cream.png" alt="" width={30} height={30} className="h-[30px] w-auto" />
            <span className="text-[17px] font-extrabold tracking-[0.05em]">D&rsquo;MATEK</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="ml-auto rounded-full border border-cream/25 bg-transparent px-5 py-3 text-[13px] font-bold tracking-[0.1em] text-cream"
            >
              CLOSE
            </button>
          </div>
          <div className="mt-11 flex flex-col gap-1.5">
            {navItems.map((n) => (
              <Link
                key={n.key}
                href={n.href}
                className="rounded-full px-5.5 py-4 text-[30px] font-bold tracking-[-0.02em] text-cream hover:bg-gold hover:text-forest"
                style={{ background: "rgba(245,241,232,0.06)" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-5.5 rounded-full bg-gold px-6 py-5 text-center text-[15px] font-bold tracking-[0.05em] text-forest"
          >
            Tell us what you need &rarr;
          </Link>
        </nav>
      )}
    </>
  );
}
