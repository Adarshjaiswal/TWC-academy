import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getMemberOverview } from "@/lib/data/member";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const overview = await getMemberOverview(user.id);
  const membership = overview.membership;

  return (
    <div className="grid gap-5">
      <div>
        <Badge>Dashboard</Badge>
        <h1 className="mt-3 text-4xl font-black">Member overview</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-sm text-[var(--muted)]">Current membership</p>
          <p className="mt-3 text-2xl font-black">{membership?.package.name ?? "No active plan"}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{membership?.status ?? "Choose a package to start."}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Access ends</p>
          <p className="mt-3 text-2xl font-black">{membership?.endsAt ? formatDate(membership.endsAt) : "Not set"}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Telegram</p>
          <p className="mt-3 text-2xl font-black">{overview.telegramAccess?.status ?? "Not eligible"}</p>
        </Card>
      </div>
      <Card>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black">Recent orders</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Provider references and payment state are normalized.</p>
          </div>
          <ButtonLink href="/packages" variant="secondary">Renew or upgrade</ButtonLink>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-3">Package</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {overview.orders.length ? overview.orders.map((order) => (
                <tr className="border-t border-[var(--border)]" key={order.id}>
                  <td className="py-3">{order.package.name}</td>
                  <td>{order.status}</td>
                  <td>{formatMoney(order.amountMinor, order.currency)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              )) : (
                <tr><td className="py-4 text-[var(--muted)]" colSpan={4}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
