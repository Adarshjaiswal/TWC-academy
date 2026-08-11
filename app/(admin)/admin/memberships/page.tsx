import { AdminTable } from "@/components/admin/admin-table";
import { getAdminList } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMembershipsPage() {
  const memberships = await getAdminList("memberships");
  return (
    <AdminTable
      title="Memberships"
      description="Activate, pause, expire, extend with mandatory reason, inspect history, and retry access provisioning from this workspace."
      columns={["User", "Package", "Status", "Starts", "Ends"]}
      rows={memberships.map((membership) => [membership.user.email, membership.package.name, membership.status, membership.startsAt ? formatDate(membership.startsAt) : "Pending", membership.endsAt ? formatDate(membership.endsAt) : "Pending"])}
    />
  );
}
