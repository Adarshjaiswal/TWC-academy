import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Reset Password"
};

type Props = {
  searchParams: Promise<{ email?: string; token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <section className="section">
      <div className="container-shell max-w-lg">
        <h1 className="text-4xl font-black">Choose a new password</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Reset tokens expire and are single-use.</p>
        <div className="mt-8">
          <ResetPasswordForm email={params.email} token={params.token} />
        </div>
      </div>
    </section>
  );
}
