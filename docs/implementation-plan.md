# Implementation Plan

## Architecture

One Next.js App Router application contains public marketing, auth, member dashboard, admin workspace, and API route handlers. Prisma 7 maps MySQL persistence. Auth/session helpers use database sessions and role-aware server checks. Payment and Telegram workflows are adapter-backed.

## Payment State Flow

`Order: CREATED -> PENDING -> PAID | FAILED | CANCELLED | REFUNDED`

`Membership: PENDING -> ACTIVE -> EXPIRING -> EXPIRED | CANCELLED`

`TelegramAccess: NOT_ELIGIBLE -> ELIGIBLE -> INVITE_CREATED -> JOINED -> REVOKED | FAILED`

## Main Risks

- Real Razorpay and Telegram credentials are required before production verification.
- Legal and performance/result content must be client-approved.
- Prisma migrations must be applied against a live MySQL database before seeded dashboard testing.
- Managed Telegram invite/revocation needs bot admin permissions and retry monitoring.
