import type { Metadata } from "next";
import { CheckCircle2, CreditCard, Send, XCircle } from "lucide-react";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { packageFixtures } from "@/lib/data/fixtures";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programs"
};

type PackagesPageProps = {
  searchParams: Promise<{
    checkout?: string;
    order?: string;
  }>;
};

function getFixturePlans() {
  return packageFixtures.map((plan) => ({
    ...plan,
    features: [...plan.features],
    id: null
  }));
}

async function getPlans() {
  try {
    const records = await prisma.package.findMany({
      include: {
        features: {
          orderBy: { sortOrder: "asc" }
        }
      },
      orderBy: { sortOrder: "asc" },
      where: { status: "ACTIVE" }
    });

    if (records.length) {
      return records.map((record) => ({
        compareAtPriceMinor: record.compareAtPriceMinor,
        currency: record.currency,
        description: record.description,
        durationDays: record.durationDays,
        features: record.features.map((feature) => feature.label),
        grantsTelegramAccess: record.grantsTelegramAccess,
        id: record.id,
        isFeatured: record.isFeatured,
        name: record.name,
        priceMinor: record.priceMinor,
        slug: record.slug,
        summary: record.summary
      }));
    }
  } catch {
    // Marketing pages remain browsable in local/dev environments without a database.
  }

  return getFixturePlans();
}

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const [{ checkout, order }, user] = await Promise.all([searchParams, getCurrentUser()]);
  const plans = user ? await getPlans() : getFixturePlans();

  return (
    <section className="section">
      <div className="container-shell">
        <Badge tone="premium">Course Comparison</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Compare TWC Academy programs.</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          Starter, Professional, Elite, and VIP follow the supplied brochure structure with server-authoritative checkout records.
        </p>
        {checkout === "mock" && order ? (
          <Card className="mt-6 border-[rgba(255,209,102,0.42)]">
            <p className="text-sm font-black text-[var(--premium)]">Development checkout created</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Order {order} used the mock checkout because live gateway credentials are not configured in this environment.
            </p>
          </Card>
        ) : null}
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card className={plan.isFeatured ? "border-[rgba(229,185,91,0.55)]" : ""} key={plan.slug}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">{plan.name}</h2>
                {plan.isFeatured ? <Badge tone="premium">Best fit</Badge> : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{plan.summary}</p>
              <p className="mt-5 text-4xl font-black">{formatMoney(plan.priceMinor, plan.currency)}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{Math.round(plan.durationDays / 7)} weeks, billed once</p>
              <ul className="mt-6 grid gap-3 text-sm text-[var(--muted)]">
                {plan.features.map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <CheckoutButton className="mt-7 w-full" packageId={plan.id} signedIn={Boolean(user)} />
            </Card>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-[rgba(255,209,102,0.42)]">
            <div className="flex items-start gap-3">
              <CreditCard aria-hidden className="mt-1 h-6 w-6 shrink-0 text-[var(--premium)]" />
              <div>
                <h2 className="text-2xl font-black">Payment gateway ready</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Razorpay checkout creates provider orders server-side. Membership and premium Telegram access activate only after verified payment events are received.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-start gap-3">
              <Send aria-hidden className="mt-1 h-6 w-6 shrink-0 text-[var(--premium)]" />
              <div>
                <h2 className="text-2xl font-black">Premium Telegram signals</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Active memberships unlock premium Telegram instructions for {env.TELEGRAM_PREMIUM_CHANNEL_LABEL}. Signals and market updates are educational and are not automated trade copying.
                </p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="mt-8">
          <h2 className="text-2xl font-black">Included and excluded</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="grid gap-3 text-sm text-[var(--muted)]">
              {["Course curriculum and market-analysis content", "Live sessions, Q&A, and trade reviews", "Risk tools, journals, templates, and checklists", "Premium Telegram signals eligibility when active"].map((item) => (
                <p className="flex gap-2" key={item}><CheckCircle2 className="h-4 w-4 text-[var(--primary)]" /> {item}</p>
              ))}
            </div>
            <div className="grid gap-3 text-sm text-[var(--muted)]">
              {["Broker execution", "MT4/MT5 auto-copying", "Guaranteed returns", "Custody of customer funds"].map((item) => (
                <p className="flex gap-2" key={item}><XCircle className="h-4 w-4 text-[var(--error)]" /> {item}</p>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
