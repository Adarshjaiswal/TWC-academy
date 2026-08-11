import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-5">
      <Badge>Settings</Badge>
      <h1 className="text-4xl font-black">Public settings and metadata</h1>
      <Card>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Public contact/social URLs, payment public metadata, Telegram labels, email sender metadata, SEO defaults, and maintenance mode are editable. Secrets stay in environment variables or a secrets manager and are never shown as plaintext.
        </p>
      </Card>
    </div>
  );
}
