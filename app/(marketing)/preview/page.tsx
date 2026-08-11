import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Preview"
};

export default function PreviewPage() {
  return (
    <section className="section">
      <div className="container-shell">
        <Badge>Preview</Badge>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Major platform states.</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          A visual checkpoint for public, member, and admin surfaces when authenticated seed data or screenshots are not available.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Card>
            <h2 className="text-2xl font-black">Public</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Premium hero, services, plans, approved placeholders, FAQs, legal copy, cookie preferences, and risk disclaimer.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Member</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Membership state, orders, Telegram eligibility, profile, notifications, and support ticket states.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Admin</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Operations metrics, users, packages, payments, memberships, Telegram jobs, CMS, leads, support, settings, and audit logs.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
