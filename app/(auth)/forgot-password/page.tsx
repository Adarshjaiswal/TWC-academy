import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Forgot Password"
};

export default function ForgotPasswordPage() {
  return (
    <section className="section">
      <div className="container-shell max-w-lg">
        <h1 className="text-4xl font-black">Reset password</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">The response is intentionally generic to prevent account enumeration.</p>
        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </section>
  );
}
