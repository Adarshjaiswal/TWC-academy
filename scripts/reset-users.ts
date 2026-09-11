import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/domain/password";

const confirmation = process.env.CONFIRM_RESET_USERS;
const adminEmail = process.env.RESET_ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.RESET_ADMIN_PASSWORD;
const adminName = process.env.RESET_ADMIN_NAME?.trim() || "TWC Super Admin";

async function resetUsers() {
  if (confirmation !== "DELETE_ALL_USERS") {
    throw new Error("Set CONFIRM_RESET_USERS=DELETE_ALL_USERS to delete all users and create a new admin.");
  }

  if (!adminEmail || !adminPassword) {
    throw new Error("Set RESET_ADMIN_EMAIL and RESET_ADMIN_PASSWORD before running this script.");
  }

  const passwordHash = await hashPassword(adminPassword);

  await prisma.telegramProvisioningJob.deleteMany({});
  await prisma.telegramAccess.deleteMany({});
  await prisma.telegramAccountLink.deleteMany({});

  await prisma.membershipEvent.deleteMany({});
  await prisma.membership.deleteMany({});

  await prisma.payment.deleteMany({});
  await prisma.webhookEvent.deleteMany({});
  await prisma.order.deleteMany({});

  await prisma.supportMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});

  await prisma.notification.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.verificationToken.deleteMany({});

  await prisma.consentRecord.updateMany({
    where: { userId: { not: null } },
    data: { userId: null }
  });
  await prisma.auditLog.updateMany({
    where: { actorUserId: { not: null } },
    data: { actorUserId: null }
  });

  const deletedUsers = await prisma.user.deleteMany({});

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      emailVerified: new Date(),
      passwordHash,
      role: "SUPER_ADMIN"
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  });

  await prisma.userRole.create({
    data: {
      userId: admin.id,
      role: "SUPER_ADMIN",
      reason: "User reset script"
    }
  });

  console.log(`Deleted ${deletedUsers.count} users.`);
  console.log(`Created ${admin.role}: ${admin.email}`);
}

resetUsers()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
