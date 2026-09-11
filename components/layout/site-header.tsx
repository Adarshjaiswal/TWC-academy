import Link from "next/link";
import { MessageCircle, UserCircle } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getCurrentUser } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/domain/permissions";
import { env } from "@/lib/env";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Curriculum", "/services"],
  ["Programs", "/packages"],
  ["Brokers", "/brokers"],
  ["Results", "/results"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"]
] as const;

export async function SiteHeader() {
  const user = await getCurrentUser();
  const accountHref = user && isAdminRole(user.role) ? "/admin" : "/dashboard";
  const displayName = user?.name?.split(" ")[0] || "Account";

  return (
    <header className="sticky top-3 z-30 px-3 sm:top-4 sm:px-5 lg:px-6">
      <div className="header-shell mx-auto flex min-h-16 w-full max-w-[1180px] items-center gap-3 border border-[rgba(255,209,102,0.24)] bg-[var(--header-bg)] px-3 py-2 backdrop-blur-xl sm:px-4 lg:min-h-[4.5rem]">
        <Link className="focus-ring flex items-center gap-3 rounded-lg" href="/">
          <BrandLogo className="h-11 w-32 sm:h-12 sm:w-40" priority />
        </Link>
        <nav aria-label="Primary navigation" className="ml-2 hidden items-center gap-1 xl:flex">
          {links.map(([label, href]) => (
            <Link
              className="focus-ring px-2.5 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[rgba(255,209,102,0.08)] hover:text-[var(--text)]"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 xl:flex">
          <ThemeToggle />
          <ButtonLink className="px-3" href={env.TELEGRAM_FREE_CHANNEL_URL} variant="secondary">
            <MessageCircle aria-hidden className="h-4 w-4" />
            Free Telegram
          </ButtonLink>
          {user ? (
            <ButtonLink className="max-w-[9.5rem] px-3" href={accountHref} title={user.email} variant="ghost">
              <UserCircle aria-hidden className="h-4 w-4 shrink-0" />
              <span className="truncate">{displayName}</span>
            </ButtonLink>
          ) : (
            <ButtonLink className="px-3" href="/sign-in" variant="ghost">
              Sign In
            </ButtonLink>
          )}
          <ButtonLink className="px-4" href="/packages">Enroll Today</ButtonLink>
        </div>
        <div className="ml-auto xl:hidden">
          <MobileNav accountHref={accountHref} user={user ? { email: user.email, name: displayName } : null} />
        </div>
      </div>
    </header>
  );
}
