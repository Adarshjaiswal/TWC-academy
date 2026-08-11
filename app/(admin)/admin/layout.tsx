import Link from "next/link";
import { ClipboardList, FileText, Home, LifeBuoy, MessageSquare, Package, Receipt, Send, Settings, Shield, Users, WalletCards } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const nav = [
  ["Overview", "/admin", Home],
  ["Users", "/admin/users", Users],
  ["Packages", "/admin/packages", Package],
  ["Orders", "/admin/orders", Receipt],
  ["Memberships", "/admin/memberships", WalletCards],
  ["Telegram", "/admin/telegram", Send],
  ["Content", "/admin/content", FileText],
  ["Testimonials", "/admin/testimonials", MessageSquare],
  ["FAQs", "/admin/faqs", ClipboardList],
  ["Leads", "/admin/leads", Users],
  ["Support", "/admin/support", LifeBuoy],
  ["Settings", "/admin/settings", Settings],
  ["Audit", "/admin/audit-logs", Shield]
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <section className="container-shell grid gap-6 py-8 xl:grid-cols-[280px_1fr]">
      <aside className="h-fit border border-[var(--border)] bg-[var(--surface)] p-4 xl:sticky xl:top-24">
        <Badge tone="premium">Admin</Badge>
        <p className="mt-3 text-lg font-black">{user.name}</p>
        <p className="text-sm text-[var(--muted)]">{user.role}</p>
        <nav className="mt-5 grid max-h-[58vh] gap-1 overflow-y-auto pr-1" aria-label="Admin navigation">
          {nav.map(([label, href, Icon]) => (
            <Link className="focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[rgba(255,209,102,0.08)] hover:text-[var(--text)]" href={href} key={href}>
              <Icon aria-hidden className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-5 border-t border-[var(--border)] pt-4">
          <SignOutButton />
        </div>
      </aside>
      <div>{children}</div>
    </section>
  );
}
