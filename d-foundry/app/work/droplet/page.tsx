"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DROPLET_URL = "https://web-gamma-fawn-29.vercel.app/";

const PROCESS = [
  { label: "01 DIAGNOSE", title: "[What we mapped]", body: "[Who we spoke to, what we learned about how orders really flowed.]", meta: "[0 WEEKS]", bg: "#F5F1E8", ink: "#06382E", metaColor: "#06382E" },
  { label: "02 BUILD", title: "[The first version]", body: "[What went into v1: web app, payments, admin, driver view.]", meta: "[0 WEEKS]", bg: "#D4A637", ink: "#06382E", metaColor: "#06382E" },
  { label: "03 SHIP", title: "[The pilot]", body: "[Where it launched first, what changed after real use.]", meta: "[0 WEEKS]", bg: "#28705A", ink: "#F5F1E8", metaColor: "#F5F1E8" },
  { label: "04 RUN", title: "Hosted and supported", body: "On D’Matek Cloud, backed up and monitored. [Anything added since launch.]", meta: "ONGOING", bg: "#1A1A1A", ink: "#F5F1E8", metaColor: "#D4A637" },
];

const RESULTS = [
  { value: "00%", label: "of orders are reorders from the one-tap prompt" },
  { value: "0,000", label: "customers ordering in the app" },
  { value: "000", label: "active delivery subscriptions" },
  { value: "0,000kg", label: "of bottles collected through recycling pickups" },
];

const PRODUCT_SHOTS = [
  { src: "/assets/droplet-home.jpg", alt: "Droplet home screen with reorder prompt", n: "01", title: "Reorder in one tap", body: "Spots when a customer is running low from their order history, and offers their usual.", imgFirst: true },
  { src: "/assets/droplet-shop.jpg", alt: "Droplet shop with products and delivery zones", n: "02", title: "Subscriptions and a proper shop", body: "Scheduled deliveries that keep coming without a new order, with products and delivery zones managed in one place.", imgFirst: false },
  { src: "/assets/droplet-rec.jpg", alt: "Droplet recycling pickup with points", n: "03", title: "Recycling that earns points", body: "Customers book pickups for empty bottles and earn points toward their next order.", imgFirst: true },
];

export default function DropletCaseStudy() {
  const router = useRouter();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const C = document.querySelector<HTMLElement>("[data-curtain]");
    const lift = () => {
      if (!C) return;
      C.style.transition = "transform 1s cubic-bezier(.76,0,.24,1), border-radius 1s cubic-bezier(.76,0,.24,1)";
      C.style.borderRadius = "0 0 50% 50% / 0 0 30% 30%";
      C.style.transform = "translateY(-110%)";
      setTimeout(() => {
        if (C) C.style.visibility = "hidden";
      }, 1050);
    };
    let liftTimer: ReturnType<typeof setTimeout> | undefined;
    if (reduce && C) C.style.visibility = "hidden";
    else liftTimer = setTimeout(lift, 450);

    const nav = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest && (target.closest("a[href]") as HTMLAnchorElement | null);
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || !C) return;
      const h = a.getAttribute("href");
      if (!h || h.startsWith("#") || /^https?:/.test(h)) return;
      e.preventDefault();
      C.style.transition = "none";
      C.style.visibility = "visible";
      C.style.borderRadius = "0";
      C.style.transform = "translateY(110%)";
      void C.offsetHeight;
      C.style.transition = "transform .8s cubic-bezier(.76,0,.24,1)";
      C.style.transform = "translateY(0)";
      setTimeout(() => router.push(h), 820);
    };
    document.addEventListener("click", nav, true);

    const INIT: Record<string, Partial<CSSStyleDeclaration>> = {
      "1": { opacity: "0", transform: "translateY(60px) skewY(4deg)" },
      mask: { clipPath: "inset(100% 0 0 0 round 24px)" },
      deal: { opacity: "0", transform: "translateY(140px) rotate(-8deg) scale(.9)" },
    };
    const TR: Record<string, string> = {
      "1": "opacity 1s ease, transform 1.2s cubic-bezier(.16,1,.3,1)",
      mask: "clip-path 1.4s cubic-bezier(.76,0,.24,1)",
      deal: "opacity .5s ease, transform 1.2s cubic-bezier(.34,1.4,.64,1)",
    };
    const DONE: Record<string, Partial<CSSStyleDeclaration>> = {
      "1": { opacity: "1", transform: "none" },
      mask: { clipPath: "inset(0% 0 0 0 round 20px)" },
      deal: { opacity: "1", transform: "none" },
    };
    const iv = setInterval(() => {
      if (reduce) return;
      document.querySelectorAll<HTMLElement>("[data-in]").forEach((el) => {
        const t = el.dataset.in!;
        if (el.dataset.s === "2") return;
        const i = Array.prototype.indexOf.call(el.parentElement!.children, el);
        if (!el.dataset.s) {
          Object.assign(el.style, INIT[t]);
          el.dataset.s = "1";
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight * 0.9 && r.bottom > 0) {
          el.style.transition = TR[t];
          el.style.transitionDelay = Math.min(i, 6) * 100 + "ms";
          Object.assign(el.style, DONE[t]);
          el.dataset.s = "2";
        }
      });
    }, 40);

    return () => {
      clearInterval(iv);
      if (liftTimer) clearTimeout(liftTimer);
      document.removeEventListener("click", nav, true);
    };
  }, [router]);

  return (
    <>
      <div data-curtain="1" style={{ position: "fixed", inset: 0, zIndex: 500, background: "#06382E", display: "grid", placeItems: "center", transformOrigin: "50% 0" }}>
        <span style={{ padding: ".08em .42em .14em", borderRadius: 999, background: "#D4A637", color: "#06382E", fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontSize: "clamp(46px,8vw,140px)", lineHeight: 1 }}>Droplet</span>
      </div>

      <header style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "22px clamp(18px,3vw,40px)", color: "#F5F1E8" }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-.03em" }}>
          &larr; D&rsquo;FOUNDRY
        </Link>
        <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".1em" }}>CASE STUDY 01</span>
      </header>

      <section data-screen-label="Case hero" style={{ background: "#1A1A1A", color: "#F5F1E8", padding: "clamp(120px,18vh,180px) clamp(18px,3vw,40px) clamp(48px,8vh,96px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "6px 12px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, fontWeight: 600 }}>LIVE</span>
            <span style={{ border: "1.5px solid #555", borderRadius: 999, padding: "5px 12px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, fontWeight: 600, color: "#D9D3C4", whiteSpace: "nowrap" }}>WEB APP &middot; MOBILE &middot; PAYMENTS</span>
          </div>
          <h1 data-in="1" style={{ margin: 0, fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(96px,18vw,300px)", lineHeight: 0.8, letterSpacing: "-.03em" }}>
            Droplet
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(24px,4vw,64px)", alignItems: "end" }}>
            <p data-in="1" style={{ margin: 0, fontWeight: 700, fontSize: "clamp(24px,2.6vw,40px)", lineHeight: 1.1, letterSpacing: "-.03em" }}>
              Water on demand for Blessed Water, live in Lagos and Ibadan.
            </p>
            <div data-in="1" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "18px 24px", fontSize: 15 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, letterSpacing: ".12em", color: "#BDB6A6" }}>CLIENT</span>
                <span style={{ fontWeight: 700 }}>Blessed Water</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, letterSpacing: ".12em", color: "#BDB6A6" }}>TIMELINE</span>
                <span style={{ fontWeight: 700, color: "#D4A637" }}>[00 weeks]</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, letterSpacing: ".12em", color: "#BDB6A6" }}>LAUNCHED</span>
                <span style={{ fontWeight: 700, color: "#D4A637" }}>[Month 2026]</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, letterSpacing: ".12em", color: "#BDB6A6" }}>HOSTED ON</span>
                <span style={{ fontWeight: 700 }}>D&rsquo;Matek Cloud</span>
              </div>
            </div>
          </div>
          <div data-in="mask" style={{ borderRadius: 24, overflow: "hidden", background: "#F5F8FB", boxShadow: "0 40px 80px rgba(0,0,0,.45)" }}>
            <img src="/assets/droplet-dash.jpg" alt="Droplet customer home" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      <section data-screen-label="Results" style={{ background: "#D4A637", color: "#06382E", padding: "clamp(64px,10vh,120px) clamp(18px,3vw,40px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
            <h2 data-in="1" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(48px,7vw,120px)", lineHeight: 0.88, letterSpacing: "-.055em" }}>
              The <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em" }}>results.</span>
            </h2>
            <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em" }}>PLACEHOLDERS &middot; REPLACE WITH REAL NUMBERS</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", borderTop: "2px solid #06382E" }}>
            {RESULTS.map((r) => (
              <div key={r.label} data-in="1" style={{ display: "flex", flexDirection: "column", gap: 10, padding: "28px 24px 28px 0", borderBottom: "2px solid #06382E" }}>
                <span style={{ fontWeight: 800, fontSize: "clamp(64px,7vw,120px)", lineHeight: 0.9, letterSpacing: "-.06em" }}>{r.value}</span>
                <span style={{ fontSize: 16, lineHeight: 1.45, maxWidth: "26ch" }}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-screen-label="The problem" style={{ background: "#F5F1E8", color: "#06382E", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(32px,5vw,80px)", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em" }}>01 &middot; THE PROBLEM</span>
            <h2 data-in="1" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px,5.6vw,96px)", lineHeight: 0.9, letterSpacing: "-.055em" }}>
              Orders came in by <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em" }}>[phone and WhatsApp].</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, fontSize: "clamp(17px,1.4vw,20px)", lineHeight: 1.55, paddingTop: "clamp(0px,4vh,48px)" }}>
            <p data-in="1" style={{ margin: 0 }}>
              [How Blessed Water took and tracked orders before Droplet. Who handled them, and what went wrong: missed orders, customers running out, drivers without routes.]
            </p>
            <p data-in="1" style={{ margin: 0 }}>
              [What they asked D&rsquo;Foundry for, in their own words if possible.]
            </p>
          </div>
        </div>
      </section>

      <section data-screen-label="What we built" style={{ background: "#1A1A1A", color: "#F5F1E8", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(56px,10vh,120px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
            <h2 data-in="1" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(48px,7vw,120px)", lineHeight: 0.88, letterSpacing: "-.055em" }}>
              What we <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#D4A637" }}>built.</span>
            </h2>
            <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#BDB6A6" }}>02 &middot; THE PRODUCT</span>
          </div>
          {PRODUCT_SHOTS.map((p) => {
            const image = (
              <div data-in="mask" style={{ borderRadius: 20, overflow: "hidden", background: "#F5F8FB" }}>
                <img loading="lazy" src={p.src} alt={p.alt} style={{ display: "block", width: "100%", height: "auto" }} />
              </div>
            );
            const copy = (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, color: "#D4A637" }}>{p.n}</span>
                <h3 data-in="1" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(32px,3.4vw,56px)", lineHeight: 0.95, letterSpacing: "-.045em" }}>
                  {p.title}
                </h3>
                <p data-in="1" style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "#D9D3C4", maxWidth: "44ch" }}>
                  {p.body}
                </p>
              </div>
            );
            return (
              <div key={p.n} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,64px)", alignItems: "center" }}>
                {p.imgFirst ? (
                  <>
                    {image}
                    {copy}
                  </>
                ) : (
                  <>
                    {copy}
                    {image}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section data-screen-label="How we built it" style={{ background: "#06382E", color: "#F5F1E8", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
            <h2 data-in="1" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(48px,7vw,120px)", lineHeight: 0.88, letterSpacing: "-.055em" }}>
              How we <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#D4A637" }}>built it.</span>
            </h2>
            <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#A9BBB3" }}>03 &middot; THE PROCESS</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 12 }}>
            {PROCESS.map((st) => (
              <div key={st.label} data-in="deal" style={{ display: "flex", flexDirection: "column", gap: 14, background: st.bg, color: st.ink, borderRadius: 24, padding: 28, minHeight: 280 }}>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, fontWeight: 600 }}>{st.label}</span>
                <span style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-.035em", lineHeight: 1 }}>{st.title}</span>
                <span style={{ fontSize: 16, lineHeight: 1.5, opacity: 0.9 }}>{st.body}</span>
                <span style={{ marginTop: "auto", fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, color: st.metaColor }}>{st.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-screen-label="Client quote" style={{ background: "#F5F1E8", color: "#06382E", padding: "clamp(72px,14vh,160px) clamp(18px,3vw,40px)" }}>
        <figure style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <blockquote data-in="1" style={{ margin: 0, fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontSize: "clamp(40px,5.4vw,92px)", lineHeight: 1, letterSpacing: "-.02em" }}>
            &ldquo;[A short quote from Blessed Water about what changed after Droplet.]&rdquo;
          </blockquote>
          <figcaption style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 13, letterSpacing: ".1em" }}>[NAME] &middot; [ROLE], BLESSED WATER</figcaption>
        </figure>
      </section>

      <section data-screen-label="Next" style={{ background: "#06382E", color: "#F5F1E8", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px) 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(40px,8vh,96px)" }}>
          <h2 data-in="1" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(52px,8vw,140px)", lineHeight: 0.88, letterSpacing: "-.055em" }}>
            Got a problem <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#D4A637" }}>like this?</span>
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/#start" style={{ background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "18px 28px", fontWeight: 700, fontSize: 16 }}>
              Bring us the problem &rarr;
            </Link>
            <a href={DROPLET_URL} target="_blank" rel="noopener" style={{ border: "2px solid #F5F1E8", borderRadius: 999, padding: "16px 26px", fontWeight: 700, fontSize: 16 }}>
              Visit Droplet &#8599;
            </a>
          </div>
          <footer style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderTop: "1px solid #28705A", paddingTop: 22, fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".1em", color: "#A9BBB3" }}>
            <Link href="/">&larr; BACK TO D&rsquo;FOUNDRY</Link>
            <span>D&rsquo;FOUNDRY &middot; A D&rsquo;MATEK BUSINESS</span>
          </footer>
        </div>
      </section>
    </>
  );
}
