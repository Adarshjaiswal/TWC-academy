"use client";

import { useActionState } from "react";
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
  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Name
          <Input autoComplete="name" name="name" required />
        </Field>
        <Field>
          Email
          <Input autoComplete="email" name="email" required type="email" />
        </Field>
        <Field>
          Password
          <Input autoComplete="new-password" name="password" required type="password" />
        </Field>
        <Field>
          Confirm password
          <Input autoComplete="new-password" name="confirmPassword" required type="password" />
        </Field>
        <label className="flex items-start gap-3 text-sm leading-6 text-[var(--muted)]">
          <input className="mt-1" name="terms" required type="checkbox" />
          I accept the terms, risk disclaimer, and platform limitations.
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-[var(--muted)]">
          <input className="mt-1" name="marketingConsent" type="checkbox" />
          I agree to receive optional marketing updates.
        </label>
        <Status state={state} />
        <Button disabled={pending}>{pending ? "Creating..." : "Create Account"}</Button>
      </form>
    </Card>
  );
}

export function VerifyEmailForm({ email, token }: { email?: string; token?: string }) {
  const [state, action, pending] = useActionState(verifyEmailAction, initialState);
  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Email
          <Input defaultValue={email} name="email" required type="email" />
        </Field>
        <Field>
          Verification token
          <Input defaultValue={token} name="token" required />
        </Field>
        <Status state={state} />
        <Button disabled={pending}>{pending ? "Verifying..." : "Verify Email"}</Button>
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
