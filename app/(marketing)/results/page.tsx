import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProfitLossChart } from "@/components/marketing/profit-loss-chart";
import { resultFixtures, testimonialFixtures } from "@/lib/data/fixtures";

export const metadata: Metadata = {
  title: "Results"
};

export default function ResultsPage() {
  return (
    <section className="section">
      <div className="container-shell">
        <Badge tone="info">Approved records only</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Results and feedback placeholders.</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          Production must publish only client-approved screenshots, records, dates, captions, source labels, verification labels, and disclaimers.
        </p>
        <div className="mt-10">
          <ProfitLossChart />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {resultFixtures.map((result) => (
            <Card key={result.title}>
              <Badge>{result.sourceLabel}</Badge>
              <h2 className="mt-4 text-2xl font-black">{result.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{result.caption}</p>
              <p className="mt-4 text-xs font-bold text-[var(--premium)]">{result.verificationLabel}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{result.disclosure}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {testimonialFixtures.map((testimonial) => (
            <Card key={testimonial.authorName}>
              <blockquote className="text-lg leading-8">“{testimonial.quote}”</blockquote>
              <p className="mt-4 font-black">{testimonial.authorName}</p>
              <p className="text-sm text-[var(--muted)]">{testimonial.roleLabel}</p>
              <p className="mt-3 text-xs text-[var(--premium)]">{testimonial.disclosure}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
