"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("twc-theme", theme);
  for (const listener of listeners) listener();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => "dark");

  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      aria-label={`Switch to ${nextTheme} mode`}
      className="button-futuristic focus-ring inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[rgba(255,209,102,0.08)] text-[var(--primary)] transition hover:bg-[rgba(255,209,102,0.16)]"
      onClick={() => {
        applyTheme(nextTheme);
      }}
      type="button"
    >
      <Icon aria-hidden className="h-4 w-4" />
    </button>
  );
}
