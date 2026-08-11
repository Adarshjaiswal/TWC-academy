import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminOverview } from "@/lib/data/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminOverview();
  const metrics = [
    ["Users", data.users],
    ["Active memberships", data.activeMemberships],
    ["Expiring soon", data.expiringMemberships],
    ["Verified revenue", formatMoney(data.revenueMinor)],
    ["Failed payments", data.failedOrders],
    ["Pending Telegram", data.pendingTelegram],
    ["Open tickets", data.openTickets]
  ];
  return (
    <div className="grid gap-5">
      <div>
        <Badge tone="premium">Admin overview</Badge>
        <h1 className="mt-3 text-4xl font-black">Operations dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="text-2xl font-black">Recent audit events</h2>
        <div className="mt-4 grid gap-3">
          {data.auditLogs.map((event) => (
            <div className="rounded-lg border border-[var(--border)] bg-white/5 p-3 text-sm" key={event.id}>
              <p className="font-black">{event.action}</p>
              <p className="text-[var(--muted)]">{event.entityType} {event.entityId ?? ""}</p>
            </div>
          ))}
          {!data.auditLogs.length ? <p className="text-sm text-[var(--muted)]">No audit events yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}
