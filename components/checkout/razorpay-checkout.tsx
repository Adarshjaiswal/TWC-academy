"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

type RazorpayCheckoutProps = {
  amountMinor: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  keyId: string;
  logoUrl: string;
  orderId: string;
  packageName: string;
  publicOrderId: string;
};

type RazorpayPaymentSuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error: {
    code?: string;
    description?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
    reason?: string;
  };
};

type RazorpayOptions = {
  amount: number;
  currency: string;
  description: string;
  handler: (response: RazorpayPaymentSuccess) => void;
  image: string;
  key: string;
  modal: {
    ondismiss: () => void;
  };
  name: string;
  order_id: string;
  prefill: {
    email: string;
    name: string;
  };
  theme: {
    color: string;
  };
};

type RazorpayInstance = {
  on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void;
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export function RazorpayCheckout({
  amountMinor,
  currency,
  customerEmail,
  customerName,
  keyId,
  logoUrl,
  orderId,
  packageName,
  publicOrderId
}: RazorpayCheckoutProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("Checkout is ready when the secure payment script loads.");

  function openCheckout() {
    if (!window.Razorpay) {
      setMessage("Payment script is still loading. Try again in a moment.");
      return;
    }

    setPending(true);
    setMessage("Opening secure Razorpay checkout.");

    const checkout = new window.Razorpay({
      amount: amountMinor,
      currency,
      description: packageName,
      handler: () => {
        setMessage("Payment response received. Membership activates after the verified provider webhook is processed.");
        router.push(`/dashboard/orders?payment=processing&order=${encodeURIComponent(publicOrderId)}`);
      },
      image: logoUrl,
      key: keyId,
      modal: {
        ondismiss: () => {
          setPending(false);
          setMessage("Checkout closed. Your order remains pending until payment is verified.");
        }
      },
      name: "Trade Wave Capital",
      order_id: orderId,
      prefill: {
        email: customerEmail,
        name: customerName
      },
      theme: {
        color: "#ffb703"
      }
    });

    checkout.on("payment.failed", (response) => {
      setPending(false);
      setMessage(response.error.description ?? response.error.reason ?? "Payment failed. Please try again.");
    });

    checkout.open();
  }

  return (
    <>
      <Script
        onError={() => setMessage("Payment script failed to load. Refresh and try again.")}
        onLoad={() => {
          setReady(true);
          setMessage("Secure checkout is ready.");
        }}
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="grid gap-3">
        <Button disabled={!ready || pending} onClick={openCheckout} type="button">
          <CreditCard aria-hidden className="h-4 w-4" />
          {pending ? "Checkout Open" : "Pay with Razorpay"}
        </Button>
        <ButtonLink href="/dashboard/orders" variant="secondary">
          View Orders
        </ButtonLink>
        <p aria-live="polite" className="text-sm leading-6 text-[var(--muted)]">
          {message}
        </p>
      </div>
    </>
  );
}
