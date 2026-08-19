# Telegram Setup

The app supports two modes.

## Redirect Mode

Set:

```bash
TELEGRAM_MODE=redirect
TELEGRAM_FREE_CHANNEL_URL=https://t.me/TWClive
TELEGRAM_PREMIUM_CHANNEL_LABEL="TWC Premium Telegram Signals"
```

Visitors see the public TWC Live link. Active members see premium signal-channel instructions in the dashboard after eligibility is confirmed. This does not place trades, copy trades, or guarantee outcomes.

## Managed Mode

Set:

```bash
TELEGRAM_MODE=managed
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
TELEGRAM_PRIVATE_CHANNEL_ID=
```

Bot requirements:
- Add the bot as an admin of the private premium channel/group.
- Grant only invite-link and membership-management permissions required by Telegram.
- Configure Telegram webhook to `/api/telegram/webhook` with `TELEGRAM_WEBHOOK_SECRET`.

The schema tracks account links, access status, invite expiry, retry count, provisioning jobs, and revocation state. Do not identify members by username alone; store Telegram user ID only after explicit linking or join workflow.
