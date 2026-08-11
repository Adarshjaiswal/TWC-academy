import { AdminTable } from "@/components/admin/admin-table";
import { getAdminList } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getAdminList("leads");
  return (
    <AdminTable
      title="Contact leads"
      description="Filter, assign, qualify, close, and preserve lead history from validated contact submissions."
      columns={["Name", "Email", "Subject", "Status", "Created"]}
      rows={leads.map((lead) => [lead.name, lead.email, lead.subject, lead.status, formatDate(lead.createdAt)])}
    />
  );
}
