/** Ports the source's flipIn(): a FLIP transition from a product card's
 * image to the product page's main image. captureFlipOrigin() runs on the
 * card's image click (before navigation) and stashes the origin rect in
 * sessionStorage, since the click and the destination page mount happen on
 * opposite sides of a route change. playFlipIn() runs on the product page's
 * mount and animates an overlay from that origin to [data-pdpimg]. */

const KEY = "ds-flip-origin";

type FlipOrigin = { left: number; top: number; width: number; height: number; radius: string; src: string };

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function captureFlipOrigin(imgEl: HTMLElement | null) {
  if (!imgEl || typeof window === "undefined" || reducedMotion()) return;
  const r = imgEl.getBoundingClientRect();
  const img = imgEl.querySelector("img");
  const src = img?.currentSrc || img?.src || "";
  const origin: FlipOrigin = { left: r.left, top: r.top, width: r.width, height: r.height, radius: getComputedStyle(imgEl).borderRadius, src };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(origin));
  } catch {
    // sessionStorage unavailable (private browsing etc.) — flip just won't play.
  }
}

export function playFlipIn() {
  if (typeof window === "undefined") return;
  let origin: FlipOrigin | null = null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      origin = JSON.parse(raw) as FlipOrigin;
      sessionStorage.removeItem(KEY);
    }
  } catch {
    // ignore
  }

  if (!origin || reducedMotion()) {
    const m = document.querySelector('[data-screen-label="Product"]') as HTMLElement | null;
    if (m && m.animate && !reducedMotion()) {
      m.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    return;
  }

  const o = origin;
  requestAnimationFrame(() => {
    const dst = document.querySelector("[data-pdpimg]") as HTMLElement | null;
    if (!dst || !document.body.animate) return;
    const r2 = dst.getBoundingClientRect();
    const rad2 = getComputedStyle(dst).borderRadius;
    const ov = document.createElement("div");
    Object.assign(ov.style, {
      position: "fixed",
      left: `${o.left}px`,
      top: `${o.top}px`,
      width: `${o.width}px`,
      height: `${o.height}px`,
      borderRadius: o.radius,
      background: o.src ? `#F6F4EF url("${o.src}") center/cover no-repeat` : "#F6F4EF",
      zIndex: "500",
      boxShadow: "0 30px 70px rgba(6,56,46,.22)",
      pointerEvents: "none",
    });
    document.body.appendChild(ov);
    dst.style.opacity = "0";

    const rest = Array.from(document.querySelectorAll('[data-screen-label="Product"] > section'));
    rest.forEach((s, i) => {
      (s as HTMLElement).animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], {
        duration: 520,
        delay: 220 + i * 80,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "backwards",
      });
    });

    const a = ov.animate(
      [
        { left: `${o.left}px`, top: `${o.top}px`, width: `${o.width}px`, height: `${o.height}px`, borderRadius: o.radius },
        { left: `${r2.left}px`, top: `${r2.top}px`, width: `${r2.width}px`, height: `${r2.height}px`, borderRadius: rad2 },
      ],
      { duration: 680, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
    );
    a.onfinish = () => {
      dst.style.opacity = "";
      ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" }).onfinish = () => ov.remove();
    };
  });
}
