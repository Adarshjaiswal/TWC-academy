import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(40).optional(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(5000),
  consent: z.literal("on"),
  company: z.string().max(0).optional()
});
