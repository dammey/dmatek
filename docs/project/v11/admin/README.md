# Handoff: D’Source Admin v3

Internal back office for the D’Source storefront (dsource.dmatek.ng/admin). Desktop-first, usable from 1024px.

## What’s in this folder
| Path | What it is |
|---|---|
| `DSource Admin v3.dc.html` | Runnable prototype — **the source of truth**. Serve the folder (`npx serve design_handoff_dsource_admin`) and open it. |
| `source/admin-template.html` | All markup + every inline style, in order (for reading) |
| `source/admin-logic.js` | Sample data + all behaviour (for reading) |
| `storefront-reference/storefront-logic.js` | Storefront data shapes (products, kits, orders, quotes) the admin manages — reference only |
| `screenshots/` | Desktop reference captures, orientation only |
| `support.js`, `image-slot.js` | Runtime the prototype needs to open — not part of the build |

## Build order
If the storefront (`design_handoff_dsource`) is already built, build the admin **on the same codebase and API** — same catalogue, orders, quotes, customers. If it isn’t, build the API first from the shapes in `storefront-reference/` and the contract below, then the admin.

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
`source/` holds the prototype split into its template (markup + every inline style) and logic class, for reading.

## Fidelity
**High-fidelity** for all four. Colours, type, spacing, motion and copy are final-intent; copy is verbatim — do not rewrite it.
Anything in `[ SQUARE BRACKETS ]` is a deliberate placeholder. **Keep placeholders visible. Never invent figures,
prices, testimonials, reviews, case studies, certifications, delivery times or response-time claims.** D’Source prices
in the prototype are sample catalogue prices, labelled `[ LIVE PRICES FROM CATALOGUE ]`; production prices come from the catalogue.

---

# Part 4 — D’Source Admin (v2)

**Reference:** `DSource Admin v3.dc.html`; split source in `dsource-source/admin-*`. Internal tool, desktop-first (usable from 1024px), Manrope, sample data throughout (header shows a dashed **SAMPLE DATA** tag — remove in production).

## Layout
- **Sidebar** (deep green `#06382E`, cream text): wordmark “D’Source” + “ADMIN”, grouped nav with count badges (gold; Quotes badge red when any are overdue), footer “View storefront ↗” (gold) and “Signed in as [ ADMIN NAME ]”. Active item `rgba(212,166,55,.22)`, weight 800.
- **Sticky header** (cream `.94` + blur): title (26px/800) + subtitle, SAMPLE DATA tag, search pill (placeholder per module).
- **Drawer** from the right (`dsIn` 24px slide) for order, quote, product and generic records. **Toast** for confirmations.

## Modules (nav groups → route `/admin/<id>`)
| Group | Module (id) | Subtitle | What it does |
|---|---|---|---|
| OVERVIEW | Dashboard (dash) | What needs you today | KPI tiles (click through), Needs attention list, Recent orders |
| | Reports (reports) | Sample data until the order system is connected | KPI tiles + bar charts |
| SALES | Orders (orders) | Home orders and business orders on account | Filter chips by stage; table: reference, date, customer/city, store tag, items, total, payment, status pill, Open → drawer (meta, lines, status stepper, installation engineer, internal note, “Send status update to customer”) |
| | Quotes (quotes) | Reply within the promised working hours | SLA **240 min** (4 working hours); reply-due column counts down, amber under 60 min, red “Overdue by …”. Drawer: unit prices ex. VAT per line, volume discount %, sums, note, send |
| | Payments (payments) | Confirm transfers and pay on delivery, refund when needed | Generic table + actions |
| | Invoices (invoices) | Business accounts on 30-day invoice | Unpaid count badge |
| | Customers (customers) | Everyone who has bought, quoted or applied | |
| OPERATIONS | Installations (schedule) | Engineer calendar for set-ups, surveys and collections | Week grid engineer × day, job chips coloured by type; “Not yet scheduled” list with Assign |
| | Returns and repairs (repairs) | From collection to returned | Stages: Requested → Collected → Diagnosing → Fixing → Ready → Returned |
| | Site surveys (surveys) | Free surveys booked from the storefront | Engineer select; tap status to advance: Requested → Date confirmed → Surveyed → Quote sent |
| | Inventory (inventory) | Stock on hand, reserved, and reorder levels | Low-stock badge |
| | Suppliers and POs (suppliers) | Where stock comes from | Tabs suppliers / POs; “Receive stock” disabled until a quantity is entered |
| | Engineer app (engineer) | | Phone-frame preview of the engineer’s day: jobs, address, checklist per job type, Call customer, complete → order becomes “Installed” and the customer gets a review request. “Preview as” engineer select |
| CATALOGUE | Products (products) | The catalogue on D’Emporium and D’Provision | Category filter, count, Add product; table with live toggle and Edit → product drawer (photo, fields, category, toggles) |
| | Categories (cats) | What customers see in the category bar | Per store: reorder ↑↓, show/hide, add. Order = storefront category bar order |
| | Kits (kits) | Place kits on the storefront | Kit list; room photo; click photo to place the selected item’s pin (item picker stays visible while moving a pin); live toggle |
| | Bulk upload (bulk) | Add or update products from a spreadsheet | CSV/XLSX; new SKUs added hidden; existing SKUs update price and stock; preview with per-row check |
| | Discounts (discounts) | Only for real offers | |
| STOREFRONT | Content (content) | Front page words, best sellers and help text | Hero words (add/remove), 4 best-seller slots, text fields; “Publish content” |
| | Reviews (reviews) | Check each review against a real purchase | Filter chips; Approve / Reject pending |
| | Delivery zones (zones) | Fees, times and pay on delivery by zone | Editable rows: zone, fee, time, pay-on-delivery toggle, installation toggle; add/remove; Save and publish. Seed: Lagos, Abuja (FCT), Rivers, Oyo, Kano, Enugu, Other states |
| | Notifications (notify) | Messages to customers and alerts to staff | Cards: name, trigger, channels, editable body, variables, on/off, Send test |
| PEOPLE | Business accounts (accounts) | Approve accounts for 30-day invoice | Card per application; credit limit (₦); Approve · 30-day invoice / Decline |
| | Enquiries (enquiries) | Repairs, pilot interest, WhatsApp and general | Filter chips; toggle handled. **Pilot interest = the pilot demand log** |
| | Staff and roles (roles) | Who can see and change what | Tabs Users / Permissions / Activity log. Roles: Owner, Sales, Warehouse, Engineer, Support. Permission grid = 25 sections × roles (header row sticky while scrolling sideways); Owner cannot be removed |
| SYSTEM | Settings (settings) | Delivery, payment, policies and contact details | Fills every `[ TO CONFIRM ]` on the storefront; Save and publish |

## Status colours
Order stages (`STAGES`, pill bg / ink): Received `#EFEADC/#06382E` · Confirmed `#FFF1CC/#7A5B00` · Packed `#E3EEE8/#1F5E48` · Out for delivery `#DCEBFF/#1B4A8A` · Delivered `#D9F0E3/#1F7A5A` · Installed `#06382E/#D4A637`.
Job types: install `#E3EEE8/#1F5E48` · survey `#DCEBFF/#1B4A8A` · Office in a Box `#FFF1CC/#7A5B00` · repair `#FDE7E4/#B42318`.
Store tags: D’EMPORIUM `#A6F000` on `#0C1411` · D’PROVISION `#D4A637` on `#06382E`. Danger `#B42318`, success `#1F7A5A`, amber `#B25E00`.
Filter chips: on `#06382E`/cream, off white with `rgba(6,56,46,.18)` border, 999px.

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

## Porting rules
## Porting rules
1. **Markup 1:1.** Keep element order, text and every style value. `style="{{ x }}"`-style holes are live values computed in `renderVals()` — find the key there.
2. **Keep the `data-*` hooks** the behaviour relies on: `data-hero data-card` (hero parallax), `data-line` (drag rope), `data-sm="scene|p|ph|e|eh|line|eo|po|puck"` (Seam), `data-pimg data-pdpimg` (FLIP card→product image), `data-kitroom data-kitpin data-kitrow data-kittotal` (kit overlay animation), `data-adire`.
3. **Behaviour verbatim**: `componentDidMount` (hash start view, narrow < 1060px, hero word interval 2300ms, pointer parallax, rope drag), `smApply`/`smOpen` + pointer handlers (Seam), `kitIn`, `flipIn`, `openKit`, `startFlow`/`done`, `openCat`/`openP`/`doSearch`. Same easings and numbers.
4. **Data → API.** Replace constants with a catalogue/order API. Product: `{ id, store:'emporium'|'provision', cat, brand, name, spec, price, free, img }`. Kit: `{ id, name, short, store, photo, items:[{ productId|name, note, price, pinX, pinY }] }`. Keep IDs stable (`e-laptops-0` style) for best-seller slots.
5. **Payments:** Paystack or Flutterwave for card; transfer/USSD/pay on delivery create an order awaiting confirmation in Admin › Payments. Pay on delivery only in zones where it is switched on (Admin › Delivery zones).
6. **Auth:** customer accounts on the storefront; staff auth + role permissions (Admin › Staff and roles) on admin. Engineer role sees only the engineer app.
7. **Reduced motion:** the prototype disables all animation/transition under `prefers-reduced-motion`; keep that.

Staff auth with role permissions (Staff and roles module). The Engineer role sees only the engineer app. Every write is checked server-side against the role, not just hidden in the UI.

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
Serve this folder and run Playwright against the original and your build at **1440×900** and **1024×768**.
Capture every module, the order / quote / product drawers, the bulk-upload preview and each Staff and roles tab. Save pairs to `/compare` and fix differences before moving on.

## Screenshots
- `screenshots/` — 01–32, one per module plus order / quote / product drawers, bulk-upload preview and the three Staff and roles tabs
Static captures at ~1190px wide. Behaviour (drag, pins, drawers, toasts) must be checked in the prototype.
