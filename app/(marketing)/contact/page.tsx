import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Badge>Contact</Badge>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">Ask before you enroll.</h1>
          <p className="mt-4 text-[var(--muted)]">
            Send an enquiry about programs, payment, Telegram access, mentorship, or seat availability. The form includes validation, rate limiting, consent, and spam controls.
          </p>
          <Card className="mt-8">
            <h2 className="text-xl font-black">Contact details</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Email: ardanishofficial@outlook.com</p>
            <p className="mt-2 text-sm text-[var(--muted)]">WhatsApp: +971 58 580 0746</p>
          </Card>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
