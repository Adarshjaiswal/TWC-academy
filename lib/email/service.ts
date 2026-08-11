import { env } from "@/lib/env";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(message: EmailMessage) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.info("[email:development-log]", {
      to: message.to,
      subject: message.subject,
      preview: message.text.slice(0, 160)
    });
    return { mode: "logged" as const };
  }

  console.info("[email:adapter-placeholder]", {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    to: message.to,
    subject: message.subject
  });
  return { mode: "smtp-placeholder" as const };
}
