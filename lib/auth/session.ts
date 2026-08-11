"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Role } from "@prisma/client";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { randomToken } from "@/lib/security";
import { addDays } from "@/lib/utils";
import { isAdminRole } from "@/lib/domain/permissions";

const cookieNames = [
  env.SESSION_COOKIE_NAME,
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token"
];

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: Date | null;
};

export async function createSession(userId: string) {
  const token = randomToken(32);
  const expires = addDays(new Date(), 30);
  const headerStore = await headers();

  await prisma.session.create({
    data: {
      sessionToken: token,
      userId,
      expires,
      userAgent: headerStore.get("user-agent")?.slice(0, 500),
      ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.slice(0, 128)
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires,
    path: "/"
  });
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieNames.map((name) => cookieStore.get(name)?.value).find(Boolean);

  if (token) {
    await prisma.session.updateMany({
      where: { sessionToken: token, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  for (const name of cookieNames) {
    cookieStore.delete(name);
  }
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const token = cookieNames.map((name) => cookieStore.get(name)?.value).find(Boolean);

  if (!token) return null;

  try {
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: token,
        revokedAt: null,
        expires: { gt: new Date() }
      },
      include: {
        user: true
      }
    });

    if (!session || session.user.disabledAt || session.user.deletedAt) return null;

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      emailVerified: session.user.emailVerified
    };
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminRole(user.role)) redirect("/dashboard");
  return user;
}
