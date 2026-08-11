import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary:
    "border border-[rgba(255,209,102,0.68)] bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] text-[#120c02] shadow-[0_14px_44px_rgba(255,209,102,0.26)] hover:shadow-[0_18px_54px_rgba(255,209,102,0.34)]",
  secondary:
    "border border-[rgba(255,209,102,0.34)] bg-[linear-gradient(135deg,rgba(255,209,102,0.12),rgba(255,255,255,0.035))] text-[var(--text)] hover:border-[rgba(255,209,102,0.62)] hover:bg-[rgba(255,209,102,0.14)]",
  ghost: "border border-transparent text-[var(--muted)] hover:border-[rgba(255,209,102,0.28)] hover:bg-[rgba(255,209,102,0.08)] hover:text-[var(--text)]",
  danger: "bg-[var(--error)] text-white hover:bg-[#ff8585]"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55",
        "button-futuristic",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & { variant?: ButtonProps["variant"]; children: ReactNode }) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-sm font-bold transition active:scale-[0.98]",
        "button-futuristic",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
