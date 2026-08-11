import crypto from "node:crypto";
import { env } from "@/lib/env";
import { digestPayload, timingSafeEqual } from "@/lib/security";

export type ProviderCheckoutInput = {
  orderId: string;
  publicOrderId: string;
  amountMinor: number;
  currency: string;
  packageName: string;
  userEmail: string;
};

export type ProviderCheckout = {
  provider: "razorpay" | "mock";
  providerOrderId: string;
  checkoutUrl: string;
  publicKey?: string;
};

export async function createProviderCheckout(input: ProviderCheckoutInput): Promise<ProviderCheckout> {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return {
      provider: "mock",
      providerOrderId: `mock_${input.publicOrderId}`,
      checkoutUrl: `/packages?checkout=mock&order=${input.publicOrderId}`
    };
  }

  const credentials = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: input.amountMinor,
      currency: input.currency,
      receipt: input.publicOrderId,
      notes: {
        appOrderId: input.orderId,
        packageName: input.packageName,
        userEmail: input.userEmail
      }
    })
  });

  if (!response.ok) {
    throw new Error("Payment provider checkout creation failed.");
  }

  const payload = (await response.json()) as { id: string };
  return {
    provider: "razorpay",
    providerOrderId: payload.id,
    publicKey: env.RAZORPAY_KEY_ID,
    checkoutUrl: `/checkout/razorpay?order=${input.publicOrderId}`
  };
}

export function verifyRazorpayWebhook(rawBody: string, signature: string | null) {
  if (!env.RAZORPAY_WEBHOOK_SECRET || !signature) {
    return env.NODE_ENV !== "production";
  }

  return verifyWebhookSignature(rawBody, env.RAZORPAY_WEBHOOK_SECRET, signature);
}

export function signWebhookPayload(rawBody: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

export function verifyWebhookSignature(rawBody: string, secret: string, signature: string) {
  const expected = signWebhookPayload(rawBody, secret);
  return timingSafeEqual(expected, signature);
}

export function normalizeWebhookEvent(rawBody: string, provider: string) {
  const body = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          method?: string;
        };
      };
    };
    id?: string;
  };

  const payment = body.payload?.payment?.entity;
  return {
    provider,
    eventId: body.id ?? `${body.event ?? "unknown"}:${payment?.id ?? digestPayload(rawBody)}`,
    eventType: body.event ?? "unknown",
    paymentId: payment?.id,
    providerOrderId: payment?.order_id,
    status: payment?.status,
    amountMinor: payment?.amount,
    currency: payment?.currency,
    method: payment?.method,
    payloadDigest: digestPayload(rawBody)
  };
}
