import Link from "next/link";
import { ExternalLink } from "lucide-react";
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
      <h1 className="text-4xl font-black">Purchase history</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        {orders.map((order) => {
          const latestPayment = order.payments[0];

          return (
            <Card key={order.id}>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-black uppercase text-[var(--muted)]">Purchased package</p>
                  <h2 className="mt-2 text-2xl font-black">{order.package.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{order.package.summary}</p>
                </div>
                <Badge tone={order.status === "PAID" ? "success" : order.status === "FAILED" ? "error" : "premium"}>
                  {order.status}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="line-tile p-4">
                  <p className="text-xs font-black uppercase text-[var(--muted)]">Amount</p>
                  <p className="mt-2 text-xl font-black">{formatMoney(order.amountMinor, order.currency)}</p>
                </div>
                <div className="line-tile p-4">
                  <p className="text-xs font-black uppercase text-[var(--muted)]">Provider</p>
                  <p className="mt-2 text-xl font-black uppercase">{order.provider}</p>
                </div>
                <div className="line-tile p-4">
                  <p className="text-xs font-black uppercase text-[var(--muted)]">Order ID</p>
                  <p className="mt-2 break-all font-bold">{order.publicId}</p>
                </div>
                <div className="line-tile p-4">
                  <p className="text-xs font-black uppercase text-[var(--muted)]">Payment</p>
                  <p className="mt-2 break-all font-bold">{latestPayment?.providerPaymentId ?? order.providerPaymentId ?? "Pending"}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[var(--muted)]">Created {formatDate(order.createdAt)}{order.paidAt ? ` • Paid ${formatDate(order.paidAt)}` : ""}</p>
                {order.checkoutUrl && order.status === "PENDING" ? (
                  <Link className="inline-flex items-center gap-2 font-black text-[var(--premium)]" href={order.checkoutUrl} rel="noopener noreferrer" target="_blank">
                    Continue payment <ExternalLink aria-hidden className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
      {!orders.length ? <Card><p className="text-sm text-[var(--muted)]">No purchases yet.</p></Card> : null}
      <Card className="overflow-x-auto">
        <h2 className="text-2xl font-black">Order records</h2>
        <table className="mt-5 w-full min-w-[860px] text-left text-sm">
          <thead className="text-[var(--muted)]">
            <tr><th className="py-3">Order</th><th>Package</th><th>Status</th><th>Provider</th><th>Payment Ref</th><th>Amount</th><th>Created</th><th>Paid</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-t border-[var(--border)]" key={order.id}>
                <td className="py-3">{order.publicId}</td>
                <td>{order.package.name}</td>
                <td>{order.status}</td>
                <td>{order.provider}</td>
                <td><span className="block max-w-[180px] truncate" title={order.providerPaymentId ?? ""}>{order.providerPaymentId ?? "Pending"}</span></td>
                <td>{formatMoney(order.amountMinor, order.currency)}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.paidAt ? formatDate(order.paidAt) : "Pending"}</td>
              </tr>
            ))}
            {!orders.length ? <tr><td className="py-4 text-[var(--muted)]" colSpan={8}>No orders yet.</td></tr> : null}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
