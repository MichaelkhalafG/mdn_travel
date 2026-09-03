import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContourLayer, Eyebrow, StatusBadge } from "@/components/ui";
import { TICKET_STATUSES } from "@/lib/status";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("faqTitle") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const questions = [1, 2, 3, 4, 5].map((n) => ({
    q: t(`q${n}`),
    a: t(`a${n}`),
  }));

  return (
    <div className="bg-navy-deep">
      <SiteNav />

      <section className="relative overflow-hidden bg-linear-to-b from-navy-deep to-navy px-5 py-14 md:px-14 md:py-[104px]">
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0 opacity-80" />
        <ContourLayer className="opacity-70" />
        <div className="relative mx-auto flex max-w-[820px] flex-col gap-10 md:gap-14">
          <div className="flex flex-col gap-5">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="text-[32px] leading-[1.4] font-light text-fg-on-dark md:text-[46px]">
              {t("title")}
            </h1>
            <p className="text-[16px] leading-loose text-fg-on-dark/60">{t("lead")}</p>
          </div>

          <div className="flex flex-col gap-4">
            {questions.map((item) => (
              <div
                key={item.q}
                className="flex flex-col gap-2.5 rounded-brand border border-fg-on-dark/8 bg-fg-on-dark/2 p-5.5 md:p-7"
              >
                <h2 className="text-[17px] font-medium text-fg-on-dark md:text-[19px]">
                  {item.q}
                </h2>
                <p className="text-[15px] leading-loose text-fg-on-dark/62">{item.a}</p>
              </div>
            ))}

            {/* the statuses, reusing the canonical status labels */}
            <div className="flex flex-col gap-5 rounded-brand border border-fg-on-dark/8 bg-fg-on-dark/2 p-5.5 md:p-7">
              <div className="flex flex-col gap-2.5">
                <h2 className="text-[17px] font-medium text-fg-on-dark md:text-[19px]">
                  {t("statusesTitle")}
                </h2>
                <p className="text-[15px] leading-loose text-fg-on-dark/62">
                  {t("statusesIntro")}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {TICKET_STATUSES.map((status) => (
                  <div
                    key={status}
                    className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <span className="sm:w-[180px] sm:flex-none">
                      <StatusBadge status={status} />
                    </span>
                    <span className="text-[14px] leading-relaxed text-fg-on-dark/60">
                      {t(`statusDesc${status}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
