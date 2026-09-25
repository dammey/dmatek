"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createEngine, type EngineState } from "@/lib/dfoundryEngine";

const WORDS: { text: string; style: React.CSSProperties }[] = [
  { text: "Built", style: { borderRadius: 999, background: "#06382E", color: "#F5F1E8" } },
  { text: "for", style: { borderRadius: 999, border: "4px solid #06382E", color: "#06382E" } },
  { text: "your", style: { borderRadius: 999, background: "#D4A637", color: "#06382E" } },
  { text: "problem,", style: { borderRadius: 22, background: "#28705A", color: "#F5F1E8" } },
  { text: "not", style: { borderRadius: 999, background: "#1A1A1A", color: "#F5F1E8", fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontSize: "clamp(44px,7.4vw,128px)", padding: ".02em .4em .1em" } },
  { text: "for", style: { borderRadius: 999, border: "4px solid #06382E", color: "#06382E" } },
  { text: "a", style: { borderRadius: 999, background: "#D4A637", color: "#06382E", padding: ".1em .42em .14em" } },
  { text: "demo.", style: { borderRadius: 22, background: "#06382E", color: "#D4A637", fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontSize: "clamp(44px,7.4vw,128px)", padding: ".02em .45em .1em" } },
];

const TAGS: { text: string; style: React.CSSProperties }[] = [
  { text: "CUSTOM SOFTWARE", style: { background: "#F5F1E8", border: "1.5px solid #06382E" } },
  { text: "WEB APPS", style: { background: "#F5F1E8", border: "1.5px solid #06382E" } },
  { text: "AUTOMATION", style: { background: "#F5F1E8", border: "1.5px solid #06382E" } },
  { text: "INTEGRATION", style: { background: "#F5F1E8", border: "1.5px solid #06382E" } },
  { text: "QADPAY", style: { background: "#06382E", color: "#D4A637" } },
  { text: "DROPLET", style: { background: "#D4A637", color: "#06382E" } },
];

export default function HeroEngine() {
  const router = useRouter();
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  const [state, setState] = useState<EngineState>({ v: "a", assembled: false, pct: 0, done: false, sound: false, p: 0, sent: false });
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const getState = () => stateRef.current;
    const patchState = (p: Partial<EngineState>) => setState((s) => ({ ...s, ...p }));
    const engine = createEngine(getState, patchState);
    engineRef.current = engine;

    let dog: ReturnType<typeof setInterval> | undefined;
    (async () => {
      const Matter = await import("matter-js");
      (window as unknown as { Matter: typeof Matter }).Matter = Matter;
      engine.revealEngine();
      engine.loaderAndTransitions(router);
      engine.extras();
      dog = setInterval(() => engine.tick(router), 150);
    })();

    return () => {
      if (dog) clearInterval(dog);
      engine.teardown();
      const w = window as unknown as { __rvIv?: ReturnType<typeof setInterval>; __heroActive?: unknown; __dfExtras?: () => void };
      if (w.__rvIv) {
        clearInterval(w.__rvIv);
        w.__rvIv = undefined;
      }
      w.__heroActive = null;
    };
    // Mirrors the source's componentDidMount: run once on mount. `router` from
    // next/navigation is stable across renders, so omitting it is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = () => engineRef.current?.setSound(!state.sound);
  const soundLabel = state.sound ? "SOUND ON" : "SOUND OFF";
  const assembleLabel = state.assembled ? "Break it up" : "Put it together";
  const toggleAssemble = () => {
    const n = !state.assembled;
    setState((s) => ({ ...s, assembled: n }));
    (engineRef.current as unknown as { _inst: { _assemble: ((on: boolean) => void) | null } })._inst._assemble?.(n);
  };
  const skipIntro = () => (engineRef.current as unknown as { _inst: { _skip: (() => void) | null } })._inst._skip?.();

  return (
    <>
      {/* Loader */}
      <div
        data-loader="1"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 500,
          background: "#06382E",
          color: "#F5F1E8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "22px clamp(18px,3vw,40px)",
          transformOrigin: "50% 0",
          willChange: "transform",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#A9BBB3" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/assets/dfoundry-logo-mark-rev.png" alt="D’Foundry logo" style={{ height: 28, width: "auto", display: "block" }} />
            D&rsquo;FOUNDRY
          </span>
          <span>A D&rsquo;MATEK BUSINESS</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(6px,1vw,12px)" }}>
          <span data-lp="1" style={{ display: "inline-block", opacity: 0, transform: "translateY(-60vh) rotate(-12deg)", padding: ".08em .42em .14em", borderRadius: 999, background: "#D4A637", color: "#06382E", fontWeight: 800, fontSize: "clamp(40px,8vw,140px)", lineHeight: 1, letterSpacing: "-.05em" }}>
            D&rsquo;
          </span>
          <span data-lp="1" style={{ display: "inline-block", opacity: 0, transform: "translateY(-60vh) rotate(9deg)", padding: ".08em .42em .14em", borderRadius: 999, background: "#F5F1E8", color: "#06382E", fontWeight: 800, fontSize: "clamp(40px,8vw,140px)", lineHeight: 1, letterSpacing: "-.05em" }}>
            Foun
          </span>
          <span
            data-lp="1"
            style={{
              display: "inline-block",
              opacity: 0,
              transform: "translateY(-60vh) rotate(-6deg)",
              padding: ".02em .42em .1em",
              borderRadius: 999,
              background: "#28705A",
              color: "#F5F1E8",
              fontFamily: "var(--font-instrument),serif",
              fontStyle: "italic",
              fontSize: "clamp(46px,9vw,156px)",
              lineHeight: 1,
            }}
          >
            dry
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#A9BBB3" }}>
          <span>CASTING THE PAGE</span>
          <span data-lc="1" style={{ color: "#D4A637" }}>
            000
          </span>
        </div>
      </div>

      {/* Controls */}
      <div data-ctl="1" style={{ position: "fixed", left: "50%", top: 64, transform: "translateX(-50%)", zIndex: 300, display: "flex", gap: 6, mixBlendMode: "difference", color: "#F5F1E8" }}>
        <button
          onClick={toggleSound}
          aria-label="Toggle sound"
          className="df-ctl-btn"
          style={{ display: "flex", alignItems: "center", gap: 7, border: 0, borderRadius: 999, background: "transparent", color: "inherit", padding: "6px 10px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 10, fontWeight: 500, letterSpacing: ".14em", whiteSpace: "nowrap", opacity: 0.6, transition: "opacity .3s" }}
        >
          <span style={{ display: "flex", alignItems: "end", gap: 2, height: 12 }}>
            <span data-bar="1" style={{ width: 2, height: 3, background: "currentColor" }} />
            <span data-bar="1" style={{ width: 2, height: 3, background: "currentColor" }} />
            <span data-bar="1" style={{ width: 2, height: 3, background: "currentColor" }} />
            <span data-bar="1" style={{ width: 2, height: 3, background: "currentColor" }} />
          </span>
          <span>{soundLabel}</span>
        </button>
        <button
          data-skip="1"
          onClick={skipIntro}
          className="df-skip-btn"
          style={{ border: "1px solid currentColor", borderRadius: 999, background: "transparent", color: "inherit", padding: "5px 10px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 10, fontWeight: 500, letterSpacing: ".14em", whiteSpace: "nowrap", transition: "opacity .4s,transform .4s" }}
        >
          SKIP INTRO &#8595;
        </button>
      </div>

      {/* Hero variant A -- physics pieces (the only variant this template ever renders; see lib/dfoundryEngine.ts) */}
      <div data-v="a" data-screen-label="Hero" style={{ position: "relative", height: "100svh", minHeight: 560, overflow: "hidden", background: "#F5F1E8", color: "#06382E", userSelect: "none", touchAction: "none" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px clamp(18px,3vw,40px)", zIndex: 5, pointerEvents: "none" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 19, letterSpacing: "-.03em" }}>
            <img src="/assets/dfoundry-logo-mark.png" alt="D’Foundry logo" style={{ height: 34, width: "auto", display: "block" }} />
            D&rsquo;FOUNDRY
          </span>
          <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".1em" }}>A D&rsquo;MATEK BUSINESS</span>
        </div>

        {WORDS.map((w, i) => (
          <div
            key={`w-${i}`}
            data-blk="w"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: "translate(-9999px,0)",
              padding: w.style.padding ?? ".1em .45em .14em",
              fontWeight: w.style.fontFamily ? undefined : 800,
              fontSize: w.style.fontSize ?? "clamp(38px,6.4vw,112px)",
              lineHeight: 1,
              letterSpacing: w.style.fontFamily ? undefined : "-.045em",
              whiteSpace: "nowrap",
              cursor: "grab",
              ...w.style,
            }}
          >
            {w.text}
          </div>
        ))}
        {TAGS.map((t, i) => (
          <div
            key={`t-${i}`}
            data-blk="t"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transform: "translate(-9999px,0)",
              padding: "12px 20px",
              borderRadius: 999,
              fontFamily: "var(--font-plex-mono),monospace",
              fontSize: "clamp(12px,1.1vw,16px)",
              fontWeight: 600,
              whiteSpace: "nowrap",
              cursor: "grab",
              ...t.style,
            }}
          >
            {t.text}
          </div>
        ))}

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap", padding: "22px clamp(18px,3vw,40px)", zIndex: 5, pointerEvents: "none" }}>
          <p style={{ margin: 0, maxWidth: "38ch", fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.5, fontWeight: 500 }}>
            We build the software, applications, automations and integrations that solve a specific problem properly. Grab a piece and throw it. Then scroll.
          </p>
          <button onClick={toggleAssemble} className="df-assemble-btn" style={{ pointerEvents: "auto", border: 0, borderRadius: 999, background: "#06382E", color: "#F5F1E8", padding: "16px 24px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
            {assembleLabel}
          </button>
        </div>
      </div>

      <TitleSequence />

      {/* Wipe divider into the Problem -> fix section */}
      <div data-wipe="1" style={{ position: "relative", height: "34vh", background: "#06382E", overflow: "hidden" }}>
        <div data-wipe-in="1" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "100%", background: "#D4A637", transformOrigin: "50% 0" }} />
      </div>

      <style jsx global>{`
        .df-ctl-btn:hover {
          opacity: 1;
        }
        .df-skip-btn:hover {
          background: #f5f1e8;
          color: #000;
        }
        .df-assemble-btn:hover {
          background: #d4a637;
          color: #06382e;
        }
      `}</style>
    </>
  );
}

function TitleSequence() {
  return (
    <div data-v="c" data-screen-label="Title sequence" style={{ position: "relative", height: "800vh", background: "#06382E" }}>
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>
        <div data-track="1" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "400vw", display: "flex", willChange: "transform" }}>
          <div data-scene="0" style={{ position: "relative", flex: "0 0 100vw", height: "100%", background: "#F5F1E8", color: "#06382E", display: "grid", placeItems: "center", overflow: "hidden" }}>
            <span style={{ position: "absolute", left: "5vw", top: "calc(9vh + 72px)", fontFamily: "var(--font-plex-mono),monospace", fontSize: "clamp(11px,1vw,14px)", letterSpacing: ".12em" }}>
              PROBLEM 01 &middot; THE CORE PROCESS STILL RUNS ON PAPER
            </span>
            <div data-push="1" style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontSize: "clamp(80px,17vw,300px)", lineHeight: 0.85, letterSpacing: "-.03em", textAlign: "center" }}>
              {"Paper".split("").map((c, i) => (
                <span key={i} data-l="1" style={{ display: "inline-block" }}>
                  {c}
                </span>
              ))}
              <br />
              {"forms.".split("").map((c, i) => (
                <span key={i} data-l="1" style={{ display: "inline-block" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div data-scene="1" style={{ position: "relative", flex: "0 0 100vw", height: "100%", background: "#1A1A1A", color: "#F5F1E8", display: "grid", placeItems: "center", overflow: "hidden" }}>
            <span style={{ position: "absolute", left: "5vw", top: "calc(9vh + 72px)", fontFamily: "var(--font-plex-mono),monospace", fontSize: "clamp(11px,1vw,14px)", letterSpacing: ".12em", color: "#D4A637" }}>
              PROBLEM 02 &middot; THREE COPIES, NO SINGLE TRUTH
            </span>
            <div data-push="1" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontWeight: 800, fontSize: "clamp(40px,11vw,200px)", lineHeight: 0.86, letterSpacing: "-.06em" }}>
              <span data-row="1">Spreadsheet.</span>
              <span data-row="1" style={{ color: "#D4A637" }}>
                Spreadsheet.
              </span>
              <span data-row="1" style={{ color: "transparent", WebkitTextStroke: "2px #F5F1E8" }}>
                Spreadsheet.
              </span>
            </div>
          </div>
          <div data-scene="2" style={{ position: "relative", flex: "0 0 100vw", height: "100%", background: "#28705A", color: "#F5F1E8", display: "grid", placeItems: "center", overflow: "hidden" }}>
            <span style={{ position: "absolute", left: "5vw", top: "calc(9vh + 72px)", fontFamily: "var(--font-plex-mono),monospace", fontSize: "clamp(11px,1vw,14px)", letterSpacing: ".12em", color: "#F5D98A" }}>
              PROBLEM 03 &middot; SOMEONE RE-TYPES EVERYTHING
            </span>
            <div data-push="1" style={{ width: "100%", padding: "0 5vw", display: "flex", flexDirection: "column", gap: "2vh", fontWeight: 800, fontSize: "clamp(56px,10vw,180px)", lineHeight: 0.9, letterSpacing: "-.055em" }}>
              <span data-split="l">Two systems</span>
              <span data-split="r" style={{ alignSelf: "flex-end", fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#F5D98A" }}>
                that won&rsquo;t talk.
              </span>
            </div>
          </div>
          <div data-scene="3" style={{ position: "relative", flex: "0 0 100vw", height: "100%", background: "#E9B940", color: "#06382E", display: "grid", placeItems: "center", overflow: "hidden" }}>
            <span style={{ position: "absolute", left: "5vw", top: "calc(9vh + 72px)", fontFamily: "var(--font-plex-mono),monospace", fontSize: "clamp(11px,1vw,14px)", letterSpacing: ".12em" }}>
              PROBLEM 04 &middot; MONTHS OF WORK, NOTHING LIVE
            </span>
            <div data-push="1" style={{ fontWeight: 800, fontSize: "clamp(56px,11vw,200px)", lineHeight: 0.88, letterSpacing: "-.06em", textAlign: "center" }}>
              A{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                demo
                <span data-strike="1" style={{ position: "absolute", left: "-4%", right: "-4%", top: "52%", height: ".09em", background: "#06382E", transformOrigin: "0 50%", transform: "rotate(-4deg) scaleX(0)" }} />
              </span>
              <br />
              <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em" }}>that never shipped.</span>
            </div>
          </div>
        </div>
        <div data-scene="4" style={{ position: "absolute", inset: 0, background: "#06382E", color: "#F5F1E8", display: "grid", placeItems: "center", overflow: "hidden", visibility: "hidden" }}>
          <h1 data-zh="1" style={{ margin: 0, padding: "0 5vw", textAlign: "center", fontWeight: 800, fontSize: "clamp(52px,9.4vw,168px)", lineHeight: 0.9, letterSpacing: "-.055em" }}>
            Built for your pr<span data-o="1" style={{ color: "#E9B940" }}>o</span>blem,{" "}
            <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#D4A637" }}>
              not for a demo.
            </span>
          </h1>
        </div>
        <div data-scene="5" style={{ position: "absolute", inset: 0, background: "#E9B940", color: "#06382E", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4vh", padding: "0 5vw", overflow: "hidden", visibility: "hidden" }}>
          <div data-rise="1" style={{ display: "flex", flexDirection: "column", gap: "4vh", maxWidth: 1200 }}>
            <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 13, letterSpacing: ".12em" }}>D&rsquo;FOUNDRY &middot; A D&rsquo;MATEK BUSINESS</span>
            <p style={{ margin: 0, fontWeight: 800, fontSize: "clamp(34px,5vw,86px)", lineHeight: 0.98, letterSpacing: "-.045em" }}>
              We build the software, applications, automations and integrations that solve a specific problem{" "}
              <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400 }}>properly.</span>
            </p>
            <a href="#start" style={{ alignSelf: "flex-start", background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "18px 28px", fontWeight: 700, fontSize: 16 }}>
              Bring us the problem &rarr;
            </a>
          </div>
        </div>
        <div data-lb="top" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "9vh", background: "#000", transition: "height .8s cubic-bezier(.76,0,.24,1)", zIndex: 3 }} />
        <div
          data-lb="bot"
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "9vh", background: "#000", transition: "height .8s cubic-bezier(.76,0,.24,1)", zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 clamp(18px,3vw,40px)", overflow: "hidden" }}
        >
          <span data-sl="1" style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".14em", color: "#F5F1E8" }}>
            SCENE 01 &middot; THE PROBLEM
          </span>
          <span data-tc="1" style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".14em", color: "#D4A637" }}>
            00:00:00:00
          </span>
        </div>
        <div data-cue="1" style={{ position: "absolute", left: "50%", bottom: "13vh", transform: "translateX(-50%)", zIndex: 4, fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".14em", color: "#06382E", transition: "opacity .4s" }}>
          SCROLL TO PLAY &#8595;
        </div>
      </div>
    </div>
  );
}
