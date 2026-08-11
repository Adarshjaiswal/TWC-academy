import { AdminTable } from "@/components/admin/admin-table";
import { getAdminList } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const tickets = await getAdminList("tickets");
  return (
    <AdminTable
      title="Support tickets"
      description="Assign, reply, add internal notes, change status, and preserve thread history."
      columns={["Requester", "Subject", "Category", "Status", "Updated"]}
      rows={tickets.map((ticket) => [ticket.requester.email, ticket.subject, ticket.category, ticket.status, formatDate(ticket.updatedAt)])}
    />
  );
}
