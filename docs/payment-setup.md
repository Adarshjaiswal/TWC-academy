# Payment Setup

Razorpay is the default sandbox provider because the initial deployment context is India-based. The domain layer is provider-neutral through `lib/adapters/payments.ts`.

## Environment

Set:

```bash
PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Without Razorpay credentials, checkout returns a mock URL for local development.

## Flow

1. Authenticated member requests checkout with `packageId`.
2. `/api/checkout` loads the package from MySQL and creates an order with database price, currency, and duration.
3. Provider checkout is created server-side.
4. Browser receives only the provider checkout URL/public key.
5. Razorpay posts to `/api/webhooks/razorpay`.
6. The route verifies the raw-body signature, upserts the webhook event by provider event ID, records payment, marks order paid, activates membership, creates Telegram access eligibility, notification, and audit-relevant records inside one transaction.

Never mark an order paid from a client success screen.

## Webhook

Configure Razorpay sandbox to send payment events to:

```text
https://your-domain.example/api/webhooks/razorpay
```

Use the configured webhook secret as `RAZORPAY_WEBHOOK_SECRET`.
