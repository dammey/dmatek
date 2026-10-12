/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
// A straight port of the design's logic class (DMatek
// Infrastructure Hero shared.dc.html), kept close to the original so later
// design updates can be diffed against it.

import React from "react";
import { useRouter } from "next/navigation";
import Markup from "./InfrastructureMarkup";
import { D_FOUNDRY_URL } from "@/lib/content/navigation";
import { enquiryHref } from "@/lib/enquiry";
import { isLite } from "@/lib/lite";
import "./infrastructure.css";

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const AP_SLOTS = [[400, 220], [130, 120], [680, 320], [680, 110], [130, 340], [400, 370]];
const WALLS = [[300, 20, 300, 170], [300, 230, 300, 420], [560, 20, 560, 120], [560, 180, 560, 420], [20, 250, 210, 250], [270, 250, 300, 250], [560, 300, 650, 300], [710, 300, 780, 300]];
const ori = (px, py, qx, qy, rx, ry) => (qx - px) * (ry - py) - (qy - py) * (rx - px);
const crosses = (ax, ay, bx, by, w) => {
  const d1 = ori(ax, ay, bx, by, w[0], w[1]), d2 = ori(ax, ay, bx, by, w[2], w[3]), d3 = ori(w[0], w[1], w[2], w[3], ax, ay), d4 = ori(w[0], w[1], w[2], w[3], bx, by);
  return d1 * d2 < 0 && d3 * d4 < 0;
};
const signalGrid = (ap) => {
  const cells = [];
  let tot = 0, ok = 0;
  for (let x = 20; x < 780; x += 20)
    for (let y = 20; y < 420; y += 20) {
      const cx = x + 10, cy = y + 10;
      let best = 0;
      for (const [ax, ay] of ap) {
        const d = Math.hypot(cx - ax, cy - ay);
        let st = Math.max(0, 1 - d / 280);
        if (st > 0) {
          let n = 0;
          for (const w of WALLS) if (crosses(ax, ay, cx, cy, w)) n++;
          st *= Math.pow(0.55, n);
        }
        if (st > best) best = st;
      }
      tot++;
      if (best >= 0.3) ok++;
      cells.push({ x, y, fill: best >= 0.55 ? "#1D8C61" : best >= 0.3 ? "#13684B" : best >= 0.12 ? "#0C4C3A" : "url(#infHatch)" });
    }
  return { cells, pct: Math.round((100 * ok) / tot) };
};
const nextSlot = (ap) => AP_SLOTS.find((p) => ap.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > 120)) || AP_SLOTS[ap.length % AP_SLOTS.length];

const PHASES = [
  { n: "01", title: "Design", body: "Surveys, network design and planning for connectivity and physical infrastructure.", links: [{ id: "inf-b1", label: "Plan your network properly" }] },
  { n: "02", title: "Build", body: "Installation of the physical network, on site, to the design.", links: [{ id: "inf-b2", label: "Build and install your network" }, { id: "inf-b10", label: "Cabling and fibre work" }, { id: "inf-b11", label: "Equipment rooms and network power" }] },
  { n: "03", title: "Operate", body: "We keep running what we build, so there is one team accountable for it.", links: [{ id: "inf-b13", label: "Ongoing network care" }, { id: "inf-b14", label: "Network security and control" }] },
];
const SISTERS = [
  { verb: "RUN IT", name: "D’Matek Cloud", href: "/cloud" },
  { verb: "MANAGE IT", name: "D’Matek Assurance", href: "/assurance" },
  { verb: "PHYSICAL WORLD", name: "IléMesh", href: "/ilemesh" },
  { verb: "BUILD IT", name: "D’Foundry", href: D_FOUNDRY_URL },
];

class Infrastructure extends React.Component {
  state = { pct: 0, done: false, ap: [[400, 220]], cut: false, seen: false };
  _offs = [];

  componentDidMount() {
    const dg = document.getElementById("inf-diagram");
    if (dg && "IntersectionObserver" in window) {
      this._io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { this.setState({ seen: true }); this._io.disconnect(); } }), { threshold: 0.35 });
      this._io.observe(dg);
    } else this.setState({ seen: true });
    // "Most customers start here" cards and phase chips open their full-list row.
    this.on(this.root, "click", (e) => {
      const a = e.target.closest && e.target.closest("a[data-open]");
      if (!a) return;
      const d = document.getElementById(a.getAttribute("data-open"));
      if (d) d.open = true;
    });
    this.setupB();
  }
  componentWillUnmount() {
    this._io?.disconnect();
    this._offs.forEach((f) => { try { f(); } catch {} });
    this._offs = [];
  }
  on(t, ev, fn, o) { t.addEventListener(ev, fn, o); this._offs.push(() => t.removeEventListener(ev, fn, o)); }
  every(fn) {
    let alive = true;
    const r = (n) => { if (!alive) return; fn(n); requestAnimationFrame(r); };
    requestAnimationFrame(r);
    this._offs.push(() => { alive = false; });
  }

  // The hero: a canvas of loose cables the visitor combs straight.
  setupB() {
    const root = this.root.querySelector('[data-v="b"]');
    if (!root) return;
    const cv = root.querySelector("[data-cv]"), ctx = cv.getContext("2d");
    let W, H, dpr, S, P, fix, baseY, xs;
    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1); W = root.clientWidth; H = root.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Phones get fewer, shorter cables: same look, a fraction of the work.
      S = W < 700 ? 20 : H < 700 ? 30 : 48; P = W < 700 ? 44 : 96;
      fix = new Float32Array(S * P); baseY = []; xs = [];
      const y0 = Math.max(90, H * 0.16), y1 = y0 + Math.max(110, H * 0.22);
      for (let i = 0; i < S; i++) baseY.push(y0 + ((y1 - y0) * i) / (S - 1));
      for (let j = 0; j < P; j++) xs.push(-10 + ((W + 20) * j) / (P - 1));
    };
    size();
    let t = 0, done = false, lastPct = -1, lastSet = 0, visible = true;
    const pctEl = root.querySelector("[data-pct]");
    const amp = () => Math.min(H * 0.085, 80);
    const pos = (i, j, out) => {
      const f = fix[i * P + j], k = (1 - f) * (1 - f), env = 0.3 + 0.7 * Math.pow(Math.sin((Math.PI * j) / (P - 1)), 0.5), A = amp() * env;
      out.x = xs[j] + k * 22 * Math.sin(j * 0.5 + i * 3.1 + t * 0.9);
      out.y = baseY[i] + k * A * (0.6 * Math.sin(j * 0.19 + i * 2.1 + t * 0.7) + 0.8 * Math.sin(j * 0.071 - i * 1.3 + t * 0.4) + 0.25 * Math.sin(j * 0.43 + i * 0.7 - t * 1.2));
      return out;
    };
    const tmp = { x: 0, y: 0 };
    const comb = (cx, cy, R, s) => {
      for (let i = 0; i < S; i++)
        for (let j = 0; j < P; j++) {
          pos(i, j, tmp);
          const d = Math.hypot(tmp.x - cx, tmp.y - cy);
          if (d < R) { const n = i * P + j; fix[n] += (1 - fix[n]) * s * (1 - d / R); }
        }
    };
    let px = null, py = null;
    const onMove = (e) => {
      const r = root.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (px === null) { px = x; py = y; }
      const dist = Math.hypot(x - px, y - py), steps = Math.max(1, Math.ceil(dist / 18));
      for (let s = 1; s <= steps; s++) comb(px + ((x - px) * s) / steps, py + ((y - py) * s) / steps, W < 700 ? 70 : 105, 0.45);
      px = x; py = y;
    };
    const onLeave = () => { px = null; };
    this.on(root, "pointermove", onMove);
    this.on(root, "pointerleave", onLeave);
    this.on(root, "pointerup", onLeave);
    let last = performance.now();
    const draw = (now) => {
      if (root.clientWidth === 0 || root.clientHeight === 0) { last = now; return; }
      if (root.clientWidth !== W || root.clientHeight !== H) { const f1 = done; size(); if (f1) fix.fill(1); }
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      if (t < 2.6 && !done) { const k = t / 2.6; comb(W * (0.04 + 0.34 * k), H * (0.35 + 0.2 * Math.sin(k * Math.PI * 3)), 60, 0.5); }
      let sum = 0;
      for (let n = 0; n < fix.length; n++) sum += fix[n];
      const pct = Math.round((100 * sum) / fix.length);
      if (!done && pct >= 55) { done = true; this.setState({ done: true }); }
      if (done) for (let n = 0; n < fix.length; n++) fix[n] += (1 - fix[n]) * 0.045;
      // Written straight to the label: a state update here would re-render the whole page ~8x a second.
      if (pct !== lastPct && now - lastSet > 120) { lastPct = pct; lastSet = now; if (pctEl) pctEl.textContent = pct + "% CONNECTED"; }
      ctx.fillStyle = "#06382E"; ctx.fillRect(0, 0, W, H);
      ctx.lineCap = "round";
      // Batch segments into one path per style (gold + 8 cream alpha steps)
      // instead of one stroke call per segment.
      const gold = new Path2D(), cream = Array.from({ length: 8 }, () => new Path2D());
      const a = { x: 0, y: 0 }, b = { x: 0, y: 0 };
      for (let i = 0; i < S; i++) {
        pos(i, 0, a);
        for (let j = 1; j < P; j++) {
          pos(i, j, b);
          const f = (fix[i * P + j - 1] + fix[i * P + j]) / 2;
          const path = f > 0.92 ? gold : cream[Math.min(7, Math.floor(f * 8))];
          path.moveTo(a.x, a.y); path.lineTo(b.x, b.y);
          a.x = b.x; a.y = b.y;
        }
      }
      ctx.lineWidth = 1.2;
      cream.forEach((path, k) => { ctx.strokeStyle = "rgba(245,241,232," + (0.22 + 0.45 * ((k + 0.5) / 8)).toFixed(3) + ")"; ctx.stroke(path); });
      ctx.strokeStyle = "#D4A637"; ctx.lineWidth = 2; ctx.stroke(gold);
      if (done) {
        ctx.fillStyle = "#F5F1E8";
        for (let i = 2; i < S; i += 6) { const j0 = Math.floor((t * 14 + i * 9) % (P - 1)); pos(i, j0, a); ctx.beginPath(); ctx.arc(a.x, a.y, 3.2, 0, 6.283); ctx.fill(); }
      }
    };
    // Lite mode (reduced motion, data saver, 2G): draw the finished network once.
    if (isLite()) {
      fix.fill(1); done = true; this.setState({ done: true }); draw(performance.now()); if (pctEl) pctEl.textContent = "100% CONNECTED";
      this._reset = () => {};
      this.on(window, "resize", () => { size(); fix.fill(1); draw(performance.now()); });
      return;
    }
    this._reset = () => { fix.fill(0); done = false; t = 0; lastPct = -1; this.setState({ done: false }); };
    // Only animate while the hero is on screen.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(root);
      this._offs.push(() => io.disconnect());
    }
    const minGap = window.innerWidth < 700 ? 32 : 0; // ~30fps on phones
    let lastDraw = 0;
    this.every((now) => { if (!visible) { last = now; return; } if (now - lastDraw < minGap) return; lastDraw = now; draw(now); });
  }

  send = (e) => {
    e.preventDefault();
    const note = String(new FormData(e.currentTarget).get("note") ?? "").trim();
    this.props.router.push(enquiryHref({ message: note ? `Site survey request: ${note}` : "I’d like to request a site survey.", source: "infrastructure_contact" }));
  };

  renderVals() {
    const s = this.state;
    if (this._sgFor !== s.ap) { this._sgFor = s.ap; this._sg = signalGrid(s.ap); }
    const sg = this._sg;
    return {
      foundryUrl: D_FOUNDRY_URL,
      pct: s.pct, aOp: s.done ? 0 : 1, bOp: s.done ? 1 : 0, aY: s.done ? "-30px" : "0px", bY: s.done ? "0px" : "30px",
      hint: s.done ? "CONNECTIVITY AND PHYSICAL NETWORK INFRASTRUCTURE" : "DRAG ACROSS THE CABLES TO RUN THEM STRAIGHT",
      retangle: () => { if (this._reset) this._reset(); },
      phases: PHASES,
      sisters: SISTERS,
      dashOff: s.seen ? 0 : 100, nodeS: s.seen ? 1 : 0,
      aps: s.ap.map(([x, y], i) => ({ i, x, y, down: (e) => { e.preventDefault(); e.currentTarget.ownerSVGElement?.setPointerCapture?.(e.pointerId); this._drag = i; } })),
      cells: sg.cells, covPct: sg.pct,
      apLabel: s.ap.length + (s.ap.length === 1 ? " access point" : " access points"),
      apMore: () => this.setState((st) => ({ ap: st.ap.length < 6 ? st.ap.concat([nextSlot(st.ap)]) : st.ap })),
      apLess: () => this.setState((st) => ({ ap: st.ap.length > 1 ? st.ap.slice(0, -1) : st.ap })),
      apReset: () => this.setState({ ap: [[400, 220]] }),
      planMove: (e) => {
        if (this._drag == null) return;
        const r = e.currentTarget.getBoundingClientRect(), x = clamp(((e.clientX - r.left) / r.width) * 800, 40, 760), y = clamp(((e.clientY - r.top) / r.height) * 440, 40, 400), i = this._drag;
        this.setState((st) => ({ ap: st.ap.map((p, k) => (k === i ? [x, y] : p)) }));
      },
      planUp: () => { this._drag = null; },
      covMsg: sg.pct >= 90 ? "Nearly the whole floor has a usable signal. Notice how the walls shorten each access point’s reach. That is why a real survey matters." : sg.pct >= 60 ? "Most rooms have a signal, but some are weak. Drag an access point, or add one." : "Large dead zones remain. Drag the gold dots or add an access point.",
      failState: s.cut ? "ONLINE ON BACKUP" : "ONLINE", mainStroke: s.cut ? "#B3261E" : "#D4A637", mainOp: s.cut ? 0.1 : 1, bakOp: s.cut ? 1 : 0.12, crossOp: s.cut ? 1 : 0,
      cutLabel: s.cut ? "Restore the main line" : "Cut the main line",
      toggleCut: () => this.setState((st) => ({ cut: !st.cut })),
      failMsg: s.cut ? "The main line is down. Traffic moves to the backup link and your team keeps working." : "Your main line is carrying everything while the backup link waits. Cut the main line and watch what happens.",
      send: this.send,
    };
  }

  render() {
    return (
      <div className="inf-root" ref={(el) => { this.root = el; }} style={{ fontFamily: "'Manrope',system-ui,sans-serif" }}>
        <Markup v={this.renderVals()} />
      </div>
    );
  }
}

export default function InfrastructureClient() {
  const router = useRouter();
  return <Infrastructure router={router} />;
}
