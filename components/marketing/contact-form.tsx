"use client";

import { useActionState } from "react";
import { submitContactAction, type ContactState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form-field";

const initialState: ContactState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactAction, initialState);

  return (
    <Card>
      <form action={action} className="grid gap-4">
        <Field>
          Name
          <Input autoComplete="name" name="name" placeholder="Your name" required />
        </Field>
        <Field>
          Email
          <Input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
        </Field>
        <Field>
          Phone / WhatsApp optional
          <Input autoComplete="tel" name="phone" placeholder="+91..." />
        </Field>
        <Field>
          Subject
          <Input name="subject" placeholder="Package or support question" required />
        </Field>
        <Field>
          Message
          <Textarea name="message" placeholder="How can TWC help?" required />
        </Field>
        <input aria-hidden className="hidden" name="company" tabIndex={-1} />
        <label className="flex items-start gap-3 text-sm leading-6 text-[var(--muted)]">
          <input className="mt-1" name="consent" required type="checkbox" />
          I consent to TWC storing this enquiry and contacting me about it.
        </label>
        {state.message ? (
          <p aria-live="polite" className={state.ok ? "text-sm text-[var(--success)]" : "text-sm text-[var(--error)]"}>
            {state.message}
          </p>
        ) : null}
        <Button disabled={pending} type="submit">
          {pending ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}
