import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Field({ className, ...props }: ComponentPropsWithoutRef<"label">) {
  return <label className={cn("grid gap-2 text-sm font-semibold text-[var(--text)]", className)} {...props} />;
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "focus-ring min-h-11 rounded-lg border border-[var(--border)] bg-[#091414] px-3 py-2 text-[var(--text)] placeholder:text-[#708989]",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-32 rounded-lg border border-[var(--border)] bg-[#091414] px-3 py-2 text-[var(--text)] placeholder:text-[#708989]",
        className
      )}
      {...props}
    />
  );
}
