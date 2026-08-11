import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (request.headers.get("x-cron-secret") !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const now = new Date();
  const expired = await prisma.membership.findMany({
    where: {
      status: { in: ["ACTIVE", "EXPIRING", "PAUSED"] },
      endsAt: { lte: now }
    }
  });

  await prisma.$transaction(async (tx) => {
    for (const membership of expired) {
      await tx.membership.update({
        where: { id: membership.id },
        data: {
          status: "EXPIRED",
          events: {
            create: {
              action: "CRON_EXPIRED",
              beforeState: membership.status,
              afterState: "EXPIRED",
              reason: "Membership end date reached"
            }
          }
        }
      });

      await tx.telegramAccess.updateMany({
        where: { membershipId: membership.id, status: { in: ["ELIGIBLE", "INVITE_CREATED", "JOINED", "FAILED"] } },
        data: { status: "REVOKED", revokedAt: now }
      });
    }
  });

  return NextResponse.json({ expired: expired.length });
}

export async function GET(request: Request) {
  return POST(request);
}
