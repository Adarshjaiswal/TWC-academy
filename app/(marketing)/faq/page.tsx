import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { FaqList } from "@/components/marketing/faq-list";
import { faqFixtures } from "@/lib/data/fixtures";

export const metadata: Metadata = {
  title: "FAQ"
};

export default function FaqPage() {
  return (
    <section className="section">
      <div className="container-shell">
        <Badge>FAQ</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Frequently asked questions.</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-xl border border-[var(--border)] bg-white/[0.035] p-5">
            <p className="font-black">Categories</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {faqFixtures.map((category) => (
                <a className="focus-ring rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)]" href={`#${category.slug}`} key={category.slug}>
                  {category.category}
                </a>
              ))}
            </div>
          </aside>
          <div className="grid gap-8">
            {faqFixtures.map((category) => (
              <section id={category.slug} key={category.slug}>
                <h2 className="mb-4 text-2xl font-black">{category.category}</h2>
                <FaqList items={category.items} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
