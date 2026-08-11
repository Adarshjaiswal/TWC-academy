import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function AdminTelegramPage() {
  return (
    <div className="grid gap-5">
      <Badge>Telegram</Badge>
      <h1 className="text-4xl font-black">Telegram access operations</h1>
      <div className="grid gap-5 md:grid-cols-2">
        <Card><p className="text-sm text-[var(--muted)]">Mode</p><p className="mt-3 text-2xl font-black">{env.TELEGRAM_MODE}</p></Card>
        <Card><p className="text-sm text-[var(--muted)]">Premium label</p><p className="mt-3 text-2xl font-black">{env.TELEGRAM_PREMIUM_CHANNEL_LABEL}</p></Card>
      </div>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Admins can view provisioning state, regenerate one-time invites, revoke access, retry failed jobs, and inspect non-secret channel configuration. Bot token and private channel ID remain environment-only.
        </p>
      </Card>
    </div>
  );
}
