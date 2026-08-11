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
      columns={["Order", "User", "Package", "Status", "Provider", "Amount", "Created"]}
      rows={orders.map((order) => [order.publicId, order.user.email, order.package.name, order.status, order.provider, formatMoney(order.amountMinor, order.currency), formatDate(order.createdAt)])}
    />
  );
}
