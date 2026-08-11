import { AdminTable } from "@/components/admin/admin-table";
import { getAdminList } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminList("users");
  return (
    <AdminTable
      title="Users"
      description="Search, filters, pagination, role assignment, memberships, orders, Telegram state, tickets, and session revocation belong here. Role writes are SUPER_ADMIN-only."
      columns={["Name", "Email", "Role", "Verified", "Created"]}
      rows={users.map((user) => [user.name, user.email, user.role, user.emailVerified ? "Yes" : "No", formatDate(user.createdAt)])}
    />
  );
}
