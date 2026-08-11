import { z } from "zod";

export const checkoutRequestSchema = z.object({
  packageId: z.string().min(1)
});

export type CheckoutPackage = {
  id: string;
  slug: string;
  name: string;
  priceMinor: number;
  currency: string;
  durationDays: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
};

export function createServerPricedOrder(input: {
  userId: string;
  packageRecord: CheckoutPackage;
  requestedPriceMinor?: number;
}) {
  if (input.packageRecord.status !== "ACTIVE") {
    throw new Error("Package is not available for checkout.");
  }

  return {
    userId: input.userId,
    packageId: input.packageRecord.id,
    amountMinor: input.packageRecord.priceMinor,
    currency: input.packageRecord.currency,
    status: "CREATED" as const,
    clientPriceIgnored: input.requestedPriceMinor !== undefined
  };
}
