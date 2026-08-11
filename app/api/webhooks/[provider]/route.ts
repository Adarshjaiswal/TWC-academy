import { NextResponse } from "next/server";
import { normalizeWebhookEvent, verifyRazorpayWebhook } from "@/lib/adapters/payments";
import { addDays } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ provider: string }>;
};

export async function POST(request: Request, { params }: Props) {
  const { provider } = await params;
  if (provider !== "razorpay") return NextResponse.json({ error: "Unsupported provider." }, { status: 404 });

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhook(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = normalizeWebhookEvent(rawBody, provider);

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.webhookEvent.findUnique({
      where: { provider_eventId: { provider, eventId: event.eventId } }
    });
    if (existing?.processedAt) {
      return { duplicate: true };
    }

    const webhook = existing
      ? await tx.webhookEvent.update({
          where: { id: existing.id },
          data: { attempts: { increment: 1 }, status: "PROCESSING" }
        })
      : await tx.webhookEvent.create({
          data: {
            provider,
            eventId: event.eventId,
            eventType: event.eventType,
            payloadDigest: event.payloadDigest,
            attempts: 1,
            status: "PROCESSING"
          }
        });

    if (event.eventType !== "payment.captured" || !event.providerOrderId || !event.paymentId) {
      await tx.webhookEvent.update({
        where: { id: webhook.id },
        data: { status: "IGNORED", processedAt: new Date() }
      });
      return { ignored: true };
    }

    const order = await tx.order.findUnique({
      where: { providerOrderId: event.providerOrderId },
      include: { package: true }
    });

    if (!order) {
      await tx.webhookEvent.update({
        where: { id: webhook.id },
        data: { status: "FAILED", errorMessage: "Order not found." }
      });
      return { failed: true };
    }

    await tx.payment.upsert({
      where: { providerPaymentId: event.paymentId },
      update: {
        status: "CAPTURED",
        capturedAt: new Date(),
        safeMetadata: {
          eventType: event.eventType,
          method: event.method
        }
      },
      create: {
        orderId: order.id,
        provider,
        providerPaymentId: event.paymentId,
        providerOrderId: event.providerOrderId,
        status: "CAPTURED",
        amountMinor: event.amountMinor ?? order.amountMinor,
        currency: event.currency ?? order.currency,
        method: event.method,
        capturedAt: new Date(),
        safeMetadata: {
          eventType: event.eventType
        }
      }
    });

    if (order.status !== "PAID") {
      const now = new Date();
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          providerPaymentId: event.paymentId,
          paidAt: now
        }
      });

      const membership = await tx.membership.create({
        data: {
          userId: order.userId,
          packageId: order.packageId,
          orderId: order.id,
          status: "ACTIVE",
          startsAt: now,
          endsAt: addDays(now, order.package.durationDays),
          events: {
            create: {
              action: "PAYMENT_ACTIVATED",
              beforeState: "PENDING",
              afterState: "ACTIVE",
              reason: "Verified payment webhook"
            }
          }
        }
      });

      await tx.telegramAccess.create({
        data: {
          userId: order.userId,
          membershipId: membership.id,
          status: order.package.grantsTelegramAccess ? "ELIGIBLE" : "NOT_ELIGIBLE",
          jobs: order.package.grantsTelegramAccess
            ? { create: { type: "CREATE_INVITE", status: "PENDING" } }
            : undefined
        }
      });

      await tx.notification.create({
        data: {
          userId: order.userId,
          type: "PAYMENT",
          title: "Payment verified",
          body: "Your membership was activated after verified payment confirmation."
        }
      });
    }

    await tx.webhookEvent.update({
      where: { id: webhook.id },
      data: { orderId: order.id, status: "PROCESSED", processedAt: new Date() }
    });

    return { processed: true };
  });

  return NextResponse.json(result);
}
