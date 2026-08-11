import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Sign In"
};

export default function SignInPage() {
  return (
    <section className="section">
      <div className="container-shell max-w-lg">
        <h1 className="text-4xl font-black">Sign in</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Access your dashboard, orders, support, and Telegram status.</p>
        <div className="mt-8">
          <SignInForm />
        </div>
        <div className="mt-5 flex justify-between text-sm text-[var(--muted)]">
          <Link href="/sign-up">Create account</Link>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </section>
  );
}
