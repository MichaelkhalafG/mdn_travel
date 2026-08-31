import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/schemas";

// ADMIN ONLY — there is no public user auth, ever.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const admin = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email },
        });
        if (!admin) return null;

        const passwordOk = await compare(parsed.data.password, admin.passwordHash);
        if (!passwordOk) return null;

        return { id: admin.id, email: admin.email, name: admin.name };
      },
    }),
  ],
});
