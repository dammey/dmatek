# D'Matek monorepo

This repo is an npm-workspaces monorepo for D'Matek Technology Limited and
its commerce division, Matek Source.

## Layout

```
dmatek/
├── site/                 the Next.js info site for dmatek.com (live)
├── matek-source/
│   ├── web/              future store frontend → source.dmatek.com (not built)
│   ├── backend/          future store backend — stack not decided (not built)
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
  does not talk to Matek Source or any store backend.
- **Matek Source lives entirely in `matek-source/`.** Anything to do with
  the store — storefront UI, catalogue/orders/fulfillment backend, or the
  mobile app — goes in `matek-source/web`, `matek-source/backend`, or
  `matek-source/mobile` respectively. None of it belongs in `site/`.
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
- When Matek Source work starts, give each of `matek-source/web`,
  `matek-source/backend`, and `matek-source/mobile` its own
  `package.json` so npm workspaces picks it up.

## Commands

Run from the repo root (after `npm install`):

- `npm run dev:site` — start the site's Next.js dev server
- `npm run build:site` — production build of the site

Or work inside a workspace directly, e.g. `cd site && npm run dev`.
