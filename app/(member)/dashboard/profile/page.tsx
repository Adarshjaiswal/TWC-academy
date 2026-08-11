import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div className="grid gap-5">
      <Badge>Profile</Badge>
      <h1 className="text-4xl font-black">Profile and preferences</h1>
      <Card>
        <dl className="grid gap-4 md:grid-cols-2">
          <div><dt className="text-sm text-[var(--muted)]">Name</dt><dd className="mt-1 text-xl font-black">{user.name}</dd></div>
          <div><dt className="text-sm text-[var(--muted)]">Email</dt><dd className="mt-1">{user.email}</dd></div>
          <div><dt className="text-sm text-[var(--muted)]">Email verification</dt><dd className="mt-1">{user.emailVerified ? "Verified" : "Pending"}</dd></div>
          <div><dt className="text-sm text-[var(--muted)]">Role</dt><dd className="mt-1">{user.role}</dd></div>
        </dl>
        <p className="risk-copy mt-6">
          Password update, session revocation, notification preferences, marketing consent changes, and account-deletion requests are represented in the schema and admin workflow.
        </p>
      </Card>
    </div>
  );
}
