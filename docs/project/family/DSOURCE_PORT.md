# D’Source storefront + Admin — port guide (for Claude Code)

Same approach as D’Foundry: **the prototype is the spec.** Read README Parts 3 and 4, then these files fully.

| File | What it is |
|---|---|
| `dsource-source/storefront-template.html` | All storefront markup + inline styles, in order |
| `dsource-source/storefront-logic.js` | Sample data (`PRODUCTS`, `EMP`, `PROV`, `K` kits, `HERO`, `ETABS`, `PTABS`, `BUCKETS`, `CDESC`, `KITFOR`) + behaviour |
| `dsource-source/admin-template.html` | All admin markup + inline styles |
| `dsource-source/admin-logic.js` | Sample data (`ORDERS`, `QUOTES`, `REVIEWS`, `ACCOUNTS`, `SURVEYS`, `ENQUIRIES`, `CUSTOMERS`, `INVOICES`, `REPAIRS`, `SUPPLIERS`, `POS`, `STAFF`, `JOBS`, `ZONES`, `NOTIFY`, `PERM_*`) + behaviour |
| `DSource v7.4.dc.html`, `DSource Admin v2.dc.html` | Runnable originals — the reference you compare against |

## Porting rules
1. **Markup 1:1.** Keep element order, text and every style value. `style="{{ x }}"`-style holes are live values computed in `renderVals()` — find the key there.
2. **Keep the `data-*` hooks** the behaviour relies on: `data-hero data-card` (hero parallax), `data-line` (drag rope), `data-sm="scene|p|ph|e|eh|line|eo|po|puck"` (Seam), `data-pimg data-pdpimg` (FLIP card→product image), `data-kitroom data-kitpin data-kitrow data-kittotal` (kit overlay animation), `data-adire`.
3. **Behaviour verbatim**: `componentDidMount` (hash start view, narrow < 1060px, hero word interval 2300ms, pointer parallax, rope drag), `smApply`/`smOpen` + pointer handlers (Seam), `kitIn`, `flipIn`, `openKit`, `startFlow`/`done`, `openCat`/`openP`/`doSearch`. Same easings and numbers.
4. **Data → API.** Replace constants with a catalogue/order API. Product: `{ id, store:'emporium'|'provision', cat, brand, name, spec, price, free, img }`. Kit: `{ id, name, short, store, photo, items:[{ productId|name, note, price, pinX, pinY }] }`. Keep IDs stable (`e-laptops-0` style) for best-seller slots.
5. **Payments:** Paystack or Flutterwave for card; transfer/USSD/pay on delivery create an order awaiting confirmation in Admin › Payments. Pay on delivery only in zones where it is switched on (Admin › Delivery zones).
6. **Auth:** customer accounts on the storefront; staff auth + role permissions (Admin › Staff and roles) on admin. Engineer role sees only the engineer app.
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

## Admin checklist
- [ ] Sidebar groups + badges (quotes red when overdue); sticky header search
- [ ] Every module in README Part 4, incl. drawers for order / quote / product / generic records
- [ ] Quote SLA countdown (240 working minutes), amber < 60 min, red overdue
- [ ] Orders status stepper + notify customer; survey and repair stage advancing
- [ ] Installations calendar + assign unscheduled; engineer phone view
- [ ] Kits pin placement (picker stays visible while moving a pin)
- [ ] Suppliers: “Receive stock” disabled until quantity entered
- [ ] Roles permission grid with sticky header row; Owner locked
- [ ] Bulk upload preview (new SKUs hidden, existing updated)
- [ ] Content / Categories / Zones / Settings publish to the storefront

## Verification loop (required)
Serve this folder and run Playwright against the originals and your build at **1440×900** and **390×844** (admin: 1440×900 and 1024×768).
Storefront: capture every route in README Part 3, the kit overlay for one Emporium and one Provision kit, the Seam at rest and mid-swipe, and each flow step.
Admin: capture every module and each drawer type. Save pairs to `/compare` and fix differences before moving on.
