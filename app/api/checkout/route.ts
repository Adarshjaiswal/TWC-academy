import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createProviderCheckout } from "@/lib/adapters/payments";
import { checkoutRequestSchema, createServerPricedOrder } from "@/lib/domain/checkout";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });

  const packageRecord = await prisma.package.findUnique({ where: { id: parsed.data.packageId } });
  if (!packageRecord) return NextResponse.json({ error: "Package not found." }, { status: 404 });

  const pricedOrder = createServerPricedOrder({
    userId: user.id,
    packageRecord: {
      id: packageRecord.id,
      slug: packageRecord.slug,
      name: packageRecord.name,
      priceMinor: packageRecord.priceMinor,
      currency: packageRecord.currency,
      durationDays: packageRecord.durationDays,
      status: packageRecord.status
    }
  });

  const order = await prisma.order.create({
    data: {
      ...pricedOrder,
      provider: "razorpay",
      status: "CREATED"
    }
  });

  const checkout = await createProviderCheckout({
    orderId: order.id,
    publicOrderId: order.publicId,
    amountMinor: order.amountMinor,
    currency: order.currency,
    packageName: packageRecord.name,
    userEmail: user.email
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PENDING",
      provider: checkout.provider,
      providerOrderId: checkout.providerOrderId,
      checkoutUrl: checkout.checkoutUrl
    }
  });

  return NextResponse.json({
    orderId: order.publicId,
    provider: checkout.provider,
    checkoutUrl: checkout.checkoutUrl,
    publicKey: checkout.publicKey
  });
}
