import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ButtonLink, ContourLayer, Eyebrow, MonoLabel } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("aboutTitle") };
}

// About — grounded in the real company facts (design/company-facts.md):
// MDN International, Jeddah, 1993, hospitality investments. Surface-tier.
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHome = await getTranslations("home");

  const steps = [
    { title: tHome("step1Title"), desc: tHome("step1Desc") },
    { title: tHome("step2Title"), desc: tHome("step2Desc") },
    { title: tHome("step3Title"), desc: tHome("step3Desc") },
  ];

  return (
    <div className="bg-navy-deep">
      <SiteNav />

      <section className="relative overflow-hidden bg-linear-to-b from-navy-deep to-navy px-5 py-14 md:px-14 md:py-[104px]">
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0 opacity-80" />
        <ContourLayer className="opacity-70" />
        <div className="relative mx-auto flex max-w-[1328px] flex-col gap-14 md:gap-20">
          <div className="flex max-w-[820px] flex-col gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="text-[32px] leading-[1.45] font-light text-pretty text-fg-on-dark md:text-[52px] md:leading-[1.35]">
              {t("title")}
            </h1>
            <p className="max-w-[640px] text-[16px] leading-loose text-fg-on-dark/65 md:text-[19px] md:leading-[2.1]">
              {t("lead")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-5">
              <Eyebrow>{t("groupTitle")}</Eyebrow>
              <p className="text-[16px] leading-loose text-fg-on-dark/70 md:leading-[2.1]">
                {t("groupBody1")}
              </p>
              <p className="text-[16px] leading-loose text-fg-on-dark/70 md:leading-[2.1]">
                {t("groupBody2")}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <Eyebrow>{t("modelTitle")}</Eyebrow>
              <p className="text-[16px] leading-loose text-fg-on-dark/70 md:leading-[2.1]">
                {t("modelBody")}
              </p>
              <div className="mt-2 flex flex-col gap-px overflow-hidden rounded-brand border border-fg-on-dark/7 bg-fg-on-dark/7">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4 bg-navy px-5.5 py-4.5">
                    <MonoLabel tone="accent" className="mt-0.5 text-[13px]">
                      {String(index + 1).padStart(2, "0")}
                    </MonoLabel>
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-medium text-fg-on-dark">
                        {step.title}
                      </span>
                      <span className="text-[13px] leading-relaxed text-fg-on-dark/50">
                        {step.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href="/#services" size="md" className="w-full sm:w-auto">
              {tHome("ctaRequest")}
            </ButtonLink>
            <ButtonLink href="/track" variant="ghost" size="md" className="w-full sm:w-auto">
              {tHome("ctaTrack")}
            </ButtonLink>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
