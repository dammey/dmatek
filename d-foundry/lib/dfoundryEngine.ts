// Ported verbatim from DFoundry Hero.dc.html's <script type="text/x-dc" data-dc-script>
// (the "logic.js" the port guide refers to lives inside that page's own script block).
// `this.state`/`this.setState` become the `getState`/`patchState` callbacks passed in;
// everything else -- DOM queries, RAF loops, magic numbers, easings -- is unchanged.
/* eslint-disable @typescript-eslint/no-explicit-any */

export type EngineState = {
  v: "a" | "b" | "c";
  assembled: boolean;
  pct: number;
  done: boolean;
  sound: boolean;
  p: number;
  sent: boolean;
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export function createEngine(getState: () => EngineState, patchState: (p: Partial<EngineState>) => void) {
  const inst: any = {
    _offs: [] as (() => void)[],
    _assemble: null as ((on: boolean) => void) | null,
    _reset: null as (() => void) | null,
    _skip: null as (() => void) | null,
    _ac: null as AudioContext | null,
    _out: null as GainNode | null,
    _noise: null as AudioBuffer | null,
  };

  function on(t: EventTarget, ev: string, fn: any, o?: any) {
    t.addEventListener(ev, fn, o);
    inst._offs.push(() => t.removeEventListener(ev, fn, o));
  }

  function every(fn: (now: number) => void) {
    let alive = true;
    let lr = 0;
    const run = () => {
      if (!alive) return;
      const n = performance.now();
      if (n - lr > 12) {
        lr = n;
        fn(n);
      }
    };
    const r = () => {
      if (!alive) return;
      run();
      requestAnimationFrame(r);
    };
    const iv = setInterval(run, 16);
    requestAnimationFrame(r);
    const stop = () => {
      alive = false;
      clearInterval(iv);
    };
    inst._offs.push(stop);
    return stop;
  }

  function teardown() {
    (inst._offs || []).forEach((f: () => void) => {
      try {
        f();
      } catch {
        /* noop */
      }
    });
    inst._offs = [];
    inst._assemble = null;
    inst._reset = null;
  }

  function loaderAndTransitions(router: { push: (href: string) => void }) {
    const L = document.querySelector<HTMLElement>("[data-loader]");
    if (!L) {
      (window as any).__loaderDone = true;
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pills = Array.from(L.querySelectorAll<HTMLElement>("[data-lp]"));
    const cnt = L.querySelector<HTMLElement>("[data-lc]");
    const lift = () => {
      L.style.transition = "transform 1s cubic-bezier(.76,0,.24,1), border-radius 1s cubic-bezier(.76,0,.24,1)";
      L.style.borderRadius = "0 0 50% 50% / 0 0 30% 30%";
      L.style.transform = "translateY(-110%)";
      setTimeout(() => {
        (window as any).__loaderDone = true;
      }, 350);
      setTimeout(() => {
        L.style.visibility = "hidden";
      }, 1100);
    };
    if ((window as any).__loaderDone || reduce) {
      (window as any).__loaderDone = true;
      L.style.visibility = "hidden";
    } else {
      pills.forEach((p, i) =>
        setTimeout(
          () => {
            p.style.transition = "transform 1s cubic-bezier(.34,1.5,.64,1), opacity .3s";
            p.style.opacity = "1";
            p.style.transform = "translateY(0) rotate(" + [-4, 3, -2][i] + "deg)";
          },
          150 + i * 170,
        ),
      );
      const t0 = Date.now();
      let seen = false;
      try {
        seen = !!localStorage.getItem("df-seen");
        localStorage.setItem("df-seen", "1");
      } catch {
        /* noop */
      }
      const dur = seen ? 550 : 1500;
      const iv = setInterval(() => {
        const k = Math.min(1, (Date.now() - t0) / dur);
        if (cnt) cnt.textContent = String(Math.round((1 - Math.pow(1 - k, 3)) * 100)).padStart(3, "0");
        if (k >= 1) {
          clearInterval(iv);
          const go = () => lift();
          (document.fonts && document.fonts.ready
            ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))])
            : Promise.resolve()
          ).then(() => setTimeout(go, 150));
        }
      }, 30);
    }
    if ((window as any).__navHook) document.removeEventListener("click", (window as any).__navHook, true);
    (window as any).__navHook = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest && (target.closest("a[href]") as HTMLAnchorElement | null);
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || /^https?:/.test(href)) return;
      e.preventDefault();
      pills.forEach((p) => {
        p.style.transition = "none";
        p.style.opacity = "1";
        p.style.transform = "none";
      });
      if (cnt) cnt.textContent = "→";
      L.style.transition = "none";
      L.style.visibility = "visible";
      L.style.borderRadius = "0 0 0 0";
      L.style.transform = "translateY(110%)";
      void L.offsetHeight;
      L.style.transition = "transform .8s cubic-bezier(.76,0,.24,1)";
      L.style.transform = "translateY(0)";
      setTimeout(() => {
        router.push(href);
      }, 820);
    };
    document.addEventListener("click", (window as any).__navHook, true);
    const onShow = (ev: PageTransitionEvent) => {
      if (ev.persisted) {
        L.style.transition = "none";
        L.style.visibility = "hidden";
      }
    };
    window.addEventListener("pageshow", onShow as any);
  }

  function extras() {
    if ((window as any).__dfExtras) (window as any).__dfExtras();
    const offs: (() => void)[] = [];
    (window as any).__dfExtras = () => offs.forEach((f) => f());
    const onLocal = (t: EventTarget, e: string, f: any, o?: any) => {
      t.addEventListener(e, f, o);
      offs.push(() => t.removeEventListener(e, f, o));
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    const last: Record<string, number> = {};
    (window as any).__sfx = (kind: string, v = 1) => {
      const ac = inst._ac;
      if (!ac || !getState().sound) return;
      const n = ac.currentTime;
      const gap = ({ pop: 0.05, tick: 0.06, swish: 0.2 } as any)[kind] || 0.05;
      if (last[kind] && n - last[kind] < gap) return;
      last[kind] = n;
      const g = ac.createGain();
      g.connect(inst._out);
      if (kind === "swish") {
        const src = ac.createBufferSource();
        const f = ac.createBiquadFilter();
        src.buffer = inst._noise;
        f.type = "bandpass";
        f.Q.value = 1.2;
        f.frequency.setValueAtTime(380, n);
        f.frequency.exponentialRampToValueAtTime(2600, n + 0.32);
        g.gain.setValueAtTime(0, n);
        g.gain.linearRampToValueAtTime(0.16, n + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.42);
        src.connect(f);
        f.connect(g);
        src.start(n);
        src.stop(n + 0.45);
        return;
      }
      const o = ac.createOscillator();
      if (kind === "pop") {
        o.type = "sine";
        o.frequency.setValueAtTime(150 + Math.random() * 140, n);
        o.frequency.exponentialRampToValueAtTime(70, n + 0.14);
        g.gain.setValueAtTime(0.22 * v, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.16);
      } else {
        o.type = "triangle";
        o.frequency.setValueAtTime(1500, n);
        g.gain.setValueAtTime(0.035, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.04);
      }
      o.connect(g);
      o.start(n);
      o.stop(n + 0.2);
    };
    onLocal(document, "pointerover", (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const el = t.closest && (t.closest('a,button,[data-blk],[data-rv="pill"]') as HTMLElement | null);
      if (el && !el.contains(e.relatedTarget as Node)) (window as any).__sfx("tick");
    });
    try {
      if (localStorage.getItem("df-sound") === "1") {
        const arm = () => {
          document.removeEventListener("pointerdown", arm);
          if (!getState().sound) setSound(true);
        };
        document.addEventListener("pointerdown", arm);
        offs.push(() => document.removeEventListener("pointerdown", arm));
      }
    } catch {
      /* noop */
    }
    const endY = () => {
      const c = document.querySelector<HTMLElement>('[data-v="c"]');
      return c ? c.getBoundingClientRect().top + scrollY + c.offsetHeight - innerHeight + 2 : 0;
    };
    let skipOn: boolean | null = null;
    let skipEl: Element | null = null;
    const skipIv = setInterval(() => {
      const skip = document.querySelector<HTMLElement>("[data-skip]");
      if (!skip) return;
      const v = scrollY < endY() - innerHeight * 0.5;
      if (v === skipOn && skip === skipEl) return;
      skipOn = v;
      skipEl = skip;
      skip.style.opacity = v ? ".6" : "0";
      skip.style.transform = v ? "none" : "translateY(-12px)";
      skip.style.pointerEvents = v ? "auto" : "none";
    }, 120);
    offs.push(() => clearInterval(skipIv));
    inst._skip = () => {
      const L = document.querySelector<HTMLElement>("[data-loader]");
      const y = endY();
      const de = document.documentElement;
      const jump = () => {
        de.style.scrollBehavior = "auto";
        scrollTo(0, y);
        de.style.scrollBehavior = "";
      };
      if (!L || reduce) return jump();
      (window as any).__sfx("swish");
      L.style.transition = "none";
      L.style.visibility = "visible";
      L.style.borderRadius = "0";
      L.style.transform = "translateY(110%)";
      void L.offsetHeight;
      L.style.transition = "transform .6s cubic-bezier(.76,0,.24,1)";
      L.style.transform = "translateY(0)";
      setTimeout(() => {
        jump();
        L.style.transition = "transform .8s cubic-bezier(.76,0,.24,1), border-radius .8s cubic-bezier(.76,0,.24,1)";
        L.style.borderRadius = "0 0 50% 50% / 0 0 30% 30%";
        L.style.transform = "translateY(-110%)";
        setTimeout(() => {
          L.style.visibility = "hidden";
        }, 850);
      }, 650);
    };
    const barIv = setInterval(() => {
      const t = performance.now();
      document.querySelectorAll<HTMLElement>("[data-bar]").forEach((b, i) => {
        b.style.height = getState().sound ? (3 + Math.abs(Math.sin(t / (170 + i * 70) + i)) * 9).toFixed(1) + "px" : "3px";
      });
    }, 50);
    offs.push(() => clearInterval(barIv));
    if (!fine || reduce) return;
    document.documentElement.classList.add("df-cur");
    offs.push(() => document.documentElement.classList.remove("df-cur"));
    const mk = (css: Partial<CSSStyleDeclaration>) => {
      const d = document.createElement("div");
      Object.assign(d.style, { position: "fixed", left: "0", top: "0", pointerEvents: "none", borderRadius: "999px" }, css);
      document.body.appendChild(d);
      offs.push(() => d.remove());
      return d;
    };
    const ring = mk({
      width: "40px",
      height: "40px",
      marginLeft: "-20px",
      marginTop: "-20px",
      border: "1.5px solid #F5F1E8",
      mixBlendMode: "difference",
      zIndex: "600",
      display: "grid",
      placeItems: "center",
      transition: "width .35s cubic-bezier(.34,1.5,.64,1), height .35s cubic-bezier(.34,1.5,.64,1), margin .35s cubic-bezier(.34,1.5,.64,1), background .25s, border-color .25s",
    } as any);
    const lab = document.createElement("span");
    Object.assign(lab.style, {
      fontFamily: "'IBM Plex Mono',monospace",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: ".12em",
      color: "#06382E",
      opacity: "0",
      transition: "opacity .2s",
    } as any);
    ring.appendChild(lab);
    const dot = mk({ width: "6px", height: "6px", marginLeft: "-3px", marginTop: "-3px", background: "#F5F1E8", mixBlendMode: "difference", zIndex: "601" } as any);
    let mx = -100,
      my = -100,
      rx = mx,
      ry = my,
      mode = "",
      down = false;
    const setMode = (m: string) => {
      if (m === mode) return;
      mode = m;
      const s = m === "label" ? 84 : m === "link" ? 64 : 40;
      Object.assign(ring.style, {
        width: s + "px",
        height: s + "px",
        marginLeft: -s / 2 + "px",
        marginTop: -s / 2 + "px",
        background: m === "label" ? "#D4A637" : "transparent",
        borderColor: m === "label" ? "#D4A637" : "#F5F1E8",
        mixBlendMode: m === "label" ? "normal" : "difference",
      } as any);
      lab.style.opacity = m === "label" ? "1" : "0";
      dot.style.opacity = m === "label" ? "0" : "1";
    };
    onLocal(
      window,
      "pointermove",
      (e: PointerEvent) => {
        mx = e.clientX;
        my = e.clientY;
        const t = e.target as HTMLElement | null;
        const tEl = t ?? null;
        const blk = tEl && (tEl.closest("[data-blk]") as HTMLElement | null);
        const lk = tEl && (tEl.closest('a,button,input,[data-rv="pill"]') as HTMLElement | null);
        if (blk) {
          lab.textContent = down ? "WHEE" : "THROW";
          setMode("label");
        } else if (lk) setMode("link");
        else setMode("");
      },
      { passive: true },
    );
    onLocal(window, "pointerdown", () => {
      down = true;
      if (mode === "label") lab.textContent = "WHEE";
    });
    onLocal(window, "pointerup", () => {
      down = false;
      if (mode === "label") lab.textContent = "THROW";
    });
    onLocal(document, "pointerleave", () => {
      mx = my = -100;
    });
    let alive = true;
    offs.push(() => {
      alive = false;
    });
    const loop = () => {
      if (!alive) return;
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)" + (down ? " scale(.85)" : "");
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function setSound(onState: boolean) {
    if (onState && !inst._ac) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      const out = ac.createGain();
      out.gain.value = 0.9;
      out.connect(ac.destination);
      const buf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      inst._ac = ac;
      inst._out = out;
      inst._noise = buf;
    }
    if (inst._ac && inst._ac.state === "suspended") inst._ac.resume();
    patchState({ sound: onState });
    try {
      localStorage.setItem("df-sound", onState ? "1" : "0");
    } catch {
      /* noop */
    }
    if (onState) setTimeout(() => (window as any).__sfx && (window as any).__sfx("pop", 0.8), 30);
  }

  function revealEngine() {
    if ((window as any).__rvIv) clearInterval((window as any).__rvIv);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INIT: Record<string, (el?: Element, i?: number) => Partial<CSSStyleDeclaration>> = {
      rise: () => ({ opacity: "0", transform: "translateY(70px) skewY(5deg)" } as any),
      up: () => ({ opacity: "0", transform: "translateY(50px)" } as any),
      pill: (_el, i = 0) => ({ opacity: "0", transform: "translateX(" + (i % 2 ? 34 : -34) + "vw) rotate(" + (i % 2 ? 7 : -7) + "deg)" } as any),
      deal: (_el, i = 0) => ({ opacity: "0", transform: "translateY(160px) rotate(" + (i - 1) * -14 + "deg) scale(.88)" } as any),
      mask: () => ({ clipPath: "inset(100% 0 0 0 round 32px)" } as any),
    };
    const DONE: Record<string, Partial<CSSStyleDeclaration>> = {
      rise: { opacity: "1", transform: "none" } as any,
      up: { opacity: "1", transform: "none" } as any,
      pill: { opacity: "1", transform: "none" } as any,
      deal: { opacity: "1", transform: "none" } as any,
      mask: { clipPath: "inset(0% 0 0 0 round 0px)" } as any,
    };
    const TR: Record<string, string> = {
      rise: "opacity 1s ease, transform 1.2s cubic-bezier(.16,1,.3,1)",
      up: "opacity .8s ease, transform 1s cubic-bezier(.16,1,.3,1)",
      pill: "opacity .5s ease, transform 1.1s cubic-bezier(.34,1.45,.64,1)",
      deal: "opacity .5s ease, transform 1.2s cubic-bezier(.34,1.4,.64,1)",
      mask: "clip-path 1.4s cubic-bezier(.76,0,.24,1)",
    };
    (window as any).__rvIv = setInterval(() => {
      const vh = innerHeight;
      document.querySelectorAll<HTMLElement>("[data-rv]").forEach((el) => {
        const t = el.dataset.rv!;
        if (el.dataset.rvS === "2") return;
        const i = Array.prototype.indexOf.call(el.parentElement!.children, el);
        if (reduce) {
          el.dataset.rvS = "2";
          Object.assign(el.style, DONE[t]);
          return;
        }
        if (!el.dataset.rvS) {
          Object.assign(el.style, INIT[t](el, i));
          el.dataset.rvS = "1";
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) {
          el.style.transition = TR[t];
          el.style.transitionDelay = Math.min(i, 8) * (t === "pill" ? 70 : 120) + "ms";
          Object.assign(el.style, DONE[t]);
          el.dataset.rvS = "2";
        }
      });
      const w = document.querySelector<HTMLElement>("[data-wipe]");
      const wi = document.querySelector<HTMLElement>("[data-wipe-in]");
      if (w && wi) {
        const r = w.getBoundingClientRect();
        const k = clamp((vh * 0.9 - r.top) / (vh * 0.9));
        const rad = (k * 100).toFixed(1);
        wi.style.transform = "scaleY(" + (1 - k * 0.92).toFixed(4) + ")";
        wi.style.borderRadius = "0 0 50% 50% / 0 0 " + rad + "% " + rad + "%";
      }
    }, 30);
  }

  function setupA(): Promise<void> | void {
    let tries = 0;
    const wait = () => {
      const M = (window as any).Matter;
      const root0 = document.querySelector<HTMLElement>('[data-v="a"]');
      if (M && root0 && root0.clientWidth > 0) {
        try {
          go();
        } catch (e: any) {
          console.error("setupA: " + e.message + " " + (e.stack || "").split("\n")[1]);
        }
      } else if (tries++ < 80) {
        const id = setTimeout(wait, 100);
        inst._offs.push(() => clearTimeout(id));
      }
    };
    const go = () => {
      const M = (window as any).Matter;
      const root = document.querySelector<HTMLElement>('[data-v="a"]')!;
      const W = root.clientWidth,
        H = root.clientHeight;
      const engine = M.Engine.create();
      engine.gravity.y = 1.15;
      const wall = (x: number, y: number, w: number, h: number) => M.Bodies.rectangle(x, y, w, h, { isStatic: true });
      M.Composite.add(engine.world, [wall(W / 2, H + 60, W * 4, 120), wall(-60, H / 2 - 1500, 120, H + 3000), wall(W + 60, H / 2 - 1500, 120, H + 3000)]);
      const els = Array.from(root.querySelectorAll<HTMLElement>("[data-blk]"));
      const bodies = els.map((el, i) => {
        const w = el.offsetWidth,
          h = el.offsetHeight;
        const b = M.Bodies.rectangle(W * (0.18 + 0.64 * Math.random()), -h - i * 95, w, h, {
          chamfer: { radius: Math.max(2, Math.min(h / 2, w / 2) - 2) },
          restitution: 0.3,
          friction: 0.35,
          frictionAir: 0.012,
          angle: (Math.random() - 0.5) * 0.9,
        });
        b._w = w;
        b._h = h;
        b._k = el.dataset.blk;
        return b;
      });
      M.Composite.add(engine.world, bodies);
      M.Events.on(engine, "collisionStart", (ev: any) => {
        if (!(window as any).__sfx) return;
        let mx = 0;
        ev.pairs.forEach((p: any) => {
          const v = Math.hypot(p.bodyA.velocity.x - p.bodyB.velocity.x, p.bodyA.velocity.y - p.bodyB.velocity.y);
          if (v > mx) mx = v;
        });
        if (mx > 2.5) (window as any).__sfx("pop", Math.min(1, mx / 14));
      });
      let touched = false,
        drag: { c: any; id: number } | null = null;
      root.style.touchAction = "pan-y";
      els.forEach((el) => {
        el.style.touchAction = "none";
      });
      const pt = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      const down = (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        const el = target.closest && (target.closest("[data-blk]") as HTMLElement | null);
        if (!el) return;
        const b = bodies[els.indexOf(el)];
        if (!b) return;
        e.preventDefault();
        touched = true;
        if (targets && targets.has(b)) {
          targets.delete(b);
          M.Body.setStatic(b, false);
          if (getState().assembled) patchState({ assembled: false });
        }
        const p = pt(e);
        const c = M.Constraint.create({
          pointA: { x: p.x, y: p.y },
          bodyB: b,
          pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
          stiffness: 0.2,
          damping: 0.1,
          length: 0,
        });
        M.Composite.add(engine.world, c);
        drag = { c, id: e.pointerId };
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      };
      const move = (e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        const p = pt(e);
        drag.c.pointA.x = p.x;
        drag.c.pointA.y = p.y;
      };
      const up = (e: PointerEvent) => {
        if (!drag || (e.pointerId !== undefined && e.pointerId !== drag.id)) return;
        M.Composite.remove(engine.world, drag.c);
        drag = null;
      };
      on(root, "pointerdown", down as any);
      on(window, "pointermove", move as any);
      on(window, "pointerup", up as any);
      on(window, "pointercancel", up as any);
      let targets: Map<any, { x: number; y: number }> | null = null;
      const layout = () => {
        const maxW = W * 0.9,
          gap = Math.max(10, W * 0.012);
        const flow = (list: any[]) => {
          const lines: any[][] = [[]];
          let lw = 0;
          list.forEach((b) => {
            if (lw + b._w > maxW && lines[lines.length - 1].length) {
              lines.push([]);
              lw = 0;
            }
            lines[lines.length - 1].push(b);
            lw += b._w + gap;
          });
          return lines;
        };
        const words = bodies.filter((b: any) => b._k === "w"),
          tags = bodies.filter((b: any) => b._k === "t");
        const wl = flow(words),
          tl = flow(tags);
        const hW = wl.reduce((s: number, l: any[]) => s + Math.max(...l.map((b) => b._h)) + gap * 0.6, 0);
        const hT = tl.reduce((s: number, l: any[]) => s + Math.max(...l.map((b) => b._h)) + 10, 0);
        let y = Math.max(80, (H - hW - hT - 36) / 2 - 10);
        const t = new Map();
        const place = (lines: any[][], g: number, vg: number) =>
          lines.forEach((l) => {
            const lh = Math.max(...l.map((b) => b._h));
            const tw = l.reduce((s: number, b: any) => s + b._w, 0) + g * (l.length - 1);
            let x = (W - tw) / 2;
            l.forEach((b) => {
              t.set(b, { x: x + b._w / 2, y: y + lh / 2 });
              x += b._w + g;
            });
            y += lh + vg;
          });
        place(wl, gap, gap * 0.6);
        y += 26;
        place(tl, 10, 10);
        return t;
      };
      inst._assemble = (assembleOn: boolean) => {
        if (assembleOn) {
          if (drag) {
            M.Composite.remove(engine.world, drag.c);
            drag = null;
          }
          targets = layout();
          bodies.forEach((b: any) => M.Body.setStatic(b, true));
        } else {
          targets = null;
          bodies.forEach((b: any) => {
            M.Body.setStatic(b, false);
            M.Body.setVelocity(b, { x: (Math.random() - 0.5) * 16, y: -4 - Math.random() * 14 });
            M.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.35);
          });
        }
      };
      const auto = setTimeout(() => {
        if (!touched && !getState().assembled) {
          patchState({ assembled: true });
          inst._assemble && inst._assemble(true);
        }
      }, 3400);
      let last = performance.now();
      const loop = (now: number) => {
        if (root.isConnected && root.clientWidth > 0 && (root.clientWidth !== W || Math.abs(root.clientHeight - H) > 140)) {
          stopA();
          onResize();
          return;
        }
        if (!root.isConnected) {
          stopA();
          return;
        }
        if (!els[0].isConnected) {
          const f = Array.from(root.querySelectorAll<HTMLElement>("[data-blk]"));
          if (f.length === els.length) f.forEach((e, i) => (els[i] = e));
        }
        const el = Math.min(400, now - last);
        last = now;
        const steps = Math.max(1, Math.round(el / 16));
        const lf = 1 - Math.pow(0.87, steps);
        if (targets)
          bodies.forEach((b: any) => {
            const tg = targets!.get(b);
            if (!tg) return;
            M.Body.setPosition(b, { x: b.position.x + (tg.x - b.position.x) * lf, y: b.position.y + (tg.y - b.position.y) * lf });
            M.Body.setAngle(b, b.angle * (1 - lf));
          });
        for (let k = 0; k < steps; k++) M.Engine.update(engine, 16);
        for (let i = 0; i < els.length; i++) {
          const b = bodies[i];
          els[i].style.transform = "translate(" + (b.position.x - b._w / 2).toFixed(1) + "px," + (b.position.y - b._h / 2).toFixed(1) + "px) rotate(" + b.angle.toFixed(4) + "rad)";
        }
      };
      const stopA = every(loop);
      let rz = 0;
      const onResize = () => {
        if (root.clientWidth === W && Math.abs(root.clientHeight - H) <= 140) return;
        clearTimeout(rz);
        rz = window.setTimeout(() => {
          teardown();
          (window as any).__heroActive = null;
          patchState({ assembled: false });
        }, 250);
      };
      on(window, "resize", onResize);
      inst._offs.push(() => {
        clearTimeout(auto);
        clearTimeout(rz);
        M.Engine.clear(engine);
        M.World.clear(engine.world, false);
      });
    };
    wait();
  }

  // setupB (Untangle, variant 2b) -- ported verbatim per the port guide, but there is no
  // `[data-v="b"]` element anywhere in DFoundry Hero.dc.html's markup (no tab switcher
  // renders `{{ tabs }}`, and `state.v` is hardcoded to 'a' on load), so this never runs
  // against real DOM in the source file either. Kept for fidelity to "don't drop anything."
  function setupB() {
    const root = document.querySelector<HTMLElement>('[data-v="b"]');
    if (!root) return;
    const cv = root.querySelector<HTMLCanvasElement>("[data-cv]")!;
    const ctx = cv.getContext("2d")!;
    let W = 0,
      H = 0,
      dpr = 1,
      S = 0,
      P = 0,
      fix: Float32Array,
      baseY: number[] = [],
      xs: number[] = [];
    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = root.clientWidth;
      H = root.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S = W < 700 ? 30 : 48;
      P = W < 700 ? 60 : 96;
      fix = new Float32Array(S * P);
      baseY = [];
      xs = [];
      const y0 = H * 0.14,
        y1 = H * 0.56;
      for (let i = 0; i < S; i++) baseY.push(y0 + (y1 - y0) * (i / (S - 1)));
      for (let j = 0; j < P; j++) xs.push(-10 + (W + 20) * (j / (P - 1)));
    };
    size();
    let t = 0,
      done = false,
      lastPct = -1,
      lastSet = 0;
    const amp = () => Math.min(H * 0.2, 170);
    const pos = (i: number, j: number, out: { x: number; y: number }) => {
      const f = fix[i * P + j],
        k = (1 - f) * (1 - f),
        env = 0.3 + 0.7 * Math.pow(Math.sin((Math.PI * j) / (P - 1)), 0.5),
        A = amp() * env;
      out.x = xs[j] + k * 22 * Math.sin(j * 0.5 + i * 3.1 + t * 0.9);
      out.y = baseY[i] + k * A * (0.6 * Math.sin(j * 0.19 + i * 2.1 + t * 0.7) + 0.8 * Math.sin(j * 0.071 - i * 1.3 + t * 0.4) + 0.25 * Math.sin(j * 0.43 + i * 0.7 - t * 1.2));
      return out;
    };
    const tmp = { x: 0, y: 0 };
    const comb = (cx: number, cy: number, R: number, s: number) => {
      for (let i = 0; i < S; i++)
        for (let j = 0; j < P; j++) {
          pos(i, j, tmp);
          const d = Math.hypot(tmp.x - cx, tmp.y - cy);
          if (d < R) {
            const n = i * P + j;
            fix[n] += (1 - fix[n]) * s * (1 - d / R);
          }
        }
    };
    let px: number | null = null,
      py = 0;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect(),
        x = e.clientX - r.left,
        y = e.clientY - r.top;
      if (px === null) {
        px = x;
        py = y;
      }
      const dist = Math.hypot(x - px, y - py),
        steps = Math.max(1, Math.ceil(dist / 18));
      for (let s = 1; s <= steps; s++) comb(px + ((x - px) * s) / steps, py + ((y - py) * s) / steps, W < 700 ? 70 : 105, 0.45);
      px = x;
      py = y;
    };
    const onLeave = () => {
      px = null;
    };
    on(root, "pointermove", onMove as any);
    on(root, "pointerleave", onLeave);
    inst._reset = () => {
      fix.fill(0);
      done = false;
      t = 0;
      patchState({ done: false, pct: 0 });
    };
    let last = performance.now();
    const loop = (now: number) => {
      if (root.clientWidth === 0 || root.clientHeight === 0) {
        last = now;
        return;
      }
      if (root.clientWidth !== W || root.clientHeight !== H) {
        const f1 = done;
        size();
        if (f1) fix.fill(1);
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (t < 2.6 && !done) {
        const k = t / 2.6;
        comb(W * (0.04 + 0.34 * k), H * (0.35 + 0.2 * Math.sin(k * Math.PI * 3)), 60, 0.5);
      }
      let sum = 0;
      for (let n = 0; n < fix.length; n++) sum += fix[n];
      const pct = Math.round((100 * sum) / fix.length);
      if (!done && pct >= 55) {
        done = true;
        patchState({ done: true });
      }
      if (done) for (let n = 0; n < fix.length; n++) fix[n] += (1 - fix[n]) * 0.045;
      if (pct !== lastPct && now - lastSet > 120) {
        lastPct = pct;
        lastSet = now;
        patchState({ pct });
      }
      ctx.fillStyle = "#06382E";
      ctx.fillRect(0, 0, W, H);
      ctx.lineCap = "round";
      const a = { x: 0, y: 0 },
        b = { x: 0, y: 0 };
      for (let i = 0; i < S; i++) {
        pos(i, 0, a);
        for (let j = 1; j < P; j++) {
          pos(i, j, b);
          const f = (fix[i * P + j - 1] + fix[i * P + j]) / 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          if (f > 0.92) {
            ctx.strokeStyle = "#D4A637";
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = "rgba(245,241,232," + (0.22 + 0.45 * f).toFixed(3) + ")";
            ctx.lineWidth = 1.2;
          }
          ctx.stroke();
          a.x = b.x;
          a.y = b.y;
        }
      }
    };
    every(loop);
    on(window, "resize", () => {
      size();
      if (done) fix.fill(1);
    });
  }

  function setupC() {
    const root = document.querySelector<HTMLElement>('[data-v="c"]');
    if (!root) return;
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const zh = q("[data-zh]")!,
      oo = q("[data-o]")!,
      lbT = q('[data-lb="top"]')!,
      lbB = q('[data-lb="bot"]')!,
      sl = q("[data-sl]")!,
      tc = q("[data-tc]")!,
      cue = q("[data-cue]")!,
      rise = q("[data-rise]")!;
    const labels = ["SCENE 01 · THE PROBLEM", "SCENE 02 · THE PROBLEM", "SCENE 03 · THE PROBLEM", "SCENE 04 · THE PROBLEM", "SCENE 05 · THE FIX", "SCENE 06 · D’FOUNDRY"];
    let cur = -1;
    const track = q("[data-track]")!;
    const ez = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const loop = () => {
      const r = root.getBoundingClientRect(),
        vh = innerHeight,
        p = clamp(-r.top / (r.height - vh));
      const idx = p < 0.4 ? Math.min(3, Math.floor(p / 0.1)) : p < 0.86 ? 4 : 5;
      if (idx !== cur) {
        if (cur !== -1 && (window as any).__sfx) (window as any).__sfx("swish");
        cur = idx;
        track.style.visibility = idx < 4 ? "visible" : "hidden";
        scenes.forEach((s, i) => {
          if (i > 3) s.style.visibility = i === idx ? "visible" : "hidden";
        });
        sl.textContent = labels[idx];
        const lb = idx < 4 ? "9vh" : idx === 4 ? "5vh" : "0vh";
        lbT.style.height = lb;
        lbB.style.height = lb;
      }
      if (idx < 4) {
        const s = Math.min(p / 0.1, 3),
          si = Math.floor(s),
          g = si < 3 ? ez(clamp((s - si - 0.6) / 0.4)) : 0;
        const posv = si + g,
          zo = 1 - 0.22 * Math.sin(Math.PI * g);
        track.style.transformOrigin = (posv * 100 + 50).toFixed(3) + "vw 50%";
        track.style.transform = "translate3d(" + (-posv * 100).toFixed(3) + "vw,0,0) scale(" + zo.toFixed(4) + ") skewX(" + (Math.sin(Math.PI * g) * -3).toFixed(2) + "deg)";
        track.style.borderRadius = "0";
        scenes.slice(0, 4).forEach((sc) => {
          sc.style.borderRadius = (Math.sin(Math.PI * g) * 40).toFixed(1) + "px";
        });
      }
      if (idx < 4)
        for (let i2 = 0; i2 < 4; i2++) {
          const k = clamp((p - i2 * 0.1) / 0.1),
            el = scenes[i2].querySelector<HTMLElement>("[data-push]");
          if (el) el.style.transform = "scale(" + (1.3 - 0.3 * ez(k)).toFixed(4) + ")";
          const sc = scenes[i2];
          if (i2 === 0)
            sc.querySelectorAll<HTMLElement>("[data-l]").forEach((l, i) => {
              const f = 1 - clamp(k * 1.7);
              l.style.transform = "translate(" + (Math.sin(i * 1.3) * 50 * f).toFixed(1) + "px," + (Math.cos(i * 1.9) * 110 * f).toFixed(1) + "px) rotate(" + (Math.sin(i * 2.3) * 34 * f).toFixed(1) + "deg)";
            });
          if (i2 === 1)
            sc.querySelectorAll<HTMLElement>("[data-row]").forEach((r2, i) => {
              const f = 1 - clamp(k * 3 - i * 0.55);
              r2.style.transform = "translateX(" + (i % 2 ? 1 : -1) * f * 70 + "vw)";
            });
          if (i2 === 2) {
            const f = clamp(k * 1.4);
            const l = sc.querySelector<HTMLElement>('[data-split="l"]'),
              rr = sc.querySelector<HTMLElement>('[data-split="r"]');
            if (l) l.style.transform = "translateX(" + (-f * 9).toFixed(2) + "vw)";
            if (rr) rr.style.transform = "translateX(" + (f * 9).toFixed(2) + "vw)";
          }
          if (i2 === 3) {
            const st = sc.querySelector<HTMLElement>("[data-strike]");
            if (st) st.style.transform = "rotate(-4deg) scaleX(" + clamp(k * 2.2 - 0.25).toFixed(3) + ")";
          }
        }
      cue.style.opacity = p < 0.03 ? "1" : "0";
      const secs = p * 48,
        ss = Math.floor(secs),
        ff = Math.floor((secs - ss) * 24);
      tc.textContent = "00:00:" + String(ss).padStart(2, "0") + ":" + String(ff).padStart(2, "0");
      const k2 = clamp((p - 0.56) / 0.3);
      if (k2 <= 0) {
        zh.style.transform = "none";
        const hr = zh.getBoundingClientRect(),
          or = oo.getBoundingClientRect();
        zh.style.transformOrigin = (or.left - hr.left + or.width * 0.12).toFixed(1) + "px " + (or.top - hr.top + or.height * 0.6).toFixed(1) + "px";
      } else zh.style.transform = "scale(" + (1 + Math.pow(k2, 3.2) * 160).toFixed(3) + ")";
      const rk = clamp((p - 0.86) / 0.08);
      rise.style.opacity = String(rk);
      rise.style.transform = "translateY(" + ((1 - rk) * 60).toFixed(1) + "px)";
    };
    every(loop);
  }

  function tick(router: { push: (href: string) => void }) {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-v]"));
    const act = (window as any).__heroActive || [];
    const same = els.length === act.length && els.every((e, i) => e === act[i]);
    if (same || !els.length || els.some((e) => e.clientWidth === 0 || e.clientHeight === 0) || !(window as any).Matter || !(window as any).__loaderDone) return;
    teardown();
    (window as any).__heroActive = els;
    els.forEach((el) => {
      const v = el.dataset.v;
      try {
        v === "a" ? setupA() : v === "b" ? setupB() : setupC();
      } catch (e: any) {
        console.error("setup " + v + ": " + e.message);
      }
    });
    void router;
  }

  return { on, every, teardown, loaderAndTransitions, extras, setSound, revealEngine, setupA, setupB, setupC, tick, _inst: inst };
}
