import { isMembershipActive, type MembershipState } from "./state-machines";

export type TelegramEligibilityInput = {
  membershipStatus: MembershipState;
  membershipEndsAt?: Date | null;
  packageGrantsAccess: boolean;
};

export function isTelegramEligible(input: TelegramEligibilityInput, now = new Date()) {
  return (
    input.packageGrantsAccess &&
    isMembershipActive(input.membershipStatus, input.membershipEndsAt ?? null, now)
  );
}

export function canCreateOneTimeInvite(input: {
  eligible: boolean;
  currentStatus: "NOT_ELIGIBLE" | "ELIGIBLE" | "INVITE_CREATED" | "JOINED" | "REVOKED" | "FAILED";
  inviteExpiresAt?: Date | null;
}, now = new Date()) {
  if (!input.eligible) return false;
  if (input.currentStatus === "JOINED") return false;
  if (input.currentStatus === "INVITE_CREATED" && input.inviteExpiresAt && input.inviteExpiresAt > now) {
    return false;
  }
  return input.currentStatus === "ELIGIBLE" || input.currentStatus === "FAILED" || input.currentStatus === "INVITE_CREATED";
}
