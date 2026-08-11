import { prisma } from "@/lib/prisma";

export async function getMemberOverview(userId: string) {
  try {
    const [membership, orders, telegramAccess, notifications, tickets] = await Promise.all([
      prisma.membership.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { package: true }
      }),
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { package: true }
      }),
      prisma.telegramAccess.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" }
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.supportTicket.findMany({
        where: { requesterId: userId },
        orderBy: { updatedAt: "desc" },
        take: 5
      })
    ]);

    return { membership, orders, telegramAccess, notifications, tickets };
  } catch {
    return {
      membership: null,
      orders: [],
      telegramAccess: null,
      notifications: [],
      tickets: []
    };
  }
}
