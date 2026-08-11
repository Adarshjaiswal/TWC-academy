import { AdminTable } from "@/components/admin/admin-table";
import { getAdminList } from "@/lib/data/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await getAdminList("packages");
  return (
    <AdminTable
      title="Packages"
      description="Create, edit, archive, reorder, feature, configure price/duration, gateway refs, benefits, and Telegram access rules. Referenced packages are archived, not hard-deleted."
      columns={["Name", "Status", "Duration", "Price", "Featured", "Telegram"]}
      rows={packages.map((plan) => [plan.name, plan.status, `${plan.durationDays} days`, formatMoney(plan.priceMinor, plan.currency), plan.isFeatured ? "Yes" : "No", plan.grantsTelegramAccess ? "Yes" : "No"])}
    />
  );
}
