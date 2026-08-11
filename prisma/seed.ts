import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/domain/password";
import { addDays } from "../lib/utils";
import { faqFixtures, packageFixtures, resultFixtures, serviceFixtures, testimonialFixtures } from "../lib/data/fixtures";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to run development seed in production.");
  }

  const adminEmail = process.env.SEED_SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Set SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD before seeding.");
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      role: "SUPER_ADMIN",
      emailVerified: new Date()
    },
    create: {
      name: "TWC Super Admin",
      email: adminEmail.toLowerCase(),
      emailVerified: new Date(),
      passwordHash: await hashPassword(adminPassword),
      role: "SUPER_ADMIN",
      roleAssignments: {
        create: { role: "SUPER_ADMIN", reason: "Development seed" }
      }
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "member.demo@example.com" },
    update: {},
    create: {
      name: "Demo Member",
      email: "member.demo@example.com",
      emailVerified: new Date(),
      passwordHash: await hashPassword("DemoMember123"),
      role: "USER",
      marketingConsent: true,
      roleAssignments: {
        create: { role: "USER", reason: "Development seed" }
      }
    }
  });

  const supportAdmin = await prisma.user.upsert({
    where: { email: "support.demo@example.com" },
    update: {},
    create: {
      name: "Support Admin",
      email: "support.demo@example.com",
      emailVerified: new Date(),
      passwordHash: await hashPassword("SupportAdmin123"),
      role: "SUPPORT_ADMIN",
      roleAssignments: {
        create: { role: "SUPPORT_ADMIN", reason: "Development seed" }
      }
    }
  });

  for (const [index, plan] of packageFixtures.entries()) {
    await prisma.package.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        summary: plan.summary,
        description: plan.description,
        durationDays: plan.durationDays,
        priceMinor: plan.priceMinor,
        currency: plan.currency,
        compareAtPriceMinor: plan.compareAtPriceMinor,
        isFeatured: plan.isFeatured,
        grantsTelegramAccess: plan.grantsTelegramAccess,
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
        isFeatured: plan.isFeatured,
        grantsTelegramAccess: plan.grantsTelegramAccess,
        status: "ACTIVE",
        sortOrder: index,
        features: {
          create: plan.features.map((feature, featureIndex) => ({ label: feature, sortOrder: featureIndex }))
        }
      }
    });
  }

  for (const [index, service] of serviceFixtures.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, status: "PUBLISHED", sortOrder: index },
      create: { ...service, status: "PUBLISHED", sortOrder: index }
    });
  }

  for (const category of faqFixtures) {
    const savedCategory = await prisma.faqCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.category },
      create: { slug: category.slug, name: category.category }
    });

    for (const [index, item] of category.items.entries()) {
      await prisma.faqItem.upsert({
        where: {
          categoryId_question: {
            categoryId: savedCategory.id,
            question: item.question
          }
        },
        update: {
          answer: item.answer,
          status: "PUBLISHED",
          sortOrder: index
        },
        create: {
          categoryId: savedCategory.id,
          question: item.question,
          answer: item.answer,
          status: "PUBLISHED",
          sortOrder: index
        }
      });
    }
  }

  for (const [index, testimonial] of testimonialFixtures.entries()) {
    await prisma.testimonial.upsert({
      where: { authorName: testimonial.authorName },
      update: {
        quote: testimonial.quote,
        disclosure: testimonial.disclosure,
        roleLabel: testimonial.roleLabel,
        status: "PUBLISHED",
        sortOrder: index,
        approvedAt: new Date(),
        publishedAt: new Date()
      },
      create: {
        ...testimonial,
        status: "PUBLISHED",
        sortOrder: index,
        approvedAt: new Date(),
        publishedAt: new Date()
      }
    });
  }

  for (const [index, result] of resultFixtures.entries()) {
    await prisma.performanceResult.upsert({
      where: { title: result.title },
      update: {
        caption: result.caption,
        sourceLabel: result.sourceLabel,
        verificationLabel: result.verificationLabel,
        disclosure: result.disclosure,
        status: "PUBLISHED",
        sortOrder: index
      },
      create: {
        ...result,
        resultDate: new Date(),
        status: "PUBLISHED",
        sortOrder: index
      }
    });
  }

  const starter = await prisma.package.findUniqueOrThrow({ where: { slug: "starter" } });
  const order = await prisma.order.upsert({
    where: { publicId: "demo-paid-order" },
    update: {},
    create: {
      publicId: "demo-paid-order",
      userId: demoUser.id,
      packageId: starter.id,
      status: "PAID",
      amountMinor: starter.priceMinor,
      currency: starter.currency,
      provider: "mock",
      providerOrderId: "mock_demo_order",
      providerPaymentId: "mock_demo_payment",
      paidAt: new Date()
    }
  });

  const membership = await prisma.membership.upsert({
    where: { orderId: order.id },
    update: {},
    create: {
      userId: demoUser.id,
      packageId: starter.id,
      orderId: order.id,
      status: "ACTIVE",
      startsAt: new Date(),
      endsAt: addDays(new Date(), 30),
      events: {
        create: { action: "SEED_ACTIVATED", afterState: "ACTIVE", reason: "Development demo data" }
      }
    }
  });

  await prisma.telegramAccess.upsert({
    where: { id: "demo-telegram-access" },
    update: {},
    create: {
      id: "demo-telegram-access",
      userId: demoUser.id,
      membershipId: membership.id,
      status: "ELIGIBLE"
    }
  });

  const ticket = await prisma.supportTicket.upsert({
    where: { publicId: "demo-support-ticket" },
    update: {},
    create: {
      publicId: "demo-support-ticket",
      requesterId: demoUser.id,
      assigneeId: supportAdmin.id,
      subject: "Premium Telegram setup question",
      category: "TELEGRAM",
      status: "OPEN"
    }
  });

  const existingMessage = await prisma.supportMessage.findFirst({
    where: {
      ticketId: ticket.id,
      authorId: demoUser.id,
      body: "How do I access the premium Telegram channel after payment?"
    }
  });
  if (!existingMessage) {
    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        authorId: demoUser.id,
        body: "How do I access the premium Telegram channel after payment?"
      }
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "telegram.freeChannelUrl" },
    update: { value: "https://t.me/twc_free_demo", public: true },
    create: {
      key: "telegram.freeChannelUrl",
      label: "Free Telegram URL",
      value: "https://t.me/twc_free_demo",
      public: true,
      description: "Public free-channel link. Private channel IDs stay in environment variables."
    }
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: "SEED_COMPLETED",
      entityType: "Database",
      reason: "Development seed data"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
