import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Sign Up"
};

export default function SignUpPage() {
  return (
    <section className="section">
      <div className="container-shell max-w-lg">
        <h1 className="text-4xl font-black">Create account</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Sign up with separate terms acceptance and optional marketing consent.</p>
        <div className="mt-8">
          <SignUpForm />
        </div>
        <p className="mt-5 text-sm text-[var(--muted)]">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
