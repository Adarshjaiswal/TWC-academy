import { z } from "zod";

const developmentSecret = "development-only-auth-secret-change-before-production";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z
      .string()
      .url()
      .default("mysql://twc:twc_dev_password@127.0.0.1:3306/twc"),
    APP_URL: z.string().url().default("http://127.0.0.1:3000"),
    AUTH_SECRET: z.string().min(32).default(developmentSecret),
    SESSION_COOKIE_NAME: z.string().default("authjs.session-token"),
    PAYMENT_PROVIDER: z.enum(["razorpay", "mock"]).default("razorpay"),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
    TELEGRAM_MODE: z.enum(["redirect", "managed"]).default("redirect"),
    TELEGRAM_FREE_CHANNEL_URL: z.string().url().default("https://t.me/TWClive"),
    TELEGRAM_PREMIUM_CHANNEL_LABEL: z.string().default("TWC Premium Telegram Signals"),
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
    TELEGRAM_PRIVATE_CHANNEL_ID: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    EMAIL_FROM: z.string().email().default("TWC <noreply@example.com>"),
    CRON_SECRET: z.string().min(16).default("development-cron-secret")
  })
  .superRefine((value, ctx) => {
    const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";
    if (value.NODE_ENV === "production" && !isProductionBuild) {
      if (value.AUTH_SECRET === developmentSecret) {
        ctx.addIssue({
          code: "custom",
          path: ["AUTH_SECRET"],
          message: "AUTH_SECRET must be a unique production secret."
        });
      }
      if (value.PAYMENT_PROVIDER === "razorpay") {
        for (const key of ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"] as const) {
          if (!value[key]) {
            ctx.addIssue({
              code: "custom",
              path: [key],
              message: `${key} is required in production.`
            });
          }
        }
      }
      if (value.TELEGRAM_MODE === "managed") {
        for (const key of ["TELEGRAM_BOT_TOKEN", "TELEGRAM_WEBHOOK_SECRET", "TELEGRAM_PRIVATE_CHANNEL_ID"] as const) {
          if (!value[key]) {
            ctx.addIssue({
              code: "custom",
              path: [key],
              message: `${key} is required for managed Telegram access.`
            });
          }
        }
      }
    }
  });

export const env = envSchema.parse(process.env);

export type AppEnv = typeof env;
