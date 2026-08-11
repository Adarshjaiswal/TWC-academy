import { AdminTable } from "@/components/admin/admin-table";
import { getAdminList } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const audit = await getAdminList("audit");
  return (
    <AdminTable
      title="Audit logs"
      description="Append-only sensitive admin activity with actor, action, entity, safe diffs, reason, IP/user-agent where permitted, and timestamp."
      columns={["Actor", "Action", "Entity", "Reason", "Created"]}
      rows={audit.map((event) => [event.actor?.email ?? "System", event.action, `${event.entityType}:${event.entityId ?? ""}`, event.reason ?? "-", formatDate(event.createdAt)])}
    />
  );
}
