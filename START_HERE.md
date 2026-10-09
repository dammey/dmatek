# D’Source handoff (storefront v11.1 + admin v3)

1. `storefront/` — read README.md, then CLAUDE_CODE_PROMPT.txt. Source of truth: `DSource v11.1.dc.html`. Tokens: `tokens.json`.
2. `admin/` — build on the same codebase and API as the storefront. Source of truth: `DSource Admin v3.dc.html`.

Assets (hero photos, logo) are copied separately into `storefront/assets/`.
Serve a folder with `npx serve <folder>` to open its prototype.
