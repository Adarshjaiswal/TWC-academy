import Link from "next/link";
import { CreditCard, Home, LifeBuoy, Send, User, WalletCards } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const nav = [
  ["Overview", "/dashboard", Home],
  ["Membership", "/dashboard/membership", WalletCards],
  ["Orders", "/dashboard/orders", CreditCard],
  ["Telegram", "/dashboard/telegram", Send],
  ["Profile", "/dashboard/profile", User],
  ["Support", "/dashboard/support", LifeBuoy]
] as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <section className="container-shell grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit border border-[var(--border)] bg-[var(--surface)] p-4 lg:sticky lg:top-24">
        <div className="mb-5">
          <Badge tone="success">Member</Badge>
          <p className="mt-3 text-lg font-black">{user.name}</p>
          <p className="text-sm text-[var(--muted)]">{user.email}</p>
        </div>
        <nav className="grid gap-1" aria-label="Dashboard navigation">
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
