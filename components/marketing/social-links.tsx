import { AtSign, Music2, Send } from "lucide-react";
import Link from "next/link";
import { socialLinkFixtures } from "@/lib/data/fixtures";
import { cn } from "@/lib/utils";

type SocialIconLinksProps = {
  className?: string;
};

function SocialIcon({ iconLabel, label }: { iconLabel: string; label: string }) {
  if (iconLabel === "YT") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path d="M21 7.5a3 3 0 0 0-2.1-2.12C17.04 4.88 12 4.88 12 4.88s-5.04 0-6.9.5A3 3 0 0 0 3 7.5 31 31 0 0 0 2.5 12 31 31 0 0 0 3 16.5a3 3 0 0 0 2.1 2.12c1.86.5 6.9.5 6.9.5s5.04 0 6.9-.5A3 3 0 0 0 21 16.5a31 31 0 0 0 .5-4.5A31 31 0 0 0 21 7.5Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m10.2 15 4.7-3-4.7-3v6Z" fill="currentColor" />
      </svg>
    );
  }

  if (iconLabel === "IG") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="4" stroke="currentColor" strokeWidth="1.8" width="16" x="4" y="4" />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16.7" cy="7.3" fill="currentColor" r="1" />
      </svg>
    );
  }

  if (iconLabel === "TG") {
    return <Send aria-hidden="true" className="h-4 w-4" />;
  }

  if (iconLabel === "TH") {
    return <AtSign aria-hidden="true" className="h-4 w-4" />;
  }

  if (iconLabel === "TT") {
    return <Music2 aria-hidden="true" className="h-4 w-4" />;
  }

  return (
    <span aria-hidden="true" className="text-xs font-black uppercase leading-none">
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
