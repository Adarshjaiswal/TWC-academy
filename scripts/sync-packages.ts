import { packageFixtures } from "../lib/data/fixtures";
import { env } from "../lib/env";
import { prisma } from "../lib/prisma";

async function syncPackages() {
  for (const [index, plan] of packageFixtures.entries()) {
    const saved = await prisma.package.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        summary: plan.summary,
        description: plan.description,
        durationDays: plan.durationDays,
        priceMinor: plan.priceMinor,
        currency: plan.currency,
        compareAtPriceMinor: plan.compareAtPriceMinor,
        gatewayProvider: env.PAYMENT_PROVIDER,
        grantsTelegramAccess: plan.grantsTelegramAccess,
        isFeatured: plan.isFeatured,
        status: "ACTIVE",
        sortOrder: index
      },
      create: {
        slug: plan.slug,
        name: plan.name,
        summary: plan.summary,
        description: plan.description,
        durationDays: plan.durationDays,
        priceMinor: plan.priceMinor,
        currency: plan.currency,
        compareAtPriceMinor: plan.compareAtPriceMinor,
        gatewayProvider: env.PAYMENT_PROVIDER,
        grantsTelegramAccess: plan.grantsTelegramAccess,
        isFeatured: plan.isFeatured,
        status: "ACTIVE",
        sortOrder: index
      }
    });

    await prisma.$transaction([
      prisma.packageFeature.deleteMany({ where: { packageId: saved.id } }),
      prisma.packageFeature.createMany({
        data: plan.features.map((feature, featureIndex) => ({
          packageId: saved.id,
          label: feature,
          sortOrder: featureIndex
        }))
      })
    ]);
  }

  console.log(`Synced ${packageFixtures.length} active packages.`);
}

syncPackages()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
