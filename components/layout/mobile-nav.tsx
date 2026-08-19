"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

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

export function MobileNav() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="button-futuristic focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[rgba(255,209,102,0.08)] xl:hidden">
        <Menu aria-hidden className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-3 right-3 z-50 flex w-[min(88vw,390px)] flex-col border border-[var(--border)] bg-[var(--background)] p-5 shadow-2xl sm:inset-y-4 sm:right-4">
          <div className="mb-8 flex items-center justify-between">
            <Dialog.Title>
              <BrandLogo className="h-12 w-40" />
              <span className="sr-only">Trade Wave Capital navigation</span>
            </Dialog.Title>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Dialog.Close className="button-futuristic focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[rgba(255,209,102,0.08)]">
                <X aria-hidden className="h-5 w-5" />
                <span className="sr-only">Close navigation</span>
              </Dialog.Close>
            </div>
          </div>
          <nav aria-label="Mobile navigation" className="grid gap-2">
            {links.map(([label, href]) => (
              <Dialog.Close asChild key={href}>
                <Link className="focus-ring px-3 py-3 text-base font-semibold text-[var(--muted)] hover:bg-[rgba(255,209,102,0.08)] hover:text-[var(--text)]" href={href}>
                  {label}
                </Link>
              </Dialog.Close>
            ))}
          </nav>
          <div className="mt-auto grid gap-3 border-t border-[var(--border)] pt-5">
            <Dialog.Close asChild>
              <ButtonLink href="/packages">Enroll Today</ButtonLink>
            </Dialog.Close>
            <Dialog.Close asChild>
              <ButtonLink href="/sign-in" variant="secondary">
                Sign In
              </ButtonLink>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
