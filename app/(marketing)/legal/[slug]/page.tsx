import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { legalPages } from "@/lib/data/fixtures";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug as keyof typeof legalPages];
  return { title: page?.title ?? "Legal" };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = legalPages[slug as keyof typeof legalPages];
  if (!page) notFound();

  return (
    <section className="section">
      <div className="container-shell max-w-4xl">
        <Badge>Legal placeholder</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{page.title}</h1>
        <Card className="mt-8">
          <p className="text-lg leading-8 text-[var(--muted)]">{page.body}</p>
          <p className="risk-copy mt-6">
            Final legal wording must be supplied or approved by qualified counsel before production launch.
          </p>
        </Card>
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}
