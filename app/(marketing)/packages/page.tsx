import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { packageFixtures } from "@/lib/data/fixtures";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programs"
};

export default function PackagesPage() {
  return (
    <section className="section">
      <div className="container-shell">
        <Badge tone="premium">Course Comparison</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Compare TWC Academy programs.</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          Starter, Professional, Elite, and VIP follow the supplied brochure structure with server-authoritative checkout records.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {packageFixtures.map((plan) => (
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
              <ButtonLink className="mt-7 w-full" href="/sign-in">Enroll Today</ButtonLink>
            </Card>
          ))}
        </div>
        <Card className="mt-8">
          <h2 className="text-2xl font-black">Included and excluded</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="grid gap-3 text-sm text-[var(--muted)]">
              {["Course curriculum and market-analysis content", "Live sessions, Q&A, and trade reviews", "Risk tools, journals, templates, and checklists", "Premium Telegram eligibility when active"].map((item) => (
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
