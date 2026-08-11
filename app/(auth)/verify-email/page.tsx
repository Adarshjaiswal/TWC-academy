import type { Metadata } from "next";
import { VerifyEmailForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Verify Email"
};

type Props = {
  searchParams: Promise<{ email?: string; token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <section className="section">
      <div className="container-shell max-w-lg">
        <h1 className="text-4xl font-black">Verify email</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Development mode logs verification links through the email adapter.</p>
        <div className="mt-8">
          <VerifyEmailForm email={params.email} token={params.token} />
        </div>
      </div>
    </section>
  );
}
