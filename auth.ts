import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 30
  },
  providers: [],
  trustHost: true,
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in"
  }
});
