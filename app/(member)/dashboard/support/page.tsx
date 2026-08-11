import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getMemberOverview } from "@/lib/data/member";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const user = await requireUser();
  const { tickets } = await getMemberOverview(user.id);
  return (
    <div className="grid gap-5">
      <Badge>Support</Badge>
      <h1 className="text-4xl font-black">Support tickets</h1>
      <Card>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-[var(--muted)]">Create and view support conversations with status history.</p>
          <ButtonLink href="/contact" variant="secondary">Open Enquiry</ButtonLink>
        </div>
        <div className="mt-5 grid gap-3">
          {tickets.map((ticket) => (
            <div className="rounded-lg border border-[var(--border)] bg-white/5 p-4" key={ticket.id}>
              <p className="font-black">{ticket.subject}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{ticket.category} · {ticket.status} · {formatDate(ticket.updatedAt)}</p>
            </div>
          ))}
          {!tickets.length ? <p className="text-sm text-[var(--muted)]">No support tickets yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}
