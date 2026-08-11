import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getMemberOverview } from "@/lib/data/member";
import { env } from "@/lib/env";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TelegramPage() {
  const user = await requireUser();
  const { membership, telegramAccess } = await getMemberOverview(user.id);
  const eligible = membership?.status === "ACTIVE" && (!membership.endsAt || membership.endsAt > new Date());

  return (
    <div className="grid gap-5">
      <Badge>Telegram</Badge>
      <h1 className="text-4xl font-black">Telegram access</h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">Free channel</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">The public channel is available to visitors and members.</p>
          <ButtonLink className="mt-5" href={env.TELEGRAM_FREE_CHANNEL_URL} variant="secondary">Open Free Telegram</ButtonLink>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Premium access</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Status: {telegramAccess?.status ?? (eligible ? "ELIGIBLE" : "NOT_ELIGIBLE")}
          </p>
          {eligible ? (
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {env.TELEGRAM_MODE === "managed"
                ? "Managed invite generation is available when bot credentials are configured."
                : `Follow admin-provided instructions for ${env.TELEGRAM_PREMIUM_CHANNEL_LABEL}.`}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Activate or renew membership to unlock premium instructions.</p>
          )}
          {telegramAccess?.inviteExpiresAt ? <p className="mt-3 text-sm text-[var(--muted)]">Invite expires {formatDate(telegramAccess.inviteExpiresAt)}</p> : null}
        </Card>
      </div>
    </div>
  );
}
