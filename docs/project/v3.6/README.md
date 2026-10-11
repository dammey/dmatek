# Handoff: D'Matek website ecosystem
11 October 2026 · Target: existing Next.js / Vercel repo `dammey/dmatek` (site workspace)

## Overview
D'Matek Technology Limited is a Lagos technology partner with six specialist businesses. This bundle contains the final designs for:

| Site / route | Design file  | Hosting |
|---|---|---|
| dmatek.ng (home, services, solutions, environment pages, work, about, contact) | `Dmatek Website v3.6.dc.html` | Main site |
| dmatek.ng/infrastructure | `DMatek Infrastructure Hero shared.dc.html` | Main site, same instance |
| dmatek.ng/cloud | `DMatek Cloud Home v3.1 shared.dc.html` | Main site, same instance |
| dmatek.ng/ilemesh | `DMatek IleMesh.dc.html` | Main site, same instance |
| dmatek.ng/assurance | `DMatek Assurance.dc.html` | Main site, same instance |
| source.dmatek.ng | `DSource v11.1.dc.html` | Separate site |
| foundry.dmatek.ng (+ case study) | `DFoundry Hero v2.dc.html`, `Droplet Case Study.dc.html` | Separate site |

## About the design files
The files are **design references built in HTML**: prototypes showing the intended look, copy and behaviour. They are not production code. Recreate them in the existing Next.js codebase using its routes, components and patterns. Each file opens directly in a browser (keep `support.js`, `image-slot.js` and the `assets/` folder beside them, with `assets/photos/` inside `assets/`); the files link to each other, so you can click through the whole ecosystem.

Inspect the repo first: routes, components, tokens, the form (`/api/contact`, Resend), deployment config. Map every change to a real file. Reuse what exists; do not build a parallel site. Industry pages already exist at `/solutions/[env]` — extend them.

## Fidelity
**High-fidelity.** Colours, typography, spacing, copy and interactions are final, except content explicitly marked as hidden or awaiting sign-off (section 9). Match them closely.

## Ground rules
- Keep **"Solving what matters."** as the main-site headline.
- Do **not** invent business facts, testimonials, metrics, clients, availability, SLAs, addresses or numbers. Missing content = typed data field that hides the element when empty.
- The six specialists are internal architecture. Customers never have to pick a unit; the finder and enquiry speak as one D'Matek.
- Small, reviewable changes. Report changed files, tests, open dependencies. Do not touch DNS, secrets or live deployment settings without approval.

## Design tokens
**Colours**
| Token | Hex | Use |
|---|---|---|
| Forest Green | `#06382E` | Primary ink, dark sections |
| Deep Green (gradient) | `#0B4B3D` → `#06382E` | Dark panels: `radial-gradient(120% 140% at 8% 0%, #0B4B3D, #06382E 60%)` |
| Progress Green | `#28705A` | Labels, secondary ink, rings |
| Gold | `#D4A637` | Punctuation only: CTAs, eyebrow rule, nodes, highlights |
| Light Gold | `#F2C879` | In-development states, night windows |
| Warm Cream | `#F5F1E8` | Primary light background |
| Sand | `#EFEADC` / `#E8E2D0` | Cards (`linear-gradient(160deg,#EFEADC,#E8E2D0)`) |
| Body text | `#3A4A44` | Paragraphs on cream |
| Muted on green | `#A9BBB3`, `rgba(245,241,232,0.86)` | Paragraphs on green |
| Signal green | `#3DFFA8` | Live/ok states inside demos only |
| Charcoal | `#1A1A1A` | Rare |

**Typography:** Manrope (400–800). JetBrains Mono for small technical labels on Cloud only.
- H1: `clamp(38px,5.4vw,76px)`, 800, line-height 1, letter-spacing −0.035em
- H2: `clamp(30px,4vw,54px)`, 800, line-height 1.04, −0.03em
- Card title: 22–26px, 800, −0.02em
- Body: 17–20px (`clamp(17px,1.7vw,20px)`), line-height 1.7
- Eyebrow: 11.5px, 700, letter-spacing 0.2em, uppercase, `border-top:2px solid #D4A637; padding-top:10px`, **never wraps** (`white-space:nowrap`)
- Small label: 11px, 700, 0.16em

**Layout:** content max-width 1280px, side padding 32px, section padding `clamp(56px,7vw,110px)` top/bottom. Radii: cards `clamp(24px,3vw,40px)`, panels `clamp(26px,3.4vw,44px)`, pills 999px, chips 4px. Shadows: `0 14px 40px rgba(6,56,46,0.08)`, hover `0 28px 60px rgba(6,56,46,0.16)`. Hover lift: `translateY(-4px…-6px)`.

**Brand devices:** the D'Matek Line (thin green/gold line drawn down the page with a node at each section label), the adire pattern band between hero and content on business pages, pulse rings (concentric Progress Green circles, top-right of heroes).

## Screens and behaviour

### Main site (`Dmatek Website v3.6.dc.html`)
Single-page router by hash (`#/home`, `#/businesses`, `#/solutions`, `#/solutions/…`, `#/work`, `#/about`, `#/contact`). Header: logo, nav, "Tell us what you need →". Mobile menu under 960px.

**Home, in order**
1. **Hero** — eyebrow "D'MATEK TECHNOLOGY LIMITED"; H1 "Solving what matters." (gold "matters." with drawn underline); subline "One technology partner. The right specialists. One team accountable for the result."; descriptor "D'Matek designs, builds and runs the technology behind connected businesses, properties, workplaces and homes."; CTAs "Tell us what you need →" (gold) and "Explore solutions →". Rings top-right; hero line draws in once.
2. **Marquee** — 70s loop, `aria-hidden` on the duplicate.
3. **Situation finder** ("What are you trying to achieve?") — cream panel on green. Heading + "Technology can be complicated. Getting things to work shouldn't be. Choose the situation closest to yours…".
   - Step 1: six photo tiles (16:9, image zooms on hover): Set up a new office · Open or upgrade a hotel · Improve a school · Connect or secure a property · Keep my IT running · Equip my business. Under them, four pills: I need software built or integrated · Keep the power on · Secure my organisation · Not sure. Talk to us.
   - Step 2 (tile click replaces tiles): photo, situation title, overview paragraph, gold "Depends on an assessment:" note, "← All situations".
   - Step 3: checkbox list of 6 needs + "Not sure yet"; button counts picks ("Continue with 2 selected →").
   - Continue → opens the enquiry with environment selected and message prefilled: `Situation: <title>. I need: <picks>.` No business names appear in the finder. Copy for all six situations is in the `SIT` array in the file.
4. **03 · How we work** — "We don't hand over and walk away." Six stage tabs (Discover → Improve), one open at a time.
5. **04 · One D'Matek, many solutions** — "One contact. Many solutions." + the orbit of six businesses around D'Matek (the home page's signature motion; hover highlights).
6. **05 · The complexity we absorb** — hotel scroll scene, six of six: Wi-Fi → Infrastructure; CCTV/access/power → IléMesh; PMS hosting/email/backup → Cloud; TVs/locks/devices → D'Source; guest app/integrations → D'Foundry; managed IT after opening → Assurance. Counters render final values first.
7. **Six specialists. Try one.** — six tiles linking to each business's demo.
8. **06 · Proof** — hidden cards; line "Case studies are coming soon… Talk to us about similar work →" until a case is `approved`.
9. **07 · We stay**, contact band, footer.

**Services (`#/businesses`)**
1. Hero: eyebrow "ONE CONTACT, MANY SOLUTIONS"; H1 "One partner. The specialists your problem requires."; three paragraphs (verbatim in file).
2. **Relationship diagram**: green card "D'Matek Technology Limited · One customer relationship · One coordinated delivery approach · Clear accountability", arrow, six white tiles (icon + verb label + name + one line). Labels: CONNECT IT, RUN IT, BUILD IT, PHYSICAL WORLD, EQUIP IT, MANAGE IT.
   - **Open:** the clicked tile's rectangle expands into a full profile covering the tile grid (clip-path from tile rect to full, 900ms `cubic-bezier(.7,0,.2,1)`), then contents fade/lift in staggered (480ms + 110ms each).
   - **Profile:** Role · Typical problems it solves · How it works with the others · Available now (chips) · Next step (CTA + link to that business's page). Round "−" close button top-right.
   - **Close:** contents fade, profile shrinks back into the same tile (700ms), tile flashes green and settles, other tiles ripple back in.
   - Entrance: tiles fly out from under the green card on page arrival.
3. How every project runs (six equal steps; 6 / 3 / 2 columns by width).

**Solutions (`#/solutions`)** — H1 "Find the right solution."; "Start with where you work" (only `hospitality`, `education`, `real-estate`, `enterprise`); then "Or start with what you need" (expandable rows; home pills deep-link to these). Rows slide in on arrival.

**Environment pages (`#/solutions/<id>`)** — same template for each: hero (eyebrow, headline, intro, CTA, photo slow zoom on arrival) → What gets in the way (5 problems) → What we solve now (6 items) → How an engagement runs (5 steps) → The next step (heading, paragraph, CTA) → Other environments. Copy per environment is in the `ENV` array. Hospitality copy is client-supplied; the other three are drafts awaiting sign-off.

**Work** — "Problems we were trusted with." + "Coming soon" panel with the five-part case format and "Discuss a similar project →". Approved cases render with: situation, assessment, work, result, afterwards.

**About** — hero, "Technology is rarely one problem" (five "affects" lines), "We connect, build, equip, host, secure and run your technology.", founder section (renders without portrait), how we work.

**Contact / enquiry** — fields: name, organisation (optional), phone or WhatsApp, email, environment (prefilled), what you need (new setup / upgrade / equipment / software / support / not sure), message, location (optional). Success state with reference and what happens next; failure keeps input. WhatsApp option beside the form. Gold pulse on WhatsApp/phone buttons on arrival.

### Infrastructure (`/infrastructure`)
Order: hero with interactive cable tangle ("% connected" counter) → intro → Design/Build/Operate diagram (draws itself) → **Wi-Fi coverage plan** (floor plan, draggable access points, +/− buttons, walls attenuate, legend Strong/Good/Weak/Dead zone, "Illustration only") → **failover demo** (cut main line → backup lights) → full service list (expandable, +/−) → projects (placeholder project name to replace) → gold band → good to know → what happens next → contact.

### Cloud (`/cloud`)
3D sphere hero (canvas). Eight groups on the sphere: Domains, DNS & SSL · Websites & Hosting · Servers & Virtualisation · Cloud Infrastructure · Storage & Directory · Email & Productivity · Backup · Recovery & Continuity, plus "Talk to us". Click group → fly into its cluster (only its services shown) → click service → detail panel. 47 services using the catalogue's original names; in-development (pale gold, "DEV", chip "IN DEVELOPMENT") and planned (grey, "PLANNED", "Planned. This is not available to order yet."). Sector HUD bottom-left, sound toggle top-right, list view fallback. Below: "Lose a file. Get it back." restore demo, collapsed "Browse everything as a list", good to know, contact. **Provide a lighter non-3D version on mobile/low-power.**

### IléMesh (`/ilemesh`)
Hero stage: cutaway of a hotel/estate with nine numbered points; guided tour auto-advances every 5.2s (pauses when the visitor picks a point); Day/Night toggle (stars, moon, lit windows). Explanation card sits inside the scene. Then place chooser, power-cut demo, full list, contact.

### Assurance (`/assurance`)
Hero "We keep your IT running, secure and improving." + **one night** scene: skyline, shield, draggable clock 18:00 → 08:00 (autoplays once when scrolled into view), sky darkens/lightens, ten example events appear with HANDLED / NEEDS YOU tags and live counters, ending in a "Monday morning" card. Labelled "Illustration only". Then start-here cards, self-check score, scam test, full list, good to know, next steps, contact.

### D'Source (`source.dmatek.ng`) and D'Foundry (`foundry.dmatek.ng`)
Separate sites; build from their files as-is. Both have "← Back to D'Matek". D'Foundry links to the Droplet case study.

### Shared across business pages
Main header and footer, page progress bar (2px, gold gradient), WhatsApp floating button, expandable lists use **+ when closed / − when open**, eyebrows never wrap.

## Motion rules
- One signature motion per page (home: orbit; services: tile zoom; about: rings; business pages: their demo). Everything else quiet.
- Page-entrance effects play once on arrival and stop.
- Respect `prefers-reduced-motion`: skip entrances, autoplay and demos' auto-animation.

## State (main site)
`page`, `envId`, `sit` (−1 or index), `sitPick` (map of picked needs), `openBiz` (−1 or index), `openEp`, stage tab index, form fields + `orgSel`, submit status. Cloud: selected group, focused service, panel, sound. Assurance: clock time, playing. IléMesh: zone, tour, night.

## Routing and links
- `/infrastructure`, `/cloud`, `/ilemesh`, `/assurance` on the main site.
- `NEXT_PUBLIC_SOURCE_URL` / `NEXT_PUBLIC_FOUNDRY_URL` (defaults `https://source.dmatek.ng`, `https://foundry.dmatek.ng`); replace every `*.vercel.app` link.
- Hide unwritten environments (retail, healthcare, worship, events, smart-buildings, home) from navigation.
- Insights hidden until 3+ posts exist.

## Enquiry backend
Server-side validation, spam/rate limiting, Resend key in env vars only, notify the designated owner with all fields + source page + source CTA, track to qualified / declined / proposal / resolved. Real end-to-end test including email delivery. Contact: phone/WhatsApp **07058071768** (`https://wa.me/2347058071768`), **hello@dmatek.ng**.

## Analytics
Fire an event for every `data-track` attribute (name + page path):
`finder_continue, try_infrastructure, try_cloud, try_ilmesh, try_assurance, try_dfoundry, try_dsource, cta_contact_header, cta_contact_footer, cta_survey_request, cta_review_request, cta_ilemesh_hero, cta_assurance_hero, demo_failover, demo_restore, demo_power_cut, form_submit_assurance, form_submit_ilemesh, form_submit_foundry, back_to_dmatek, whatsapp_click, call_click, email_click`.
Plus: form starts, successful submissions with source, finder situation + needs selected. Needs the analytics ID and Search Console verification from D'Matek.

## SEO
Unique title, description and Open Graph per page. Home description: "D'Matek designs, builds and runs the technology behind businesses, hotels, estates and homes in Lagos: networks, cloud, security, power and managed IT." Canonicals on `https://www.dmatek.ng`; `noindex` on non-dmatek.ng hosts; Organization JSON-LD (address and RC number only when supplied).

## Accessibility
Keyboard operation for every tile, tab, checkbox and demo; visible focus; alt text on all photos; contrast 4.5:1 for body text; accessible form errors; `aria-expanded` on expanders; `aria-hidden` on decorative motion.

## 9. Content hidden until supplied — do not invent
| Item | Where | Until supplied |
|---|---|---|
| Approved case studies | Work, home Proof | "Coming soon" panel; `approved: true` publishes |
| Client names (Valour and Valiant, Droplet) | D'Foundry | Need written permission |
| Testimonials | About | Only `verified: true` render |
| Founder story + portrait | About | Section renders without them |
| Real photos (school, hotel with people, environments without photos) | Finder, environment pages | School tile uses a stand-in |
| Service status per offering (available / partner-delivered / pilot) | Services, environments, Cloud | No label shown |
| Address, RC number, social links | Footer, contact, JSON-LD | Hidden |
| Infrastructure project name | Infrastructure projects | Replace or remove placeholder |

**Awaiting D'Matek sign-off:** Education / Real Estate / Enterprise environment copy; Services "How it works with the others" lines; Cloud catalogue labels; IléMesh warranty, Assurance compliance and D'Source pay-on-delivery wording (legal).

## Assets
`assets/` — logos (`mark-green.png`, `mark-cream.png`, `logo-lockup.png`, D'Source and D'Foundry marks, Cloud mark), photos in `assets/photos/` (team, hotel, cabling, planning, support, source kit, foundry, stage photos), D'Source hero imagery, Droplet screenshots. Replace stand-ins with real D'Matek photography; no stock or AI imagery.

## Launch checks
No placeholders visible · every link and CTA tested at 1440px and 375px · real form submission delivered · WhatsApp link works · counters correct with JS off · unique metadata per page · vercel.app noindexed · keyboard + reduced motion checked · performance measured, 3D pieces lightened on mobile.
