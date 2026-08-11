export type OrderState = "CREATED" | "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
export type MembershipState = "PENDING" | "ACTIVE" | "EXPIRING" | "EXPIRED" | "CANCELLED" | "PAUSED";
export type TelegramState =
  | "NOT_ELIGIBLE"
  | "ELIGIBLE"
  | "INVITE_CREATED"
  | "JOINED"
  | "REVOKED"
  | "FAILED";

const orderTransitions: Record<OrderState, OrderState[]> = {
  CREATED: ["PENDING", "CANCELLED", "FAILED"],
  PENDING: ["PAID", "FAILED", "CANCELLED"],
  PAID: ["REFUNDED"],
  FAILED: [],
  CANCELLED: [],
  REFUNDED: []
};

const membershipTransitions: Record<MembershipState, MembershipState[]> = {
  PENDING: ["ACTIVE", "CANCELLED", "EXPIRED"],
  ACTIVE: ["EXPIRING", "EXPIRED", "CANCELLED", "PAUSED"],
  EXPIRING: ["ACTIVE", "EXPIRED", "CANCELLED"],
  PAUSED: ["ACTIVE", "CANCELLED", "EXPIRED"],
  EXPIRED: [],
  CANCELLED: []
};

const telegramTransitions: Record<TelegramState, TelegramState[]> = {
  NOT_ELIGIBLE: ["ELIGIBLE"],
  ELIGIBLE: ["INVITE_CREATED", "FAILED", "REVOKED", "NOT_ELIGIBLE"],
  INVITE_CREATED: ["JOINED", "FAILED", "REVOKED"],
  JOINED: ["REVOKED"],
  FAILED: ["ELIGIBLE", "REVOKED"],
  REVOKED: []
};

export function canTransition<T extends string>(from: T, to: T, map: Record<T, T[]>) {
  return from === to || map[from]?.includes(to) === true;
}

export function assertOrderTransition(from: OrderState, to: OrderState) {
  if (!canTransition(from, to, orderTransitions)) {
    throw new Error(`Invalid order transition ${from} -> ${to}`);
  }
}

export function assertMembershipTransition(from: MembershipState, to: MembershipState) {
  if (!canTransition(from, to, membershipTransitions)) {
    throw new Error(`Invalid membership transition ${from} -> ${to}`);
  }
}

export function assertTelegramTransition(from: TelegramState, to: TelegramState) {
  if (!canTransition(from, to, telegramTransitions)) {
    throw new Error(`Invalid Telegram transition ${from} -> ${to}`);
  }
}

export function isMembershipActive(status: MembershipState, endsAt?: Date | null, now = new Date()) {
  return status === "ACTIVE" && (!endsAt || endsAt > now);
}

export function shouldExpireMembership(status: MembershipState, endsAt: Date | null, now = new Date()) {
  return (status === "ACTIVE" || status === "EXPIRING" || status === "PAUSED") && !!endsAt && endsAt <= now;
}
