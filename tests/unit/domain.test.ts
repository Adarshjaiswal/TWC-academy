import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/actions/contact";
import { normalizeWebhookEvent, signWebhookPayload, verifyWebhookSignature } from "@/lib/adapters/payments";
import { createServerPricedOrder } from "@/lib/domain/checkout";
import { passwordSchema } from "@/lib/domain/password";
import { hasPermission } from "@/lib/domain/permissions";
import {
  assertMembershipTransition,
  assertOrderTransition,
  assertTelegramTransition,
  shouldExpireMembership
} from "@/lib/domain/state-machines";
import { canCreateOneTimeInvite, isTelegramEligible } from "@/lib/domain/telegram";
import { sanitizeRichText } from "@/lib/security";

describe("checkout pricing", () => {
  it("uses the database package price and ignores client price input", () => {
    const order = createServerPricedOrder({
      userId: "user_1",
      requestedPriceMinor: 1,
      packageRecord: {
        id: "pkg_1",
        slug: "pro",
        name: "Pro",
        priceMinor: 1199900,
        currency: "INR",
        durationDays: 90,
        status: "ACTIVE"
      }
    });

    expect(order.amountMinor).toBe(1199900);
    expect(order.clientPriceIgnored).toBe(true);
  });
});

describe("password validation", () => {
  it("requires strong passwords", () => {
    expect(() => passwordSchema.parse("short")).toThrow();
    expect(passwordSchema.parse("StrongPass123")).toBe("StrongPass123");
  });
});

describe("role permissions", () => {
  it("keeps normal users out of admin permissions", () => {
    expect(hasPermission("USER", "member:read")).toBe(true);
    expect(hasPermission("USER", "admin:overview")).toBe(false);
    expect(hasPermission("SUPER_ADMIN", "admin:settings:write")).toBe(true);
  });
});

describe("state transitions", () => {
  it("allows expected order, membership, and Telegram transitions", () => {
    expect(() => assertOrderTransition("PENDING", "PAID")).not.toThrow();
    expect(() => assertMembershipTransition("ACTIVE", "EXPIRED")).not.toThrow();
    expect(() => assertTelegramTransition("ELIGIBLE", "INVITE_CREATED")).not.toThrow();
  });

  it("rejects unsafe transitions", () => {
    expect(() => assertOrderTransition("FAILED", "PAID")).toThrow();
    expect(() => assertMembershipTransition("EXPIRED", "ACTIVE")).toThrow();
    expect(() => assertTelegramTransition("REVOKED", "JOINED")).toThrow();
  });
});

describe("webhook verification and normalization", () => {
  it("verifies HMAC signatures and normalizes event IDs", () => {
    const raw = JSON.stringify({
      id: "evt_1",
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_1",
            order_id: "order_1",
            amount: 1000,
            currency: "INR",
            status: "captured",
            method: "upi"
          }
        }
      }
    });
    const signature = signWebhookPayload(raw, "secret");

    expect(verifyWebhookSignature(raw, "secret", signature)).toBe(true);
    expect(normalizeWebhookEvent(raw, "razorpay")).toMatchObject({
      eventId: "evt_1",
      eventType: "payment.captured",
      paymentId: "pay_1",
      providerOrderId: "order_1"
    });
  });
});

describe("Telegram eligibility", () => {
  it("allows one-time invite only for eligible active memberships", () => {
    const now = new Date("2026-08-10T00:00:00Z");
    const eligible = isTelegramEligible(
      {
        membershipStatus: "ACTIVE",
        membershipEndsAt: new Date("2026-09-10T00:00:00Z"),
        packageGrantsAccess: true
      },
      now
    );

    expect(eligible).toBe(true);
    expect(canCreateOneTimeInvite({ eligible, currentStatus: "ELIGIBLE" }, now)).toBe(true);
    expect(canCreateOneTimeInvite({ eligible, currentStatus: "JOINED" }, now)).toBe(false);
  });
});

describe("expiry idempotency", () => {
  it("marks only active-like expired memberships as expirable", () => {
    const now = new Date("2026-08-10T00:00:00Z");
    expect(shouldExpireMembership("ACTIVE", new Date("2026-08-09T00:00:00Z"), now)).toBe(true);
    expect(shouldExpireMembership("EXPIRED", new Date("2026-08-09T00:00:00Z"), now)).toBe(false);
  });
});

describe("contact validation and CMS sanitization", () => {
  it("validates contact consent and removes unsafe CMS HTML", () => {
    expect(contactSchema.safeParse({ name: "A", email: "bad", subject: "Hi", message: "short", consent: "on" }).success).toBe(false);
    expect(
      contactSchema.safeParse({
        name: "Ada",
        email: "ada@example.com",
        subject: "Packages",
        message: "Tell me about the quarterly package.",
        consent: "on"
      }).success
    ).toBe(true);
    expect(sanitizeRichText('<p>Hello</p><script>alert("x")</script>')).toBe("<p>Hello</p>");
  });
});
