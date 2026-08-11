"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section">
      <div className="container-shell max-w-2xl">
        <p className="text-sm font-black uppercase text-[var(--error)]">Error</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Something went wrong.</h1>
        <p className="mt-4 text-[var(--muted)]">Try again. If the issue continues, contact support.</p>
        <Button className="mt-7" onClick={reset}>Retry</Button>
      </div>
    </section>
  );
}
