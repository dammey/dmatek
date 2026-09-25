# D'Foundry — exact-replication port guide (for Claude Code)

The first handoff described D'Foundry in prose, so features were lost. **Do not reinterpret this
design. Port it.** The prototype is the spec; every animation lives in plain DOM JavaScript that
can be moved into React almost unchanged.

## Source files (read these fully before writing code)
| File | What it is |
|---|---|
| `dfoundry-source/template.html` | All markup + every inline style, in order. `{{ x }}` = a value from `renderVals()`; `<sc-for list as>` = `.map()`; `<sc-if value>` = conditional; `<helmet>` = head tags/fonts/global CSS. |
| `dfoundry-source/logic.js` | The whole behaviour: loader, page curtain, reveals, three hero engines, title sequence, cursor, sound, skip-intro. ~33k chars. |
| `dfoundry-source/droplet-*.{html,js}` | Same split for the Droplet case study. |
| `DFoundry Hero.dc.html` | Runnable original. Serve the folder (`npx serve .` or `python -m http.server`) and open it. **This is the reference you compare against.** |

## Porting rules
1. **Markup 1:1.** Convert template.html to JSX section by section. Keep element order, nesting,
   text and every style value. Inline `style="a:b"` → `style={{a:'b'}}` (or a CSS module with the
   identical values). `style-hover="…"` → a `:hover` rule with those exact declarations.
2. **Keep every `data-*` attribute.** The engine finds elements by them. Contract:
   `data-loader data-lp data-lc` loader · `data-skip` skip-intro · `data-v="a|b|c"` hero variant roots ·
   `data-blk` draggable physics pieces · `data-ctl data-bar` sound/controls · `data-track data-scene data-push
   data-l data-row data-split data-strike data-zh data-o data-lb data-sl data-tc data-cue data-wipe` title
   sequence · `data-rv="rise|pill|up|mask|deal"` scroll reveals.
3. **Engine verbatim.** Copy the class methods from logic.js into `lib/foundryEngine.ts` as plain
   functions and call them from one `useEffect` in the page, returning `teardown` as cleanup:
   `revealEngine`, `loaderAndTransitions`, `extras` (cursor + sound + skip), `setup` → `setupA` (matter-js
   physics hero), `setupB` (untangle lines), `setupC` (title sequence), `tick`, `every`, `on`, `teardown`,
   `setSound`. Replace `this.setState`/`this.state` with a small store or refs; change nothing else —
   same easings, durations, thresholds, magic numbers.
4. **Globals.** It uses `window.__hero`, `__loaderDone`, `__navHook`, `__sfx`, `__dfExtras`, `__heroDog`.
   Keep them at first (fastest path to parity); tidy only after screenshots match.
5. **Next.js specifics.** Page is `'use client'`. Load `matter-js@0.19.0` from npm and import it
   dynamically in setupA. Page-leave curtain: intercept `<Link>` clicks the same way (capture-phase
   click listener), play the curtain, then `router.push`. `localStorage` keys stay: `df-seen`, `dfd-hero`, `df-sound`.
6. **Fonts** (exact): Bricolage Grotesque opsz 12–96 wght 500/700/800, Instrument Serif 400 + italic,
   IBM Plex Mono 400/500/600 via `next/font/google`. Global CSS from `<helmet><style>` goes into
   globals.css unchanged (incl. `html.df-cur *{cursor:none}` for fine pointers).
7. **Hero variants.** Keep all three (tabs 2a Pieces / 2b Untangle / 2c Title sequence) exactly as built.
   Production default = the one in `localStorage dfd-hero`, else `a`.

## Feature checklist — tick every one before calling it done
- [ ] Loader: pills drop in with spring, 000→100 counter, curved lift-off; 1500ms first visit / 550ms repeat; skip under reduced motion
- [ ] Page-leave curtain on internal links; bfcache (`pageshow`) hides it on back
- [ ] 2a: physics words/tags you can grab and throw; "Put it together / Break it up"
- [ ] 2b: drag to comb tangled lines, live %, copy swap on done, re-tangle
- [ ] 2c: scroll-driven title sequence, 4 problem scenes, timecode, cues, wipes
- [ ] SKIP INTRO button fades in/out by scroll position and jumps past the sequence behind the curtain
- [ ] Custom cursor: ring + dot, difference blend, grows on links, gold "label" mode on `data-blk`
- [ ] Sound toggle (Web Audio pop/tick/swish, animated bars), remembered in `df-sound`
- [ ] Reveals: rise / pill / up / mask / deal, once each
- [ ] Problem → fix picker, Services list, Process, Recent work (Droplet deal-in screenshots), Products, Contact success state
- [ ] Droplet case study page and links both ways
- [ ] `prefers-reduced-motion` disables loader, cursor, physics and sequence animation

## Verification loop (required)
Write a Playwright script that opens the original (`/DFoundry Hero.dc.html` on the static server) and
your build side by side at **1440×900** and **390×844**, scrolls to each `data-screen-label`
section (Hero, Title sequence, Problem → fix, Services, Process, Recent work, Products, Contact),
waits 1.2s, and saves paired screenshots to `/compare`. Fix differences until each pair matches.
Also record a short video of the hero interactions in both and compare.
