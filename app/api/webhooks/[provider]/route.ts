import { NextResponse } from "next/server";
import { normalizeWebhookEvent, type PaymentProvider, verifyProviderWebhook, verifyZiinaWebhookSource } from "@/lib/adapters/payments";
import { processNormalizedPaymentEvent } from "@/lib/domain/payment-processing";

type Props = {
  params: Promise<{ provider: string }>;
};

export async function POST(request: Request, { params }: Props) {
  const { provider: rawProvider } = await params;
  if (rawProvider !== "razorpay" && rawProvider !== "ziina") {
    return NextResponse.json({ error: "Unsupported provider." }, { status: 404 });
  }
  const provider = rawProvider as PaymentProvider;

  if (provider === "ziina" && !verifyZiinaWebhookSource(request.headers)) {
    return NextResponse.json({ error: "Invalid webhook source." }, { status: 403 });
  }

  const rawBody = await request.text();

  if (!verifyProviderWebhook(provider, rawBody, request.headers)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = normalizeWebhookEvent(rawBody, provider);
  const result = await processNormalizedPaymentEvent(event);

  return NextResponse.json(result);
}
