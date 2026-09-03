import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { serviceSlugs } from "@/lib/services";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ButtonLink, Card, Eyebrow, MediaImage, MeridianLayer } from "@/components/ui";

// Shells for the 9 seeded slugs; name/desc stay editable data — ISR serves
// cached HTML instantly and picks up admin edits within a minute.
export const revalidate = 60;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

async function getService(slug: string) {
  return prisma.service.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("serviceTitle", {
      name: locale === "ar" ? service.nameAr : service.nameEn,
    }),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getService(slug);
  if (!service) notFound();

  const t = await getTranslations("service");
  const name = locale === "ar" ? service.nameAr : service.nameEn;
  const desc = locale === "ar" ? service.descAr : service.descEn;

  const features = [
    { title: t("feature1Title"), desc: t("feature1Desc") },
    { title: t("feature2Title"), desc: t("feature2Desc") },
    { title: t("feature3Title"), desc: t("feature3Desc") },
    { title: t("feature4Title"), desc: t("feature4Desc") },
  ];

  const rows = [
    { label: t("rowResponse"), value: t("rowResponseValue"), mono: true },
    { label: t("rowPayment"), value: t("rowPaymentValue"), mono: false },
    { label: t("rowTracking"), value: t("rowTrackingValue"), mono: false },
  ];

  return (
    <div className="bg-navy-deep">
      <SiteNav />

      {/* Cinematic hero — service image under the landing scrim family */}
      <section className="hero-base relative overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage
            src={service.image}
            alt={name}
            sizes="100vw"
            priority
            fallback="none"
            className="size-full"
          />
        </div>
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0" />
        <MeridianLayer />
        <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-text-scrim pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex min-h-[470px] max-w-[1440px] flex-col justify-end gap-5 px-5 pb-11 md:min-h-[560px] md:gap-6 md:px-14 md:pb-[72px]">
          <p className="flex items-center gap-2.5">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <Eyebrow aria-hidden>/</Eyebrow>
            {/* dir=ltr: bidi isolation for the digits + Latin slug in RTL */}
            <Eyebrow dir="ltr">
              {`${String(service.order).padStart(2, "0")} ${service.slug.toUpperCase()}`}
            </Eyebrow>
          </p>
          <h1 className="max-w-[860px] text-[38px] leading-[1.35] font-light text-pretty text-fg-on-dark md:text-[62px]">
            {name}
          </h1>
          <p className="max-w-[660px] text-[16px] leading-loose text-fg-on-dark/70 md:text-[19px] md:leading-[2.1]">
            {desc}
          </p>
        </div>
      </section>

      {/* The experience + request card */}
      <section className="bg-linear-to-b from-navy-deep to-navy px-5 py-12 md:px-14 md:py-[104px]">
        <div className="mx-auto grid max-w-[1328px] grid-cols-1 items-start gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-8 md:gap-11">
            <div className="flex flex-col gap-4 md:gap-5">
              <Eyebrow>{t("experienceEyebrow")}</Eyebrow>
              <h2 className="text-[26px] leading-relaxed font-light text-fg-on-dark md:text-[34px] md:leading-[1.6]">
                {t("experienceTitle")}
              </h2>
              <p className="text-[16px] leading-loose text-fg-on-dark/62 md:text-[17px] md:leading-[2.2]">
                {t("experienceBody")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-brand border border-fg-on-dark/7 bg-fg-on-dark/7 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-2 bg-navy px-7 py-6.5"
                >
                  <span className="text-[15px] text-fg-on-dark">{feature.title}</span>
                  <span className="text-[13px] leading-relaxed text-fg-on-dark/45">
                    {feature.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card variant="dark" className="lg:sticky lg:top-28">
            <div className="flex flex-col gap-6 p-7 md:p-11">
              <Eyebrow>{t("requestEyebrow")}</Eyebrow>
              <h2 className="text-[24px] leading-relaxed font-normal text-fg-on-dark md:text-[28px] md:leading-[1.6]">
                {t("requestTitle")}
              </h2>
              <p className="text-[15px] leading-loose text-fg-on-dark/60">
                {t("requestBody")}
              </p>
              <div aria-hidden className="h-px bg-fg-on-dark/8" />
              <div className="flex flex-col gap-3">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between gap-4 text-sm text-fg-on-dark/55"
                  >
                    <span>{row.label}</span>
                    <span className={row.mono ? "mono text-fg-on-dark" : "text-fg-on-dark"}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <ButtonLink
                href={`/request/${service.slug}`}
                size="lg"
                className="w-full"
              >
                {t("requestCta")}
              </ButtonLink>
              <p className="text-center text-[13px] text-fg-on-dark/40">
                {t("noPaymentNote")}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
