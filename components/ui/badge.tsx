import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "border-[var(--border)] bg-[rgba(255,209,102,0.06)] text-[var(--muted)]",
  success: "border-[rgba(255,209,102,0.35)] bg-[rgba(255,209,102,0.1)] text-[var(--success)]",
  premium: "border-[rgba(229,185,91,0.4)] bg-[rgba(229,185,91,0.12)] text-[var(--premium)]",
  error: "border-[rgba(255,107,107,0.42)] bg-[rgba(255,107,107,0.12)] text-[var(--error)]",
  info: "border-[rgba(255,230,161,0.36)] bg-[rgba(255,230,161,0.1)] text-[var(--info)]"
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentPropsWithoutRef<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-xs font-bold uppercase tracking-normal",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
