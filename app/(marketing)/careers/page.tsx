import type { Metadata } from "next";
import { BriefcaseBusiness, CheckCircle2, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const careerAreas = [
  "Trading education and mentorship",
  "Market research and content",
  "Community support",
  "Sales and admissions coordination",
  "Video editing and social media"
] as const;

const expectations = [
  "Risk-first communication",
  "Clear student support",
  "No guaranteed profit claims",
  "No client fund handling",
  "No live trade execution"
] as const;

export const metadata: Metadata = {
  title: "Careers"
};

export default function CareersPage() {
  return (
    <section className="section">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <Badge tone="premium">Careers</Badge>
            <h1 className="mt-4 text-4xl font-black md:text-6xl">Build with Trade Wave Capital.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
              We are open to disciplined educators, market-content creators, community specialists, and operations partners who can support structured trading education.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="mailto:ardanishofficial@outlook.com?subject=Career%20Application%20-%20Trade%20Wave%20Capital">
                <Mail aria-hidden className="h-4 w-4" />
                Apply by Email
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact Team
              </ButtonLink>
            </div>
          </div>

          <Card className="grid gap-5 sm:grid-cols-2">
            <div className="line-tile p-5">
              <MapPin aria-hidden className="h-5 w-5 text-[var(--premium)]" />
              <h2 className="mt-4 text-xl font-black">Location</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Dubai, UAE and remote collaboration.</p>
            </div>
            <div className="line-tile p-5">
              <Users aria-hidden className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="mt-4 text-xl font-black">Who fits</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">People with trading education, content, sales, or community experience.</p>
            </div>
            <div className="line-tile p-5 sm:col-span-2">
              <ShieldCheck aria-hidden className="h-5 w-5 text-[var(--premium)]" />
              <h2 className="mt-4 text-xl font-black">Important boundary</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                TWC does not hire for broker execution, client fund handling, account management, guaranteed-return promotion, or automated trade copying.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card>
            <Badge>Open Areas</Badge>
            <h2 className="mt-4 text-3xl font-black">Career and collaboration options.</h2>
            <div className="mt-6 grid gap-3">
              {careerAreas.map((area) => (
                <div className="line-tile flex items-center gap-3 p-4 text-sm font-bold" key={area}>
                  <BriefcaseBusiness aria-hidden className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                  {area}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Badge tone="info">Application Standard</Badge>
            <h2 className="mt-4 text-3xl font-black">What we expect.</h2>
            <div className="mt-6 grid gap-3">
              {expectations.map((expectation) => (
                <div className="line-tile flex items-center gap-3 p-4 text-sm font-bold" key={expectation}>
                  <CheckCircle2 aria-hidden className="h-4 w-4 shrink-0 text-[var(--premium)]" />
                  {expectation}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
