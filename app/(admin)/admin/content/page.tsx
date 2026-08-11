import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  return (
    <div className="grid gap-5">
      <Badge>CMS</Badge>
      <h1 className="text-4xl font-black">Lightweight content management</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted)]">
          ContentBlock, Service, SiteSetting, legal placeholder, SEO metadata, CTA, footer, and navigation records are represented in the schema. Rich text is constrained and sanitized before persistence.
        </p>
      </Card>
    </div>
  );
}
