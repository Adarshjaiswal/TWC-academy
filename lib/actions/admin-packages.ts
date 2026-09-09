"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { assertPermission } from "@/lib/domain/permissions";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export type PackageFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const packageStatuses = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;

function parseMoneyMinor(value: string) {
  const normalized = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;

  const [major, decimals = ""] = normalized.split(".");
  const minor = Number(major) * 100 + Number(decimals.padEnd(2, "0"));
  if (!Number.isSafeInteger(minor)) return null;
  return minor;
}

const packageFormSchema = z
  .object({
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, "Use at least 2 characters.")
      .max(80, "Use 80 characters or fewer.")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens only."),
    name: z.string().trim().min(2, "Package name is required.").max(120, "Use 120 characters or fewer."),
    summary: z.string().trim().min(10, "Summary is required.").max(500, "Use 500 characters or fewer."),
    description: z.string().trim().min(20, "Description is required.").max(5000, "Use 5000 characters or fewer."),
    durationDays: z.coerce.number().int("Use whole days.").positive("Duration must be greater than zero.").max(3650, "Duration is too long."),
    priceMajor: z.string().trim().min(1, "Price is required."),
    compareAtPriceMajor: z.string().trim().optional(),
    currency: z
      .string()
      .trim()
      .toUpperCase()
      .length(3, "Use a 3-letter currency code.")
      .regex(/^[A-Z]{3}$/, "Use letters only."),
    gatewayProvider: z.string().trim().min(2, "Gateway provider is required.").max(80, "Use 80 characters or fewer."),
    gatewayPriceRef: z.string().trim().max(180, "Use 180 characters or fewer.").optional(),
    status: z.enum(packageStatuses),
    sortOrder: z.coerce.number().int("Use a whole number.").min(0, "Sort order cannot be negative.").max(9999, "Sort order is too high."),
    isFeatured: z.boolean(),
    grantsTelegramAccess: z.boolean(),
    features: z
      .string()
      .max(3000, "Features list is too long.")
      .transform((value) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))
      .pipe(z.array(z.string().min(2).max(160)).min(1, "Add at least one feature.").max(24, "Use 24 features or fewer."))
  })
  .superRefine((value, ctx) => {
    const priceMinor = parseMoneyMinor(value.priceMajor);
    if (!priceMinor || priceMinor <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["priceMajor"],
        message: "Use a valid price greater than zero with up to 2 decimals."
      });
    }

    const compareAtPriceMinor = value.compareAtPriceMajor ? parseMoneyMinor(value.compareAtPriceMajor) : null;
    if (value.compareAtPriceMajor && !compareAtPriceMinor) {
      ctx.addIssue({
        code: "custom",
        path: ["compareAtPriceMajor"],
        message: "Use a valid compare-at price with up to 2 decimals."
      });
    }

    if (priceMinor && compareAtPriceMinor && compareAtPriceMinor <= priceMinor) {
      ctx.addIssue({
        code: "custom",
        path: ["compareAtPriceMajor"],
        message: "Compare-at price must be higher than the sale price."
      });
    }
  })
  .transform((value) => ({
    slug: value.slug,
    name: value.name,
    summary: value.summary,
    description: value.description,
    durationDays: value.durationDays,
    priceMinor: parseMoneyMinor(value.priceMajor) ?? 0,
    compareAtPriceMinor: value.compareAtPriceMajor ? parseMoneyMinor(value.compareAtPriceMajor) : null,
    currency: value.currency,
    gatewayProvider: value.gatewayProvider,
    gatewayPriceRef: value.gatewayPriceRef || null,
    status: value.status,
    sortOrder: value.sortOrder,
    isFeatured: value.isFeatured,
    grantsTelegramAccess: value.grantsTelegramAccess,
    features: value.features,
    archivedAt: value.status === "ARCHIVED" ? new Date() : null
  }));

function readPackageForm(formData: FormData) {
  return {
    slug: formData.get("slug"),
    name: formData.get("name"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    durationDays: formData.get("durationDays"),
    priceMajor: formData.get("priceMajor"),
    compareAtPriceMajor: formData.get("compareAtPriceMajor"),
    currency: formData.get("currency"),
    gatewayProvider: formData.get("gatewayProvider") || env.PAYMENT_PROVIDER,
    gatewayPriceRef: formData.get("gatewayPriceRef"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured") === "on",
    grantsTelegramAccess: formData.get("grantsTelegramAccess") === "on",
    features: formData.get("features")
  };
}

function packageAuditSnapshot(packageRecord: {
  slug: string;
  name: string;
  status: string;
  durationDays: number;
  priceMinor: number;
  currency: string;
  isFeatured: boolean;
  grantsTelegramAccess: boolean;
  sortOrder: number;
}) {
  return {
    slug: packageRecord.slug,
    name: packageRecord.name,
    status: packageRecord.status,
    durationDays: packageRecord.durationDays,
    priceMinor: packageRecord.priceMinor,
    currency: packageRecord.currency,
    isFeatured: packageRecord.isFeatured,
    grantsTelegramAccess: packageRecord.grantsTelegramAccess,
    sortOrder: packageRecord.sortOrder
  };
}

async function getAuditRequestContext() {
  const headerStore = await headers();
  return {
    ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.slice(0, 128),
    userAgent: headerStore.get("user-agent")?.slice(0, 500)
  };
}

async function requirePackageManager() {
  const user = await requireAdmin();
  assertPermission(user.role, "admin:settings:write");
  return user;
}

function revalidatePackagePaths() {
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/");
}

function validationErrorState(error: z.ZodError): PackageFormState {
  return {
    ok: false,
    message: "Check the package details.",
    fieldErrors: error.flatten().fieldErrors
  };
}

function persistenceErrorState(error: unknown): PackageFormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return {
      ok: false,
      message: "A package with this slug already exists.",
      fieldErrors: { slug: ["Use a unique slug."] }
    };
  }

  return { ok: false, message: "Package could not be saved. Try again." };
}

export async function createPackageAction(_: PackageFormState, formData: FormData): Promise<PackageFormState> {
  const user = await requirePackageManager();
  const parsed = packageFormSchema.safeParse(readPackageForm(formData));
  if (!parsed.success) return validationErrorState(parsed.error);

  const auditContext = await getAuditRequestContext();

  try {
    await prisma.$transaction(async (tx) => {
      const packageRecord = await tx.package.create({
        data: {
          slug: parsed.data.slug,
          name: parsed.data.name,
          summary: parsed.data.summary,
          description: parsed.data.description,
          durationDays: parsed.data.durationDays,
          priceMinor: parsed.data.priceMinor,
          currency: parsed.data.currency,
          compareAtPriceMinor: parsed.data.compareAtPriceMinor,
          gatewayProvider: parsed.data.gatewayProvider,
          gatewayPriceRef: parsed.data.gatewayPriceRef,
          grantsTelegramAccess: parsed.data.grantsTelegramAccess,
          isFeatured: parsed.data.isFeatured,
          sortOrder: parsed.data.sortOrder,
          status: parsed.data.status,
          archivedAt: parsed.data.archivedAt,
          features: {
            create: parsed.data.features.map((label, sortOrder) => ({ label, sortOrder }))
          }
        }
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: "PACKAGE_CREATED",
          entityType: "Package",
          entityId: packageRecord.id,
          reason: "Admin package create",
          afterDiff: packageAuditSnapshot(packageRecord),
          ...auditContext
        }
      });
    });
  } catch (error) {
    return persistenceErrorState(error);
  }

  revalidatePackagePaths();
  redirect("/admin/packages");
}

export async function updatePackageAction(packageId: string, _: PackageFormState, formData: FormData): Promise<PackageFormState> {
  const user = await requirePackageManager();
  const parsed = packageFormSchema.safeParse(readPackageForm(formData));
  if (!parsed.success) return validationErrorState(parsed.error);

  const auditContext = await getAuditRequestContext();

  try {
    await prisma.$transaction(async (tx) => {
      const before = await tx.package.findUnique({ where: { id: packageId } });
      if (!before) throw new Error("Package not found.");

      const updated = await tx.package.update({
        where: { id: packageId },
        data: {
          slug: parsed.data.slug,
          name: parsed.data.name,
          summary: parsed.data.summary,
          description: parsed.data.description,
          durationDays: parsed.data.durationDays,
          priceMinor: parsed.data.priceMinor,
          currency: parsed.data.currency,
          compareAtPriceMinor: parsed.data.compareAtPriceMinor,
          gatewayProvider: parsed.data.gatewayProvider,
          gatewayPriceRef: parsed.data.gatewayPriceRef,
          grantsTelegramAccess: parsed.data.grantsTelegramAccess,
          isFeatured: parsed.data.isFeatured,
          sortOrder: parsed.data.sortOrder,
          status: parsed.data.status,
          archivedAt: parsed.data.archivedAt
        }
      });

      await tx.packageFeature.deleteMany({ where: { packageId } });
      await tx.packageFeature.createMany({
        data: parsed.data.features.map((label, sortOrder) => ({
          packageId,
          label,
          sortOrder
        }))
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: "PACKAGE_UPDATED",
          entityType: "Package",
          entityId: packageId,
          reason: "Admin package update",
          beforeDiff: packageAuditSnapshot(before),
          afterDiff: packageAuditSnapshot(updated),
          ...auditContext
        }
      });
    });
  } catch (error) {
    return persistenceErrorState(error);
  }

  revalidatePackagePaths();
  redirect("/admin/packages");
}

export async function archivePackageAction(packageId: string) {
  const user = await requirePackageManager();
  const auditContext = await getAuditRequestContext();

  await prisma.$transaction(async (tx) => {
    const before = await tx.package.findUnique({ where: { id: packageId } });
    if (!before) return;

    const updated = await tx.package.update({
      where: { id: packageId },
      data: {
        status: "ARCHIVED",
        archivedAt: new Date()
      }
    });

    await tx.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "PACKAGE_ARCHIVED",
        entityType: "Package",
        entityId: packageId,
        reason: "Admin archived package",
        beforeDiff: packageAuditSnapshot(before),
        afterDiff: packageAuditSnapshot(updated),
        ...auditContext
      }
    });
  });

  revalidatePackagePaths();
  redirect("/admin/packages");
}

export async function restorePackageAction(packageId: string) {
  const user = await requirePackageManager();
  const auditContext = await getAuditRequestContext();

  await prisma.$transaction(async (tx) => {
    const before = await tx.package.findUnique({ where: { id: packageId } });
    if (!before) return;

    const updated = await tx.package.update({
      where: { id: packageId },
      data: {
        status: "ACTIVE",
        archivedAt: null
      }
    });

    await tx.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "PACKAGE_RESTORED",
        entityType: "Package",
        entityId: packageId,
        reason: "Admin restored package",
        beforeDiff: packageAuditSnapshot(before),
        afterDiff: packageAuditSnapshot(updated),
        ...auditContext
      }
    });
  });

  revalidatePackagePaths();
  redirect("/admin/packages");
}
