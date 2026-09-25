# D'Source — backend

The backend for D'Source: catalogue, accounts, ordering, and fulfillment
for both D'Emporium (retail) and D'Provision (business/procurement).

**Stack:** Postgres via Supabase (project `d-source-backend`, ref
`yawvfjolibpsvftkgwwt`). Most reads and simple writes go straight through
Supabase's auto-generated REST API against Postgres + row-level security —
no separate API server for CRUD. Custom business logic (quote pricing,
quote → order conversion, payment webhooks) will live in Supabase Edge
Functions once that logic is defined. This keeps the backend to "schema +
RLS policies + a handful of functions" rather than a hand-rolled server,
and is easy to swap out later if that stops being enough.

## Why two order paths

D'Emporium (retail) is a straight catalogue → cart → checkout flow.
D'Provision (business) is procurement — customers specify a requirement,
D'Source prices it against the design, and only then does it become an
order. So there are two entry points that both land in the same `orders`
table:

- **Emporium:** `products` → `orders` + `order_lines` directly.
- **Provision:** `products`/custom spec → `quotes` + `quote_lines` →
  (on acceptance) `orders` + `order_lines`, with `orders.quote_id` linking
  back to the originating quote.

## Schema (applied as the `initial_schema` migration)

**Accounts**
- `customers` — `type` (`retail`/`business`), contact info, and
  business-only fields (`company_name`, `tax_id`, `credit_terms_days`)
- `addresses` — shipping/billing, linked to a customer

**Catalogue**
- `categories` — hierarchical (`parent_id`)
- `products` — sku, name, `specs` (jsonb), `images` (jsonb)
- `product_prices` — separate `retail`/`business` unit price per product
- `suppliers` / `product_suppliers` — sourcing side, not customer-facing
- `inventory` — quantity on hand/reserved per product per location

**Provision quote/RFQ**
- `quotes` — `draft` → `submitted` → `priced` → `accepted`/`rejected`/`expired`
- `quote_lines` — catalogue or custom-spec line items; `unit_price` is
  null until D'Source prices the quote

**Ordering**
- `orders` — `channel` (`emporium`/`provision`), optional `quote_id`,
  `status` (`pending` → `confirmed` → `fulfilling` → `shipped` →
  `completed`, or `cancelled`)
- `order_lines` — `line_total` is a generated column (`quantity * unit_price`)
- `payments` — `method` (`card`/`transfer`/`invoice_terms` for business
  credit terms), `status`

**Fulfillment**
- `shipments` — carrier, tracking, status per order

All tables have RLS **enabled with no policies yet** — everything is
locked down by default until the auth strategy (who logs in as what,
retail customer vs business account vs staff) is decided. Don't ship
against this schema assuming open access; policies are the next piece of
work, not an afterthought.

## Not decided yet

- Auth (Supabase Auth email/password? magic link? separate staff role?)
- Payment provider integration (Paystack/Flutterwave are the common
  Nigeria-facing options, unconfirmed)
- Whether `product_prices`/quoting need multi-currency beyond NGN

**Not built yet** beyond the schema above — no Edge Functions, no auth
policies. This README documents what exists so the storefront/mobile work
can be planned against it.
