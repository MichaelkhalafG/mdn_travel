import { getTranslations } from "next-intl/server";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ButtonLink, MonoLabel } from "@/components/ui";

// Styled, localized 404 — catches notFound() from unknown service slugs and
// reference codes anywhere under /[locale].
export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div className="bg-navy-deep">
      <SiteNav />
      <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden bg-linear-to-b from-navy-deep to-navy px-5 py-16 md:min-h-[640px]">
        <div aria-hidden className="bloom-top pointer-events-none absolute inset-0" />
        <div aria-hidden className="grid-motif-lg pointer-events-none absolute inset-0" />
        <div className="relative flex max-w-[560px] flex-col items-center gap-6 text-center">
          <MonoLabel tone="accent" className="tracking-[0.24em]">
            {t("eyebrow")}
          </MonoLabel>
          <h1 className="text-[34px] leading-[1.4] font-light text-fg-on-dark md:text-[46px]">
            {t("title")}
          </h1>
          <p className="text-[15px] leading-loose text-fg-on-dark/60">{t("body")}</p>
          <ButtonLink href="/" size="md" className="mt-2">
            {t("backHome")}
          </ButtonLink>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
