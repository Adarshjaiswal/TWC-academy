"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomToken, hashToken } from "@/lib/security";
import { sendEmail } from "@/lib/email/service";
import { createSession, destroyCurrentSession } from "@/lib/auth/session";
import { hashPassword, passwordSchema, verifyPassword } from "@/lib/domain/password";
import { addDays } from "@/lib/utils";

export type FormState = {
  ok: boolean;
  message: string;
};

const signInSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1)
});

const signUpSchema = z
  .object({
    name: z.string().min(2).max(120),
    email: z.string().email().transform((value) => value.toLowerCase()),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.literal("on"),
    marketingConsent: z.string().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

const forgotSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase())
});

const resetSchema = z
  .object({
    token: z.string().min(16),
    email: z.string().email().transform((value) => value.toLowerCase()),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

export async function signInAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Check your email and password." };

  const limiter = checkRateLimit(`auth:${parsed.data.email}`, 8, 15 * 60 * 1000);
  if (!limiter.allowed) return { ok: false, message: "Too many attempts. Try again later." };

  const generic = { ok: false, message: "Invalid email or password." };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.passwordHash || user.disabledAt || user.deletedAt) return generic;
  if (!user.emailVerified) return { ok: false, message: "Verify your email before signing in." };

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return generic;

  await createSession(user.id);
  redirect(user.role === "USER" ? "/dashboard" : "/admin");
}

export async function signUpAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };

  const limiter = checkRateLimit(`signup:${parsed.data.email}`, 4, 60 * 60 * 1000);
  if (!limiter.allowed) return { ok: false, message: "Too many sign-up attempts. Try later." };

  const passwordHash = await hashPassword(parsed.data.password);
  const verificationToken = randomToken(32);
  const verificationHash = hashToken(verificationToken);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
          marketingConsent: parsed.data.marketingConsent === "on",
          consentRecords: {
            create: [
              {
                category: "terms",
                granted: true,
                source: "sign-up",
                email: parsed.data.email
              },
              {
                category: "marketing",
                granted: parsed.data.marketingConsent === "on",
                source: "sign-up",
                email: parsed.data.email
              }
            ]
          }
        }
      });

      await tx.userRole.create({ data: { userId: user.id, role: "USER", reason: "Initial sign-up" } });
      await tx.verificationToken.create({
        data: {
          identifier: `verify:${parsed.data.email}`,
          token: verificationHash,
          expires: addDays(new Date(), 1)
        }
      });
    });
  } catch {
    return { ok: false, message: "We could not create that account. The email may already exist." };
  }

  await sendEmail({
    to: parsed.data.email,
    subject: "Verify your TWC account",
    text: `Use this development verification link: /verify-email?email=${encodeURIComponent(parsed.data.email)}&token=${verificationToken}`
  });

  return { ok: true, message: "Account created. Check the development email log for the verification link." };
}

export async function verifyEmailAction(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const token = String(formData.get("token") ?? "");
  const tokenHash = hashToken(token);

  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: `verify:${email}`,
      token: tokenHash,
      usedAt: null,
      expires: { gt: new Date() }
    }
  });

  if (!record) return { ok: false, message: "This verification link is invalid or expired." };

  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.update({
      where: { identifier_token: { identifier: record.identifier, token: record.token } },
      data: { usedAt: new Date() }
    })
  ]);

  return { ok: true, message: "Email verified. You can sign in now." };
}

export async function forgotPasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = forgotSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: true, message: "If the email exists, reset instructions were sent." };

  const limiter = checkRateLimit(`reset:${parsed.data.email}`, 5, 60 * 60 * 1000);
  if (!limiter.allowed) return { ok: true, message: "If the email exists, reset instructions were sent." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = randomToken(32);
    await prisma.verificationToken.create({
      data: {
        identifier: `reset:${parsed.data.email}`,
        token: hashToken(token),
        expires: new Date(Date.now() + 1000 * 60 * 30)
      }
    });
    await sendEmail({
      to: parsed.data.email,
      subject: "Reset your TWC password",
      text: `Use this development reset link: /reset-password?email=${encodeURIComponent(parsed.data.email)}&token=${token}`
    });
  }

  return { ok: true, message: "If the email exists, reset instructions were sent." };
}

export async function resetPasswordAction(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };

  const tokenHash = hashToken(parsed.data.token);
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: `reset:${parsed.data.email}`,
      token: tokenHash,
      usedAt: null,
      expires: { gt: new Date() }
    }
  });

  if (!record) return { ok: false, message: "This reset link is invalid or expired." };

  await prisma.$transaction([
    prisma.user.update({
      where: { email: parsed.data.email },
      data: { passwordHash: await hashPassword(parsed.data.password) }
    }),
    prisma.verificationToken.update({
      where: { identifier_token: { identifier: record.identifier, token: record.token } },
      data: { usedAt: new Date() }
    }),
    prisma.session.updateMany({
      where: { user: { email: parsed.data.email }, revokedAt: null },
      data: { revokedAt: new Date() }
    })
  ]);

  return { ok: true, message: "Password updated. Sign in with your new password." };
}

export async function signOutAction() {
  await destroyCurrentSession();
  redirect("/");
}
