type Target = "emporium" | "provision" | "source";
type PushRouter = { push: (href: string) => void };

const PATHS: Record<Target, string> = { emporium: "/emporium", provision: "/provision", source: "/" };

const THEME = {
  e: { bg: "#0A0A0A", ink: "#F2F2F2", acc: "#A6F000", name: "EMPORIUM", kick: "D’EMPORIUM · FOR HOME", line: "DOORS OPEN · DELIVERED NATIONWIDE", kickMono: true },
  p: { bg: "#06382E", ink: "#F5F1E8", acc: "#D4A637", name: "Provision", kick: "D’PROVISION · FOR BUSINESS", line: "Welcome in. Let’s equip the building.", kickMono: false },
  h: { bg: "#F5F1E8", ink: "#06382E", acc: "#06382E", name: "D’Source", kick: "COMMERCE BY D’MATEK", line: "Back to the front.", kickMono: false },
} as const;

function kindFor(target: Target): keyof typeof THEME {
  return target === "emporium" ? "e" : target === "provision" ? "p" : "h";
}

function mk(css: Partial<CSSStyleDeclaration>) {
  const d = document.createElement("div");
  Object.assign(d.style, css);
  return d;
}

let inFlight = false;

/** Full-screen store-switch transition, matching the design source's `go()`:
 * a plate grows from the triggering element to fill the screen, splits into
 * a two-leaf curtain with the destination's name animating in letter by
 * letter over a progress bar, then wipes away in a store-specific way
 * (emporium: leaves slide apart; provision: circular clip-path; home: fade)
 * once the route has actually changed underneath. */
export function playStoreTransition(router: PushRouter, target: Target, originEl?: HTMLElement | null) {
  if (inFlight) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !document.body.animate) {
    router.push(PATHS[target]);
    return;
  }

  const kind = kindFor(target);
  const W = THEME[kind];
  const key = "ds-seen-" + target;
  let seen = false;
  try {
    seen = sessionStorage.getItem(key) === "1";
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage unavailable (private mode, etc.) — treat as unseen each time.
  }
  const full = !seen;
  const T = full ? { grow: 750, hold: 1250, out: 900, stag: 45 } : { grow: 420, hold: 380, out: 560, stag: 0 };

  const vw = innerWidth;
  const vh = innerHeight;
  const src = originEl ? originEl.getBoundingClientRect() : { left: vw / 2 - 40, top: vh / 2 - 40, width: 80, height: 80 };

  inFlight = true;
  const root = mk({ position: "fixed", inset: "0", zIndex: "9999", cursor: "pointer" });
  const leafBase: Partial<CSSStyleDeclaration> = { position: "absolute", top: "0", bottom: "0", width: "50.5%", background: W.bg, overflow: "hidden" };
  const L = mk({ ...leafBase, left: "0" });
  const Rr = mk({ ...leafBase, right: "0" });
  const seam = mk({ position: "absolute", top: "0", bottom: "0", left: "50%", width: "2px", marginLeft: "-1px", background: W.acc, transform: "scaleY(0)" });
  const plate = mk({
    position: "absolute",
    left: src.left + "px",
    top: src.top + "px",
    width: src.width + "px",
    height: src.height + "px",
    background: W.bg,
    borderRadius: kind === "p" ? "40px" : "0px",
  });
  const txt = mk({ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px", color: W.ink, textAlign: "center", padding: "24px", opacity: "0" });
  const k = mk({ fontFamily: W.kickMono ? "var(--font-mono)" : "var(--font-sans)", fontSize: "12px", letterSpacing: ".22em", color: W.acc });
  k.textContent = W.kick;
  const nm = mk({ fontFamily: "var(--font-sans)", fontWeight: "800", fontSize: "clamp(56px,13vw,210px)", lineHeight: ".88", letterSpacing: kind === "e" ? "-.04em" : "-.045em" });
  const letters = [...W.name].map((ch) => {
    const s = document.createElement("span");
    s.textContent = ch === " " ? " " : ch;
    s.style.display = "inline-block";
    nm.appendChild(s);
    return s;
  });
  const ln = mk({ fontFamily: kind === "e" ? "var(--font-mono)" : "var(--font-sans)", fontSize: kind === "e" ? "12px" : "17px", fontWeight: "600", letterSpacing: kind === "e" ? ".2em" : "0", opacity: ".8" });
  ln.textContent = W.line;
  const bar = mk({ width: "min(320px,60vw)", height: "2px", background: "rgba(128,128,128,.25)", position: "relative", overflow: "hidden", borderRadius: "2px" });
  const fill = mk({ position: "absolute", inset: "0", background: W.acc, transform: "scaleX(0)", transformOrigin: "left" });
  bar.appendChild(fill);
  const skip = mk({ position: "absolute", left: "50%", bottom: "22px", transform: "translateX(-50%)", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".16em", color: W.ink, opacity: ".5" });
  skip.textContent = "TAP TO SKIP";
  txt.append(k, nm, ln, bar);
  root.append(plate);
  document.body.appendChild(root);

  let applied = false;
  const apply = () => {
    if (applied) return;
    applied = true;
    router.push(PATHS[target]);
  };

  const ease = "cubic-bezier(.76,0,.24,1)";
  const finishAll = () => {
    if (!inFlight) return;
    inFlight = false;
    root.remove();
  };

  const grow = plate.animate(
    [
      { left: src.left + "px", top: src.top + "px", width: src.width + "px", height: src.height + "px", borderRadius: kind === "p" ? "40px" : "0px" },
      { left: "0px", top: "0px", width: vw + "px", height: vh + "px", borderRadius: "0px" },
    ],
    { duration: T.grow, easing: ease, fill: "forwards" }
  );

  grow.onfinish = () => {
    root.append(L, Rr, seam, txt, skip);
    plate.remove();
    txt.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: "forwards" });
    letters.forEach((s, i) =>
      s.animate([{ transform: "translateY(40%) rotate(4deg)", opacity: 0 }, { transform: "none", opacity: 1 }], {
        duration: full ? 600 : 300,
        delay: 40 + i * T.stag,
        easing: "cubic-bezier(.2,.7,.2,1)",
        fill: "both",
      })
    );
    fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: full ? 900 : 360, delay: full ? 200 : 0, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" });

    const holdTimer = setTimeout(runExit, T.hold);

    function runExit() {
      clearTimeout(holdTimer);
      apply();
      txt.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.08)" }], { duration: 340, easing: "ease-in", fill: "forwards" });
      skip.remove();
      root.removeEventListener("click", skipNow);
      let out: Animation;
      if (kind === "e") {
        seam.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 240, delay: 100, easing: "ease-out", fill: "forwards" });
        L.animate([{ transform: "translateX(0)" }, { transform: "translateX(-101%)" }], { duration: T.out, delay: 340, easing: ease, fill: "forwards" });
        out = Rr.animate([{ transform: "translateX(0)" }, { transform: "translateX(101%)" }], { duration: T.out, delay: 340, easing: ease, fill: "forwards" });
        seam.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: 340, fill: "forwards" });
      } else if (kind === "p") {
        [L, Rr].forEach((x) => {
          x.style.width = "100%";
          x.style.left = "0";
          x.style.right = "auto";
        });
        Rr.style.display = "none";
        out = L.animate([{ clipPath: "circle(150% at 50% 50%)" }, { clipPath: "circle(0% at 50% 50%)" }], { duration: T.out + 100, delay: 300, easing: ease, fill: "forwards" });
      } else {
        Rr.style.display = "none";
        L.style.width = "100%";
        out = L.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.out - 300, delay: 260, easing: "ease", fill: "forwards" });
      }
      out.onfinish = finishAll;
    }

    function skipNow() {
      runExit();
    }
    root.addEventListener("click", skipNow);
  };
}
