# Handoff: D'Source redesign (v11.1)

## Overview
D'Source is a Lagos technology sourcing shop, part of D'Matek Technology Limited. It is a reseller: it buys from vetted suppliers after an order, checks every item, delivers, and (for business equipment) installs. Positioning: "We sell trust, not devices." The redesign replaces the For Home / For Business toggle and all D'Emporium branding with one store, one catalogue, and two entry journeys ("For you" and "For your business" / Provision).

## About the Design Files
`DSource v11.1.dc.html` is a **design reference built in HTML**: a prototype showing intended look and behavior. It is not production code. Recreate it in the target codebase (the existing Next.js app, stored on GitHub) using its established patterns and libraries. Do not ship the HTML. Open the file in a browser to see every page; set the `reviewBar` tweak off to see only the real site.

## Fidelity
**High-fidelity.** Final colours, type, spacing, motion and copy. Placeholders marked `[ ... ]` and empty photo slots are intentional (see Assets).

## Pages (reachable from the site; the black review bar is a design aid only)
Home, Category (also Search results), Product (3 versions), Cart / Quote, Checkout, Order confirmation + receipt, Tracking, "We'll source it" request, Pickup repair booking, Provision (business hub), Account, Guarantee, Help, Terms. Designer-only pages: States, Tokens.

Navigation: header = Shop, For your business, We'll source it, Pickup repairs, Help, Account; Quote and Cart buttons side by side. Footer = Account, Track order, Guarantee, Terms, Help.

## Brand and tokens
See `tokens.json`. Default palette "Cream + forest + terracotta": cream bg `#F5F1E8`, forest `#06382E` (deep), `#28705A` (mid), tints `#EFEADC` / `#E3DCC8`, ink `#06382E`, line `#E6E2D8`, gold `#D4A637` (accent only: kickers, rope line, adire band, grade pills, highlights), **terracotta `#C4481C` = the single buy colour** (white text) used only for primary actions (Buy, Checkout, Request quote, Send request, hero source button). Failed-inspection red `#9E1B32`. Pass/success green `#1B7A52` / mint `#9BE6C5` on dark. Four alternative palettes exist as a tweak.
Fonts: Manrope 400-800 (all text), IBM Plex Mono 500/600 for small caps labels (11px, letter-spacing .12-.2em). Headings: weight 800, letter-spacing -.04 to -.07em, line-height .88-.95. Radius: 6, 10, 14, 18-24 (cards), 99 (pills). Spacing: 4, 8, 12, 16, 24, 32, 48. Shadow: `0 2px 8px rgba(0,0,0,.08)` and `0 20px 44px rgba(6,56,46,.14)` (hover lift).
Adire pattern: 64px SVG tile (forest ground, cream strokes, gold dots) used as a 22px band at the top of the footer and a 10px strip under the header and above the kit selector. Toggle via `adire` prop.

## Promises (use these exact values everywhere; add no others)
- Returns: 7 days.
- D'Source warranty: 1 month new, 7 days used.
- Manufacturer warranty: claimed by the customer directly with the manufacturer or authorised service centre. Footnote on product pages, confirmation, receipt, invoice, guarantee, terms.
- Sourcing reply, personal devices: within 1 hour, 8am-8pm daily (after 8pm: from 8am next morning). Always show the hours with the 1-hour promise.
- Quotes and business sourcing: within 24 hours.
- Delivery: Lagos within 24 hours, outside Lagos within 48 hours.
- Pay on delivery: available, subject to terms and conditions (link to Terms).
- Inspect on delivery; if it fails, we take it back and the customer pays nothing.
- Contact: phone and WhatsApp 07058071768, hello@dmatek.ng.
Remove from the old site: "Delivered nationwide", "quotes in 4 working hours", the Home/Business toggle, all D'Emporium branding.

## Screens

### Home
1. **Hero**: cream, headline "Sourced for the [place]" (clamp 64-112px desktop, 52px mobile; weight 800). Place cycles home, office, server room, shop, hotel, classroom every 3.2s. Hero images rotate per place with the word: `assets/hero-home.png`, `hero-office.png`, `hero-server-room.png`, `hero-shop.png`, `hero-hotel.png`, `hero-classroom.png`. All share a dark green left wall and warm gold light so they blend into the deep-forest hero (radial #14503B to #0B3326); the image fades in from the left edge. New photo wipes in left to right over the previous (clip-path, 1s, cubic-bezier(.7,0,.2,1)); the word wipes in too (0.8s). Rotation pauses on hover/tap, off under prefers-reduced-motion (note shown). Tap background or the underlined word or "See what goes in a [place]" scrolls to the kit selector with that place selected. Under headline: "Every item checked before it reaches you." + three icon proofs (every item checked, inspect on delivery, 7-day returns). Search input (Enter or button goes to Search results) and button "Can't find it? We'll source it" (terracotta) + line "Reply within 1 hour, 8am-8pm daily". Gold animated flow line under hero. Hero photo has slight scroll parallax.
2. **Category tiles**: 10 categories (Phones & Tablets, Laptops & Computers, Accessories & Audio, Networking & Wi-Fi, Internet Devices, Servers & Storage, Printers & Office, Security & CCTV, Power, TV & Displays), photo-slot tile with number; click opens Category.
3. **Entry swipe ("seam")**: see Interactions.
4. **Best sellers**: mix of personal and business items with price or "price on quote", condition, "Checked" mark.
5. **Pinned "How we check"** (forest): section is 300vh tall with a sticky inner panel. Scroll progress drives a big battery % count-up to 91 and four check rows moving from "Checking..." to "Pass" (IMEI clean, battery health, no replaced parts, genuine charger), with a progress bar and a photo slot of a real device being verified. Headline "We sell trust, not devices."
6. Delivery strip (icons: Lagos 24h, outside Lagos 48h, pay on delivery), delivered-moments photo grid (captions "Tolu, Yaba · iPhone 13"), pickup repairs card, lifecycle chips Buy / Set up / Repair / Refresh, device care plan pilot box (clearly labelled), kit selector (place rope below), Office in a Box block, "Can't find it? We'll source it" block.
7. **Place rope** (kit selector): tilted cards hanging from a gold line, one per place; click selects the place and updates the kit list ("What goes in a [place]", price on quote, Add kit to quote).

### Category / Search results
Mono kicker (CATEGORY or SEARCH RESULTS), huge title, one-line intro, filter rows that work: Condition (All, New, UK-used, Grade A, B, C), Buying (All, Buy now, Quote), Brand (derived from items), Sort (Featured, Price low-high, high-low). Result count. Tiles: photo slot, condition badge, brand, name, price or "Price on quote", "Checked · [result]", mode. Hover lifts 5px. Loading = skeleton shimmer for 500ms on filter change. Empty state "Nothing listed for that right now" ending in "We'll source it" + WhatsApp. Source strip always visible.

### Product (3 versions: a new phone, b used laptop, c quote-based server)
Two columns (sticky buy column on desktop). Photo slot (b adds 3 real-unit photo slots: marks included). Kicker, name, price + "confirmed at checkout" (a, b) or "from / price on quote" (c). b shows condition grade with one-line definitions. c adds spec summary, "Installed and configured by D'Matek engineers" checkbox, quantity + notes, "Add to quote, quote within 24 hours". Guarantee summary: inspect on delivery, 7-day returns, D'Source warranty (1 month new / 7 days used by condition), delivery line, manufacturer-warranty footnote, link to Guarantee. "Buying 5 or more? Get a bulk quote" link adds the item to a business quote. **Checked by D'Source panel**: ONE reusable component taking a category checklist (phones: IMEI, battery %, replaced parts; laptops: battery cycles, screen/keyboard/ports, genuine charger, specs match; networking/servers/storage/printers: genuine unit from verified channel, serial verified, manufacturer warranty status, model and specs as quoted, firmware updated). Rows animate "Checking..." to result as the panel scrolls into view. Then expandable specs and verified-purchase reviews.
Tile to product transition: a ghost box grows from the tile photo to the product gallery (0.7s, cubic-bezier(.2,.7,.2,1)).

### Cart / Quote
Tabs Cart and Quote. Cart: images, condition, warranty line, "Checked before delivery", summary with guarantee reminder, Checkout. Quote list: items, qty, optional installation checkbox, notes, "We'll send your quote within 24 hours", Request quote, then confirmation state.

### Checkout
Three steps Address, Payment, Confirm with progress bars. Payment: pay online or pay on delivery (link to Terms). Plain statement: "If it fails inspection at your door, we take it back and you pay nothing." Ends on Confirmation.

### Confirmation + receipt, Tracking
Receipt lists each item with its D'Source warranty period and the manufacturer warranty footnote. Tracking stages: Ordered, Sourced, Checked, Out for delivery, Delivered. The Checked stage shows that unit's photo/video slot and results (battery, IMEI/serial).

### We'll source it
Describe item (or upload photo/spec sheet), quantity, budget; Personal vs Business toggle sets the promise; confirmation reflects time of day ("We'll reply within the hour" during hours, "We'll reply from 8am tomorrow" after 8pm).

### Pickup repair, Provision, Account, Guarantee, Help, Terms
Repair: describe, book pickup, diagnosis and quote before any work, approve or decline, repaired and returned; one personal device or several company devices. Provision: service-led hub (bulk purchase, IT room and server setup, Wi-Fi and network installation, security and CCTV installation, repairs for company devices, Office in a Box, free site survey, business account with invoicing application form). Account: Personal (orders, tracking, repairs, saved items, warranty end dates) and Business (quotes, orders, invoices, repair tickets, reorder). Guarantee: plain-language page (what we check per category, inspect on delivery, 7-day returns, D'Source warranty, manufacturer warranty explained, what isn't covered, what happens if something goes wrong, how to reach a human, hours 8am-8pm). Terms contains full manufacturer-warranty wording.

## Interactions and behavior
- **Swipe entry (home)**: scene with "For you" (cream, left) and "For your business / Provision" (forest, right), puck at bottom. Drag progress p = dx / min(width*0.28, 300), clamped +-1.15. While dragging: scene transform `perspective(1200px) translateX(-p*10%) rotateX(|p|*14deg) scale(1+|p|*0.35)`; the full-screen "For you" (cream) or "Provision" (forest) overlay fades in with opacity |p|; the opposite side's content opacity 1 - 0.85*p and the target side scales 1 + 0.12*p; puck shows LET GO at |p| >= 1. Release at |p| >= 1 holds the overlay then navigates (Category or Provision, ~650ms) and fades the overlay out. Release below threshold springs back (0.6s). Tap a side or press Left/Right arrows plays the same fade. Two always-visible buttons below ("Shop devices", "Explore Provision") are the fallback; swipe is never the only way in.
- **Page transitions**: each page fades up 24px over 0.55s; scroll resets to top.
- **Scroll reveals**: tiles and sections fade/translate up 30px (0.8s) as they enter. Disabled for reduced motion.
- **Hover/press**: tiles lift; buttons scale .97 on press.
- **Loading**: skeleton shimmer on category filter change.
- **Responsive**: mobile-first. The prototype previews a 390px column and a full-width desktop view; build the real site fluid.

## State management
Current page and category, search query, filters (condition, buying mode, brand, sort), loading flag, hero place index and paused flag, kit-selector place, cart and quote lists, checkout step and payment choice, tracking stage, sourcing form (type, time of day), repair step, account tab, swipe progress (drag only, DOM-driven).

## Assets
No real photography exists yet. Every `image-slot` (hero place photos, category tiles, rope cards, delivered moments, product and used-unit photos, Checked photo, Office in a Box) is a labelled placeholder for real photos of real people, deliveries, devices and installations. No stock photos. Icons are a custom inline SVG set (seal, inspect, returns "7", truck, warranty badge, banknote, source, wrench, clock): 24px viewBox, 1.6 stroke, round caps, gold dot on the seal.

## Brand assets
`assets/dsource-logo.png` (DS cart mark, forest green and gold, wordmark and "COMMERCE BY D’MATEK"). It is a low-res crop on an off-white background: supply a transparent SVG/PNG before launch. Tagline: "TECH YOU NEED, DELIVERED." (header logo, hero kicker, footer).

## Gift block
Home section "Looking for the perfect gift? We'll source it." uses `assets/dsource-hero.png` (phone, laptop, watch, headphones) on a forest card; CTA "Request a gift" opens the source request. The header is dark green on Home and cream elsewhere.

## Files
- `DSource v11.1.dc.html` (the design; open in a browser)
- `support.js`, `image-slot.js` (runtime needed to open the file)
- `tokens.json`
- `CLAUDE_CODE_PROMPT.txt`
Earlier explorations are not included.
