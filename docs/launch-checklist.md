# Launch checklist: moving from *.vercel.app to the real domains

Temporary test settings that must change (or go) when dmatek.ng,
source.dmatek.ng and foundry.dmatek.ng are attached in Vercel.

## When the domains go live

| Where | Setting | Now (testing) | Change to |
|---|---|---|---|
| dmatek-website | `ENQUIRY_ALLOWED_ORIGINS` | `https://dfoundry.vercel.app` | **Delete it.** Any `https://*.dmatek.ng` origin is already allowed in code. |
| dmatek-website | `NEXT_PUBLIC_DSOURCE_URL` (or `NEXT_PUBLIC_SOURCE_URL`) | `https://dsource-web.vercel.app` | `https://source.dmatek.ng` |
| dmatek-website | `NEXT_PUBLIC_DFOUNDRY_URL` (or `NEXT_PUBLIC_FOUNDRY_URL`) | `https://dfoundry.vercel.app` | `https://foundry.dmatek.ng` |
| dfoundry | `NEXT_PUBLIC_DMATEK_URL` | `https://dmatek-website.vercel.app` | `https://www.dmatek.ng` |
| dsource-web | `NEXT_PUBLIC_DMATEK_URL` | `https://dmatek-website.vercel.app` | `https://www.dmatek.ng` |
| dfoundry | `NEXT_PUBLIC_SITE_URL` | (default) | `https://foundry.dmatek.ng` |
| dsource-web | `NEXT_PUBLIC_SITE_URL` | (default) | `https://source.dmatek.ng` |

Redeploy each project after changing settings (they apply to new
deployments only). Check `www.dmatek.ng` redirects/aliases correctly (the
site's canonical URLs use `https://www.dmatek.ng`).

## Email (Resend)

- [ ] Verify `dmatek.ng` in Resend (DNS records at the registrar).
- [ ] Store the key as `RESEND_API_KEY` (the code also accepts `RESEND_KEY_TEST`).
- [ ] Delete `RESEND_FROM` so the sender is `noreply@dmatek.ng`.
- [ ] `RESEND_TO_EMAIL` points at a mailbox that exists and is read daily.
- [ ] Unused `RESEND_*` settings on dfoundry and dsource-web can be deleted
      (their forms send through the main site).
- [ ] Send one real enquiry from each form and confirm it arrives (not in spam):
      main contact, Infrastructure, Cloud, IléMesh, Assurance, D'Foundry.

## Other launch items

- [ ] `NEXT_PUBLIC_GA_ID` on all three public projects, and Search Console.
- [ ] Anything on `vercel.app` stays `noindex` (automatic); confirm the real
      domains are indexable.
- [ ] D'Foundry client names: shown by default; `NEXT_PUBLIC_FOUNDRY_CLIENT_WORK=hidden` takes them down.
- [ ] Real Droplet case-study content (timeline, results, quote) so the hidden blocks can appear.
