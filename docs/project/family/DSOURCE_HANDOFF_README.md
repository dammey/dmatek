# Handoff: D’Source storefront v7.4

Commerce site by D’Matek (dsource.dmatek.ng). Two stores in one site: **D’Emporium · For Home** and **D’Provision · For Business**, organised around place kits.

## What’s in this folder
| Path | What it is |
|---|---|
| `DSource v7.4.dc.html` | Runnable prototype — **the source of truth**. Open in a browser (serve the folder: `npx serve design_handoff_dsource`). |
| `source/storefront-template.html` | All markup + every inline style, in order (for reading) |
| `source/storefront-logic.js` | Sample data + all behaviour (for reading) |
| `screenshots/` | 22 desktop reference captures (~1190px wide), orientation only |
| `assets/` | D’Matek marks |
| `content-sources/` | Brand doc and sales packaging (wording reference) |
| `support.js`, `image-slot.js` | Runtime the prototype needs to open — not part of the build |

## About the design files
The `.dc.html` files are **design references created in HTML** — working prototypes showing intended look, copy,
motion and behaviour. They are **not production code**. Recreate them in the target codebase’s environment and
patterns (or the stack above if none exists).

Do not port the prototype mechanics: `support.js`, `<x-dc>`, `<sc-for>` (= `.map()`), `<sc-if>` (= conditional),
`{{ hole }}` (= prop/value from `renderVals()`), `<helmet>` (= head tags + global CSS), `style-hover` (= `:hover` rule),
`<image-slot>` (= an image with a placeholder caption until the real photo exists). Styling is inline only for
streaming; use the codebase’s styling system with the same values. Page switching is `useState` in the prototypes;
in production use **real routes**. All data in the prototypes is sample data held in constants at the top of each
logic class — move it behind an API.

To view: serve this folder (`npx serve .`) and open any `.dc.html`. Keep `support.js`, `image-slot.js` and `assets/` alongside.
`dfoundry-source/` and `dsource-source/` hold each prototype split into its template (markup + every inline style) and logic class, for reading.

## Fidelity
**High-fidelity** for all four. Colours, type, spacing, motion and copy are final-intent; copy is verbatim — do not rewrite it.
Anything in `[ SQUARE BRACKETS ]` is a deliberate placeholder. **Keep placeholders visible. Never invent figures,
prices, testimonials, reviews, case studies, certifications, delivery times or response-time claims.** D’Source prices
in the prototype are sample catalogue prices, labelled `[ LIVE PRICES FROM CATALOGUE ]`; production prices come from the catalogue.

---

# Part 3 — D’Source storefront (v7.4)

**Port it exactly — follow `DSOURCE_PORT.md`.** Reference: `DSource v7.4.dc.html`; split source in `dsource-source/storefront-*`.

D’Source is “Commerce by D’Matek”: one front door with two stores.
- **D’Emporium · For Home** — retail checkout (card, transfer, USSD, pay on delivery) or order on WhatsApp. Dark theme.
- **D’Provision · For Business** — quote lists, requests for quote (reply within 4 working hours), order on account (PO + 30-day invoice for approved accounts), free site surveys, Office in a Box.

## Routes (prototype `view` → production route)
| Route | Screen label | Notes |
|---|---|---|
| `/` | D’Source front | Hero, Shop by category, Pick a place, Best sellers, Seam, Device lifecycle, Office in a Box, “Not on the list?” |
| `/emporium` | D’Emporium | Prototype also reads `#/emporium` |
| `/provision` | D’Provision | Prototype also reads `#/provision`; sections `#p-ways #oib #p-kits #p-cat` |
| `/categories`, `/[store]/categories` | All categories | |
| `/[store]/[category]` | Category (`listLabel`) | Filters + sort |
| `/search?q=` | Search | Same list template |
| `/p/[id]` | Product | |
| `/basket` | Cart page | Tabs: Cart (Emporium) · Quote list (Provision) |
| `/track?ref=DS-…` | Track an order | |
| `/account` (+ `?tab=orders|quotes|kits|reviews|biz`) | Account | Signed-out: sign in / create account |
| `/help/[topic]` | Help | Topics include delivery, payment, install |
| `/legal/[terms|privacy|cookies]` | Legal | Text `[ LEGAL TEXT TO BE SUPPLIED BY COUNSEL ]` |
| `/about` | About D’Source | |
| `/office-in-a-box` | Office in a Box | |
| `/site-survey` | Site survey | Success shows reference `SV-XXXXXX` |
| anything else | 404 | “This page isn’t on the shelf.” |

Overlays (not routes, but deep-linkable with `?kit=<id>` is recommended): **Kit overlay**, **Basket drawer** (cart / quote),
**Flows** modal (checkout 2 steps, WhatsApp, enquiry, quote, account 2 steps, review) with a **done** state.

## Chrome (changes with context)
| Context | Page bg | Header | Sub-brand pill |
|---|---|---|---|
| Front | `#F5F1E8` | `rgba(245,241,232,.92)` blur, ink `#06382E` | none |
| D’Emporium | `#0C1411` | `rgba(12,20,17,.92)`, ink `#F2F2EC`, line `#22322B` | “D’EMPORIUM” lime `#A6F000` on `#0C1411` |
| D’Provision | `#F5F1E8` | cream, ink `#06382E` | “D’PROVISION” gold `#D4A637` on `#06382E` |
| List / product / categories / pages | `#FFFFFF` | white `.94`, line `#EEEAE2` | store pill if a store is in context |

- Utility bar above header: store switcher (For Home / For Business; active pill lime for Emporium, gold for Provision) + “Genuine, warranty-backed devices · Delivered nationwide · Installed by D’Matek engineers” + “D’Matek ↗”.
- Header: wordmark (→ `/`), context nav (front: D’Emporium · Home, D’Provision · Business, Build a kit, Office in a Box…; Emporium: category tabs + Kits; Provision: Ways to order, Office in a Box, Kits by place, Catalogue; list/product: that store’s categories), search ⌕, account, **Cart n** (lime on Emporium), **Quote n** (gold on Provision). Category bar below. Below 1060px the nav collapses (`narrow`).
- Search panel: input (Enter searches) + popular: MacBook Air, Mesh, Camera, Omada, Signage.
- Footer: Adire strip (22px) → brand block (“Commerce by D’Matek.”, `[ PHONE ] · [ EMAIL ] · [ WHATSAPP ]`) → columns SHOP / BUSINESS / HELP → “D’SOURCE · D’EMPORIUM · D’PROVISION” · “PART OF D’MATEK ↗”.
- Toast: fixed bottom-centre pill `#06382E`, with gold “View” button that opens the relevant basket.

## Front page
1. **Hero** — eyebrow “COMMERCE BY D’MATEK · DELIVERED NATIONWIDE”, H1 “D’Source” (`clamp(48px,9vw,140px)`), rotating line **“Sourced for the ___ ↗”** (clickable, opens that kit). Words rotate every **2.3s** (paused while a kit is open): home., front gate., weekend., office., classroom., clinic., restaurant., hotel lobby., event hall., student hostel., whole building. Search field + button. Two tilted photo cards (`data-card`) that parallax with the pointer inside the hero (card 1 rotate 5°±7°, card 2 −6°∓6°; disabled when narrow). Captions change with the word.
2. **Shop by category** — two groups (For Home / For Business) of tiles with count; links “All categories →”, “All products →”.
3. **Pick a place. Get the whole kit.** — horizontal rope (`data-line`) of 11 places, drag or scroll; each stop shows photo, name, store, “From ₦…”. Click opens the kit.
4. **Best sellers** — 4 product cards (admin-editable, Part 4 › Content).
5. **Seam** — full-width split scene: D’Provision (business) and D’Emporium (home) halves with a centre line and a **SWIPE** puck. Drag/swipe toward a side (or tap a side, or arrow keys) to tilt the scene (`perspective(1200px) translateX(−p×10%) rotateX(|p|×14°) scale(1+|p|×.35)`), fade in the store overlay, and past the threshold enter that store (store transition when prop `transition` is on). Easing `all .6s cubic-bezier(.2,.7,.2,1)` on release.
6. **Device lifecycle** — “Buy. Set up. Repair. Refresh.” 01–04 + **Device care plan** pilot panel (PilotLabel, standard sentence, “Talk to us about joining the pilot →” opens enquiry pre-filled).
7. **Office in a Box** package block (copy verbatim from the design).
8. **“Not on the list? Tell us the place.”** — “Tell us what you need →” (enquiry) + “Request a business quote”.

## Kits (the core idea)
13 place kits: Home, Front gate, Weekend (chooser → Weekend away / Weekend at home), Student hostel (Emporium);
Office, Classroom, Clinic, Restaurant, Hotel lobby, Event hall, Whole building (Provision). Each kit = room photo +
4 items `[name, note, price, pinX%, pinY%]`.
**Kit overlay:** header “SOURCED FOR THE <place>” + store tag; left = room photo with numbered pins (tap pin → focus card with add/remove);
right = “The <place> kit” rows (tap to toggle, ticks), count + live total (`data-kittotal` animates), primary/secondary actions
(Emporium: add kit to cart / checkout; Provision: add to quote / request quote) and “Save kit to my account”. Entry animation: room scales 1.22→1 with blur clearing.
Product pages show “SEE IT IN THE PLACE — Goes in the <kit> kit.” with the same pins and “Get the whole kit →”.

## Product listing, product page, basket
- **Card:** photo (`data-pimg`; click → product with a FLIP image transition), brand, store tag, name, spec, FREE SET-UP tag (TVs, laptops, phones), price + sub-line, primary CTA (Emporium “Add to cart”, Provision “Add to quote”) + View.
- **List:** breadcrumbs, title/description, sibling category chips, sidebar filters — Store, Category (in search/all), Brand (multi), Price buckets (Under ₦250k · ₦250k–₦750k · ₦750k–₦1.5m · Over ₦1.5m), Free set-up only toggle, Clear. Sort: Featured / Price low→high / high→low. Empty state with enquiry CTA.
- **Product:** gallery + thumbs, store/brand, name, spec, rating line (→ reviews), price, quantity stepper, actions — Emporium: Add to cart · Buy now · Order on WhatsApp · Ask a question; Provision: Add to quote list · Request a quote (back within 4 working hours) · Order on account. Info rows, Overview, Specifications, See it in the place, Reviews (verified purchases, new reviews show **PENDING CHECK**), “You might also need”, sticky bottom bar with name/price/CTA.
- **Basket drawer / cart page:** qty steppers, summary, totals (quote list shows “Total ex. VAT”, lines without a price show “Quoted”), actions into the flows.

## Flows (modal)
| Flow | Steps | Fields |
|---|---|---|
| checkout | 1 Delivery → 2 Payment → done | Full name, phone, delivery address, city/state, set-up needed? · Payment options: Card (Paystack or Flutterwave), Bank transfer, USSD, Pay on delivery. Note on free set-up + `[ DELIVERY TIMES AND FEES TO CONFIRM ]` |
| whatsapp | 1 → opens WhatsApp | Cart written out as a message (`waText`), `[ WHATSAPP NUMBER TO BE ADDED ]` |
| enquiry | 1 → done | Name, email or phone, what do you need? (pre-filled note) |
| quote | 1 → done | Organisation, name, email or phone, delivery location, needed by, set-up, site survey, quote lines, anything else |
| account | 1 Sign in → 2 Order (PO) → done | Work email, password, “No account yet? Apply for one →”; then lines + PO number |
| review | 1 → done | Star rating, title, review, name shown, order reference |
Done state: ✓, title/body per flow, **REFERENCE DS-XXXXXX**, “Track this order →” for orders. Orders/quotes are added to the account and are trackable.

## Other pages
Track (reference input, recent orders, step timeline, `[ LIVE STATUS CONNECTS TO THE ORDER SYSTEM ]`, not-found state) ·
Account (orders, quotes “Sent · reply within 4 working hours”, saved kits, your reviews, business account application: company, CAC, accounts contact/email, phone, expected orders, delivery sites → “Application received … `[ REVIEW TIME TO CONFIRM ]`”) ·
Help (tabbed topics with lists and CTAs) · Legal · About · Office in a Box (What’s included, How it works 01 Understand · 02 Simplify · 03 Solve · 04 Support) · Site survey form · 404.

## Props → config
`startView` (Source | Emporium | Provision) · `transition` (store transition animation, default true) · `adire` (footer strip, default true).

## Content rules
Delivery times/fees, WhatsApp number, phone/email, review time and legal text stay as placeholders until supplied. Reviews only from verified purchases and only after a check. No invented stock levels, ratings or delivery promises. Set-up is free only on TVs (wall mount), laptops and phones (data transfer) and Office in a Box; other installation is a paid add-on.

---

## Shared family pieces used by D’Source
### 4. Adire bands (prop `adire`, default on)
A repeating Adire-inspired tile (cream circles, cross-hatch stripes, gold dots on deep green) used as a textile band.
- Tile: 64×64 SVG, background `#06382E`; cream strokes (`#F5F1E8`, opacity .5, width 1.3): centre cross `M32 0V64M0 32H64`, concentric circles r10/r5 at (16,16) and (48,48), diagonal hatches `M36 4l24 24M36 14l14 14M46 4l14 14M4 36l24 24M4 46l14 14M14 36l14 14`; gold dots (`#D4A637`) r1.8 at circle centres, r2.4 at (32,32) and the four corners. Exact data-URI is in the prototype — reuse it or save it as `adire-tile.svg`.
- **Six Specialists band** (top and bottom of that section): height `clamp(40px,4vw,56px)`, tile `background-size:auto 100%; repeat-x`, 2px gold rules top and bottom, plus a cable threaded through it: path `M0 30 H300 V14 H760 V34 H1140 V18 H1440` drawn three times — deep green 7px (the gap), gold 2px (the cable), cream 3.5px travelling light (`dasharray "110 2290"`, `dmFlow 7s linear infinite`).
- **Page strip** (About under hero; Environment page "At Home" under hero): height `clamp(30px,3.2vw,44px)`, gold rules top and bottom, no cable.
- **Footer strip**: 22px tall, tile at `auto 22px`, 2px gold rule below.
- When `adire=false`, Six Specialists falls back to cable-run dividers and all strips are removed.

### Pilot label (use everywhere a pilot item appears)
- Tag: text **"AVAILABLE AS A PILOT"**, 11px/700/0.16em, `border:1px dashed`, radius **4px** (v3.4), `padding:8px 14px`.
  On cream: text `#06382E`, border `rgba(6,56,46,0.45)`. On dark: text `#D4A637`, border `rgba(212,166,55,0.6)`.
- Container: dashed border panel (`rgba(6,56,46,0.35)` on cream / `rgba(212,166,55,0.5)` on dark), radius 26px–44px.
- Items as outline chips (lighter weight than "available now" chips, which are filled).
- Standard sentence under every pilot list (verbatim): *"Available as a pilot. We're rolling this out with a small
  number of early customers. If it fits what you need, talk to us about joining the pilot."*
- Link: **"Talk to us about joining the pilot →"** → `/contact` with the pilot items pre-filled (see Contact).

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

## Cross-site links
| From | Element | To |
|---|---|---|
| D’Matek footer, Businesses › D’Source, Solutions › Equip my business, orbit D’Source node | “Shop D’Source” | D’Source front (`/`) |
| D’Matek footer, Businesses › D’Foundry, Solutions › Build software, orbit D’Foundry node | “Explore D’Foundry” | D’Foundry home |
| D’Foundry footer | “D’MATEK.COM ↗” | D’Matek home |
| D’Foundry ↔ Droplet case study | | both ways |
| D’Source utility bar “D’Matek ↗”, footer “PART OF D’MATEK ↗”, About “Visit D’Matek ↗” | | D’Matek home |
| D’Source Admin sidebar “View storefront ↗” | | D’Source front |

The D’Matek header has **no** shop button (D’Source lives in the footer and business rows only).

## Storefront ↔ admin contract
| Storefront event | Admin record |
|---|---|
| Checkout / WhatsApp order | Order (stage Received), payment status |
| Request a quote / quote list | Quote (SLA clock starts) |
| Order on account | Order with PO, invoice on delivery (30 days) |
| Business account application | Business account (pending) |
| Book a site survey | Site survey (Requested) + unscheduled job |
| Enquiry / “join the pilot” | Enquiry (type general / repair / pilot / WhatsApp) |
| Review | Review (pending check) |
| Admin Content, Categories, Kits, Products, Zones, Settings | Drive what the storefront shows |
| Engineer completes install | Order → Installed; review request sent |

---

Admin is a separate build. Implement the storefront side of this contract (orders, quotes, surveys, reviews, enquiries, business applications written to the API in these shapes).

## Porting rules
## Porting rules
1. **Markup 1:1.** Keep element order, text and every style value. `style="{{ x }}"`-style holes are live values computed in `renderVals()` — find the key there.
2. **Keep the `data-*` hooks** the behaviour relies on: `data-hero data-card` (hero parallax), `data-line` (drag rope), `data-sm="scene|p|ph|e|eh|line|eo|po|puck"` (Seam), `data-pimg data-pdpimg` (FLIP card→product image), `data-kitroom data-kitpin data-kitrow data-kittotal` (kit overlay animation), `data-adire`.
3. **Behaviour verbatim**: `componentDidMount` (hash start view, narrow < 1060px, hero word interval 2300ms, pointer parallax, rope drag), `smApply`/`smOpen` + pointer handlers (Seam), `kitIn`, `flipIn`, `openKit`, `startFlow`/`done`, `openCat`/`openP`/`doSearch`. Same easings and numbers.
4. **Data → API.** Replace constants with a catalogue/order API. Product: `{ id, store:'emporium'|'provision', cat, brand, name, spec, price, free, img }`. Kit: `{ id, name, short, store, photo, items:[{ productId|name, note, price, pinX, pinY }] }`. Keep IDs stable (`e-laptops-0` style) for best-seller slots.
5. **Payments:** Paystack or Flutterwave for card; transfer/USSD/pay on delivery create an order awaiting confirmation in Admin › Payments. Pay on delivery only in zones where it is switched on (Admin › Delivery zones).
6. **Auth:** customer accounts on the storefront. Staff/admin side is a separate build — expose the API so it can be added later.
7. **Reduced motion:** the prototype disables all animation/transition under `prefers-reduced-motion`; keep that.

## Storefront checklist
- [ ] Context chrome (front / Emporium dark / Provision / white pages) and store switcher
- [ ] Hero rotating “Sourced for the ___” (2.3s, pauses with overlay), opens matching kit; card parallax
- [ ] Pick-a-place rope: drag + scroll, 11 stops
- [ ] Seam swipe: tilt, overlays, threshold entry, keyboard + tap sides
- [ ] Kit overlay: pins, focus card, toggle rows, live total, weekend chooser, save kit, entry animation
- [ ] Listing filters (store, category, brand, price buckets, free set-up) + sort + empty state
- [ ] Product page incl. FLIP image transition, sticky bar, reviews with PENDING CHECK
- [ ] Cart and quote basket (drawer + page), toasts with View
- [ ] All six flows with steps and done state + DS- reference; orders appear in account and track page
- [ ] Account tabs incl. business application; Help, Legal, About, Office in a Box, Site survey (SV- ref), 404
- [ ] Adire footer strip (prop `adire`)

## Verification loop (required)
Serve this folder and run Playwright against the original and your build at **1440×900** and **390×844**.
Capture every route above, the kit overlay for one Emporium and one Provision kit, the Seam at rest and mid-swipe, and each flow step. Save pairs to `/compare` and fix differences before moving on.

## Known gaps in the screenshots
Desktop only — check mobile against the prototype. The 404 page is not captured (open it in the prototype).

