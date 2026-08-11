import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminTestimonialsPage() {
  return (
    <div className="grid gap-5">
      <Badge>Publishing</Badge>
      <h1 className="text-4xl font-black">Testimonials and results</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Draft, approve, publish, unpublish, reorder, disclose, and manage optimized media for testimonials and result records. Demo seed entries are labelled as placeholders.
        </p>
      </Card>
    </div>
  );
}
