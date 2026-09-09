import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";
import { requireAdmin } from "@/lib/auth/session";
import { hasPermission } from "@/lib/domain/permissions";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Package"
};

export default async function NewPackagePage() {
  const user = await requireAdmin();
  if (!hasPermission(user.role, "admin:settings:write")) redirect("/admin/packages");

  return (
    <PackageForm
      activePaymentProvider={env.PAYMENT_PROVIDER}
      mode="create"
    />
  );
}
