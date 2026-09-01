import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  ButtonLink,
  HeroRotator,
  MonoLabel,
  ServiceCard,
  StatStrip,
} from "@/components/ui";
import { cn } from "@/lib/cn";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  // rotating hero slides 2-4: the most cinematic service stills
  const heroStills = ["yachts", "hotels-resorts", "leisure-tourism"].flatMap(
    (slug) => {
      const service = services.find((s) => s.slug === slug);
      return service
        ? [
            {
              src: service.image,
              alt: locale === "ar" ? service.nameAr : service.nameEn,
            },
          ]
        : [];
    }
  );

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <div className="bg-navy-deep">
      <SiteNav />

      {/* Hero — rotating cinematic media under navy scrim, per 02 — LANDING */}
      <section className="hero-base relative overflow-hidden">
        <HeroRotator
          video={{ webm: "/img/hero.webm", mp4: "/img/hero.mp4" }}
          poster="/img/hero.webp"
          posterAlt={t("heroImageAlt")}
          stills={heroStills}
          className="absolute inset-0"
        />
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0" />
        <div aria-hidden className="grid-motif-lg pointer-events-none absolute inset-0" />
        <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex min-h-[470px] max-w-[1440px] flex-col justify-end gap-6 px-5 pb-16 md:min-h-[720px] md:justify-center md:gap-8 md:px-14 md:pb-0">
          <p className="hero-rise flex items-center gap-3">
            <span aria-hidden className="h-px w-7 bg-accent-soft max-md:hidden" />
            <MonoLabel tone="accent" className="tracking-[0.22em]">
              {t("eyebrow")}
            </MonoLabel>
          </p>
          <h1 className="hero-rise max-w-[900px] text-[38px] leading-[1.35] font-light text-pretty text-fg-on-dark [animation-delay:90ms] md:text-[76px] md:leading-[1.3]">
            {t("heroTitleLine1")} <br className="max-md:hidden" />
            {t("heroTitleLine2")}
          </h1>
          <p className="hero-rise max-w-[620px] text-[15px] leading-loose text-fg-on-dark/68 [animation-delay:180ms] md:text-[19px] md:leading-[2.1]">
            {t("heroTagline")}
          </p>
          <div className="hero-rise flex flex-col gap-3.5 [animation-delay:270ms] sm:flex-row sm:items-center sm:gap-4.5">
            <ButtonLink href="/#services" size="lg">
              {t("ctaRequest")}
            </ButtonLink>
            <ButtonLink href="/track" variant="ghost" size="lg">
              {t("ctaTrack")}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Services grid — all 9 from the database, ordered */}
      <section
        id="services"
        className="bg-linear-to-b from-navy-deep to-navy px-5 py-11 md:px-14 md:py-[120px]"
      >
        <div className="mx-auto flex max-w-[1328px] flex-col gap-6 md:gap-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex flex-col gap-4 md:max-w-[640px]">
              <MonoLabel tone="accent" className="tracking-[0.22em]">
                {t("servicesEyebrow")}
              </MonoLabel>
              <h2 className="text-[28px] leading-normal font-light text-fg-on-dark md:text-[46px]">
                {t("servicesTitle")}
              </h2>
            </div>
            <p className="max-w-[380px] text-[15px] leading-loose text-fg-on-dark/55">
              {t("servicesLead")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                slug={service.slug}
                name={locale === "ar" ? service.nameAr : service.nameEn}
                image={service.image}
                order={service.order}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works — light section, 3 steps */}
      <section className="bg-canvas-light px-5 py-10 md:px-14 md:py-[120px]">
        <div className="mx-auto flex max-w-[1328px] flex-col gap-5 md:gap-16">
          <div className="flex flex-col gap-4 md:items-center md:text-center">
            <MonoLabel tone="royal" className="tracking-[0.22em]">
              {t("howEyebrow")}
            </MonoLabel>
            <h2 className="text-[26px] leading-normal font-light text-navy md:text-[44px]">
              {t("howTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-brand border border-border-light bg-border-light md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={cn(
                  "flex flex-col gap-2 p-5.5 md:gap-4.5 md:px-10 md:py-12",
                  index === 1 ? "bg-canvas-subtle" : "bg-canvas-light"
                )}
              >
                <MonoLabel tone="royal" className="text-[13px] tracking-[0.1em]">
                  {String(index + 1).padStart(2, "0")}
                </MonoLabel>
                <h3 className="text-[19px] font-medium text-navy md:text-[26px]">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-loose text-fg-on-light-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / USP strip */}
      <StatStrip stats={stats} />

      <SiteFooter />
    </div>
  );
}
