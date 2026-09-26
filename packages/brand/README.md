# @dmatek/brand

Shared brand package for the D'Matek family (D'Matek, D'Foundry, D'Source
storefront, D'Source Admin): colour tokens, the shared Manrope font config,
and the two cross-product components — `AdireBand` and `PilotLabel`.

Source-only (no build step) — consumed via each app's own `transpilePackages`
config in `next.config.ts`.

- `tokens.ts` — `brand.color.*`, `brand.radius.*`
- `fonts.ts` — `manrope` (D'Matek, D'Source storefront, D'Source Admin; D'Foundry has its own fonts)
- `AdireBand.tsx` — the Adire-inspired tile band (`strip` / `footer` / `specialists-with-cable` variants)
- `PilotLabel.tsx` — the "AVAILABLE AS A PILOT" panel + standard sentence (`pilotNote`)
- `keyframes.css` — `dmFlow`, needed by `AdireBand`'s travelling light (import only if your app doesn't already define it)
