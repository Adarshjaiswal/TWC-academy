import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container-shell">
        <Badge>About TWC Academy</Badge>
        <h1 className="mt-4 max-w-4xl text-4xl font-black md:text-6xl">Professional trading education led by discipline, structure, and risk clarity.</h1>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            ["Mission", "Help students build disciplined market-preparation habits through education, analysis, mentorship, and community context."],
            ["Approach", "Teach technical and fundamental decision-making with risk-first planning before any live-market application."],
            ["Risk boundary", "No broker execution, custody, automated trade copying, signal bot, or guaranteed performance claims."]
          ].map(([title, body]) => (
            <Card key={title}>
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-black">A R Danish</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Trader + Founder of TWC Capital / TWC Academy, based in Dubai, UAE, with 9 years of trading experience and 5+ years focused on CFDs.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Why choose TWC</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              The academy combines a structured curriculum, Gold-focused market education, Smart Money Concepts, live sessions, trading psychology, resources, and premium access workflows.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
