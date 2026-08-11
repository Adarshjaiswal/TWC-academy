import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="secondary">
        <LogOut aria-hidden className="h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
}
