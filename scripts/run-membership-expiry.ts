import { prisma } from "../lib/prisma";

async function main() {
  const now = new Date();
  const memberships = await prisma.membership.findMany({
    where: {
      status: { in: ["ACTIVE", "EXPIRING", "PAUSED"] },
      endsAt: { lte: now }
    }
  });

  for (const membership of memberships) {
    await prisma.$transaction([
      prisma.membership.update({
        where: { id: membership.id },
        data: {
          status: "EXPIRED",
          events: {
            create: {
              action: "JOB_EXPIRED",
              beforeState: membership.status,
              afterState: "EXPIRED",
              reason: "Background expiry job"
            }
          }
        }
      }),
      prisma.telegramAccess.updateMany({
        where: {
          membershipId: membership.id,
          status: { in: ["ELIGIBLE", "INVITE_CREATED", "JOINED", "FAILED"] }
        },
        data: {
          status: "REVOKED",
          revokedAt: now
        }
      })
    ]);
  }

  console.log(`Expired ${memberships.length} memberships.`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
