# D'Matek monorepo

This repo is an npm-workspaces monorepo for D'Matek Technology Limited and
its commerce division, D'Source.

## Layout

```
dmatek/
├── site/                 the Next.js info site for dmatek.com (live)
├── d-foundry/            D'Foundry's own site (BUILD IT) — its own Next.js app (live)
├── d-source/
│   ├── web/              future store frontend → source.dmatek.com (not built)
│   ├── backend/          store backend — Supabase Postgres, schema drafted (not built out)
│   └── mobile/           future mobile app (not started)
├── packages/
│   └── shared/           brand tokens, fonts, shared UI (empty for now)
├── docs/
│   ├── chats/            design-handoff chat transcripts
│   └── project/          Claude Design handoff bundle (.dc.html prototypes, assets)
├── package.json           npm workspaces root
└── .gitignore
```

## What lives where

- **`site/`** is the marketing/info site only. It has **no backend** beyond
  its own `app/api/contact` route (a contact-form mailer via Resend). It
  does not talk to D'Source or any store backend.
- **`d-foundry/`** is D'Foundry's own site (D'Matek's custom-software
  business) — a separate Next.js app with its own fonts/palette/domain, not
  a page inside `site/`. It cross-links with `site/` (the "D'Foundry" node
  on the home orbit and the Businesses accordion link out to it) via the
  `NEXT_PUBLIC_DFOUNDRY_URL` env var in `site/`, and links back to
  `site/` via `NEXT_PUBLIC_DMATEK_URL` in `d-foundry/`.
- **D'Source lives entirely in `d-source/`.** Anything to do with
  the store — storefront UI, catalogue/orders/fulfillment backend, or the
  mobile app — goes in `d-source/web`, `d-source/backend`, or
  `d-source/mobile` respectively. None of it belongs in `site/`.
- **`packages/shared`** is for code actually shared across two or more
  workspaces (brand tokens, fonts, common UI). Don't put site-only or
  store-only code here.
- **`docs/`** is reference material from the original Claude Design
  handoff (chat transcripts + the `.dc.html` prototypes/assets they
  produced). It documents design intent; it is not application code and
  is not built or deployed.

## Rules for new code

- **New code must go in the correct workspace folder — never at the repo
  root.** The repo root only holds the workspaces config, root
  `.gitignore`, `CLAUDE.md`, and `README.md`.
- Site-specific dependencies, config, and env vars belong in `site/`
  (its own `package.json`, `.env.example`, `next.config.ts`, etc.) —
  don't hoist them to the root beyond what npm workspaces already does.
- When D'Source work starts, give each of `d-source/web`,
  `d-source/backend`, and `d-source/mobile` its own
  `package.json` so npm workspaces picks it up.

## Commands

Run from the repo root (after `npm install`):

- `npm run dev:site` — start the site's Next.js dev server
- `npm run build:site` — production build of the site
- `npm run dev:foundry` — start D'Foundry's Next.js dev server
- `npm run build:foundry` — production build of D'Foundry

Or work inside a workspace directly, e.g. `cd site && npm run dev`.

## A known Reveal/IntersectionObserver gotcha

If you add a scroll-reveal variant that hides content via `clip-path`
(e.g. `clip-path: inset(100% ...)`) on the same element being observed,
IntersectionObserver can permanently report zero intersection for it —
the element self-reports as having no visible area, so it can never be
detected entering the viewport, and the reveal never fires. Hide reveal
content with `opacity`/`transform` only, never `clip-path`, on the
observed element itself. (Hit this in `d-foundry`'s `mask` variant —
see its `components/Reveal.tsx` and `app/globals.css`.)
