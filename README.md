# D'Matek

Monorepo for D'Matek Technology Limited's public site and Matek Source, its
commerce division.

## Layout

```
dmatek/
├── site/                 the Next.js info site for dmatek.com
├── matek-source/
│   ├── web/              future store frontend → source.dmatek.com
│   ├── backend/          future store backend — stack not decided yet
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
npm run dev:site     # starts the site at localhost:3000
npm run build:site   # production build of the site
```

`matek-source/*` and `packages/shared` are placeholders — see the
`README.md` in each for status.

## Workspaces

This repo uses npm workspaces (`site`, `matek-source/*`, `packages/*`).
Run `npm install` once at the root; it installs and links all workspaces.
