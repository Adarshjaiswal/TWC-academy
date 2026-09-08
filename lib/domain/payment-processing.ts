import type { PaymentStatus } from "@prisma/client";
import type { NormalizedPaymentEvent } from "@/lib/adapters/payments";
import { prisma } from "@/lib/prisma";
import { addDays } from "@/lib/utils";

type PaymentOutcome = "paid" | "failed" | "cancelled" | "pending" | "ignored";

function normalizeStatus(status?: string) {
  return status?.toLowerCase().replaceAll("_", "-");
}

function getPaymentOutcome(event: NormalizedPaymentEvent): PaymentOutcome {
  const status = normalizeStatus(event.status);

  if (event.provider === "razorpay") {
    if (event.eventType === "payment.captured" || status === "captured") return "paid";
    if (event.eventType === "payment.failed" || status === "failed") return "failed";
    return "ignored";
  }

  if (event.provider === "ziina") {
    if (status === "completed" || status === "captured" || status === "succeeded" || status === "success") return "paid";
    if (status === "failed" || status === "declined" || status === "expired") return "failed";
    if (status === "canceled" || status === "cancelled") return "cancelled";
    if (status === "pending" || status === "requires-payment-instrument" || status === "requires-action") return "pending";
  }

  return "ignored";
}

function paymentStatusForOutcome(outcome: PaymentOutcome): PaymentStatus | null {
  if (outcome === "paid") return "CAPTURED";
  if (outcome === "failed" || outcome === "cancelled") return "FAILED";
  if (outcome === "pending") return "INITIATED";
  return null;
}

export async function processNormalizedPaymentEvent(event: NormalizedPaymentEvent) {
  const outcome = getPaymentOutcome(event);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.webhookEvent.findUnique({
      where: { provider_eventId: { provider: event.provider, eventId: event.eventId } }
    });
    if (existing?.processedAt) {
      return { duplicate: true, outcome };
    }

    const webhook = existing
      ? await tx.webhookEvent.update({
          where: { id: existing.id },
          data: { attempts: { increment: 1 }, status: "PROCESSING" }
        })
      : await tx.webhookEvent.create({
          data: {
            provider: event.provider,
            eventId: event.eventId,
            eventType: event.eventType,
            payloadDigest: event.payloadDigest,
            attempts: 1,
            status: "PROCESSING"
          }
        });

    if (outcome === "ignored" || !event.providerOrderId) {
      await tx.webhookEvent.update({
        where: { id: webhook.id },
        data: { status: "IGNORED", processedAt: now }
      });
      return { ignored: true, outcome };
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
      return { failed: true, outcome };
    }

    const amountMatches = event.amountMinor === undefined || event.amountMinor === order.amountMinor;
    const currencyMatches = !event.currency || event.currency.toUpperCase() === order.currency.toUpperCase();
    if (outcome === "paid" && (!amountMatches || !currencyMatches)) {
      await tx.webhookEvent.update({
        where: { id: webhook.id },
        data: {
          orderId: order.id,
          status: "FAILED",
          errorMessage: "Payment amount or currency mismatch."
        }
      });
      return { failed: true, outcome, reason: "amount_or_currency_mismatch" };
    }

    const providerPaymentId = event.paymentId ?? event.providerOrderId;
    const paymentStatus = paymentStatusForOutcome(outcome);
    if (providerPaymentId && paymentStatus) {
      await tx.payment.upsert({
        where: { providerPaymentId },
        update: {
          status: paymentStatus,
          providerOrderId: event.providerOrderId,
          amountMinor: event.amountMinor ?? order.amountMinor,
          currency: event.currency ?? order.currency,
          method: event.method,
          safeMetadata: {
            eventType: event.eventType,
            providerStatus: event.status,
            ...(event.safeMetadata ?? {})
          },
          capturedAt: outcome === "paid" ? now : undefined,
          failedAt: outcome === "failed" || outcome === "cancelled" ? now : undefined
        },
        create: {
          orderId: order.id,
          provider: event.provider,
          providerPaymentId,
          providerOrderId: event.providerOrderId,
          status: paymentStatus,
          amountMinor: event.amountMinor ?? order.amountMinor,
          currency: event.currency ?? order.currency,
          method: event.method,
          capturedAt: outcome === "paid" ? now : undefined,
          failedAt: outcome === "failed" || outcome === "cancelled" ? now : undefined,
          safeMetadata: {
            eventType: event.eventType,
            providerStatus: event.status,
            ...(event.safeMetadata ?? {})
          }
        }
      });
    }

    if (outcome === "paid" && order.status !== "PAID") {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          providerPaymentId,
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
              beforeState: order.status,
              afterState: "ACTIVE",
              reason: `Verified ${event.provider} payment event`
            }
          }
        }
      });

      await tx.telegramAccess.create({
        data: {
          userId: order.userId,
          membershipId: membership.id,
          status: order.package.grantsTelegramAccess ? "ELIGIBLE" : "NOT_ELIGIBLE",
          jobs: order.package.grantsTelegramAccess ? { create: { type: "CREATE_INVITE", status: "PENDING" } } : undefined
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

      await tx.auditLog.create({
        data: {
          action: "PAYMENT_VERIFIED",
          entityType: "Order",
          entityId: order.id,
          reason: `Verified ${event.provider} ${event.eventType}`,
          beforeDiff: { status: order.status },
          afterDiff: { status: "PAID", providerPaymentId }
        }
      });
    }

    if ((outcome === "failed" || outcome === "cancelled") && !["PAID", "REFUNDED"].includes(order.status)) {
      const nextStatus = outcome === "cancelled" ? "CANCELLED" : "FAILED";
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: nextStatus,
          providerPaymentId,
          failedAt: outcome === "failed" ? now : undefined,
          cancelledAt: outcome === "cancelled" ? now : undefined
        }
      });

      await tx.notification.create({
        data: {
          userId: order.userId,
          type: "PAYMENT",
          title: outcome === "cancelled" ? "Payment cancelled" : "Payment failed",
          body: outcome === "cancelled" ? "Your checkout was cancelled before payment completion." : "Your payment was not completed. You can try checkout again from packages."
        }
      });

      await tx.auditLog.create({
        data: {
          action: outcome === "cancelled" ? "PAYMENT_CANCELLED" : "PAYMENT_FAILED",
          entityType: "Order",
          entityId: order.id,
          reason: `Verified ${event.provider} ${event.eventType}`,
          beforeDiff: { status: order.status },
          afterDiff: { status: nextStatus, providerPaymentId }
        }
      });
    }

    if (outcome === "pending" && order.status === "CREATED") {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "PENDING" }
      });
    }

    await tx.webhookEvent.update({
      where: { id: webhook.id },
      data: { orderId: order.id, status: "PROCESSED", processedAt: now }
    });

    return { processed: true, outcome, orderId: order.publicId };
  });
}
