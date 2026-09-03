import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContourLayer, Eyebrow } from "@/components/ui";
import { CONTACT } from "@/lib/company";

// TODO(legal): this policy describes what the product actually does today
// (see the sections below) but has NOT been reviewed by counsel — get a legal
// review before launch, especially for KSA/Egypt/UAE data-protection wording.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("privacyTitle") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  const sections = [1, 2, 3, 4].map((n) => ({
    title: t(`s${n}Title`),
    body: t(`s${n}Body`),
  }));

  return (
    <div className="bg-navy-deep">
      <SiteNav />

      <section className="relative overflow-hidden bg-linear-to-b from-navy-deep to-navy px-5 py-14 md:px-14 md:py-[104px]">
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0 opacity-80" />
        <ContourLayer className="opacity-70" />
        <div className="relative mx-auto flex max-w-[720px] flex-col gap-10 md:gap-12">
          <div className="flex flex-col gap-5">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="text-[32px] leading-[1.4] font-light text-fg-on-dark md:text-[46px]">
              {t("title")}
            </h1>
            <p className="text-[16px] leading-loose text-fg-on-dark/60">{t("intro")}</p>
          </div>

          <div className="flex flex-col gap-8">
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2.5">
                <h2 className="text-[19px] font-medium text-fg-on-dark">{section.title}</h2>
                <p className="text-[15px] leading-loose text-fg-on-dark/65 md:leading-[2.1]">
                  {section.body}
                </p>
              </div>
            ))}
            <div className="flex flex-col gap-2.5">
              <h2 className="text-[19px] font-medium text-fg-on-dark">{t("s5Title")}</h2>
              <p className="text-[15px] leading-loose text-fg-on-dark/65 md:leading-[2.1]">
                {t.rich("s5Body", {
                  email: () => (
                    <a
                      key="email"
                      href={`mailto:${CONTACT.email}`}
                      className="mono rounded-brand text-fg-on-dark underline decoration-fg-on-dark/30 underline-offset-4 outline-none hover:decoration-fg-on-dark focus-visible:ring-[3px] focus-visible:ring-accent/40"
                    >
                      {CONTACT.email}
                    </a>
                  ),
                }) /* s5Body uses an <email></email> tag placeholder */}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
