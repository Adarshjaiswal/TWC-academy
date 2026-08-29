import { AtSign, Music2, Send } from "lucide-react";
import Link from "next/link";
import { socialLinkFixtures } from "@/lib/data/fixtures";
import { cn } from "@/lib/utils";

type SocialIconLinksProps = {
  className?: string;
};

const socialDescriptions: Record<string, string> = {
  "Facebook / Meta": "Community announcements and platform updates.",
  Instagram: "Behind-the-scenes updates and short-form education.",
  Telegram: "Real-time updates, trade education, and community alerts.",
  Threads: "Short market thoughts and community conversations.",
  TikTok: "Short educational clips and quick trading concepts.",
  "X / Twitter": "Market updates, quick insights, and TWC announcements.",
  YouTube: "Educational content, market breakdowns, and longer-form lessons."
};

const socialTones: Record<string, string> = {
  "Facebook / Meta": "from-[#1877f2] to-[#4b7cff] border-[#4b7cff]/45",
  Instagram: "from-[#f58529] via-[#dd2a7b] to-[#8134af] border-[#dd2a7b]/45",
  Telegram: "from-[#229ed9] to-[#0277aa] border-[#229ed9]/45",
  Threads: "from-[#151515] to-[#050505] border-white/20",
  TikTok: "from-[#00f2ea] via-[#111111] to-[#ff0050] border-[#00f2ea]/35",
  "X / Twitter": "from-[#050505] to-[#171717] border-white/18",
  YouTube: "from-[#ff0000] to-[#9f0000] border-[#ff0000]/45"
};

function SocialIcon({ iconLabel, label, className }: { iconLabel: string; label: string; className?: string }) {
  if (iconLabel === "YT") {
    return (
      <svg aria-hidden="true" className={cn("h-4 w-4", className)} fill="none" viewBox="0 0 24 24">
        <path d="M21 7.5a3 3 0 0 0-2.1-2.12C17.04 4.88 12 4.88 12 4.88s-5.04 0-6.9.5A3 3 0 0 0 3 7.5 31 31 0 0 0 2.5 12 31 31 0 0 0 3 16.5a3 3 0 0 0 2.1 2.12c1.86.5 6.9.5 6.9.5s5.04 0 6.9-.5A3 3 0 0 0 21 16.5a31 31 0 0 0 .5-4.5A31 31 0 0 0 21 7.5Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m10.2 15 4.7-3-4.7-3v6Z" fill="currentColor" />
      </svg>
    );
  }

  if (iconLabel === "IG") {
    return (
      <svg aria-hidden="true" className={cn("h-4 w-4", className)} fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="4" stroke="currentColor" strokeWidth="1.8" width="16" x="4" y="4" />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16.7" cy="7.3" fill="currentColor" r="1" />
      </svg>
    );
  }

  if (iconLabel === "TG") {
    return <Send aria-hidden="true" className={cn("h-4 w-4", className)} />;
  }

  if (iconLabel === "TH") {
    return <AtSign aria-hidden="true" className={cn("h-4 w-4", className)} />;
  }

  if (iconLabel === "TT") {
    return <Music2 aria-hidden="true" className={cn("h-4 w-4", className)} />;
  }

  return (
    <span aria-hidden="true" className={cn("text-xs font-black uppercase leading-none", className)}>
      {label === "Facebook / Meta" ? "f" : iconLabel}
    </span>
  );
}

export function SocialIconLinks({ className }: SocialIconLinksProps) {
  const liveLinks = socialLinkFixtures.filter((social) => social.href);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {liveLinks.map((social) => (
        <Link
          aria-label={social.label}
          className="focus-ring grid h-9 w-9 place-items-center border border-[rgba(255,209,102,0.34)] bg-[rgba(255,209,102,0.08)] text-[var(--primary)] transition hover:border-[rgba(255,209,102,0.62)] hover:bg-[rgba(255,209,102,0.14)] hover:text-[var(--premium)]"
          href={social.href ?? "#"}
          key={social.label}
          rel="noopener noreferrer"
          target="_blank"
          title={social.label}
        >
          <SocialIcon iconLabel={social.iconLabel} label={social.label} />
        </Link>
      ))}
    </div>
  );
}

export function SocialMediaSection() {
  return (
    <section className="section section-band" id="social-platforms">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black text-[var(--premium)] md:text-5xl">Connect With Us</h2>
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            Join our growing community across all platforms for exclusive content and insights.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {socialLinkFixtures.map((social) => {
            const tone = socialTones[social.label] ?? "from-[var(--surface)] to-[var(--surface-2)] border-[var(--border)]";
            const buttonTone =
              social.href
                ? "border-[rgba(255,209,102,0.32)] bg-[rgba(255,209,102,0.1)] text-[var(--text)] hover:border-[rgba(255,209,102,0.6)] hover:bg-[rgba(255,209,102,0.18)]"
                : "cursor-not-allowed border-[var(--border)] bg-black/20 text-[var(--muted)]";

            return (
              <article className="line-tile flex min-h-[270px] flex-col p-5" key={social.label}>
                <div className={cn("grid h-12 w-12 place-items-center border bg-gradient-to-br text-white shadow-[0_12px_28px_rgba(0,0,0,0.24)]", tone)}>
                  <SocialIcon className="h-6 w-6 text-base" iconLabel={social.iconLabel} label={social.label} />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-black">{social.label}</h3>
                  <p className="mt-1 truncate text-sm text-[var(--muted)]">{social.handle}</p>
                </div>
                <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
                  {socialDescriptions[social.label] ?? "Follow Trade Wave Capital for platform updates and education."}
                </p>
                {social.href ? (
                  <Link
                    className={cn("focus-ring mt-auto inline-flex min-h-10 items-center justify-center border px-4 text-sm font-black transition", buttonTone)}
                    href={social.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Follow on {social.label.replace(" / Twitter", "")}
                  </Link>
                ) : (
                  <span className={cn("mt-auto inline-flex min-h-10 items-center justify-center border px-4 text-sm font-black", buttonTone)}>
                    Coming Soon
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
