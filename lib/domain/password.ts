import bcrypt from "bcryptjs";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .regex(/[a-z]/, "Use at least one lowercase letter.")
  .regex(/[A-Z]/, "Use at least one uppercase letter.")
  .regex(/[0-9]/, "Use at least one number.");

export async function hashPassword(password: string) {
  passwordSchema.parse(password);
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}
