"use client";

import { useSyncExternalStore, useState } from "react";
import { Button } from "@/components/ui/button";

type Consent = {
  analytics: boolean;
  marketing: boolean;
};

export function CookieConsent() {
  const snapshot = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      window.addEventListener("twc-cookie-consent", callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("twc-cookie-consent", callback);
      };
    },
    () => localStorage.getItem("twc-cookie-consent") ?? "missing",
    () => "saved"
  );
  const [consent, setConsent] = useState<Consent>({ analytics: false, marketing: false });
  const visible = snapshot !== "saved";

  if (!visible) return null;

  return (
    <section
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-2xl"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 className="text-base font-black">Cookie Preferences</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Necessary cookies keep the site secure. Analytics and marketing stay off until you opt in.
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
            <label className="flex items-center gap-2">
              <input checked readOnly type="checkbox" />
              Necessary
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={consent.analytics}
                onChange={(event) => setConsent((current) => ({ ...current, analytics: event.target.checked }))}
                type="checkbox"
              />
              Analytics
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={consent.marketing}
                onChange={(event) => setConsent((current) => ({ ...current, marketing: event.target.checked }))}
                type="checkbox"
              />
              Marketing
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              localStorage.setItem("twc-cookie-consent", "saved");
              localStorage.setItem("twc-cookie-preferences", JSON.stringify(consent));
              window.dispatchEvent(new Event("twc-cookie-consent"));
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("twc-cookie-consent", "saved");
              localStorage.setItem("twc-cookie-preferences", JSON.stringify({ analytics: true, marketing: true }));
              window.dispatchEvent(new Event("twc-cookie-consent"));
            }}
            variant="secondary"
          >
            Accept
          </Button>
        </div>
      </div>
    </section>
  );
}
