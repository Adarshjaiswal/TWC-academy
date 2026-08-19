"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

type CheckoutButtonProps = {
  className?: string;
  packageId: string | null;
  signedIn: boolean;
};

type CheckoutResponse = {
  checkoutUrl?: string;
  error?: string;
};

export function CheckoutButton({ className, packageId, signedIn }: CheckoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  if (!signedIn || !packageId) {
    return (
      <ButtonLink className={className} href="/sign-in">
        Sign In to Pay
      </ButtonLink>
    );
  }

  async function startCheckout() {
    setPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        body: JSON.stringify({ packageId }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });

      if (response.status === 401) {
        router.push("/sign-in");
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as CheckoutResponse;
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Checkout could not be created.");
      }

      router.push(payload.checkoutUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout could not be created.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={className}>
      <Button className="w-full" disabled={pending} onClick={startCheckout} type="button">
        {pending ? "Creating Checkout..." : "Pay Securely"}
      </Button>
      {message ? <p className="mt-2 text-xs text-[var(--error)]">{message}</p> : null}
    </div>
  );
}
