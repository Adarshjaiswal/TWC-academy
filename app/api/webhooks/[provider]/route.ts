import { NextResponse } from "next/server";
import { normalizeWebhookEvent, type NormalizedPaymentEvent, type PaymentProvider, verifyProviderWebhook, verifyZiinaWebhookSource } from "@/lib/adapters/payments";
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

  let event: NormalizedPaymentEvent;
  try {
    event = normalizeWebhookEvent(rawBody, provider);
  } catch (error) {
    console.error("[webhook:normalize-failed]", { provider, error });
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  let result;
  try {
    result = await processNormalizedPaymentEvent(event);
  } catch (error) {
    console.error("[webhook:process-failed]", {
      provider,
      eventId: event.eventId,
      eventType: event.eventType,
      providerOrderId: event.providerOrderId,
      error
    });
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  return NextResponse.json(result);
}
