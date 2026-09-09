"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
  signUpAction,
  verifyEmailAction,
  type FormState
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-field";

const initialState: FormState = { ok: false, message: "" };

const passwordRules = [
  ["length", "At least 10 characters"],
  ["lowercase", "One lowercase letter"],
  ["uppercase", "One uppercase letter"],
  ["number", "One number"]
] as const;

function Status({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p aria-live="polite" className={state.ok ? "text-sm text-[var(--success)]" : "text-sm text-[var(--error)]"}>
      {state.message}
    </p>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, initialState);
  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Email
          <Input autoComplete="email" name="email" required type="email" />
        </Field>
        <Field>
          Password
          <Input autoComplete="current-password" name="password" required type="password" />
        </Field>
        <Status state={state} />
        <Button disabled={pending}>{pending ? "Signing in..." : "Sign In"}</Button>
      </form>
    </Card>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, initialState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const passwordState = useMemo(
    () => ({
      length: password.length >= 10,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password)
    }),
    [password]
  );
  const passwordReady = Object.values(passwordState).every(Boolean);
  const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const confirmReady = Boolean(confirmPassword) && password === confirmPassword;
  const formReady = name.trim().length >= 2 && emailReady && passwordReady && confirmReady && termsAccepted;

  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Name
          <Input autoComplete="name" name="name" onChange={(event) => setName(event.target.value)} required value={name} />
        </Field>
        <Field>
          Email
          <Input autoComplete="email" name="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
        </Field>
        <Field>
          Password
          <Input
            aria-describedby="signup-password-rules"
            autoComplete="new-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </Field>
        <div className="grid gap-2 rounded-lg border border-[var(--border)] bg-[rgba(255,209,102,0.06)] p-3" id="signup-password-rules">
          <p className="text-xs font-black uppercase text-[var(--muted)]">Password requirements</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {passwordRules.map(([key, label]) => {
              const met = passwordState[key];
              return (
                <p className={met ? "text-sm font-semibold text-[var(--success)]" : "text-sm text-[var(--muted)]"} key={key}>
                  <span aria-hidden>{met ? "OK" : "-"}</span> {label}
                </p>
              );
            })}
          </div>
        </div>
        <Field>
          Confirm password
          <Input
            autoComplete="new-password"
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            type="password"
            value={confirmPassword}
          />
        </Field>
        {confirmPassword ? (
          <p className={confirmReady ? "text-sm font-semibold text-[var(--success)]" : "text-sm text-[var(--error)]"}>
            {confirmReady ? "Passwords match." : "Passwords must match."}
          </p>
        ) : null}
        <label className="flex items-start gap-3 text-sm leading-6 text-[var(--muted)]">
          <input className="mt-1" name="terms" onChange={(event) => setTermsAccepted(event.target.checked)} required type="checkbox" />
          I accept the terms, risk disclaimer, and platform limitations.
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-[var(--muted)]">
          <input className="mt-1" name="marketingConsent" type="checkbox" />
          I agree to receive optional marketing updates.
        </label>
        <Status state={state} />
        <Button disabled={pending || !formReady}>{pending ? "Creating..." : "Create Account"}</Button>
      </form>
    </Card>
  );
}

export function VerifyEmailForm({ email, token }: { email?: string; token?: string }) {
  const [state, action, pending] = useActionState(verifyEmailAction, initialState);
  const router = useRouter();
  const canVerify = Boolean(email && token);

  useEffect(() => {
    if (!state.ok) return;

    const timeout = window.setTimeout(() => {
      router.replace("/sign-in");
    }, 1400);

    return () => window.clearTimeout(timeout);
  }, [router, state.ok]);

  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Email
          <Input defaultValue={email} name="email" readOnly required type="email" />
        </Field>
        <input name="token" type="hidden" value={token ?? ""} />
        {!canVerify ? (
          <p className="text-sm leading-6 text-[var(--muted)]">
            Open the verification link sent to your email inbox.
          </p>
        ) : null}
        <Status state={state} />
        {state.ok ? <p className="text-sm text-[var(--muted)]">Redirecting to sign in...</p> : null}
        <Button disabled={pending || !canVerify || state.ok}>{pending ? "Verifying..." : "Verify Email"}</Button>
      </form>
    </Card>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initialState);
  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Email
          <Input autoComplete="email" name="email" required type="email" />
        </Field>
        <Status state={state} />
        <Button disabled={pending}>{pending ? "Sending..." : "Send Reset Link"}</Button>
      </form>
    </Card>
  );
}

export function ResetPasswordForm({ email, token }: { email?: string; token?: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, initialState);
  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Email
          <Input defaultValue={email} name="email" required type="email" />
        </Field>
        <Field>
          Reset token
          <Input defaultValue={token} name="token" required />
        </Field>
        <Field>
          New password
          <Input autoComplete="new-password" name="password" required type="password" />
        </Field>
        <Field>
          Confirm password
          <Input autoComplete="new-password" name="confirmPassword" required type="password" />
        </Field>
        <Status state={state} />
        <Button disabled={pending}>{pending ? "Updating..." : "Update Password"}</Button>
      </form>
    </Card>
  );
}
