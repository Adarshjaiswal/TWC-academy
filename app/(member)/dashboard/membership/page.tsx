import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getMemberOverview } from "@/lib/data/member";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const user = await requireUser();
  const { membership } = await getMemberOverview(user.id);

  return (
    <div className="grid gap-5">
      <Badge>Membership</Badge>
      <h1 className="text-4xl font-black">Membership status</h1>
      <Card>
        {membership ? (
          <dl className="grid gap-4 md:grid-cols-2">
            <div><dt className="text-sm text-[var(--muted)]">Plan</dt><dd className="mt-1 text-xl font-black">{membership.package.name}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Status</dt><dd className="mt-1 text-xl font-black">{membership.status}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Starts</dt><dd className="mt-1">{membership.startsAt ? formatDate(membership.startsAt) : "Pending"}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Ends</dt><dd className="mt-1">{membership.endsAt ? formatDate(membership.endsAt) : "Pending"}</dd></div>
          </dl>
        ) : (
          <div>
            <p className="text-[var(--muted)]">No membership is active for this account.</p>
            <ButtonLink className="mt-5" href="/packages">View Packages</ButtonLink>
          </div>
        )}
      </Card>
    </div>
  );
}
