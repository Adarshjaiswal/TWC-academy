# TWC Academy

TWC Academy is a single Next.js App Router monolith for a trading education, analysis, community, and membership platform. It includes public marketing pages, email/password auth, database-backed sessions, member dashboard, admin workspace, package management data model, Razorpay-ready checkout/webhook flow, Telegram access state, MySQL/Prisma persistence, seed data, tests, and operations docs.

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

## Deployment

The app is designed to run on a Node.js 22+ VPS with MySQL/MariaDB, Nginx, PM2, and a production `.env`.

Typical production commands:

```bash
npm ci
npm run db:deploy
npm run build
PORT=3000 pm2 start npm --name twc -- run start
```

Use Nginx as a reverse proxy to `http://127.0.0.1:3000`, then issue SSL with Certbot.

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
