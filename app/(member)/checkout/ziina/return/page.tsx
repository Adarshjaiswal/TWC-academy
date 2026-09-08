import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getZiinaPaymentIntent, normalizeZiinaPaymentIntent } from "@/lib/adapters/payments";
import { requireUser } from "@/lib/auth/session";
import { processNormalizedPaymentEvent } from "@/lib/domain/payment-processing";
import { prisma } from "@/lib/prisma";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ziina Payment Status"
};

type ZiinaReturnPageProps = {
  searchParams: Promise<{
    order?: string;
    state?: string;
  }>;
};

function statusMessage(status: string) {
  if (status === "PAID") return "Payment verified. Your purchase is active.";
  if (status === "FAILED") return "Payment failed. You can try again from the package page.";
  if (status === "CANCELLED") return "Checkout was cancelled before payment completion.";
  return "Payment is pending provider confirmation.";
}

export default async function ZiinaReturnPage({ searchParams }: ZiinaReturnPageProps) {
  const user = await requireUser();
  const { order: publicOrderId, state } = await searchParams;

  if (!publicOrderId) redirect("/dashboard/orders");

  const order = await prisma.order.findFirst({
    include: { package: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    where: {
      publicId: publicOrderId,
      userId: user.id
    }
  });

  if (!order) redirect("/dashboard/orders");
  if (order.provider !== "ziina") redirect("/dashboard/orders");

  let reconciliationError: string | null = null;
  if (order.providerOrderId && order.status !== "PAID") {
    try {
      const intent = await getZiinaPaymentIntent(order.providerOrderId);
      await processNormalizedPaymentEvent(normalizeZiinaPaymentIntent(intent));
    } catch {
      reconciliationError = "We could not refresh Ziina status immediately. The webhook can still update this order automatically.";
    }
  }

  const latestOrder = await prisma.order.findFirst({
    include: { package: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    where: {
      publicId: publicOrderId,
      userId: user.id
    }
  });

  if (!latestOrder) redirect("/dashboard/orders");

  const payment = latestOrder.payments[0];

  return (
    <section className="section">
      <div className="container-shell max-w-3xl">
        <Badge tone={latestOrder.status === "PAID" ? "success" : latestOrder.status === "FAILED" ? "error" : "premium"}>
          Ziina Payment
        </Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{statusMessage(latestOrder.status)}</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Order state is based on Ziina provider verification, not browser input. Return state: {state ?? "not supplied"}.
        </p>

        <Card className="mt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase text-[var(--muted)]">Package</p>
              <p className="mt-2 text-2xl font-black">{latestOrder.package.name}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{formatMoney(latestOrder.amountMinor, latestOrder.currency)}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[var(--muted)]">Order</p>
              <p className="mt-2 break-all text-sm font-black">{latestOrder.publicId}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Status: {latestOrder.status}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[var(--muted)]">Ziina intent</p>
              <p className="mt-2 break-all text-sm text-[var(--muted)]">{latestOrder.providerOrderId ?? "Not set"}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[var(--muted)]">Verified at</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{latestOrder.paidAt ? formatDate(latestOrder.paidAt) : payment?.capturedAt ? formatDate(payment.capturedAt) : "Pending"}</p>
            </div>
          </div>
          {reconciliationError ? <p className="mt-5 text-sm leading-6 text-[var(--premium)]">{reconciliationError}</p> : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/dashboard/orders" variant="secondary">
              View purchases
            </ButtonLink>
            {latestOrder.status === "PAID" ? (
              <ButtonLink href="/dashboard/membership">Open membership</ButtonLink>
            ) : (
              <ButtonLink href="/packages">Choose package</ButtonLink>
            )}
          </div>
        </Card>

        {latestOrder.checkoutUrl && latestOrder.status === "PENDING" ? (
          <p className="mt-5 text-sm text-[var(--muted)]">
            Need to continue?{" "}
            <Link className="font-black text-[var(--premium)]" href={latestOrder.checkoutUrl}>
              Reopen Ziina checkout
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
