# TWC Trading Membership Platform

TWC is a single Next.js App Router monolith for a trading education, analysis, signals, community, and membership platform. It includes public marketing pages, email/password auth, database-backed sessions, member dashboard, admin workspace, package management data model, Razorpay-ready checkout/webhook flow, Telegram access state, MySQL/Prisma persistence, seed data, tests, and operations docs.

## Version Set

- Next.js `16.3.0`
- React `19.2.8`
- TypeScript `5.9.3`
- Prisma ORM / Client `7.9.1`
- Auth.js / `next-auth` `5.0.0-beta.32`
- Tailwind CSS `4.3.3`
- Vitest `4.1.10`
- Playwright `1.62.1`

This stack uses Prisma 7 `prisma.config.ts` and `@prisma/adapter-mariadb` for MySQL.

## Reference Direction

Source references inspected:
- Traders Paradise Live: premium trading-community positioning and strong CTAs, but the live site did not expose crawlable text in the inspection tool.
- Easy Forex Pips: services navigation, VIP plans, Telegram CTA, reviews/FAQ/cookie-preference patterns, and payment-link flow.
- Supplied SOW PDF: original marketing/payment/Telegram-redirection scope; this implementation expands it into auth, dashboard, admin, CMS, membership, and automation-ready workflows.

The implementation avoids copying source code, exact composition, logos, proprietary assets, or automated trade-copying claims.

## Route Map

- Public: `/`, `/about`, `/services`, `/packages`, `/results`, `/faq`, `/contact`, `/legal/[slug]`
- Preview: `/preview` documents major public, member, and admin states when screenshots are not available.
- Auth: `/sign-in`, `/sign-up`, `/verify-email`, `/forgot-password`, `/reset-password`
- Member: `/dashboard`, `/dashboard/membership`, `/dashboard/orders`, `/dashboard/telegram`, `/dashboard/profile`, `/dashboard/support`
- Admin: `/admin`, `/admin/users`, `/admin/packages`, `/admin/orders`, `/admin/memberships`, `/admin/telegram`, `/admin/content`, `/admin/testimonials`, `/admin/faqs`, `/admin/leads`, `/admin/support`, `/admin/settings`, `/admin/audit-logs`
- API: `/api/checkout`, `/api/webhooks/razorpay`, `/api/telegram/webhook`, `/api/cron/membership-expiry`, `/api/health`, `/api/auth/[...nextauth]`

## Data Model

The Prisma schema includes Auth.js adapter tables plus users/roles, packages/features, orders, payments, webhook events, memberships/events, Telegram account/access/jobs, services, CMS blocks, testimonials, results, FAQs, contact leads, support tickets/messages, notifications, media, settings, audit logs, and consent records.

Money is stored as integer minor units. Packages referenced by orders are archived rather than hard-deleted. Webhook event IDs are unique per provider for idempotency.

## Local Setup

1. Copy `.env.example` to `.env` and set `AUTH_SECRET`, seed credentials, and any provider credentials available.
2. Start MySQL 8 with Docker Compose when Docker is installed:

```bash
docker compose up -d
```

3. Generate and migrate:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Run the app:

```bash
npm run dev
```

Docker is not installed in the current environment, so local DB startup was not verified here.

## Validation

Commands used in this environment:

```bash
npm audit --audit-level=low
env DATABASE_URL=mysql://twc:twc_dev_password@127.0.0.1:3306/twc ./node_modules/.bin/prisma validate
env DATABASE_URL=mysql://twc:twc_dev_password@127.0.0.1:3306/twc ./node_modules/.bin/prisma generate
npm run typecheck
npm run test
npm run lint
npm run build
```

End-to-end Playwright smoke specs are present in `tests/e2e`, but browser execution requires running the dev server and installed Playwright browsers.

## Security Notes

- Protected routes are guarded at the routing layer through `proxy.ts` and rechecked in server helpers.
- Admin/member pages use server-side session reads.
- Checkout uses server database package pricing only.
- Razorpay webhook handling verifies signatures, records event IDs, and processes payment activation in a database transaction.
- Production runtime env validation requires real auth, payment, and Telegram secrets.
- Rich CMS HTML should pass through the constrained sanitizer in `lib/security.ts`.
- Secrets are environment-only and are not exposed in admin settings.

## Limitations

- SMTP sends to a development logger unless real SMTP credentials are provided.
- Razorpay checkout falls back to a mock checkout URL when sandbox credentials are absent.
- Telegram managed mode has schema, jobs, status tracking, and webhook validation, but real invite creation/revocation requires bot credentials and private-channel admin setup.
- Legal copy, testimonials, results, team claims, and performance data are placeholders pending client/legal approval.
- Docker, real MySQL migration execution, real payment webhooks, Telegram bot actions, and browser visual QA could not be fully verified in this environment.
