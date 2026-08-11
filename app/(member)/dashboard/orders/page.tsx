import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getMemberOverview } from "@/lib/data/member";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await requireUser();
  const { orders } = await getMemberOverview(user.id);

  return (
    <div className="grid gap-5">
      <Badge>Orders</Badge>
      <h1 className="text-4xl font-black">Order history</h1>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr><th className="py-3">Order</th><th>Package</th><th>Status</th><th>Provider</th><th>Amount</th><th>Created</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-t border-[var(--border)]" key={order.id}>
                <td className="py-3">{order.publicId}</td>
                <td>{order.package.name}</td>
                <td>{order.status}</td>
                <td>{order.provider}</td>
                <td>{formatMoney(order.amountMinor, order.currency)}</td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
            {!orders.length ? <tr><td className="py-4 text-[var(--muted)]" colSpan={6}>No orders yet.</td></tr> : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
