/** Tile → product transition (design v11.1 runFlip): a ghost box grows from
 * the tapped tile's photo to the product gallery over .7s, then the gallery
 * fades in. Skipped under prefers-reduced-motion. */
let origin: { l: number; t: number; w: number; h: number } | null = null;

export function captureFlip(el: Element | null) {
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = el.getBoundingClientRect();
  origin = { l: r.left, t: r.top, w: r.width, h: r.height };
}

export function runFlip() {
  const s0 = origin;
  origin = null;
  if (!s0) return;
  const g = document.querySelector("[data-flip]") as HTMLElement | null;
  if (!g) return;
  const d = g.getBoundingClientRect();
  g.style.opacity = "0";
  const gh = document.createElement("div");
  Object.assign(gh.style, {
    position: "fixed",
    left: s0.l + "px",
    top: s0.t + "px",
    width: s0.w + "px",
    height: s0.h + "px",
    background: getComputedStyle(g).backgroundColor,
    borderRadius: "18px",
    zIndex: "500",
    pointerEvents: "none",
    boxShadow: "0 24px 60px rgba(6,56,46,.25)",
    transition: "none",
  });
  document.body.appendChild(gh);
  gh.getBoundingClientRect();
  requestAnimationFrame(() => {
    Object.assign(gh.style, { transition: "all .7s cubic-bezier(.2,.7,.2,1)", left: d.left + "px", top: d.top - 24 + "px", width: d.width + "px", height: d.height + "px", borderRadius: "24px" });
  });
  setTimeout(() => {
    g.style.transition = "opacity .25s";
    g.style.opacity = "1";
    gh.style.transition = "opacity .3s";
    gh.style.opacity = "0";
    setTimeout(() => gh.remove(), 320);
  }, 720);
}
