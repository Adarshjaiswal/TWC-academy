import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, CreditCard, ExternalLink, Receipt, Webhook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPaymentOperations } from "@/lib/data/admin";
import { env } from "@/lib/env";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

function countOrders(orders: Awaited<ReturnType<typeof getPaymentOperations>>["orders"], status: string) {
  return orders.filter((order) => order.status === status).length;
}

function paidRevenue(orders: Awaited<ReturnType<typeof getPaymentOperations>>["orders"]) {
  return orders.filter((order) => order.status === "PAID").reduce((sum, order) => sum + order.amountMinor, 0);
}

function StatusPill({ value }: { value: string }) {
  const tone =
    value === "PAID" || value === "CAPTURED" || value === "PROCESSED"
      ? "border-[rgba(255,209,102,0.38)] bg-[rgba(255,209,102,0.14)] text-[var(--premium)]"
      : value === "FAILED" || value === "CANCELLED"
        ? "border-[rgba(255,107,69,0.42)] bg-[rgba(255,107,69,0.12)] text-[var(--error)]"
        : "border-[var(--border)] bg-[rgba(255,255,255,0.04)] text-[var(--muted)]";

  return <span className={`inline-flex border px-2 py-1 text-xs font-black uppercase ${tone}`}>{value}</span>;
}

export default async function AdminPaymentsPage() {
  const data = await getPaymentOperations();
  const webhookUrl = `${env.APP_URL.replace(/\/$/, "")}/api/webhooks/ziina`;
  const latestWebhook = data.webhooks[0];
  const latestPayment = data.payments[0];
  const metrics = [
    ["Verified revenue", formatMoney(paidRevenue(data.orders), "AED"), CheckCircle2],
    ["Pending orders", countOrders(data.orders, "PENDING"), Activity],
    ["Failed orders", countOrders(data.orders, "FAILED"), AlertTriangle],
    ["Captured payments", data.payments.filter((payment) => payment.status === "CAPTURED").length, CreditCard]
  ] as const;

  return (
    <div className="grid gap-5">
      <div>
        <Badge tone="premium">Payment Operations</Badge>
        <h1 className="mt-3 text-4xl font-black">Ziina payment management</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          Server-created payment intents, verified webhook processing, member purchase history, and provider reconciliation are managed here. Orders are never marked paid from browser redirects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <Card key={label}>
            <Icon aria-hidden className="h-5 w-5 text-[var(--primary)]" />
            <p className="mt-4 text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h2 className="text-2xl font-black">Gateway configuration</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="line-tile flex justify-between gap-4 p-4">
              <span className="text-[var(--muted)]">Active provider</span>
              <span className="font-black uppercase">{env.PAYMENT_PROVIDER}</span>
            </div>
            <div className="line-tile flex justify-between gap-4 p-4">
              <span className="text-[var(--muted)]">Ziina API token</span>
              <span className="font-black">{env.ZIINA_API_TOKEN ? "Configured" : "Missing"}</span>
            </div>
            <div className="line-tile flex justify-between gap-4 p-4">
              <span className="text-[var(--muted)]">Webhook secret</span>
              <span className="font-black">{env.ZIINA_WEBHOOK_SECRET ? "Configured" : "Missing"}</span>
            </div>
            <div className="line-tile flex justify-between gap-4 p-4">
              <span className="text-[var(--muted)]">Ziina test mode</span>
              <span className="font-black">{env.ZIINA_TEST_MODE ? "On" : "Off"}</span>
            </div>
            <div className="line-tile p-4">
              <span className="text-[var(--muted)]">Production webhook URL</span>
              <p className="mt-2 break-all font-black">{webhookUrl}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-black">Provider health</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="line-tile p-4">
              <Webhook aria-hidden className="h-5 w-5 text-[var(--primary)]" />
              <p className="mt-3 text-sm text-[var(--muted)]">Latest webhook</p>
              <p className="mt-2 text-lg font-black">{latestWebhook ? latestWebhook.status : "No events"}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{latestWebhook ? `${latestWebhook.provider} / ${latestWebhook.eventType}` : "Waiting for provider events"}</p>
            </div>
            <div className="line-tile p-4">
              <Receipt aria-hidden className="h-5 w-5 text-[var(--premium)]" />
              <p className="mt-3 text-sm text-[var(--muted)]">Latest payment</p>
              <p className="mt-2 text-lg font-black">{latestPayment ? latestPayment.status : "No payments"}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{latestPayment ? formatMoney(latestPayment.amountMinor, latestPayment.currency) : "No captured payment yet"}</p>
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
            Keep Ziina secrets in the VPS environment only. Admin screens show configuration state but never reveal the token or webhook secret.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-black">Provider breakdown</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-3">Provider</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.providerStatusGroups.map((group) => (
                <tr className="border-t border-[var(--border)]" key={`${group.provider}-${group.status}`}>
                  <td className="py-3 font-black uppercase">{group.provider}</td>
                  <td><StatusPill value={group.status} /></td>
                  <td>{group._count._all}</td>
                  <td>{formatMoney(group._sum.amountMinor ?? 0, "AED")}</td>
                </tr>
              ))}
              {!data.providerStatusGroups.length ? <tr><td className="py-4 text-[var(--muted)]" colSpan={4}>No payment data yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-black">Recent orders and purchases</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-3">Order</th>
                <th>User</th>
                <th>Package</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Provider intent</th>
                <th>Paid</th>
                <th>Checkout</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr className="border-t border-[var(--border)]" key={order.id}>
                  <td className="py-3 font-black">{order.publicId}</td>
                  <td>{order.user.email}</td>
                  <td>{order.package.name}</td>
                  <td><StatusPill value={order.status} /></td>
                  <td>{formatMoney(order.amountMinor, order.currency)}</td>
                  <td><span className="block max-w-[180px] truncate" title={order.providerOrderId ?? ""}>{order.providerOrderId ?? "Not created"}</span></td>
                  <td>{order.paidAt ? formatDate(order.paidAt) : "Pending"}</td>
                  <td>
                    {order.checkoutUrl ? (
                      <Link className="inline-flex items-center gap-1 font-black text-[var(--premium)]" href={order.checkoutUrl} rel="noopener noreferrer" target="_blank">
                        Open <ExternalLink aria-hidden className="h-3 w-3" />
                      </Link>
                    ) : (
                      "Not available"
                    )}
                  </td>
                </tr>
              ))}
              {!data.orders.length ? <tr><td className="py-4 text-[var(--muted)]" colSpan={8}>No orders yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-black">Recent webhook events</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="py-3">Provider</th>
                <th>Event</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Order</th>
                <th>Processed</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {data.webhooks.map((webhook) => (
                <tr className="border-t border-[var(--border)]" key={webhook.id}>
                  <td className="py-3 font-black uppercase">{webhook.provider}</td>
                  <td>{webhook.eventType}</td>
                  <td><StatusPill value={webhook.status} /></td>
                  <td>{webhook.attempts}</td>
                  <td>{webhook.order?.publicId ?? "Not linked"}</td>
                  <td>{webhook.processedAt ? formatDate(webhook.processedAt) : "Pending"}</td>
                  <td>{webhook.errorMessage ?? "None"}</td>
                </tr>
              ))}
              {!data.webhooks.length ? <tr><td className="py-4 text-[var(--muted)]" colSpan={7}>No webhook events yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
