import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RazorpayCheckout } from "@/components/checkout/razorpay-checkout";
import { requireUser } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Razorpay Checkout"
};

type RazorpayPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function RazorpayCheckoutPage({ searchParams }: RazorpayPageProps) {
  const user = await requireUser();
  const { order: publicOrderId } = await searchParams;

  if (!publicOrderId) redirect("/dashboard/orders");

  const order = await prisma.order.findFirst({
    include: { package: true },
    where: {
      publicId: publicOrderId,
      userId: user.id
    }
  });

  if (!order) redirect("/dashboard/orders");
  if (order.status === "PAID") redirect("/dashboard/membership");
  if (order.provider !== "razorpay" || !order.providerOrderId || !env.RAZORPAY_KEY_ID) {
    redirect("/dashboard/orders");
  }

  return (
    <section className="section">
      <div className="container-shell max-w-3xl">
        <Badge tone="premium">Secure Payment</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Complete your payment.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Your order was priced on the server. Access activates only after Razorpay sends a verified payment webhook.
        </p>
        <Card className="mt-8">
          <div className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-[var(--muted)]">Order</p>
              <h2 className="mt-2 text-3xl font-black">{order.package.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{order.package.summary}</p>
              <p className="mt-5 text-4xl font-black">{formatMoney(order.amountMinor, order.currency)}</p>
              <p className="mt-2 text-xs font-bold text-[var(--premium)]">Order ID: {order.publicId}</p>
            </div>
            <RazorpayCheckout
              amountMinor={order.amountMinor}
              currency={order.currency}
              customerEmail={user.email}
              customerName={user.name}
              keyId={env.RAZORPAY_KEY_ID}
              logoUrl={`${env.APP_URL}/brand/trade-wave-capital-logo.png`}
              orderId={order.providerOrderId}
              packageName={order.package.name}
              publicOrderId={order.publicId}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
