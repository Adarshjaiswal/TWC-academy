import Link from "next/link";
import { archivePackageAction, restorePackageAction } from "@/lib/actions/admin-packages";
import { requireAdmin } from "@/lib/auth/session";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { getAdminList } from "@/lib/data/admin";
import { hasPermission } from "@/lib/domain/permissions";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

function statusTone(status: string) {
  if (status === "ACTIVE") return "success";
  if (status === "ARCHIVED") return "error";
  return "neutral";
}

export default async function AdminPackagesPage() {
  const [packages, user] = await Promise.all([getAdminList("packages"), requireAdmin()]);
  const canManagePackages = hasPermission(user.role, "admin:settings:write");

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge tone="premium">Program Management</Badge>
          <h1 className="mt-3 text-4xl font-black">Packages</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Create, edit, archive, reorder, feature, configure price/duration, gateway refs, benefits, and Telegram access rules. Referenced packages are archived, not hard-deleted.
          </p>
        </div>
        {canManagePackages ? (
          <ButtonLink href="/admin/packages/new">
            New Package
          </ButtonLink>
        ) : null}
      </div>

      <AdminTable
        title="Package records"
        description={canManagePackages ? "Super admins can manage package checkout data from this table." : "You have read-only access to package records."}
        columns={["Package", "Status", "Duration", "Price", "Featured", "Telegram", "Features", "Sort", "Gateway", "Actions"]}
        rows={packages.map((plan) => {
          const archiveAction = archivePackageAction.bind(null, plan.id);
          const restoreAction = restorePackageAction.bind(null, plan.id);

          return [
            <div key="package">
              <p className="font-black">{plan.name}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{plan.slug}</p>
            </div>,
            <Badge key="status" tone={statusTone(plan.status)}>{plan.status}</Badge>,
            `${plan.durationDays} days`,
            formatMoney(plan.priceMinor, plan.currency),
            plan.isFeatured ? "Yes" : "No",
            plan.grantsTelegramAccess ? "Yes" : "No",
            <span key="features">{plan.features.length}</span>,
            String(plan.sortOrder),
            plan.gatewayProvider,
            canManagePackages ? (
              <div className="flex flex-wrap items-center gap-2" key="actions">
                <Link className="font-black text-[var(--premium)]" href={`/admin/packages/${plan.id}/edit`}>
                  Edit
                </Link>
                {plan.status === "ARCHIVED" ? (
                  <form action={restoreAction}>
                    <Button className="min-h-9 px-3 py-1 text-xs" type="submit" variant="secondary">
                      Restore
                    </Button>
                  </form>
                ) : (
                  <form action={archiveAction}>
                    <Button className="min-h-9 px-3 py-1 text-xs" type="submit" variant="ghost">
                      Archive
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              "Read only"
            )
          ];
        })}
      />
    </div>
  );
}
