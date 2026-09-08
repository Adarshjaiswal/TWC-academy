import Link from "next/link";
import { AdminTable } from "@/components/admin/admin-table";
import { getAdminList } from "@/lib/data/admin";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminList("orders");
  return (
    <AdminTable
      title="Orders"
      description="Inspect normalized payment metadata, webhook attempts, reconciliation reason capture, and provider references. Orders are never marked paid from client input."
      columns={["Order", "User", "Package", "Status", "Provider", "Amount", "Provider Ref", "Payment", "Webhook", "Created", "Checkout"]}
      rows={orders.map((order) => {
        const latestPayment = order.payments[0];
        const latestWebhook = order.webhooks[0];

        return [
          order.publicId,
          order.user.email,
          order.package.name,
          order.status,
          order.provider,
          formatMoney(order.amountMinor, order.currency),
          <span className="block max-w-[160px] truncate" key="provider-ref" title={order.providerOrderId ?? ""}>{order.providerOrderId ?? "Not created"}</span>,
          latestPayment ? `${latestPayment.status}${latestPayment.method ? ` / ${latestPayment.method}` : ""}` : "No payment",
          latestWebhook ? `${latestWebhook.status} / ${latestWebhook.eventType}` : "No webhook",
          formatDate(order.createdAt),
          order.checkoutUrl ? (
            <Link className="font-black text-[var(--premium)]" href={order.checkoutUrl} key="checkout-link" rel="noopener noreferrer" target="_blank">
              Open
            </Link>
          ) : (
            "Not available"
          )
        ];
      })}
    />
  );
}
