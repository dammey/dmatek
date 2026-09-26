"use client";

import { useEffect, useRef } from "react";

type Dot = { y: number; ring: SVGCircleElement; dot: SVGCircleElement; last: boolean; g: SVGGElement; on: boolean };
type LineState = { prog: SVGLineElement; dots: Dot[]; y0: number; y1: number; top: number };

const SVG_NS = "http://www.w3.org/2000/svg";

function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

/**
 * Home-only signature line: a gold line down the left edge of the 1280px
 * container, drawing itself as you scroll, with a lit node at each of the
 * seven moments. Ported near-verbatim from the prototype's buildLine/
 * updateLine (plain DOM, not React state — the geometry depends on layout
 * measurements that have to be read after paint).
 */
export default function SignatureLine() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRef = useRef<LineState | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const home = svg?.closest<HTMLElement>("[data-home]");
    if (!svg || !home) return;

    const mk = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>) => {
      const el = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el as SVGElementTagNameMap[K];
    };

    function buildLine() {
      if (!svg || !home) return;
      const hr = home.getBoundingClientRect();
      const W = home.clientWidth;
      const H = home.scrollHeight;
      const x = Math.max(12, (W - 1280) / 2 + 12);
      const nodes = Array.from(home.querySelectorAll<HTMLElement>("[data-node]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          const off = el.hasAttribute("data-hotel") ? Math.min(window.innerHeight * 0.5, 420) : 8;
          return { id: el.getAttribute("data-node")!, y: Math.round(r.top - hr.top + off) };
        })
        .sort((a, b) => a.y - b.y);
      if (nodes.length < 2) return;

      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(H));

      const y0 = nodes[0].y;
      const y1 = nodes[nodes.length - 1].y;
      svg.appendChild(
        mk("line", { x1: String(x), y1: String(y0), x2: String(x), y2: String(y1), stroke: "#D4A637", "stroke-opacity": "0.25", "stroke-width": "2" }),
      );
      const prog = mk("line", { x1: String(x), y1: String(y0), x2: String(x), y2: String(y0), stroke: "#D4A637", "stroke-width": "2.5", "stroke-linecap": "round" });
      svg.appendChild(prog);

      const dots: Dot[] = nodes.map((n, i) => {
        const last = i === nodes.length - 1;
        const g = mk("g", { transform: `translate(${x} ${n.y})` });
        const ring = mk("circle", { r: last ? "13" : "9", fill: "none", stroke: "#D4A637", "stroke-opacity": "0.3", "stroke-width": "1.5" });
        const dot = mk("circle", { r: "4", fill: "#D4A637", "fill-opacity": "0.35" });
        ring.style.transition = dot.style.transition = "r .4s cubic-bezier(.2,.8,.2,1), fill-opacity .4s ease, stroke-opacity .4s ease";
        g.appendChild(ring);
        g.appendChild(dot);
        svg.appendChild(g);
        return { y: n.y, ring, dot, last, g, on: false };
      });

      lineRef.current = { prog, dots, y0, y1, top: hr.top + window.scrollY };
      updateLine();
    }

    function updateLine() {
      const L = lineRef.current;
      if (!L) return;
      const motion = !prefersReducedMotion();
      let t = window.scrollY + window.innerHeight * 0.6 - L.top;
      if (!motion) t = L.y1;
      const yy = Math.max(L.y0, Math.min(L.y1, t));
      L.prog.setAttribute("y2", String(yy));
      L.dots.forEach((d) => {
        const on = yy >= d.y - 1;
        if (on && !d.on && motion && d.g) {
          const p = document.createElementNS(SVG_NS, "circle");
          p.setAttribute("r", "30");
          p.setAttribute("fill", "none");
          p.setAttribute("stroke", "#D4A637");
          p.setAttribute("stroke-width", "1.5");
          p.style.transformBox = "fill-box";
          p.style.transformOrigin = "center";
          d.g.appendChild(p);
          const an = p.animate([{ transform: "scale(.15)", opacity: 0.9 }, { transform: "scale(1)", opacity: 0 }], {
            duration: 1100,
            easing: "cubic-bezier(.2,.7,.3,1)",
          });
          an.onfinish = () => p.remove();
        }
        d.on = on;
        d.dot.setAttribute("r", on ? (d.last ? "7" : "5.5") : "4");
        d.dot.setAttribute("fill-opacity", on ? "1" : "0.35");
        d.ring.setAttribute("stroke-opacity", on ? "0.9" : "0.3");
        d.ring.setAttribute("r", on && d.last ? "18" : d.last ? "13" : "9");
      });
    }

    const onScroll = () => updateLine();
    const onResize = () => buildLine();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    requestAnimationFrame(buildLine);
    const t1 = setTimeout(buildLine, 400);
    const t2 = setTimeout(buildLine, 1500);

    let ro: ResizeObserver | null = null;
    let roFrame = 0;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => {
        cancelAnimationFrame(roFrame);
        roFrame = requestAnimationFrame(buildLine);
      });
      ro.observe(home);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(roFrame);
      ro?.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      data-dmline
      aria-hidden="true"
      style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5, overflow: "visible" }}
    />
  );
}
