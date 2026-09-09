import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";
import { requireAdmin } from "@/lib/auth/session";
import { hasPermission } from "@/lib/domain/permissions";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Package"
};

type EditPackagePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const user = await requireAdmin();
  if (!hasPermission(user.role, "admin:settings:write")) redirect("/admin/packages");

  const { id } = await params;
  const packageRecord = await prisma.package.findUnique({
    where: { id },
    include: {
      features: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  if (!packageRecord) notFound();

  return (
    <PackageForm
      activePaymentProvider={env.PAYMENT_PROVIDER}
      mode="edit"
      packageRecord={{
        id: packageRecord.id,
        slug: packageRecord.slug,
        name: packageRecord.name,
        summary: packageRecord.summary,
        description: packageRecord.description,
        durationDays: packageRecord.durationDays,
        priceMinor: packageRecord.priceMinor,
        currency: packageRecord.currency,
        compareAtPriceMinor: packageRecord.compareAtPriceMinor,
        gatewayProvider: packageRecord.gatewayProvider,
        gatewayPriceRef: packageRecord.gatewayPriceRef,
        grantsTelegramAccess: packageRecord.grantsTelegramAccess,
        isFeatured: packageRecord.isFeatured,
        sortOrder: packageRecord.sortOrder,
        status: packageRecord.status,
        features: packageRecord.features.map((feature) => feature.label)
      }}
    />
  );
}
