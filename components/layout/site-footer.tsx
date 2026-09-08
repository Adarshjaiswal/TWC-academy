import Link from "next/link";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SocialIconLinks } from "@/components/marketing/social-links";
import { env } from "@/lib/env";

const legal = [
  ["Privacy", "/legal/privacy"],
  ["Terms", "/legal/terms"],
  ["Refunds", "/legal/refund"],
  ["Risk", "/legal/trading-risk"],
  ["Advice", "/legal/financial-advice"],
  ["Cookies", "/legal/cookies"]
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div className="space-y-4">
          <BrandLogo className="h-16 w-48" />
          <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
            Trade Wave Capital provides TWC Academy education for Gold, Forex, Crypto, Indices, and risk-first market application.
          </p>
          <p className="risk-copy">
            Trading involves substantial risk. TWC is not a broker, exchange, investment adviser, live trading terminal, or automated trade-execution service.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase text-[var(--text)]">Explore</p>
          <div className="grid gap-2 text-sm text-[var(--muted)]">
            <Link href="/services">Curriculum</Link>
            <Link href="/packages">Programs</Link>
            <Link href="/brokers">Broker Signup</Link>
            <Link href="/results">Results</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase text-[var(--text)]">Legal</p>
          <div className="grid gap-2 text-sm text-[var(--muted)]">
            {legal.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase text-[var(--text)]">Contact</p>
          <div className="grid gap-3 text-sm text-[var(--muted)]">
            <Link className="flex items-center gap-2" href="mailto:ardanishofficial@outlook.com">
              <Mail aria-hidden className="h-4 w-4" />
              ardanishofficial@outlook.com
            </Link>
            <Link className="flex items-center gap-2" href="tel:+971585800746">
              <Phone aria-hidden className="h-4 w-4" />
              +971 58 580 0746
            </Link>
            <Link className="flex items-center gap-2" href={env.TELEGRAM_FREE_CHANNEL_URL}>
              <Send aria-hidden className="h-4 w-4" />
              Free Telegram
            </Link>
            <Link className="flex items-center gap-2" href="/contact">
              <MessageCircle aria-hidden className="h-4 w-4" />
              Enquiry form
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4">
        <div className="container-shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--muted)]">© 2026 Trade Wave Capital. Demo content requires client approval before production use.</p>
          <SocialIconLinks className="sm:justify-end" />
        </div>
      </div>
    </footer>
  );
}
