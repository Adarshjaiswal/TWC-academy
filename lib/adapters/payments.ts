import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { env } from "@/lib/env";
import { digestPayload, timingSafeEqual } from "@/lib/security";

export type PaymentProvider = "razorpay" | "ziina" | "mock";

export type ProviderCheckoutInput = {
  orderId: string;
  publicOrderId: string;
  amountMinor: number;
  currency: string;
  packageName: string;
  userEmail: string;
};

export type ProviderCheckout = {
  provider: PaymentProvider;
  providerOrderId: string;
  providerCheckoutId?: string;
  checkoutUrl: string;
  publicKey?: string;
  metadata?: Prisma.InputJsonObject;
};

export type NormalizedPaymentEvent = {
  provider: PaymentProvider;
  eventId: string;
  eventType: string;
  paymentId?: string;
  providerOrderId?: string;
  status?: string;
  amountMinor?: number;
  currency?: string;
  method?: string;
  payloadDigest: string;
  safeMetadata?: Prisma.InputJsonObject;
};

type ZiinaPaymentIntent = {
  id: string;
  amount?: number;
  currency_code?: string;
  status?: string;
  redirect_url?: string;
  payment_link?: string;
  checkout_url?: string;
  operation_id?: string;
  account_id?: string;
  expiry?: number;
  allow_tips?: boolean;
  test?: boolean;
  fee_amount?: number;
  tip_amount?: number;
  card_details?: {
    card_brand?: string;
    card_last_four?: string;
    card_last_four_digits?: string;
    card_funding_type?: string;
  };
  latest_error?: {
    code?: string;
    message?: string;
  };
};

function compactJson(input: Record<string, unknown>): Prisma.InputJsonObject {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as Prisma.InputJsonObject;
}

function isPresent(value: string | null | undefined): value is string {
  return Boolean(value);
}

function buildAppUrl(path: string) {
  return new URL(path, env.APP_URL).toString();
}

function createMockCheckout(input: ProviderCheckoutInput): ProviderCheckout {
  return {
    provider: "mock",
    providerOrderId: `mock_${input.publicOrderId}`,
    checkoutUrl: `/packages?checkout=mock&order=${input.publicOrderId}`
  };
}

export async function createProviderCheckout(input: ProviderCheckoutInput): Promise<ProviderCheckout> {
  if (env.PAYMENT_PROVIDER === "mock") return createMockCheckout(input);
  if (env.PAYMENT_PROVIDER === "ziina") return createZiinaCheckout(input);
  return createRazorpayCheckout(input);
}

async function createRazorpayCheckout(input: ProviderCheckoutInput): Promise<ProviderCheckout> {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return createMockCheckout(input);
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

async function createZiinaCheckout(input: ProviderCheckoutInput): Promise<ProviderCheckout> {
  if (!env.ZIINA_API_TOKEN) {
    return createMockCheckout(input);
  }

  const operationId = crypto.randomUUID();
  const expiresAt = Date.now() + env.ZIINA_PAYMENT_EXPIRY_MINUTES * 60 * 1000;
  const response = await fetch(`${env.ZIINA_API_BASE_URL}/payment_intent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ZIINA_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: input.amountMinor,
      currency_code: input.currency.toUpperCase(),
      message: `${input.packageName} - ${input.publicOrderId}`,
      success_url: buildAppUrl(`/checkout/ziina/return?order=${encodeURIComponent(input.publicOrderId)}&state=success`),
      cancel_url: buildAppUrl(`/checkout/ziina/return?order=${encodeURIComponent(input.publicOrderId)}&state=cancelled`),
      failure_url: buildAppUrl(`/checkout/ziina/return?order=${encodeURIComponent(input.publicOrderId)}&state=failed`),
      test: env.ZIINA_TEST_MODE,
      transaction_source: "directApi",
      expiry: String(expiresAt),
      allow_tips: env.ZIINA_ALLOW_TIPS,
      operation_id: operationId
    })
  });

  if (!response.ok) {
    throw new Error("Ziina checkout creation failed.");
  }

  const payload = (await response.json()) as ZiinaPaymentIntent;
  const checkoutUrl = payload.redirect_url ?? payload.payment_link ?? payload.checkout_url;

  if (!payload.id || !checkoutUrl) {
    throw new Error("Ziina checkout response did not include a payment intent redirect URL.");
  }

  return {
    provider: "ziina",
    providerOrderId: payload.id,
    providerCheckoutId: payload.operation_id ?? operationId,
    checkoutUrl,
    metadata: compactJson({
      ziinaPaymentIntentId: payload.id,
      ziinaOperationId: payload.operation_id ?? operationId,
      ziinaStatus: payload.status,
      ziinaTestMode: payload.test ?? env.ZIINA_TEST_MODE,
      ziinaCheckoutUrl: checkoutUrl,
      ziinaSuccessUrl: buildAppUrl(`/checkout/ziina/return?order=${encodeURIComponent(input.publicOrderId)}&state=success`),
      ziinaCancelUrl: buildAppUrl(`/checkout/ziina/return?order=${encodeURIComponent(input.publicOrderId)}&state=cancelled`),
      ziinaFailureUrl: buildAppUrl(`/checkout/ziina/return?order=${encodeURIComponent(input.publicOrderId)}&state=failed`)
    })
  };
}

export async function getZiinaPaymentIntent(paymentIntentId: string) {
  if (!env.ZIINA_API_TOKEN) {
    throw new Error("Ziina API token is not configured.");
  }

  const response = await fetch(`${env.ZIINA_API_BASE_URL}/payment_intent/${encodeURIComponent(paymentIntentId)}`, {
    headers: {
      Authorization: `Bearer ${env.ZIINA_API_TOKEN}`,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Ziina payment intent lookup failed.");
  }

  return (await response.json()) as ZiinaPaymentIntent;
}

export function verifyRazorpayWebhook(rawBody: string, signature: string | null) {
  if (!env.RAZORPAY_WEBHOOK_SECRET || !signature) {
    return env.NODE_ENV !== "production";
  }

  return verifyWebhookSignature(rawBody, env.RAZORPAY_WEBHOOK_SECRET, signature);
}

export function verifyZiinaWebhook(rawBody: string, signature: string | null) {
  if (!env.ZIINA_WEBHOOK_SECRET || !signature) {
    return env.NODE_ENV !== "production";
  }

  return verifyWebhookSignature(rawBody, env.ZIINA_WEBHOOK_SECRET, signature);
}

export function verifyZiinaWebhookSource(headers: Headers) {
  if (env.NODE_ENV !== "production") return true;

  const allowedIps = env.ZIINA_WEBHOOK_ALLOWED_IPS.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!allowedIps.length) return true;

  const forwardedFor = headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    ...(forwardedFor ?? [])
  ].filter(isPresent);

  return candidates.some((candidate) => allowedIps.includes(candidate));
}

export function verifyProviderWebhook(provider: PaymentProvider, rawBody: string, headers: Headers) {
  if (provider === "razorpay") return verifyRazorpayWebhook(rawBody, headers.get("x-razorpay-signature"));
  if (provider === "ziina") return verifyZiinaWebhook(rawBody, headers.get("x-hmac-signature"));
  return env.NODE_ENV !== "production";
}

export function signWebhookPayload(rawBody: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

export function verifyWebhookSignature(rawBody: string, secret: string, signature: string) {
  const expected = signWebhookPayload(rawBody, secret);
  return timingSafeEqual(expected, signature);
}

export function normalizeZiinaPaymentIntent(intent: ZiinaPaymentIntent, eventType = "payment_intent.retrieved"): NormalizedPaymentEvent {
  const payloadDigest = digestPayload(JSON.stringify(intent));
  const status = intent.status?.toLowerCase();

  return {
    provider: "ziina",
    eventId: `${eventType}:${intent.id}:${status ?? "unknown"}:${payloadDigest}`,
    eventType,
    paymentId: intent.id,
    providerOrderId: intent.id,
    status,
    amountMinor: intent.amount,
    currency: intent.currency_code,
    method: intent.card_details?.card_brand,
    payloadDigest,
    safeMetadata: compactJson({
      ziinaStatus: status,
      ziinaOperationId: intent.operation_id,
      ziinaAccountId: intent.account_id,
      ziinaFeeAmount: intent.fee_amount,
      ziinaTipAmount: intent.tip_amount,
      ziinaCardBrand: intent.card_details?.card_brand,
      ziinaCardLastFour: intent.card_details?.card_last_four ?? intent.card_details?.card_last_four_digits,
      ziinaCardFundingType: intent.card_details?.card_funding_type,
      ziinaLatestErrorCode: intent.latest_error?.code,
      ziinaLatestErrorMessage: intent.latest_error?.message
    })
  };
}

export function normalizeWebhookEvent(rawBody: string, provider: PaymentProvider): NormalizedPaymentEvent {
  if (provider === "ziina") {
    const body = JSON.parse(rawBody) as {
      id?: string;
      event_id?: string;
      event?: string;
      type?: string;
      data?: ZiinaPaymentIntent;
      payment_intent?: ZiinaPaymentIntent;
    } & Partial<ZiinaPaymentIntent>;

    const intent = (body.data ?? body.payment_intent ?? body) as Partial<ZiinaPaymentIntent>;
    const eventType = body.event ?? body.type ?? "payment_intent.status.updated";
    const payloadDigest = digestPayload(rawBody);

    if (!intent.id) {
      return {
        provider: "ziina",
        eventId: body.id ?? body.event_id ?? `${eventType}:missing-id:${payloadDigest}`,
        eventType,
        payloadDigest
      };
    }

    const normalized = normalizeZiinaPaymentIntent(intent as ZiinaPaymentIntent, eventType);

    return {
      ...normalized,
      eventId: body.id ?? body.event_id ?? normalized.eventId,
      payloadDigest
    };
  }

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
