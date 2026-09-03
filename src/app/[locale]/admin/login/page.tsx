import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContourLayer, Eyebrow, LogoLockup, MonoLabel } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("adminLoginTitle") };
}

// 07 — ADMIN / LOGIN: navy panel (surface-tier contours) + white form card.
export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { callbackUrl } = await searchParams;
  const t = await getTranslations("admin.login");

  // never follow an external callback (open-redirect guard)
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : `/${locale}/admin`;

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <div className="relative flex flex-col justify-between gap-14 overflow-hidden bg-linear-to-b from-navy-deep to-navy p-8 md:p-14">
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0 opacity-70" />
        <ContourLayer className="opacity-70" />
        <div className="relative">
          <LogoLockup size="sm" />
        </div>
        <div className="relative flex flex-col gap-4">
          <h1 className="text-[30px] leading-normal font-light text-fg-on-dark md:text-[38px] md:leading-[1.5]">
            {t("panelTitleLine1")}
            <br />
            {t("panelTitleLine2")}
          </h1>
          <p className="max-w-[320px] text-[15px] leading-loose text-fg-on-dark/55">
            {t("panelBody")}
          </p>
        </div>
        <MonoLabel className="relative tracking-[0.16em] text-fg-on-dark/35">
          {t("adminTag")}
        </MonoLabel>
      </div>

      <div className="flex items-center justify-center bg-canvas-subtle p-6 md:p-14">
        <div className="flex w-full max-w-[400px] flex-col gap-6 rounded-brand border border-border-light bg-canvas-light p-8 md:p-10">
          <div className="flex flex-col gap-1.5">
            <Eyebrow tone="light">{t("adminTag")}</Eyebrow>
            <h2 className="text-[22px] font-medium text-navy">{t("title")}</h2>
          </div>
          <LoginForm callbackUrl={safeCallback} />
        </div>
      </div>
    </div>
  );
}
