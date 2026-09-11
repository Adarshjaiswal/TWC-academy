import "dotenv/config";
import { packageFixtures } from "../lib/data/fixtures";
import { env } from "../lib/env";
import { prisma } from "../lib/prisma";

async function syncPackages() {
  for (const [index, plan] of packageFixtures.entries()) {
    const packageData = {
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
      status: "ACTIVE" as const,
      sortOrder: index
    };

    const existing = await prisma.package.findUnique({
      where: { slug: plan.slug },
      select: { id: true }
    });

    const saved = existing
      ? await prisma.package.update({
          where: { id: existing.id },
          data: packageData
        })
      : await prisma.package.create({
          data: {
            slug: plan.slug,
            ...packageData
          }
        });

    await prisma.packageFeature.deleteMany({ where: { packageId: saved.id } });

    if (plan.features.length > 0) {
      await prisma.packageFeature.createMany({
        data: plan.features.map((feature, featureIndex) => ({
          packageId: saved.id,
          label: feature,
          sortOrder: featureIndex
        }))
      });
    }
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
