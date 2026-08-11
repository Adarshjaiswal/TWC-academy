"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashToken } from "@/lib/security";

export type ContactState = {
  ok: boolean;
  message: string;
};

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(40).optional(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(5000),
  consent: z.literal("on"),
  company: z.string().max(0).optional()
});

export async function submitContactAction(_: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData);
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const limiter = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!limiter.allowed) return { ok: false, message: "Too many messages. Try again later." };

  try {
    await prisma.contactLead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone || null,
        subject: parsed.data.subject,
        message: parsed.data.message,
        consentAccepted: true,
        ipHash: hashToken(ip),
        userAgent: headerStore.get("user-agent")?.slice(0, 500)
      }
    });
  } catch {
    console.info("[contact:development-log]", {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject
    });
  }

  return { ok: true, message: "Message received. TWC support will review it." };
}
