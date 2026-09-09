# Deployment Guide

Use a Node-compatible host with persistent MySQL 8.x.

## Build

```bash
npm ci
npm run db:generate
npm run build
```

Production runtime must define:

```bash
DATABASE_URL
APP_URL
AUTH_SECRET
PAYMENT_PROVIDER=ziina
ZIINA_API_BASE_URL
ZIINA_API_TOKEN
ZIINA_WEBHOOK_SECRET
ZIINA_TEST_MODE=false
ZIINA_ALLOW_TIPS=false
ZIINA_PAYMENT_EXPIRY_MINUTES
ZIINA_WEBHOOK_ALLOWED_IPS
CRON_SECRET
```

Use Razorpay variables only when `PAYMENT_PROVIDER=razorpay`.

For Hostinger email delivery, also define:

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=support@twcfx.com
SMTP_PASS
EMAIL_FROM=Trade Wave Capital <support@twcfx.com>
SUPPORT_EMAIL=support@twcfx.com
```

If `TELEGRAM_MODE=managed`, also define bot token, webhook secret, and private channel ID.

## Release

1. Back up the database.
2. Deploy code.
3. Run `npm run db:deploy`.
4. Run `npm run db:sync-packages` after fresh database setup or when package fixture pricing/content changes.
5. Start the Next.js server with `npm run start`.
6. Verify `/api/health`.
7. Verify auth, checkout sandbox, webhook delivery, and member Telegram eligibility.

## Headers

Security headers are defined in `next.config.ts`, including CSP, HSTS, frame restrictions, MIME sniffing protection, referrer policy, and permissions policy.
