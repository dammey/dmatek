# D'Source — backend

A Node/Express API, deployed on Railway, fronting the D'Source Postgres
database (Supabase project `d-source-backend`, ref `yawvfjolibpsvftkgwwt`).
Both the storefront (`d-source/web`) and admin (`d-source/admin`) apps talk
to this API only — neither talks to Supabase directly. That's why every
table has RLS enabled with **no policies**: this API holds the one
service-role key that can read/write, and access control is enforced here
(staff auth + `role_permissions`, customer auth for account-only routes)
rather than in Postgres policies.

## Running locally

```
cp .env.example .env   # fill in SUPABASE_SERVICE_ROLE_KEY from the Supabase dashboard
npm install
npm run dev
```

## Deploying

This repo is **not yet linked to a Railway project** — that step needs
either a `RAILWAY_TOKEN` or someone running the Railway CLI by hand:

```
npm install -g @railway/cli
railway login
railway link            # or: railway init, to create a new project
railway up
```

Set the env vars from `.env.example` in the Railway project dashboard
(`SUPABASE_SERVICE_ROLE_KEY` especially — get it from Supabase's Project
Settings → API, never commit it). `railway.json` in this folder tells
Railway to run `npm run build` then `npm start`.

## Structure

- `src/env.ts` — required env vars, fails fast if missing
- `src/supabase.ts` — the one service-role Supabase client every route uses
- `src/auth/middleware.ts` — `withCustomer` (optional, populates `req.customer` for signed-in shoppers) and `requireStaff(module?)` (401/403, checks `role_permissions` for non-Owner roles)
- `src/payments/` — `PaymentProvider` interface with `paystack.ts` and `flutterwave.ts` adapters, selected by `PAYMENT_PROVIDER`. Both run in **sandbox mode** (order created, no actual charge) until real secret keys are set — there are no live merchant accounts yet.
- `src/routes/` — storefront-facing: `catalogue`, `cart`, `checkout`, `quotes`, `account`, `reviews`, `surveys`, `enquiries`, `track`, `zones`
- `src/routes/admin/` — staff-only, one file per Admin module (dashboard, orders, quotes, payments, invoices, customers, jobs/installations, repairs, surveys, suppliers, products, categories, kits, discounts, content, reviews, zones, notifications, accounts, enquiries, staff, settings, reports)

## Schema

Two generations, both applied as migrations via the Supabase MCP:

**Original catalogue/order schema** (`customers`, `addresses`, `categories`,
`products`, `product_prices`, `product_suppliers`, `suppliers`,
`inventory`, `quotes`, `quote_lines`, `orders`, `order_lines`, `payments`,
`shipments`) — reused as-is, with `orders.ref`/`quotes.ref` (human-readable
`DS-XXXXXX`/`DQ-XXXXXX` references), `orders.internal_note`, and
`customers.auth_user_id`/`account_status`/`expected_activity`/`applied_at`
added on top for the storefront/admin build.

**Storefront + Admin extension** (`kits`, `kit_items`, `reviews`,
`site_surveys`, `enquiries`, `staff`, `role_permissions`, `jobs` (engineer
schedule), `repairs`, `purchase_orders`, `po_lines`, `delivery_zones`,
`notification_templates`, `notification_log`, `discounts`,
`storefront_content` (a small CMS key/value table for hero words,
best-seller slots, help text), `carts`, `cart_items`) — added to support
every module in README Part 4 and every flow in Part 3.

`delivery_zones` is seeded with the named zones from the README
(Lagos/Abuja (FCT)/Rivers/Oyo/Kano/Enugu/Other — fees and times still need
filling in via Admin → Delivery zones). `role_permissions` is seeded with
the Owner-sees-everything default plus the Sales/Warehouse/Engineer/Support
defaults from README Part 4's permission table.

## Auth

Both customer and staff accounts use Supabase Auth (email/password),
signed in directly from the Next.js apps against Supabase's auth API (this
backend never handles passwords). After sign-up/sign-in, the frontend
calls `POST /account/link` (customer) or `POST /admin/staff/link` (staff,
for a staff member accepting an invite) with the Supabase session token,
which attaches `auth.users.id` to the right `customers`/`staff` row.
Every subsequent request carries `Authorization: Bearer <token>`.

## Not done yet

- Actual Railway deployment (see above)
- Paystack/Flutterwave merchant accounts (sandbox mode covers development)
- Webhook endpoints for async payment confirmation (currently polling
  `GET /checkout/verify/:reference` from the storefront after redirect —
  fine for now, but a webhook is more reliable for transfer/USSD)
- `product_prices`/quoting beyond NGN
