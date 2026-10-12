# Website content management: scope

Goal: staff manage the marketing sites' content from the **existing D'Source
admin** (`d-source/admin`), with no code changes and no redeploys. The admin
already has Products, Categories, Content, Reviews, Enquiries, Roles and
Accounts modules, so this adds a "Websites" section in the same design.

Sites covered: dmatek.ng (main site, including /infrastructure, /cloud,
/ilemesh, /assurance) and D'Foundry. D'Source's storefront is already managed
by the existing admin modules.

## Rules every module follows

- **Draft, then publish.** Every item has a status: Draft / Published.
  Only Published appears on a site. Nothing goes live by accident.
- **Nothing invented.** A required "Approved by client" tick (and date) on
  case studies and testimonials. Unticked items never publish. This matches
  the existing `approved` / `verified` flags in the code.
- **Hide when empty.** If a section has no published items, the site hides
  the section. No placeholders, no "coming soon".
- **Reorder** by drag where order matters (work cards, testimonials).
- **Roles.** Reuse the existing Roles module: Editor can draft, Publisher can
  publish, Admin can do both and manage accounts.
- **Image upload** (the admin already handles product images): JPG/PNG/WebP,
  alt text required.
- **Audit trail.** Who changed what and when (reuse the admin's existing log
  if there is one).

## Modules (priority order)

### 1. Enquiries inbox (website enquiries)  *highest value*
Today website enquiries only arrive by email. Store them so staff can track
them. The enquiry email already says "track it to qualified, declined,
proposal or resolved".
- List: reference (DM-XXXXX), date, name, contact, source page, source CTA, status.
- Detail: every field submitted (name, organisation, phone, email,
  environment, closest starting point, what they need, location, message).
- Status: New → Qualified / Declined / Proposal sent / Resolved. Owner
  (assigned staff), internal notes, filter by status/source, search by reference.
- Email notification stays as is.

### 2. Case studies and work (main site /work, home "Proof")
Fields: sector label, tenure label, title, before, what we did, divisions
involved, outcome ("after"), photo + caption, one-line quote, attribution,
Approved by client (required to publish).

### 3. Testimonials (About "Why clients stick around")
Fields: quote text, attribution, tone (light/dark), Verified (required to publish).

### 4. D'Foundry work and products
- **Client work cards:** client name, one-line description, optional link,
  order, Approved (required to publish). Currently: Omatek, Valour and
  Valiant, Saratu's Atelier, WeddCraft (and Droplet / Blessed Water).
- **D'Matek-owned products:** name, number, description, status
  (Live / In development), order. Currently: QADPAY, Romora.
- **Droplet case study page:** timeline, launch, results, before-story,
  process, quote, images. Fields stay empty until real content is supplied.

### 5. Insights (main site /insights)
Fields: title, topic (Connectivity, Security, Power, Operations, Data and AI),
summary, body (rich text), cover image, author, date, slug. Draft / Published.

### 6. Environments / solutions (main site /solutions/[env])
Edit existing pages: headline, supporting line, problems list, "what we do
now" list, packages, call to action, hero image, deliver steps. Status:
Ready / Draft (only Ready appear live; currently Hospitality, Education,
Real Estate, Enterprise, Retail are in code with different sign-off states).

### 7. Business pages copy (/infrastructure, /cloud, /ilemesh, /assurance)
These are large designed pages. Phase 2 of this work, not the first
build: expose only the plain-text blocks (headlines, descriptions, lists, CTA
labels). Layout stays in code. Needs a careful look before committing.

### 8. Site settings
Contact phone, WhatsApp number, email, address(es), social links, opening
hours (only if supplied), announcement banner (optional, with start/end
date), and the on/off switch for D'Foundry client work.

### 9. Media library
One place to upload, search and reuse images across all modules, with alt
text and "used in" list. Also keep the manufacturer / user-supplied-images-only rule.

## Out of scope (stays in code)

Page layouts and animations, brand tokens, legal wording, pricing logic,
the design of the business pages. Changed through a developer.

## Technical notes (for the build, not for the design)

- New tables in the D'Source Supabase DB, same pattern as `storefront_content`
  (RLS on, no policies; the backend's service-role key is the only access path).
- New admin routes under `d-source/backend/src/routes/admin/` and a public
  read-only `GET /sites/...` that the main site and D'Foundry call.
- Every public page keeps a **built-in fallback** (today's content in code)
  so the marketing sites never go blank if the backend is down or slow.
- Public reads are cached/revalidated (Next.js ISR, e.g. 60s) and the admin
  triggers an on-demand revalidate on Publish.
- Prerequisites: backend deployed to Railway; admin deployed.

## Suggested build phases

1. Enquiries inbox + Site settings + Media library
2. Case studies, Testimonials, D'Foundry work/products
3. Insights, Environments
4. Business-page copy blocks (only if still wanted)

## Brief for Claude Design

"Add a **Websites** section to the existing D'Source admin, in the same
visual language as the current modules (navigation, tables, forms, status
chips, drawers). Screens: Enquiries inbox (list + detail with status/owner/
notes), Case studies, Testimonials, D'Foundry work, D'Foundry products,
Insights (with rich-text editor), Environments, Site settings, Media
library. Each content list shows status chips (Draft / Published,
Approved / Not approved), drag-to-reorder where order matters, a
Publish/Unpublish action, and an empty state. Include the editor form for
each type, a preview-before-publish state, and role-limited states (Editor
can't see Publish)."
