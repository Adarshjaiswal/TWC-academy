import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { faqFixtures } from "@/lib/data/fixtures";

export const dynamic = "force-dynamic";

export default function AdminFaqsPage() {
  return (
    <div className="grid gap-5">
      <Badge>FAQ</Badge>
      <h1 className="text-4xl font-black">FAQ management</h1>
      <div className="grid gap-4">
        {faqFixtures.map((category) => (
          <Card key={category.slug}>
            <h2 className="text-2xl font-black">{category.category}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{category.items.length} seeded questions. Admins can manage category, order, status, question, and answer.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
