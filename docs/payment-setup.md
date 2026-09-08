# Payment Setup

Ziina is the default payment provider. Razorpay remains available through the same provider-neutral layer in `lib/adapters/payments.ts`.

## Environment

For Ziina, set:

```bash
PAYMENT_PROVIDER=ziina
ZIINA_API_BASE_URL=https://api-v2.ziina.com/api
ZIINA_API_TOKEN=
ZIINA_WEBHOOK_SECRET=
ZIINA_TEST_MODE=false
ZIINA_ALLOW_TIPS=false
ZIINA_PAYMENT_EXPIRY_MINUTES=60
ZIINA_WEBHOOK_ALLOWED_IPS=3.29.184.186,3.29.190.95,20.233.47.127,13.202.161.181
```

For Razorpay fallback/support, set:

```bash
PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Without selected provider credentials, checkout returns a mock URL for local development. Production runtime validation requires the selected provider secrets.

## Flow

1. Authenticated member requests checkout with `packageId`.
2. `/api/checkout` loads the package from MySQL and creates an order with database price, currency, and duration.
3. Provider checkout is created server-side.
4. For Ziina, the browser is redirected to the Ziina hosted `redirect_url`.
5. Ziina returns the member to `/checkout/ziina/return`, where the server retrieves the payment intent and reconciles the order.
6. Ziina posts status updates to `/api/webhooks/ziina`.
7. The route verifies the raw-body signature, upserts the webhook event by provider event ID, validates amount/currency, records payment, marks order paid/failed/cancelled, activates membership on successful payment, creates Telegram access eligibility, notifications, and audit records inside one transaction.

Never mark an order paid from browser input alone. Ziina return pages may trigger a server-side payment-intent lookup, but membership activation still depends on provider verification.

## Webhook

Configure Ziina to send payment intent status updates to:

```text
https://your-domain.example/api/webhooks/ziina
```

Use the configured HMAC secret as `ZIINA_WEBHOOK_SECRET`. Ziina sends `payment_intent.status.updated` events and the `X-HMAC-Signature` header.

In production, `/api/webhooks/ziina` also checks the request source against `ZIINA_WEBHOOK_ALLOWED_IPS`. Keep the default Ziina IPs unless Ziina changes them. If a VPS proxy blocks the source IP from reaching Next.js, configure Nginx/Cloudflare to forward `X-Forwarded-For`, `X-Real-IP`, or `CF-Connecting-IP`. Setting `ZIINA_WEBHOOK_ALLOWED_IPS=` disables the IP check and leaves HMAC verification as the required control.

For Razorpay, configure:

```text
https://your-domain.example/api/webhooks/razorpay
```

Use the configured webhook secret as `RAZORPAY_WEBHOOK_SECRET`.

## Admin and Member Visibility

- Admins can review `/admin/payments` for provider configuration, webhook health, recent payments, status totals, and recent orders.
- Admins can review `/admin/orders` for order-level provider references and latest webhook state.
- Members can review `/dashboard/orders` for purchased packages, checkout state, payment reference, paid date, and pending checkout links.
