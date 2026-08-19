import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brokerFixtures } from "@/lib/data/fixtures";

export function BrokerListSection() {
  return (
    <section className="section section-band" id="brokers">
      <div className="container-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Badge tone="premium">Broker Signup</Badge>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">Collaborated broker list with direct signup links.</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Open broker accounts on the broker websites through the supplied links. TWC does not hold client funds, place trades, or operate broker execution.
            </p>
          </div>
          <p className="risk-copy max-w-sm">
            Broker availability, onboarding, leverage, and product access depend on each broker and the user&apos;s jurisdiction.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {brokerFixtures.map((broker) => (
            <Card className="flex min-h-[440px] flex-col" key={broker.slug}>
              <div className="flex h-24 items-center justify-center border border-[rgba(255,209,102,0.16)] bg-white p-4">
                {broker.logoSrc ? (
                  <Image
                    alt={broker.logoAlt}
                    className="max-h-14 w-auto object-contain"
                    height={96}
                    loading="eager"
                    src={broker.logoSrc}
                    unoptimized={broker.logoSrc.endsWith(".svg")}
                    width={220}
                  />
                ) : (
                  <span className="text-2xl font-black tracking-normal text-[#0752c7]">{broker.logoText}</span>
                )}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <ShieldCheck aria-hidden className="h-4 w-4 text-[var(--premium)]" />
                <h3 className="text-2xl font-black">{broker.name}</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{broker.description}</p>
              <div className="mt-5 grid gap-2 text-xs font-bold text-[var(--muted)]">
                {broker.details.map((detail) => (
                  <span className="border-l border-[var(--border)] pl-3" key={detail}>
                    {detail}
                  </span>
                ))}
              </div>
              <ButtonLink
                className="mt-auto w-full"
                href={broker.signupUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Sign Up <ArrowUpRight aria-hidden className="h-4 w-4" />
              </ButtonLink>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
