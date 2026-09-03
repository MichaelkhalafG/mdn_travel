import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth, signOut } from "@/auth";
import { LogoLockup } from "@/components/ui";

// Admin shell (Primer-style light app UI): slim topbar + content. Middleware
// already gates these routes, and this layout re-checks the session
// server-side; admin views are never cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("adminTitle") };
}

export default async function AdminShellLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/admin/login`);

  const t = await getTranslations("admin.shell");

  return (
    <div className="min-h-dvh bg-canvas-subtle">
      <header className="border-b border-border-light bg-canvas-light">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3.5">
            <LogoLockup variant="navy" size="sm" />
            <span className="mono rounded-brand bg-lavender px-2 py-0.5 text-[10px] tracking-[0.16em] text-navy-deep">
              {t("adminTag")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-fg-on-light-muted max-sm:hidden">
              {session.user.name ?? session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: `/${locale}/admin/login` });
              }}
            >
              <button
                type="submit"
                className="rounded-brand border border-border-light px-3.5 py-1.5 text-[13px] text-navy outline-none transition-colors hover:bg-canvas-subtle focus-visible:ring-[3px] focus-visible:ring-accent/40"
              >
                {t("logout")}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-7">{children}</main>
    </div>
  );
}
