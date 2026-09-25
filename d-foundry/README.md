# Handoff: D'Matek Technology Limited — corporate website (v3) + D'Foundry site

## Overview
Single-page-app style marketing site for D'Matek Technology Limited, a Lagos-based
problem-solving company built around six specialist businesses. Six client-side "pages"
(Home, Approach, Businesses, Work, About, Contact) rendered from one shell with a shared
sticky header, mobile menu, and footer. Positioning line: **"Solving what matters."**

This bundle also contains the **D'Foundry** business site (`DFoundry Hero.dc.html`) and its
**Droplet case study** (`Droplet Case Study.dc.html`). The corporate site links out to D'Foundry;
D'Foundry links back. See **Part 2** at the end of this document.

### Build order for Claude Code
1. Scaffold one project (recommended: Next.js App Router + TypeScript; CSS Modules or Tailwind
   with the tokens below). Self-host the fonts.
2. Build the shared D'Matek shell and the six corporate routes (Part 1).
3. Build D'Foundry as its own route group (`/foundry`, `/foundry/work/droplet`) or a subdomain
   (`foundry.dmatek.com`) with its own layout, fonts and palette (Part 2).
4. Wire cross-links (table under **Cross-site links**).
5. Port the motion last, behind `prefers-reduced-motion` checks.

### Cross-site links
| From | Element | To |
|---|---|---|
| D'Matek › Businesses accordion, D'Foundry row (open) | gold pill **"Visit D'Foundry ↗"** | D'Foundry home |
| D'Matek › Home orbit, **D'Foundry** node (click) | whole node | D'Foundry home (other five nodes still go to `/businesses`) |
| D'Matek › header, mobile menu, footer | "Matek Source" links | Commerce site. **Now renamed D'Source** — point these at the D'Source store (separate project) |
| D'Foundry › footer | "D'MATEK.COM ↗" | D'Matek home |
| D'Foundry › Contact | sister pills "D'Matek Cloud", "D'Matek Infrastructure" | Those division sites (not in this bundle — link to `/businesses` until they exist) |
| D'Foundry › Recent work / Products | "Read the case study →" | Droplet case study |
| Droplet case study › Next | back link | D'Foundry home |

## About the design files
`Dmatek Website v3.dc.html` is a **design reference created in HTML** — a working prototype
that demonstrates the intended look, copy, motion and interaction. It is not production code
to lift directly.

The task is to **recreate this design in the target codebase's existing environment** (React,
Vue, Next, Astro, SwiftUI, whatever the project uses), following that codebase's established
component patterns, routing, styling approach and libraries. If no environment exists yet,
choose an appropriate framework and implement it there.

Notes on the prototype's mechanics that should NOT be copied:
- It uses a bespoke template runtime (`support.js`, `<x-dc>`, `<sc-for>`, `<sc-if>`,
  `{{ hole }}`). Replace these with the target framework's loops/conditionals/props.
- All styling is inline for streaming reasons. In production use the codebase's normal
  styling system (CSS modules, Tailwind, styled-components etc.). Token values below.
- Page switching is `useState`, not routing. In production these should be **real routes**:
  `/`, `/approach`, `/businesses`, `/work`, `/about`, `/contact`.

To view the prototype: open `Dmatek Website v3.dc.html` in a browser (keep `support.js` and
`assets/` alongside it).

## Fidelity
**High-fidelity.** Colors, typography, spacing, motion timings and copy are final-intent.
Recreate pixel-faithfully, substituting the codebase's own primitives where equivalents exist.

Exception: every string wrapped in `[ SQUARE BRACKETS ]` is an intentional content
placeholder awaiting real client data (figures, testimonials, phone, email, photography).
Keep them visible as placeholders — do not invent values.

## Design tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| Cream (page ground) | `#F5F1E8` | Default background, text on dark |
| Deep green | `#06382E` | Headings, dark sections, primary text-on-cream |
| Green tint (gradient partner) | `#0B4B3D` | Lighter stop of dark radial gradients |
| Green deepest | `#043028` / `#032A22` | Blob and card gradient ends |
| Mid green | `#28705A` | Eyebrow labels, small meta text, links hover |
| Gold (accent, **tweakable prop**) | `#D4A637` | CTAs, numerals, kickers, focus ring |
| Ink | `#1A1A1A` | Body text in nav/quotes |
| Body grey-green | `#3A4A44` | Paragraph text on cream |
| Muted footer text | `#4A5A54` | Legal line |
| Card cream A | `#EFEADC` | Card gradient start |
| Card cream B | `#E8E2D0` / `#E9E3D2` / `#E6E0CE` / `#E4DECC` | Card gradient ends |

Common alphas: `rgba(6,56,46,0.10)` eyebrow pill ground, `rgba(6,56,46,0.22)` outline button
border, `rgba(212,166,55,0.16 / 0.28 / 0.30)` gold pill grounds, `rgba(245,241,232,0.82)`
body copy on dark, `rgba(245,241,232,0.16)` hairlines on dark.

Alternate accent options exposed as a prop: `#D4A637` (default), `#C8922B`, `#B98F3A`, `#E0B455`.

### Typography
Single family: **Manrope** (Google Fonts), weights 300/400/500/600/700/800.
Fallback stack: `'Manrope', system-ui, sans-serif`. `-webkit-font-smoothing: antialiased`.

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Hero H1 (home) | `clamp(42px,6.2vw,86px)` | 800 | `-0.038em` | 0.98 |
| Page H1 (inner) | `clamp(38px,5.4vw,76px)` | 800 | `-0.035em` | 1.0 |
| Section H2 | `clamp(30px,4vw,54px)` | 800 | `-0.03em` | 1.04 |
| Sub-H2 / case H2 | `clamp(27px,3.7vw,50px)` | 800 | `-0.032em` | 1.06 |
| Stage / business H3 | `clamp(28px,3.4vw,46px)` | 800 | `-0.03em` | 1.05 |
| Hero lede | `clamp(19px,1.9vw,25px)` | 500 | — | 1.45 |
| Page lede | `clamp(17px,1.7vw,20px)` | 400 | — | 1.7 |
| Body | 17px (15–17.5px in cards) | 300–400 | — | 1.7–1.8 |
| Eyebrow pill | 11.5px | 700 | `0.2em` | — |
| Small meta label | 11–13px | 700 | `0.12–0.18em` | — |
| Nav item | 14.5px | 600 | — | — |
| Button | 15px | 700 | `0.04em` | — |
| Stat numeral | `clamp(38px,5vw,64px)` | 800 | `-0.035em` | 1 |

Headlines use `text-wrap: balance`; quotes and long paragraphs use `text-wrap: pretty`.

### Shape & elevation
- **Everything is pill or blob.** `border-radius: 999px` on nav, chips, buttons, inputs,
  pills, path steps. Cards: `clamp(24px,3vw,40px)` up to `clamp(32px,5vw,72px)`.
- **Organic blobs** (photo placeholders, quote cards): asymmetric radii such as
  `58% 42% 47% 53% / 52% 46% 54% 48%`, animated by the `dmDrift` keyframe.
- Shadows: `0 14px 36px rgba(6,56,46,0.08)` (card rest),
  `0 26px 54px rgba(6,56,46,0.14–0.16)` (card hover),
  `0 24px 60px rgba(6,56,46,0.10)` (large panel),
  `0 10px 34px rgba(6,56,46,0.07)` (floating header),
  `0 10px 26px rgba(212,166,55,0.35)` (gold CTA).

### Spacing
Container `max-width: 1280px`, centred, horizontal padding 32px (20px on full-bleed wrappers).
Vertical section rhythm `clamp(56px,7vw,110px)`. Card padding `clamp(26px,3vw,38px)` small,
`clamp(30px,4vw,60px)` large. Grid gaps `clamp(20px,2.5vw,30px)` tight,
`clamp(36px,5vw,72px)` wide.

### Motion
Easing everywhere: `cubic-bezier(.2,.8,.2,1)`. Transitions 0.3s (colour) / 0.35s (transform,
shadow) / 0.8s (reveal).

| Keyframe | Purpose | Duration |
|---|---|---|
| `dmRise` | fade + 26px rise on entrance | .4–.8s, staggered .08/.18/.28/.4/.5/.6s |
| `dmFloatA` / `dmFloatB` | ambient gradient orbs drift | 17–24s infinite |
| `dmSpin` / `dmSpinRev` | ecosystem orbit rotation (and counter-rotation of each node so labels stay upright) | 90s linear infinite |
| `dmMarquee` | value ticker translateX(-50%) | 34s linear infinite |
| `dmDash` | SVG stroke-dashoffset draw-on | 1.1–3.4s forwards |
| `dmPulse` | small gold status dot | 2.4–2.8s infinite |
| `dmDrift` | blob border-radius morph | 16–22s infinite |

`@media (prefers-reduced-motion: reduce)` kills all transition, animation and smooth scroll.
Respect this.

## Global chrome

### Header (sticky, all pages)
Floating pill bar: `max-width:1280px`, `padding:10px 14px 10px 18px`,
`background: rgba(245,241,232,0.82)` + `backdrop-filter: blur(16px)`,
`border:1px solid rgba(6,56,46,0.10)`, `border-radius:999px`,
`box-shadow:0 10px 34px rgba(6,56,46,0.07)`. Sits inside `padding:14px 20px 0`, `z-index:80`.

- Left: `assets/mark-green.png` at 30px height + stacked wordmark — "D'MATEK" (17px/800/`0.05em`/`#06382E`)
  over "TECHNOLOGY LIMITED" (8px/600/`0.2em`/`#28705A`).
- Right (≥961px): nav items Home, Approach, Businesses, Work, About. Active item gets
  `background: rgba(212,166,55,0.32)` and `aria-current="page"`. Hover: `#06382E` text on
  `rgba(6,56,46,0.07)`.
- CTA "LET'S TALK": gold pill, 13px/700/`0.04em`, `padding:14px 24px`.
  Hover → green ground, cream text, `translateY(-2px)`, `0 12px 26px rgba(6,56,46,0.22)`.
- ≤960px: nav hidden, green burger pill labelled MENU / CLOSE (`aria-expanded`).

### Mobile menu
Full-screen `#06382E` overlay, `z-index:90`, `dmRise .4s`. Logo + CLOSE pill at top; nav items
as 30px/700 pills with `rgba(245,241,232,0.06)` ground (hover → gold ground, green text);
full-width gold "LET'S TALK →" at the bottom. Selecting an item navigates and closes.

### Scroll progress bar
Fixed 3px bar at `top:0`, `z-index:120`,
`background: linear-gradient(90deg,#28705A,#D4A637)`, `border-radius:0 999px 999px 0`.
Width = `scrollY / (scrollHeight - innerHeight) * 100%`, updated on passive scroll.

### Cursor glow (home hero only)
520px radial `rgba(6,56,46,0.10)` circle following the pointer inside the hero, opacity 0→1
on enter with a .5s ease. Disabled when motion is off.

### Footer (all pages)
Cream page ground with an inset `linear-gradient(160deg,#EFEADC,#E8E2D0)` card,
`border-radius: clamp(32px,5vw,64px)`. Four auto-fit columns (min 220px):
1. Mark + "D'MATEK", "Solving what matters." (clamp(20px,2.2vw,27px)/800), one-line descriptor.
2. THE SIX BUSINESSES — links to the Businesses page.
3. PAGES — the five nav items.
4. GET IN TOUCH — gold LET'S TALK pill, then `[ PHONE ] / [ EMAIL ] / [ SOCIAL LINKS ]`.

Bottom rule `1px rgba(6,56,46,0.12)`, then "© 2026 D'Matek Technology Limited. Lagos, Nigeria."
left and "WE'LL FIGURE IT OUT." (13px/700/`0.12em`/`#28705A`) right.

### Accessibility baked in
- Skip link, visible on focus at `left:8px`, green pill.
- Focus ring: `2px solid #D4A637`, `outline-offset:3px` on all interactives.
- `::selection` = gold ground, green text.
- `aria-current`, `aria-expanded`, `aria-pressed`, `aria-labelledby` on the relevant controls;
  decorative gradients and SVGs are `aria-hidden`; blob photo placeholders use
  `role="img"` + `aria-label`.

---

## Screens

### 1. Home
**Purpose:** establish the positioning, show the six-business ecosystem, prove it, route onward.

Sections in order:

1. **Hero** — two-column auto-fit (min 320px), `padding: clamp(56px,7vw,112px) 32px`.
   Left: pulsing gold dot + "D'MATEK TECHNOLOGY LIMITED" pill; H1 *"Solving what matters."*
   with "matters." in gold and a hand-drawn gold underline SVG that draws in at 1.1s; lede
   *"You can trust us. You won't be alone. We'll figure it out."*; supporting paragraph; two
   CTAs (gold "Let's talk →", outlined "How we work →"). Words animate in on a stagger.
   Right: 4:5 organic blob, `linear-gradient(150deg,#EFEADC,#E6E0CE)`, tilt-on-hover,
   containing `[ REAL PHOTOGRAPHY REQUIRED ]` + art direction note.
   Behind: two floating radial orbs, two draw-on curve SVGs, and a green wave SVG at the
   bottom edge transitioning into the next section.

2. **Value ticker** (toggleable prop) — `#06382E` band, marquee of TRUST · SOLVE · CONNECT ·
   IMPROVE · WE STAY, list doubled for a seamless 34s loop, gold dot between items.

3. **Ecosystem orbit** — dark section. Eyebrow "ONE D'MATEK. MANY SPECIALISTS.",
   H2 *"One customer. One relationship. Six specialists behind it."*
   A 1:1 stage up to 820px: rotating dashed/gold SVG rings (90s), six circular business nodes
   positioned at `[50%,17%] [78%,33.5%] [78%,66.5%] [50%,83%] [22%,66.5%] [22%,33.5%]` on a
   90s rotating layer, each counter-rotated 90s so its label stays upright. Node = 23% width,
   `rgba(245,241,232,0.06)` ground, `1px rgba(245,241,232,0.22)` border, verb over name.
   **Hover/focus a node** → it turns gold with green text, and the 38% centre disc swaps its
   kicker/name/body to that business's verb, name and "solves" line. Default centre state:
   "THE RELATIONSHIP / One customer / Six specialists behind one conversation."
   Cream CTA below; cream wave SVG closes the section.

4. **Stage selector** — "HOW WE WORK" / *"We don't hand over and walk away."*
   Six chips (01–06) over a dashed curve SVG; the active chip is solid green, lifted `-4px`,
   `aria-pressed="true"`. Below, the active stage expands into a two-column panel: number +
   name + body + value chip on the left, a drifting dark blob with the photo brief and the
   outcome line on the right. Panel animates `dmRise .55s` on change.

5. **Stats band** — dark rounded panel, four auto-fit columns. Numerals **count up** from 0
   over 1100ms with a cubic ease-out when the panel first scrolls into view (once only):
   10+ years · 70% of work in design · 6 specialist businesses · 24/7 response.

6. **Case teasers** — "REAL OUTCOMES" / *"What it looked like before, and after."* plus an
   "All case studies →" outlined button. Three tilt cards (sector pill, title, truncated
   problem at 120 chars + "…", tenure) → navigate to Work.

7. **Relationship close** — "WE STAY" / *"You don't get a ticket system. You get Damilola."*
   with an About CTA, beside a dark drifting blob holding the placeholder client quote.

### 2. Approach
Hero (eyebrow OUR APPROACH, H1 *"We own the problem until the result is real."*), then the six
stages stacked as full panels — alternating cream gradients, each with an `id` and
`scroll-margin-top:110px` so they're deep-linkable (`#understand`, `#design`, `#implement`,
`#operate`, `#optimise`, `#own`). Closes with a dark "THE MOAT" panel:
*"Seventy percent of the work is design. Then we stay ten years."* plus the four values listed
as soft cards on the right.

### 3. Businesses
Hero (ONE D'MATEK. MANY SPECIALISTS. / *"Six businesses that work on the same problem."*).
"A TYPICAL PROJECT PATH" — six pill steps over a gold draw-on curve: Understand, Design,
Supply, Implement, Operate, Own the result.
Then an **accordion** of the six businesses (first open by default, clicking the open one
closes it — index `-1`). Closed row: cream gradient card, `+` in a 44px circle, name
(clamp(24px,3vw,38px)/800), "solves" line, gold verb pill. Open row: card ground becomes the
dark radial gradient, `+` → `–` in gold, all text flips to cream, and the body reveals the
proposition line (where present), the scope paragraph, the gold note, and a drifting blob with
the stat, stat label and photo brief.

### 4. Work
Hero (CASE STUDIES / *"Problems we were trusted with."*). Three case articles, each with
`id` (`#safwah`, `#estate`, `#commercial`) and `scroll-margin-top:110px`: sector + tenure pills,
headline, then a **BEFORE / WHAT WE DID / AFTER** segmented control (independent state per
case, defaults to BEFORE). The selected facet renders in a translucent cream panel with
`dmRise .45s`; the WHAT WE DID facet also shows the divisions credit line as meta. Below:
a dark drifting blob with the before/after photo brief, beside a cream quote card.

### 5. About
Hero (ABOUT D'MATEK / *"We're not vendors. We're partners for life."*).
Four value cards (numbered gold discs, tilt on hover). Then the Damilola section: 4:5 portrait
blob placeholder beside "MEET DAMILOLA" / *"When something matters to you, it matters to us."*,
a highlighted `[ ONE SHORT STORY TO BE ADDED ]` block, and three stat pills.
Closes with "WHY CLIENTS STICK AROUND" / *"Relief, then gratitude, then trust."* — four
testimonial cards, the second inverted to the dark gradient for rhythm.

### 6. Contact
One dark rounded panel on cream. Left: CONTACT pill, H1 *"Let's figure it out together."*,
lede, three pulsing-dot badges (24/7 support on managed accounts · We respond within four
hours · Problem-solving starts here), then "Lagos, Nigeria" + `[ PHONE ]` + `[ EMAIL ]`.
Right: a translucent form card (`rgba(3,42,34,0.7)` + `blur(6px)`) with Name (required),
Email (required, type=email), a "CLOSEST STARTING POINT" select, and a "WHAT'S HAPPENING?"
textarea (5 rows, vertical resize). Inputs are pill-shaped, `rgba(245,241,232,0.06)` ground,
`1px rgba(245,241,232,0.18)` border; focus → gold border, `0.10` ground. Labels are
11.5px/700/`0.14em` gold. Gold submit pill "Send it to us →", with reassurance line beneath.

**On submit** the form is replaced by a success state (`dmRise .5s`): gold check disc,
*"Thank you. We've got it."*, and "Someone will read this properly and come back to you within
four hours." In production, wire this to the real endpoint and add error handling — the
prototype only sets a local flag.

---

## Interactions & behaviour summary
| Interaction | Behaviour |
|---|---|
| Nav / any in-page CTA | Switches page, closes mobile menu, resets `sent`, jumps scroll to top (`behavior:"auto"`). **In production: route change.** |
| Burger | Toggles full-screen overlay; label MENU ⇄ CLOSE |
| Orbit node hover/focus | Centre disc content swaps; node turns gold. Click → Businesses page (D'Foundry node → D'Foundry site) |
| Orbit node blur/mouseleave | Centre returns to default copy |
| Stage chip | Sets active stage; panel re-renders with `dmRise` |
| Business row | Accordion toggle; open index or `-1` |
| Case facet chip | Per-case tab state (`{caseId: 'before'|'did'|'after'}`) |
| Card hover (`data-tilt`) | `translateY(-6px)` + deeper shadow |
| Scroll reveal (`data-reveal`) | IntersectionObserver, `rootMargin:"0px 0px -8% 0px"`, `threshold:0.06`; fades + rises 26px once, then unobserves. Elements already above 92% of viewport height on mount fire immediately |
| Stat counters (`data-count`) | Fire once when their container reveals; skipped (value set directly) when motion is off |
| Scroll | Progress bar width update |
| Reduced motion / `animate=false` | Reveals and counters resolve instantly; all CSS animation off |

## State
```
page:        "home" | "approach" | "businesses" | "work" | "about" | "contact"   → routes
menuOpen:    boolean
sent:        boolean                      (contact form success)
hoverBiz:    number | null                (orbit centre content)
openBiz:     number                       (accordion index, -1 = all closed; default 0)
activeStage: number                       (0–5, default 0)
facets:      { [caseId]: "before"|"did"|"after" }   default "before"
```
Non-React side effects to port: scroll listener (progress bar), mousemove listener (hero glow),
IntersectionObserver (reveals + counters, re-armed on page change), all torn down on unmount.

No data fetching. All content is static in the component — move it to a CMS or content files
if the project has one.

## Configurable props (exposed as design tweaks in the prototype)
| Prop | Type | Default | Effect |
|---|---|---|---|
| `accent` | string (hex) | `#D4A637` | Gold accent across kickers, numerals, active states |
| `animate` | boolean | `true` | Master motion switch (also respects `prefers-reduced-motion`) |
| `ticker` | boolean | `true` | Shows/hides the home value marquee |

## Content inventory
All copy in the prototype is final-intent and should be carried over verbatim. Key data sets:

**Six businesses** (name · verb · solves · scope · note · stat):
D'Matek Infrastructure (CONNECT IT) · D'Matek Cloud (RUN IT) · D'Foundry (BUILD IT) ·
IléMesh (SENSE IT) · **Matek Source (SUPPLY IT)** · D'Matek Assurance (OWN IT).

> **Naming note:** the commerce division is **Matek Source — "Commerce by D'Matek"**, with two
> sub-brands beneath it: **Matek Emporium (retail)** and **Matek Provision (business)**. The
> umbrella name is what appears in the six-business list; the sub-brands appear inside the
> Source scope line and note. A separate prototype (`Matek Source.dc.html`, not in this bundle)
> covers the commerce experience itself.

**Six stages:** 01 Understand (TRUST) · 02 Design (SIMPLIFY) · 03 Implement (SOLVE) ·
04 Operate (SUPPORT) · 05 Optimise (IMPROVE) · 06 Own the result (WE STAY).

**Four values:** Trust · Solve · Connect · Improve.

**Three case studies:** Safwah Hotel (hospitality, Lagos) · Residential estate · Commercial
property.

**Seven contact "starting point" options**, beginning with "I'm not sure yet — help me figure
it out".

## Placeholders requiring real content before launch
- Photography: hero, six business blobs, six stage blobs, three before/after case pairs,
  Damilola portrait. Art direction is written into each placeholder — real work, real people,
  no stock server racks.
- Figures: five `[ FIGURE ]` business stats, `[ 50+ ]` deployments, `[ X ]-YEAR` tenures.
- All testimonials and attributions (7 instances).
- Phone, email, social links (header-adjacent footer and contact page).
- The `[ ONE SHORT STORY TO BE ADDED ]` block on About.
- Real `after` outcomes on all three case studies.

## Assets
| File | Use |
|---|---|
| `assets/mark-green.png` | Header + footer mark on cream, 30px height |
| `assets/mark-cream.png` | Mobile menu mark on green, 24–30px height |
| `assets/logo-lockup.png` | Full horizontal lockup (not used in v3; supplied for reference) |
| `assets/logo-symbol.png` | Symbol only (not used in v3; supplied for reference) |

Fonts load from Google Fonts:
`https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap`
— self-host in production.

All decorative shapes are inline SVG or CSS gradients. No icon library, no emoji.

---

# Part 2 — D'Foundry site ("BUILD IT")

## Overview
Single long-scroll page for D'Foundry, D'Matek's custom-software business. Headline:
**"Built for your problem, not for a demo."** Sections (screen labels): Hero · Title sequence ·
Problem → fix · Services · Process · Recent work · Products · Contact. Plus a separate
**Droplet case study** page (Case hero · Results · The problem · What we built · How we built it ·
Client quote · Next).

Fidelity: **high-fidelity**, same rules as Part 1 (bracketed copy = placeholder, keep verbatim).

## Tokens (D'Foundry)
| Token | Hex | Use |
|---|---|---|
| Foundry green | `#06382E` | Page ground on dark sections, primary ink on cream |
| Cream | `#F5F1E8` | Light sections, ink on dark |
| Gold | `#D4A637` | Pills, active states, link hover |
| Mid green | `#28705A` | Hairlines, inactive markers |
| Sage mute | `#A9BBB3` | Mono meta on dark |
| Warm mute | `#D9D3C4` | Body copy on dark |
| Case dark | `#1C1917`-range / `#444` rules | Recent-work band |

Type: **Bricolage Grotesque** 500/700/800 (display + UI), **Instrument Serif** italic (display
accents, e.g. the "Droplet" wordmark at `clamp(72px,9vw,150px)`), **IBM Plex Mono** 400–600
(12px, `letter-spacing:.1–.12em`, uppercase meta labels).
Google Fonts URL is in the file's `<helmet>`; self-host in production.
Shape: pills `999px`, image masks 20–32px radius, deep shadows `0 40px 80px rgba(0,0,0,.45–.5)`.

> **For an exact replica, follow `DFOUNDRY_PORT.md`** — it tells Claude Code to port the
> prototype's markup and engine code verbatim and verify with side-by-side screenshots.

## Behaviour to port
| Feature | Behaviour |
|---|---|
| **Loader** | Full-screen green panel, three gold "D' / Foun / dry" pills drop in (spring `cubic-bezier(.34,1.5,.64,1)`, staggered 170ms), 000→100 counter, then the panel lifts off with a curved bottom edge (1s `cubic-bezier(.76,0,.24,1)`). 1500ms first visit, 550ms after (`localStorage df-seen`). "SKIP INTRO ↓" button. Skipped under reduced motion. |
| **Page-leave curtain** | Clicking any internal link drops the same panel back down (.8s) before navigating. In an SPA, run this on route change instead. |
| **Hero (3 variants, tab switch, persisted in `localStorage dfd-hero`)** | **2a Pieces:** headline words and service tags are physics bodies (matter-js 0.19, loaded from CDN) you can grab and throw; "Put it together / Break it up" toggle snaps them into the sentence. **2b Untangle:** drag across tangled lines to comb them straight; shows a % and then swaps copy to "THAT'S THE JOB. WE DO IT IN SOFTWARE." **2c Title sequence:** scroll-driven film-style scenes (PROBLEM 01–04: paper forms, "Spreadsheet." ×3, "Two systems that won't talk.", "A demo that never shipped.") with a timecode readout. **Ship one variant** (recommend 2a) and keep the others behind a flag. |
| **Problem → fix** | Four problem rows; selecting one (gold fill, ● marker) swaps the plan text. |
| **Services** | Seven numbered rows (01–07), last is QADPAY. |
| **Process** | Three stages: Customer project → Reusable solution → Product. |
| **Recent work** | Droplet feature: three stacked screenshots with "deal" reveal (cards slide in rotated), three feature rows, CTAs "Read the case study →" and "Visit Droplet ↗". Two smaller cases: Omatek, Valour and Valiant. |
| **Products** | QADPAY (in development) and Droplet (live). |
| **Contact** | Short form → local success state "Got it. An engineer will reply within two working days." Wire to a real endpoint. |
| **Reveals** | `data-rv` = rise / pill / up / mask / deal, IntersectionObserver-driven, once. |
| **Extras** | Custom cursor on fine pointers (`html.df-cur` hides the native cursor), optional UI sound effects with a SOUND ON/OFF toggle (default off). |

## D'Foundry assets
| File | Use |
|---|---|
| `assets/dfoundry-logo-mark.png` | Green-and-gold swoosh mark on cream, 34px high |
| `assets/dfoundry-logo-mark-rev.png` | Mark for green grounds |
| `assets/dmatek-team.jpg` | Process section photo, also og:image |
| `assets/droplet-home.jpg`, `droplet-shop.jpg`, `droplet-rec.jpg`, `droplet-dash.jpg` | Droplet app screenshots (site + case study) |

Dependencies: `matter-js@0.19.0` (hero 2a only). `image-slot.js` is a prototype-only
drop-zone for missing photos — replace with real `<img>`/`next/image`.

## Files in this bundle
```
Dmatek Website v3.dc.html   corporate site design reference (open in a browser)
DFoundry Hero.dc.html       D'Foundry site design reference
Droplet Case Study.dc.html  D'Foundry case study page
DFOUNDRY_PORT.md            exact-replication guide for D'Foundry
CLAUDE_CODE_PROMPT.txt      prompt to paste into Claude Code
dfoundry-source/            D'Foundry markup and engine code split into plain files
image-slot.js               prototype photo drop-zone — reference only
support.js                  prototype runtime — reference only, do not port
assets/                     logos, D'Foundry marks, team photo, Droplet screenshots
README.md                   this document
```
