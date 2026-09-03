import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

// Everything under /[locale]/admin/* except the login page requires a valid
// session JWT; unauthenticated hits bounce to login with a callbackUrl.
// (Edge-safe: only the JWT is verified here — no Prisma. Every admin page and
// action re-checks the session server-side as well.)
const ADMIN_PATH = /^\/(en|ar)\/admin(?:\/|$)/;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(ADMIN_PATH);
  if (match && !pathname.startsWith(`/${match[1]}/admin/login`)) {
    const secure = request.nextUrl.protocol === "https:";
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: secure,
      salt: secure ? "__Secure-authjs.session-token" : "authjs.session-token",
    });
    if (!token) {
      const loginUrl = new URL(`/${match[1]}/admin/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return intl(request);
}

export const config = {
  // Match all pathnames except API routes, Next internals and static files
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
