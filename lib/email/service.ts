import { env } from "@/lib/env";
import nodemailer from "nodemailer";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
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

  const port = env.SMTP_PORT ?? 587;
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: env.SMTP_SECURE ?? port === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  const result = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html
  });

  console.info("[email:smtp-sent]", {
    host: env.SMTP_HOST,
    port,
    to: message.to,
    subject: message.subject,
    messageId: result.messageId
  });

  return { mode: "smtp" as const, messageId: result.messageId };
}
