import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/schemas";

// ADMIN ONLY — there is no public user auth, ever. JWT sessions (httpOnly
// cookie, NextAuth default); middleware gates /[locale]/admin/*, and every
// admin page/action ALSO re-checks the session server-side.

class InvalidLogin extends CredentialsSignin {
  code = "invalid";
}
class TooManyLoginAttempts extends CredentialsSignin {
  code = "rate_limited";
}

// Same in-memory limiter pattern as the tracking lookup: 10 attempts per IP
// per 10 minutes; failed or not, every attempt counts.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 10;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (loginAttempts.size > 1000) {
    for (const [key, entry] of loginAttempts) {
      if (entry.resetAt <= now) loginAttempts.delete(key);
    }
  }
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX_ATTEMPTS;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, request) {
        const ip = (request.headers.get("x-forwarded-for") ?? "local")
          .split(",")[0]
          .trim();
        if (isRateLimited(ip)) throw new TooManyLoginAttempts();

        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) throw new InvalidLogin();

        const admin = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email },
        });
        if (!admin) throw new InvalidLogin();

        const passwordOk = await compare(parsed.data.password, admin.passwordHash);
        if (!passwordOk) throw new InvalidLogin();

        return { id: admin.id, email: admin.email, name: admin.name };
      },
    }),
  ],
});
