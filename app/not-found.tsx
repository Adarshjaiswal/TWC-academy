import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-shell max-w-2xl">
        <p className="text-sm font-black uppercase text-[var(--primary)]">404</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Page not found.</h1>
        <p className="mt-4 text-[var(--muted)]">The page may have moved, or the requested content is not published.</p>
        <ButtonLink className="mt-7" href="/">Return Home</ButtonLink>
      </div>
    </section>
  );
}
