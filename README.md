# D'Matek

Monorepo for D'Matek Technology Limited's public site, D'Foundry (its
custom-software business), and D'Source, its commerce division.

## Layout

```
dmatek/
├── site/                 the Next.js info site for dmatek.com
├── d-foundry/             D'Foundry's own site, a separate Next.js app
├── d-source/
│   ├── web/              future store frontend → source.dmatek.com
│   ├── backend/          store backend — Supabase Postgres, schema drafted
│   └── mobile/           future, not started
├── packages/
│   └── shared/           brand tokens, fonts, shared UI — empty for now
├── docs/                 chats/ and project/ design handoff material
├── package.json           npm workspaces root
├── .gitignore
├── CLAUDE.md
└── README.md
```

See `CLAUDE.md` for what belongs in each folder.

## Getting started

```bash
npm install
npm run dev:site       # starts the site at localhost:3000
npm run build:site     # production build of the site
npm run dev:foundry    # starts D'Foundry at localhost:3000 (run one at a time, or pass -p)
npm run build:foundry  # production build of D'Foundry
```

`d-source/*` (except `backend`, which has a Supabase project and schema)
and `packages/shared` are placeholders — see the `README.md` in each for
status.

## Workspaces

This repo uses npm workspaces (`site`, `d-foundry`, `d-source/*`,
`packages/*`). Run `npm install` once at the root; it installs and links
all workspaces.
