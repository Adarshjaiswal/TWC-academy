import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceFixtures } from "@/lib/data/fixtures";

export const metadata: Metadata = {
  title: "Curriculum"
};

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container-shell">
        <Badge>Course Curriculum</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Structured learning from market basics to live-market application.</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          TWC Academy covers technical analysis, Smart Money Concepts, Gold, risk management, psychology, fundamentals, and live sessions.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceFixtures.map((service) => (
            <Card key={service.slug}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.summary}</CardDescription>
              </CardHeader>
              <p className="text-sm leading-6 text-[var(--muted)]">{service.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
