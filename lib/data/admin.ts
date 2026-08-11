import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AdminListMap = {
  users: Prisma.UserGetPayload<Record<string, never>>[];
  packages: Prisma.PackageGetPayload<{ include: { features: true } }>[];
  orders: Prisma.OrderGetPayload<{ include: { user: true; package: true } }>[];
  memberships: Prisma.MembershipGetPayload<{ include: { user: true; package: true } }>[];
  tickets: Prisma.SupportTicketGetPayload<{ include: { requester: true } }>[];
  leads: Prisma.ContactLeadGetPayload<Record<string, never>>[];
  audit: Prisma.AuditLogGetPayload<{ include: { actor: true } }>[];
};

export async function getAdminOverview() {
  try {
    const [
      users,
      activeMemberships,
      expiringMemberships,
      paidOrders,
      failedOrders,
      pendingTelegram,
      openTickets,
      auditLogs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.membership.count({ where: { status: "ACTIVE" } }),
      prisma.membership.count({
        where: {
          status: { in: ["ACTIVE", "EXPIRING"] },
          endsAt: { lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) }
        }
      }),
      prisma.order.findMany({ where: { status: "PAID" }, select: { amountMinor: true } }),
      prisma.order.count({ where: { status: "FAILED" } }),
      prisma.telegramAccess.count({ where: { status: { in: ["ELIGIBLE", "FAILED"] } } }),
      prisma.supportTicket.count({ where: { status: { in: ["OPEN", "PENDING_USER"] } } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
    ]);

    return {
      users,
      activeMemberships,
      expiringMemberships,
      revenueMinor: paidOrders.reduce((sum, order) => sum + order.amountMinor, 0),
      failedOrders,
      pendingTelegram,
      openTickets,
      auditLogs
    };
  } catch {
    return {
      users: 0,
      activeMemberships: 0,
      expiringMemberships: 0,
      revenueMinor: 0,
      failedOrders: 0,
      pendingTelegram: 0,
      openTickets: 0,
      auditLogs: []
    };
  }
}

export async function getAdminList<K extends keyof AdminListMap>(kind: K): Promise<AdminListMap[K]> {
  try {
    switch (kind) {
      case "users":
        return (await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 25 })) as AdminListMap[K];
      case "packages":
        return (await prisma.package.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 25, include: { features: true } })) as AdminListMap[K];
      case "orders":
        return (await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 25, include: { user: true, package: true } })) as AdminListMap[K];
      case "memberships":
        return (await prisma.membership.findMany({ orderBy: { createdAt: "desc" }, take: 25, include: { user: true, package: true } })) as AdminListMap[K];
      case "tickets":
        return (await prisma.supportTicket.findMany({ orderBy: { updatedAt: "desc" }, take: 25, include: { requester: true } })) as AdminListMap[K];
      case "leads":
        return (await prisma.contactLead.findMany({ orderBy: { createdAt: "desc" }, take: 25 })) as AdminListMap[K];
      case "audit":
        return (await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { actor: true } })) as AdminListMap[K];
      default:
        return [] as AdminListMap[K];
    }
  } catch {
    return [] as AdminListMap[K];
  }
}
