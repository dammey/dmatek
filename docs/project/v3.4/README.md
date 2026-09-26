# Handoff: D'Matek website (v3.4) + D'Foundry site

## Overview
Two sites, one bundle:

1. **D'Matek corporate site (dmatek.ng)** — `Dmatek Website v3.4.dc.html`. Content follows the *Website Content & Sales
   Master v1.1*, *Solution Definition Register v1.5* and *Industry Solutions & Sales Packaging v1.4*. Positioning:
   **"Solving what matters."** Primary CTA everywhere: **"Tell us what you need →"**.
2. **D'Foundry site (dfoundry.dmatek.ng)** — `DFoundry Hero.dc.html` + `Droplet Case Study.dc.html`. Port exactly per
   `DFOUNDRY_PORT.md` (Part 2).

v3.4 supersedes the v3.1 handoff. What is new since v3.1 is collected in **“v3.4 signature systems”** below; everything
else in Part 1 is the full spec, updated where v3.4 changed it.

### Build order
1. One project (recommended: Next.js App Router + TypeScript). Self-host fonts.
2. D'Matek shell + routes + content files (Part 1).
3. D'Matek signature systems (signature line, cable dividers, signal rings, Adire bands, hotel moment).
4. D'Foundry as its own route group or subdomain with its own layout/fonts/palette (Part 2).
5. Cross-links (table below).
6. Motion last, all behind `prefers-reduced-motion`.

## About the design files
The `.dc.html` files are **design references created in HTML** — working prototypes showing intended look, copy,
motion and behaviour. They are **not production code**. Recreate them in the target codebase's environment and
patterns (or pick the best framework if none exists).

Do not port the prototype mechanics: `support.js`, `<x-dc>`, `<sc-for>` (= `.map()`), `<sc-if>` (= conditional),
`{{ hole }}` (= prop/value from `renderVals()`), `<helmet>` (= head tags + global CSS), `style-hover` (= `:hover` rule).
Styling is inline only for streaming; use the codebase's styling system with the same values. Page switching is
`useState` in the prototype; in production use **real routes**. The logic class at the bottom of the file
(`buildLine`, `updateLine`, `updateHotel`, `setupMotion`) is plain DOM code and can be ported almost line for line.

To view: serve the folder (`npx serve .`) and open the `.dc.html` files. Keep `support.js`, `image-slot.js` and
`assets/` alongside.

## Fidelity
**High-fidelity.** Colours, type, spacing, motion and copy are final-intent. Copy is verbatim from the content
documents — do not rewrite it.

Anything in `[ SQUARE BRACKETS ]` is a deliberate placeholder (delivered case studies, Damilola portrait, phone, email).
**Keep placeholders visible. Never invent figures, testimonials, case studies, certifications, partner tiers or
response-time/24/7 claims** (content rule).

## Cross-site links
| From | Element | To |
|---|---|---|
| D'Matek footer | "Shop D'Source →" | D'Source standalone site (`dsource.dmatek.ng`, separate project, not in this bundle) |
| D'Matek footer, Businesses › D'Foundry, Solutions › Build software, orbit D'Foundry node | "Explore D'Foundry" | D'Foundry home (`dfoundry.dmatek.ng`) |
| D'Matek footer "Explore IléMesh →", orbit IléMesh node | | Businesses page, IléMesh row (until the IléMesh subdomain launches — name TBC) |
| D'Matek Businesses › D'Source, Solutions › Equip my business, orbit D'Source node | "Shop D'Source ↗" | D'Source site |
| D'Foundry footer | "D'MATEK.COM ↗" | D'Matek home |
| D'Foundry ↔ Droplet case study | | both ways |

The header has **no** shop button (approved nav; D'Source lives in the footer and business rows only).

---

# Part 1 — D'Matek site (v3.4)

## v3.4 signature systems (new since v3.1 — build these as shared components)

### 1. Signature line (Home only)
A single gold line runs down the left edge of the whole Home page, drawing itself as you scroll, with a node at each
of the seven moments.
- Overlay: one absolutely-positioned SVG covering the Home wrapper (`[data-home]`), `pointer-events:none; z-index:5; overflow:visible`.
- Nodes: each moment's eyebrow carries `data-node="01"…"07"` (01 hero eyebrow, 02 problem, 03 how we work, 04 six
  specialists, 05 the hotel section itself, 06 proof, 07 we stay). Node y = element top relative to Home + 8px; for the
  hotel section (`data-hotel`) y = top + `min(innerHeight × 0.5, 420)`.
- x = `max(12, (width − 1280)/2 + 12)` — the left edge of the 1280 container.
- Track: line from first to last node, `#D4A637`, opacity .25, width 2. Progress line on top: `#D4A637`, width 2.5, round cap.
- Progress y = `scrollY + innerHeight × 0.6 − homeTop`, clamped to [first, last]. Reduced motion → fully drawn.
- Each node = ring (r 9, last node r 13; stroke gold 1.5, opacity .3) + dot (r 4, fill-opacity .35).
  Lit state: dot r 5.5 (last 7), fill-opacity 1, ring opacity .9 (last ring r 18). Transition `r/opacity .4s cubic-bezier(.2,.8,.2,1)`.
- On first lighting, emit a pulse: circle r 30, gold stroke 1.5, WAAPI `scale(.15)→1, opacity .9→0`, 1100ms `cubic-bezier(.2,.7,.3,1)`, then remove.
- Rebuild geometry on resize, on a ResizeObserver of the Home wrapper, and at 0 / 400 / 1500ms after mount (images/fonts settling).

### 2. Signal rings
Decorative ring emitter in every page hero (Home hero ×2, Six Specialists, Solutions, Environment, Insights, Businesses,
Work, About, Contact panel). Positioned absolutely, off-canvas corner (e.g. `top:-22%; right:-10%; width:min(50vw,600px); aspect-ratio:1`).
Contents: four rings `border:1.5px solid #28705A`, `animation: dmRing 8s cubic-bezier(.2,.6,.3,1) infinite` staggered 0/2/4/6s;
two static rings at `inset:16%` and `inset:33%` (`1px solid rgba(40,112,90,0.14)`); gold centre dot 8px.
`@keyframes dmRing { 0% { transform:scale(.12); opacity:0 } 12% { opacity:.6 } 100% { transform:scale(1); opacity:0 } }`
On dark sections the same component is used (rings read against green).

### 3. Cable-run dividers
Section transitions are drawn as a cable route (right-angled with 12px radius corners) instead of waves.
- SVG `viewBox 0 0 1440 120` (or 110), `preserveAspectRatio="none"`, height `clamp(84px,8vw,120px)`.
- Layer 1: filled shape in the next section's colour, e.g. `M0 50 H420 Q432 50 432 62 V98 Q432 110 444 110 H1060 Q1072 110 1072 98 V42 Q1072 30 1084 30 H1440 V120 H0 Z`.
- Layer 2: same edge as a stroke, `#D4A637` width 2, opacity .55, `vector-effect:non-scaling-stroke`.
- Layer 3: travelling light on the same edge: `pathLength=2400; stroke #D4A637; width 3.5; round cap; dasharray "120 2280"; dashoffset 2400; animation dmFlow 9–10s linear infinite` (1.6–2.4s delay).
- Used: Problem → How we work; and (when Adire is off) around Six Specialists.

### 4. Adire bands (prop `adire`, default on)
A repeating Adire-inspired tile (cream circles, cross-hatch stripes, gold dots on deep green) used as a textile band.
- Tile: 64×64 SVG, background `#06382E`; cream strokes (`#F5F1E8`, opacity .5, width 1.3): centre cross `M32 0V64M0 32H64`, concentric circles r10/r5 at (16,16) and (48,48), diagonal hatches `M36 4l24 24M36 14l14 14M46 4l14 14M4 36l24 24M4 46l14 14M14 36l14 14`; gold dots (`#D4A637`) r1.8 at circle centres, r2.4 at (32,32) and the four corners. Exact data-URI is in the prototype — reuse it or save it as `adire-tile.svg`.
- **Six Specialists band** (top and bottom of that section): height `clamp(40px,4vw,56px)`, tile `background-size:auto 100%; repeat-x`, 2px gold rules top and bottom, plus a cable threaded through it: path `M0 30 H300 V14 H760 V34 H1140 V18 H1440` drawn three times — deep green 7px (the gap), gold 2px (the cable), cream 3.5px travelling light (`dasharray "110 2290"`, `dmFlow 7s linear infinite`).
- **Page strip** (About under hero; Environment page "At Home" under hero): height `clamp(30px,3.2vw,44px)`, gold rules top and bottom, no cable.
- **Footer strip**: 22px tall, tile at `auto 22px`, 2px gold rule below.
- When `adire=false`, Six Specialists falls back to cable-run dividers and all strips are removed.

### 5. Hotel moment (Home 05) — scroll-driven
- Section `height:320vh` with a sticky inner (`top:0; height:100vh`). Grid: left copy, right capability list.
- Left: small drifting photo blob (`assets/photos/hotel.jpg`; height `clamp(0px, calc(100vh − 640px), 190px)`, so it disappears on short screens), eyebrow "05 · THE COMPLEXITY WE ABSORB", H2 *"“We're opening a hotel.”"* (`clamp(34px,4.6vw,64px)`), then three stacked lines *One problem.* / *One team.* / *Many capabilities.* (last gold; `clamp(22px,2.4vw,32px)`/800).
- Counter row between 1px rules: **N/6 CAPABILITIES** · **N SPECIALISTS** · **1 TEAM TO CALL** (numbers `clamp(28px,3vw,40px)`/800; labels 11px/700/0.16em `#28705A`).
- Right: vertical track (2px `rgba(6,56,46,0.12)`) with a gold fill that grows to the last active row; six rows, each with a numbered index, name and specialist:
  Connectivity and guest Wi-Fi — INFRASTRUCTURE · Security and operations — ILÉMESH · Guest room technology — ILÉMESH · Power — ILÉMESH · Conference technology — ILÉMESH · Managed IT — ASSURANCE.
- Progress p = `clamp(−sectionTop / (sectionHeight − innerHeight), 0, 1)`; k = p × 7.2; row i active when k > i + 0.35.
  Active row: opacity 1, no offset, dot filled gold. Inactive: opacity .22, `translateX(18px)`, dot cream with `rgba(212,166,55,0.5)` border. Transitions .5s.
  CAPABILITIES = active count; SPECIALISTS = distinct specialists among active rows. Line 1 always on; line 2 at ≥3 active; line 3 at all 6 (off state opacity .18, `translateY(6px)`).
- **≤760px or reduced motion:** section height auto, not sticky, all rows active (p = 1).

### 6. Photography
Real images now fill the hero, stage panels, business rows, environment heroes and the hotel moment (`assets/photos/`):
| Image | Used for |
|---|---|
| team-real.jpg | Home hero blob |
| discover / understand / solve / deliver / support / improve.jpg | How we work stages (and Enterprise, Smart Buildings envs) |
| hotel.jpg | Hotel moment, Hospitality env |
| cabling-site.jpg | Infrastructure row, Real Estate env |
| support.jpg | Cloud row |
| foundry.jpg | D'Foundry row |
| smart-lock.jpg | IléMesh row, At Home env |
| source-kit.jpg | D'Source row |
| planning.jpg | Assurance row |
Environments without an image keep the `[ REAL PHOTOGRAPHY REQUIRED ]` + brief treatment (data field `img` optional).
Serve via the framework image component (AVIF/WebP, lazy below the fold). **Confirm rights for every photo before launch; replace with commissioned D'Matek shoots where available.**

### 7. Solutions / Environment presentation
Entry points, environments and business scope render as quiet lists with status: filled 4px chips = **AVAILABLE NOW**,
dashed-outline chips inside a dashed panel = **AVAILABLE AS A PILOT**. No decorative card grids beyond those specified below.

### 8. Footer (v3.4)
Full-width `#EFEADC` ground, `border-top:1px solid rgba(6,56,46,0.12)`, Adire strip on top (when on). Normal density:
padding `clamp(32px,4vw,48px) 32px 20px`, grid `repeat(auto-fit,minmax(min(100%,180px),1fr))`, gap `28px 40px`, mark 24px.

### Props / tweaks → production config
`accent` (gold, default #D4A637) · `animate` (bool) · `ticker` (bool) · `adire` (bool, default true). Ship with defaults; keep
`adire` as a site config flag.

## Routes
| Route | Screen |
|---|---|
| `/` | Home (7 moments) |
| `/solutions` | Solutions: "What do you need?" (10 entry points) + "Your environment" (10 environments). Anchors `#need`, `#env`, `#ep-<id>` |
| `/solutions/<env-id>` | Environment page (one template, 10 instances): `real-estate`, `enterprise`, `hospitality`, `education`, `retail`, `healthcare`, `worship`, `events`, `smart-buildings`, `home` |
| `/businesses` | Six specialists accordion. Anchors `#infrastructure #cloud #foundry #ilemesh #source #assurance` |
| `/work` | Proof layout (empty frames — delivered work only) |
| `/about` | About + "How we work" six steps (anchor `#how`) — replaces the old Approach page |
| `/insights` | Light page: five topic pills, no articles yet |
| `/contact` | "Tell us what you need" form |

Nav (desktop, ≥961px): **Solutions · Businesses · Work · About · Insights** + gold pill CTA **"Tell us what you need →"**.
Logo → `/`. Active nav item: `background: rgba(212,166,55,0.32)`; Solutions is also active on environment pages.

## Design tokens
### Colour
| Token | Hex | Use |
|---|---|---|
| Cream | `#F5F1E8` | Page ground, text on dark |
| Deep green | `#06382E` | Headings, dark sections |
| Green tint | `#0B4B3D` | Light stop of dark radial gradients |
| Green deepest | `#043028` / `#032A22` | Blob/card gradient ends |
| Mid green | `#28705A` | Eyebrows, meta, link hover |
| Gold (prop `accent`) | `#D4A637` | CTAs, numerals, kickers, focus ring, pilot tag on dark |
| Ink | `#1A1A1A` | Nav/footer text |
| Body | `#3A4A44` | Paragraphs on cream |
| Card cream | `#EFEADC` → `#E8E2D0` / `#E6E0CE` | Card gradients (160deg / 150deg) |

Alphas: `rgba(6,56,46,0.10)` eyebrow ground · `rgba(6,56,46,0.22)` outline button border · `rgba(212,166,55,0.14–0.32)` gold grounds ·
`rgba(245,241,232,0.82)` body on dark · `rgba(245,241,232,0.16–0.20)` hairlines on dark.

### Type
**Manrope** 300–800, `system-ui` fallback, antialiased. Headlines `text-wrap: balance`.
| Role | Size / weight / tracking / leading |
|---|---|
| Home H1 | `clamp(42px,6.2vw,86px)` / 800 / -0.038em / 0.98 |
| Page H1 | `clamp(38px,5.4vw,76px)` / 800 / -0.035em / 1.0 (environment H1 `clamp(36px,5vw,68px)`, leading 1.02) |
| Section H2 | `clamp(30px,4vw,54px)` / 800 / -0.03em / 1.04 |
| Accordion title | `clamp(22px,2.6vw,32px)` (entry points), `clamp(24px,3vw,38px)` (businesses) / 800 |
| Lede | `clamp(17px,1.7vw,20px)` / 400 / lh 1.7 |
| Body | 15–17.5px / lh 1.65–1.8 |
| Eyebrow label (v3.4) | 11.5px / 700 / 0.2em (`clamp(0.08em,0.6vw,0.2em)` in sections), `border-top:2px solid #D4A637; padding:10px 0 0` — no pill ground |
| Meta label | 11px / 700 / 0.16em |
| Button | 15px / 700 |

### Shape, elevation, spacing
Buttons, nav and inputs `999px`. **Chips, tags and step tiles are `4px`** in v3.4 (AVAILABLE NOW chips, pilot chips, PACKAGE tag, sector tags, HOW IT WORKS steps, Insights topics). Cards `clamp(24px,3vw,40px)` → panels `clamp(32px,5vw,72px)`.
Organic blobs use asymmetric radii (e.g. `58% 42% 47% 53% / 52% 46% 54% 48%`) morphing via `dmDrift`.
Shadows: card `0 14px 36px rgba(6,56,46,0.08)`, hover `0 26px 54px rgba(6,56,46,0.14)`, panel `0 24px 60px rgba(6,56,46,0.10)`, gold CTA `0 10px 26px rgba(212,166,55,0.35)`.
Container 1280px, side padding 32px. Section rhythm `clamp(56px,7vw,110px)`.

### Pilot label (use everywhere a pilot item appears)
- Tag: text **"AVAILABLE AS A PILOT"**, 11px/700/0.16em, `border:1px dashed`, radius **4px** (v3.4), `padding:8px 14px`.
  On cream: text `#06382E`, border `rgba(6,56,46,0.45)`. On dark: text `#D4A637`, border `rgba(212,166,55,0.6)`.
- Container: dashed border panel (`rgba(6,56,46,0.35)` on cream / `rgba(212,166,55,0.5)` on dark), radius 26px–44px.
- Items as outline chips (lighter weight than "available now" chips, which are filled).
- Standard sentence under every pilot list (verbatim): *"Available as a pilot. We're rolling this out with a small
  number of early customers. If it fits what you need, talk to us about joining the pilot."*
- Link: **"Talk to us about joining the pilot →"** → `/contact` with the pilot items pre-filled (see Contact).

## Motion
Easing `cubic-bezier(.2,.8,.2,1)`. Keyframes: `dmRise` (fade + 26px rise), `dmFloatA/B` (ambient orbs 17–24s),
`dmSpin/dmSpinRev` (orbit 90s), `dmMarquee` (ticker 34s), `dmDash` (SVG draw-in), `dmPulse`, `dmDrift` (blob morph).
**New in v3.1 — hero lines are continuous:**
- The two hero curves still draw in (`dmDash` 2.6s @.3s gold, 3.4s @.6s green).
- A second copy of each path runs a travelling light on top:
  gold `stroke-width 3.5; linecap round; dasharray "140 2260"; dashoffset 2400; animation dmFlow 6s linear 2.4s infinite`;
  green `stroke-width 2.4; opacity .6; dasharray "90 2310"; animation dmFlow 8s linear 3.6s infinite`.
- The SVG container drifts: `dmSway 11s ease-in-out 3s infinite`.
- `@keyframes dmFlow { from { stroke-dashoffset:2400 } to { stroke-dashoffset:0 } }`
  `@keyframes dmSway { 0%,100% { transform:translate3d(0,0,0) } 50% { transform:translate3d(-14px,12px,0) } }`

Scroll reveals: IntersectionObserver on `[data-reveal]`, `rootMargin "0px 0px -8% 0px"`, threshold .06, once; elements
already in view on mount show immediately. Scroll progress bar (3px, green→gold). Hero cursor glow. All off under
`prefers-reduced-motion` or `animate=false`.

## Screens

### Home — seven moments (in this order)
1. **01 Opening (hero).** Pill "D'MATEK TECHNOLOGY LIMITED". H1 *"Solving what matters."* (gold "matters." + drawn underline).
   Lede *"You can trust us. You won't be alone. We'll figure it out."* Paragraph *"D'Matek designs, builds and runs the
   technology behind connected businesses, properties, workplaces and homes."* CTAs: gold **"Tell us what you need →"**
   (→ contact), outline **"Explore solutions →"** (→ /solutions). Right: drifting photo blob (`assets/photos/team-real.jpg`, `data-tilt`).
   Animated curves (see Motion). Green wave into ↓.
2. **Ticker** (prop `ticker`): DISCOVER · UNDERSTAND · SOLVE · DELIVER · SUPPORT · IMPROVE · WE STAY.
3. **02 The problem** (dark green). H2 *"Technology is rarely one problem."* Five rows, each "X **affects** Y" with gold
   "affects": Connectivity → productivity · Security → trust · Power → availability · Software → how work gets done ·
   Devices → the people using them. Below: translucent panel "WHAT DO YOU NEED?" with the **10 entry-point pills**
   (each → `/solutions#ep-<id>` with that item opened). Cream wave into ↓.
4. **03 How we work.** H2 *"We don't hand over and walk away."* Copy: *"Discover, Understand, Solve, Deliver, Support,
   Improve. We start with what matters to you, not with a box, a licence or a brand. Pick a stage to read it."*
   Six chips 01–06 over a dashed curve; active chip green, lifted -4px; panel below shows body, value chip, photo blob,
   outcome line. Button "How we work, in full →" → `/about#how`.
5. **04 Six specialists** (dark, cream wave at top and bottom). H2 *"One customer. Six specialists."* Copy: *"Infrastructure
   connects it. Cloud runs it. D'Foundry builds it. IléMesh connects the physical world. D'Source sources it. Assurance
   manages, protects and improves it. One team accountable for the result."* Rotating orbit of six nodes (verb over name);
   hover swaps the centre disc; click → Businesses row (D'Foundry/D'Source nodes → their sites). Default centre:
   "THE RELATIONSHIP / One customer / Six specialists. One team accountable for the result."
6. **05 The complexity we absorb.** H2 *"“We're opening a hotel.”"* + *"One problem. One team. Many capabilities."*
   (last phrase gold). **Replaced in v3.4 by the scroll-driven hotel moment — see “v3.4 signature systems › Hotel moment”.** Button "See Connected Hotel →" → `/solutions/hospitality`.
7. **06 Proof.** H2 *"Problem. What we did. What changed."* Three placeholder cards (DELIVERED WORK ONLY) → /work.
8. **07 We stay.** H2 *"WE STAY."* *"We don't disappear when installation is finished."* *"Have a problem? Let's figure it out."*
   Gold CTA "Tell us what you need →". Right: drifting dark blob listing *Support. Management. Improvement. Problem-solving.*

**Removed from v3 (content rules):** the stats band (10+ years / 70% / 24/7), "seventy percent" and "decade" copy,
the Damilola ticket-system line, the placeholder testimonial on Home.

### Solutions
Hero: pill SOLUTIONS, H1 *"Start with what you need."*, lede *"Or start with where you work. Everything here is available
now, unless it carries the pilot label."*

**What do you need?** — accordion of 10 (same card treatment as Businesses: closed = cream gradient, `+`; open = dark radial
gradient, gold `–`, cream text, `dmRise .45s`). Open body: copy, **AVAILABLE NOW** filled chips, pilot panel (if any),
gold "Tell us what you need →" (pre-fills contact) + optional secondary button.

| # | id | Title | Copy | Available now | Pilot | Secondary |
|---|---|---|---|---|---|---|
| 01 | connect | Connect my business | Internet and Wi-Fi designed for how your site is used, with backup links, and watched for you. Or Wi-Fi for a monthly fee, with no equipment to buy. | Managed Connectivity & Wi-Fi; Wi-Fi-as-a-Service | Guest access and billing platform | — |
| 02 | start | Start or move my business | Everything a new office needs, set up right the first time. Or a move where you're working on day one and nothing goes missing. | Office in a Box; Office Relocation; Digital Workplace & Identity; Website & Hosting Care | — | — |
| 03 | it | Keep my IT running | One number to call. Problems fixed or prevented. A plain-language picture every month. Not sure where to start? Begin with a Technology Health Check. | Managed IT; Technology Health Check; Device Lifecycle Management | — | "Request a Technology Health Check" (→ contact, message pre-filled) |
| 04 | secure | Secure my organisation | Know your risk and close the gaps that matter. Stop phishing and invoice fraud. Back up what you can't lose, and prove you can restore it. Control who comes in. | Cyber Protection; Email Security & Anti-Fraud; Verified Backup & Recovery; Security & Access; Security System Care | Security awareness training; Incident response retainer; NDPA readiness; ISO / CBN compliance | — |
| 05 | power | Keep the power on | Power you can count on, at a cost you can see: grid, solar, inverter, generator and protection for your IT. | Power Continuity | Fuel and generator monitoring | — |
| 06 | software | Build software | Software, systems and automation built around your problem. Continues on D'Foundry. | Custom Software & Products; Business Systems & Automation | WhatsApp and customer messaging automation | "Explore D'Foundry →" |
| 07 | building | Modernise a building | Secure access, rooms that work, and building systems that respond to how the space is used. | Security & Access; Meeting & Workplace Technology; Building Automation & Environment | Energy and fuel monitoring | — |
| 08 | estate | Prepare a new estate | ISP-ready fibre to every home, and security from the gate, designed into the development. | Estate Fiber (infrastructure); Estate Gate & Perimeter Security; Power Continuity | Internet-Ready Homes; Estate utilities monitoring | "See Connected Estate →" |
| 09 | equip | Equip my business | Genuine devices and equipment, set up and supported. Continues on D'Source. | Device Lifecycle Management; D'Provision | — | "Shop D'Source →" |
| 10 | data | Use my data or AI | Turn what your systems already record into better decisions, and adopt AI safely. | *(none — show "Everything here is currently a pilot.")* | D'Matek Insight; AI Readiness & Adoption | — |

**Your environment** — H2 *"Or start with where you work."* Grid (auto-fit, min 300px) of 10 cream cards: solution name
(11px meta, `#28705A`), environment name (23px/800), headline (15px). Click → environment page.

### Environment page (one template, data-driven)
Order: back link "← Solutions · Your environment" → pill (solution name) → H1 headline → supporting line → CTAs (gold
"Tell us what you need →" + outline contextual CTA; both → contact pre-filled with the environment) → photo blob.
Then **WHAT GETS IN THE WAY** (3 numbered cards) → dark panel **WHAT WE SOLVE NOW** (filled chips) + **HOW IT WORKS**
(six step pills) → pilot panel (hidden if none) beside package card(s) → **PROOF** placeholder + **OTHER ENVIRONMENTS** pills.
Package card: "PACKAGE" pill, name, *What's included*, *For*, gold "Ask about this package →". **No prices.**

| id | Name | Solution | Headline | Supporting line | Problems | Solve now | Pilot | Package(s) | Contextual CTA |
|---|---|---|---|---|---|---|---|---|---|
| real-estate | Real Estate | CONNECTED ESTATE | Estates built connected and secure. | ISP-ready fibre to every home, and security from the gate, designed in before the first resident moves in. | Every new ISP digs up the estate and damages finishes. / Gates run on notebooks, so incidents have no evidence. / Pumps, gates and common areas fail when power does. | ISP-ready estate fibre infrastructure; Estate gate and perimeter security (CCTV, number-plate recognition, access control, visitor codes, intercom); Common-area power; Estate technology management | Internet-Ready Homes; Estate utilities monitoring; Automated gates, barriers and remote video monitoring | Connected Estate Essentials | Plan my estate |
| enterprise | Enterprise & Corporate | CONNECTED WORKPLACE | One accountable partner for your whole technology environment. | Connectivity, workplace platforms, devices, security, backup and meeting spaces, run under one relationship. | Too many vendors and nobody accountable. / Security gaps nobody has measured. / Staff losing hours to slow devices and bad meetings. | Multi-site networks; Microsoft 365 / Google Workspace / Zoho with identity and MFA; Device lifecycle; Cyber protection and email security; Verified backup; Meeting spaces; Managed IT and vCIO; Integration, automation and software | Governance, risk and compliance (ISO 27001, CBN); Endpoint detection and security monitoring; Executive dashboards (D'Matek Insight); AI readiness | Connected Workplace Essentials; Secure Workplace | Plan my workplace |
| hospitality | Hospitality | CONNECTED HOTEL | Hotels where guests stay connected, rooms run efficiently and the property stays secure. | From guest Wi-Fi to room keys, power and security, designed as one hotel environment and looked after once it is live. | Guests judge you by the Wi-Fi. / Rooms are cooled and lit while empty. / Nobody can see what's happening in public areas or stores. | Hotel connectivity and guest Wi-Fi; Security and operations (including people counting and queues); Guest room technology (key cards, room power, IPTV, elevator access); Hotel power; Conference and banqueting technology; Hotel IT management and backup | Guest messaging; Diesel and generator monitoring; Guest data compliance | Connected Hotel Essentials | Plan a hotel project |
| education | Education | CONNECTED SCHOOL | Reliable, safe campuses where technology helps teachers teach. | Campus Wi-Fi with safe internet, classrooms that work, devices ready for every lesson, and a campus you can secure. | Wi-Fi fails in classrooms and labs. / No record of who is on campus or who collected a child. / Nobody in-house to fix IT when term starts. | Campus connectivity and safe internet; Smart classrooms; Computer labs and devices; Campus safety (CCTV, access, visitor and collection records); Campus power; Managed campus IT | Children's data protection (NDPA); Attendance systems | Connected School Essentials | Plan my school |
| retail | Retail | CONNECTED RETAIL | Stores that keep trading, protect stock and know their busy hours. | Payments that don't stop when the internet does, cameras that deter loss and show footfall, and IT that keeps tills running. | When the internet drops, card payments stop. / Shrinkage nobody can explain. / No idea when the store is busiest. | Store connectivity and payment uptime; Loss prevention and store security (including footfall and peak-time analytics); Store power; Store IT management | POS and inventory; Conversion analytics (footfall + sales); Customer messaging; Cold chain monitoring | Connected Retail Essentials | Improve my stores |
| healthcare | Healthcare | CONNECTED CLINIC | Clinics where the network, power and systems don't fail during care. | A segmented, reliable network, protected power, controlled access to pharmacy and records, and IT that's supported and backed up. | Outages interrupt care. / Pharmacy and records rooms aren't controlled. / IT failures during clinic hours with nobody to call. | Clinical network and connectivity; Clinical power; Clinic security and access; Clinical IT management and backup | Patient data protection (NDPA); Cold chain and critical environment monitoring; Patient calls and messaging | Connected Clinic Essentials | Plan a clinic |
| worship | Worship | CONNECTED WORSHIP CENTRE | Services that sound right, look right and run on time, every week. | Sound, screens and cameras that work for the auditorium and your online members, with safety, power and support behind them. | Sound and screens fail mid-service. / Volunteers fighting the technology. / Large crowds with little visibility. | Worship AV and media (sound, screens, cameras); Connectivity for services and online members; Safety and crowd management; Worship power; Media team support | Attendance and engagement insight | Connected Worship Essentials | Plan our technology |
| events | Events | CONNECTED EVENT | Events where the Wi-Fi holds, the stage works and sponsors see the numbers. | High-density connectivity with a post-event report as standard, professional AV, and power for every piece of kit. | Wi-Fi collapses at the keynote. / Presentations and sound fail on the day. / No evidence for sponsors afterwards. | Event connectivity with a post-event report; Event AV and media; Event power | *(none — hide pilot panel)* | Connected Event Essentials | Plan an event |
| smart-buildings | Smart Buildings | SMART BUILDING | Buildings that are secure, powered and easier to run. | A segmented building network, controlled access, reliable power, working meeting rooms, and building systems that flag problems early. | Faults found by complaint. / Energy and diesel costs nobody can explain. / Visitors and contractors uncontrolled. | Building network and tenant connectivity; Building security and access; Building power; Building automation and environment (sensors, monitoring, BMS integration); Meeting and workplace technology; Building technology management | Fuel, generator and energy monitoring; Building insight | Smart Building Essentials | Modernise my building |
| home | At Home | AT HOME | Devices, power and security for your home, handled. | Genuine devices set up properly, power that stays on, and a home you can see and secure. | Fake or wrong devices, and no honest repair. / Outages stop work from home. / You can't see your home when you're away. | Personal devices and care; Home power; Home security and smart home | Home internet and Wi-Fi; Device care plan; Building a home? Internet-Ready Homes | Home Essentials | Tell us what you need |

**Packages** (What's included · For):
- Connected Workplace Essentials — Technology Health Check, managed connectivity, digital workplace and identity, managed IT · Organisations needing a dependable baseline
- Secure Workplace — Connected Workplace Essentials + cyber protection, email security, verified backup · Organisations exposed to security or fraud risk
- Connected Estate Essentials — ISP-ready estate fibre, estate gate and perimeter security, common-area power, managed estate technology · Developers and estate operators
- Connected Hotel Essentials — Connectivity and guest Wi-Fi, security and operations, guest room technology, power, conference technology, managed IT · Hotels, serviced apartments, lodges
- Connected School Essentials — Campus connectivity, smart classrooms, devices, campus safety, power, managed campus IT · Schools and training centres
- Connected Retail Essentials — Store connectivity and payment uptime, security with footfall analytics, power, store IT · Retailers, pharmacies, restaurants, showrooms
- Connected Clinic Essentials — Clinical network, security and access, power, managed IT and backup · Clinics and diagnostic centres
- Connected Worship Essentials — Worship AV and media, connectivity, safety, power, media team support · Worship centres
- Connected Event Essentials — Event connectivity with post-event report, event AV and media (+ event power) · Organisers and venues
- Smart Building Essentials — Building network, security and access, power, building automation, meeting technology, managed IT · Building owners and facility managers
- Home Essentials — Personal devices and care, home power, home security · Individuals, families, estate residents
- (Office in a Box — Devices, office network and internet with backup, domain, email and files, website, MFA and backup, set up and documented · New businesses — defined in data, not yet placed on a page)

Content rules to keep in code review: Estate Fiber is **ISP-ready fibre infrastructure only** (never present D'Matek as
an internet provider); no live-streaming offer; Retail says "footfall and peak times", not "conversion" (except the
labelled pilot); no patient-data or "executive visibility" claims outside pilot labels.

### Businesses
Hero H1 *"Six businesses that work on the same problem."* Lede *"A hotel needs Wi-Fi, cameras, room technology, power,
backup and someone to run all of it. That is several of our businesses and one conversation with us."*
"HOW EVERY PROJECT RUNS" — six pills: Discover, Understand, Solve, Deliver, Support, Improve.
Accordion (first open by default). Open body: proposition line (gold), **AVAILABLE NOW** + scope, note, site button
(where applicable), and a drifting blob with **AVAILABLE AS A PILOT** + items (or **ALL AVAILABLE NOW** / *"Everything
listed here can be provided today."*) + photo brief.

| id | Name | Verb | Proposition | Solves | Available now | Pilot | Note | Button |
|---|---|---|---|---|---|---|---|---|
| infrastructure | D'Matek Infrastructure | CONNECT IT | Connectivity designed around how you work. | When the network is the thing standing between people and their work. | Network design and deployment · enterprise and guest Wi-Fi · internet with backup links and failover · fibre and structured cabling · ISP-ready estate fibre · event connectivity · managed networks · Wi-Fi-as-a-Service · power protection for IT (UPS, surge, earthing). | — | NETWORKS · FIBRE · WI-FI · INTERNET | — |
| cloud | D'Matek Cloud | RUN IT | A digital workplace your people can rely on. | When email, files, sign-in and backup have to just work. | Microsoft 365, Google Workspace and Zoho · identity, MFA and SSO · business email and email security · hosting and website care · verified backup and recovery. | — | EMAIL · IDENTITY · HOSTING · BACKUP | — |
| foundry | D'Foundry | BUILD IT | Software built around the problem. | When the software you need doesn't exist yet, or the ones you have won't talk to each other. | Custom software and products · business systems, integrations and automation · websites. | Customer messaging and WhatsApp automation · Guest access and billing platform | SOFTWARE · INTEGRATIONS · AUTOMATION | Explore D'Foundry ↗ |
| ilemesh | IléMesh | PHYSICAL WORLD | Smart and connected systems for real places. | When a building, estate or room should look after itself and the people in it. | CCTV, access control and visitor management · security system care · power continuity (solar, inverter, generator, UPS design) · meeting rooms and AV · building automation and sensors · guest room technology · smart classrooms · worship and event AV. | Fuel and generator monitoring · Cold chain monitoring · Estate utilities monitoring | STANDALONE SITE COMING · SUBDOMAIN TO CONFIRM | — |
| source | D'Source | SOURCE IT | Commerce by D'Matek. | When the right equipment has to arrive, genuine and set up. | D'Emporium (retail and consumer technology) · D'Provision (business procurement) · device lifecycle · Office in a Box. | Device care plan | D'EMPORIUM · D'PROVISION | Shop D'Source ↗ |
| assurance | D'Matek Assurance | MANAGE IT | We keep it running, secure and improving. | When somebody needs to be responsible for all of it. | Managed IT and helpdesk · Technology Health Check · cyber protection (assessment, hardening, identity controls, firewall policy) · IT strategy and vCIO. | NDPA readiness and DPO service · ISO / CBN compliance · Security awareness training · Incident response retainer · D'Matek Insight · AI readiness | MANAGED IT · CYBERSECURITY · RESILIENCE | — |

Division boundary rule: Infrastructure never describes CCTV/access/building systems/AV; IléMesh never describes
fibre/networks/Wi-Fi/internet.

### Work
H1 *"Problems we were trusted with."* Lede *"Delivered projects and outcomes only. Each one is published here once the work
is complete and the client has agreed."* Three case frames with a **PROBLEM / WHAT WE DID / WHAT CHANGED** segmented control
(per-case state), photo blob, quote card — all placeholders (`[ DELIVERED PROJECT n — TO BE CONFIRMED ]`, `[ REAL OUTCOME
TO BE ADDED ]`, `“[ CLIENT QUOTE — ONLY WITH PERMISSION ]”`). Build the layout ready for CMS data; publish nothing invented.

### About
Hero *"We're not vendors. We're partners for life."* / *"Built in Lagos, working across Nigeria…"*. Four value cards
(Trust, Solve, Connect, Improve). Damilola section (portrait placeholder, *"When something matters to you, it matters to
us."*, *"You don't get a ticket system. You get Damilola — in the first meeting, during the build, and after handover."*,
`[ ONE SHORT STORY TO BE ADDED ]`). Then **HOW WE WORK** (`#how`): H2 *"Six steps, one continuous relationship."* and six
stacked stage panels:

| # | Step | Body | Value | Outcome |
|---|---|---|---|---|
| 01 | Discover | We start with what you're trying to achieve, not with a box, a licence or a brand. | TRUST | What matters, named. |
| 02 | Understand | We look at how the site, the people and the systems work today, and what has already been tried. | LISTEN | The real problem, understood. |
| 03 | Solve | We simplify it, then design the right answer, with options and trade-offs in plain language so the decision is yours. | SIMPLIFY | Simpler, and solved properly. |
| 04 | Deliver | We build, install and integrate across whichever specialists the job needs, then hand over with everything documented. | SOLVE | One team on site. |
| 05 | Support | We don't disappear when installation is finished. Support, management and someone who knows your setup. | WE STAY | Someone accountable after handover. |
| 06 | Improve | Needs change and businesses grow. We revisit what we built and make it better. | IMPROVE | Better as you grow. |

Removed (rules): About stat pills, the four testimonial cards, the "Moat" panel from the old Approach page.

### Insights
Hero pill INSIGHTS, H1 *"Practical guidance."*, lede *"On connectivity, security, power, operations, and data and AI.
Articles will be published here."* Five topic pills. Build as a CMS-ready listing.

### Contact ("Tell us what you need")
Dark panel. Left: pill TELL US WHAT YOU NEED, H1 *"Let's figure it out together."*, lede, three badges
(*Tell us in your own words · No technical knowledge needed · One team from the first conversation*),
`Lagos, Nigeria / [ PHONE TO BE ADDED ] / [ EMAIL TO BE ADDED ]`.
Right: form —
- Pilot notice (only when arriving from a pilot link): "PILOT INTEREST" + the pilot items + standard pilot sentence.
- NAME (required) · EMAIL OR PHONE (required, text)
- ORGANISATION TYPE (select: Business or office, Estate or developer, Hotel or hospitality, School, Retail, Clinic,
  Worship centre, Event or venue, Building owner or facility manager, Home, Other) · LOCATION (text, "City or site")
- CLOSEST STARTING POINT (select: "I'm not sure yet — help me figure it out", the 10 entry points, the 10 environments)
- WHAT ARE YOU TRYING TO SOLVE? (textarea, controlled; may be pre-filled)
- WHAT WOULD A GOOD OUTCOME LOOK LIKE? (textarea)
- Gold submit "Send it to us →"; note *"You don't need to know which technology it needs. Tell us the problem in your own words."*
- Success state: check disc, *"Thank you. We've got it."*, *"Someone will read this properly and come back to you."*
  (no response-time promise). Wire to a real endpoint; **log pilot enquiries by item + environment** (pilot demand log).

**Pre-fill contract:** every CTA that routes to contact passes `{ topic, message?, pilot? }`:
entry point → topic = entry title; environment/package CTA → topic = environment name (package CTA also sets
message "I'd like to talk about <package>."); pilot link → pilot = comma-joined pilot items; Health Check → message
"I'd like to request a Technology Health Check." In production use query params, e.g.
`/contact?topic=Hospitality&pilot=Guest%20messaging`.

### Footer
Four columns: brand ("Solving what matters.") · THE SIX BUSINESSES (each → its Businesses row) · PAGES (nav) ·
GET IN TOUCH (gold "Tell us what you need →", `[ PHONE ] [ EMAIL ] [ SOCIAL LINKS ]`, then **Shop D'Source →**,
**Explore IléMesh →**, **Explore D'Foundry →**). Bottom: © line + "WE'LL FIGURE IT OUT."

## State (prototype → production)
```
page         → route
menuOpen     boolean
openEp       number (-1 none)         Solutions accordion
envId        string                   → /solutions/[env]
openBiz      number (default 0)       Businesses accordion
activeStage  number (0–5)             Home stage selector
facets       {caseId: before|did|after}
hoverBiz     number|null              orbit centre
topic, msg, pilotAsk                  → contact query params
sent         boolean                  form success
```
Props: `accent` (gold, options #D4A637/#C8922B/#B98F3A/#E0B455), `animate` (bool), `ticker` (bool).

## Placeholders before launch
Photography (hero, stage blobs, business blobs, environment heroes, Damilola portrait, case before/after) · phone,
email, socials · delivered case studies (open item: which projects can be published) · IléMesh subdomain · the About story.

## Assets
`assets/mark-green.png` (header/footer on cream, 30px) · `assets/mark-cream.png` (mobile menu) · `assets/logo-lockup.png`,
`assets/logo-symbol.png` (reference). Manrope from Google Fonts — self-host.

---

---

# Part 2 — D'Foundry site

**Port it exactly — follow `DFOUNDRY_PORT.md`** (markup + engine verbatim, Playwright side-by-side verification).
Source split: `dfoundry-source/template.html`, `dfoundry-source/logic.js`, `droplet-*`.

### Change in this release — Process section (screen label "Process")
Reason: the old copy implied client work is resold to other clients. Replace verbatim:
- Heading: **"Built around you, "** + Instrument Serif italic accent **"on proven foundations."** (was "One client, then a platform, then a product.")
- Label: **"03 · HOW WE BUILD"** (was "03 · HOW A PROJECT GROWS")
- Card 1 — label **YOUR PROBLEM**, title **Built around your problem**, body *"Designed with the people who live with it every day."*
- Card 2 — label **PROVEN FOUNDATIONS**, title **Started on tested ground**, body *"Your project begins on components we have already tested, so it moves faster and breaks less."*
- Card 3 — label **YOURS TO OWN**, title **Yours to own**, body *"What we build for you is yours, and we maintain it for as long as you need."*
- QADPAY/Droplet no longer mentioned here (they stay in Products / Recent work).
- Search the codebase for "Keep what repeats", "Ship it to many", "Solve it for one client", "then a product" — none should remain.

Open checks for the owner (not code): confirm "Yours to own" matches client contracts; D'Foundry contact success copy
promises "within two working days" — confirm or soften.


### Pending D'Foundry v2 improvements (NOT designed yet — do not build unless a v2 prototype is supplied)
Identified in review, to be designed next: headline visible on load; tighten the empty green area; D'Matek family markers
(gold cable, Adire footer strip — reuse the Part 1 components when that lands); sharper product frames; clearer sound
control; phone interaction pass. Build the current design exactly; structure the footer and hero so these can drop in.

## Files in this bundle
```
Dmatek Website v3.4.dc.html   D'Matek site design reference (source of truth)
DFoundry Hero.dc.html         D'Foundry site design reference
Droplet Case Study.dc.html    D'Foundry case study
DFOUNDRY_PORT.md              exact-replication guide for D'Foundry
dfoundry-source/              D'Foundry markup + engine as plain files
CLAUDE_CODE_PROMPT.txt        prompt to paste into Claude Code
support.js, image-slot.js     prototype runtime — reference only, do not port
assets/                       logos, marks, team photo, Droplet screenshots
assets/photos/                v3.4 photography
README.md                     this document
```
