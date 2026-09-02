import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { serviceSlugs } from "@/lib/services";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Card, Chip, ContourLayer, MonoLabel } from "@/components/ui";
import { RequestForm } from "./RequestForm";

export const revalidate = 0;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("requestTitle") };
}

export default async function RequestPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();

  const t = await getTranslations("request");
  const serviceName = locale === "ar" ? service.nameAr : service.nameEn;
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3")];

  return (
    <div className="bg-navy-deep">
      <SiteNav />

      {/* 04 — REQUEST FORM: dark panel, pitch column + white form card */}
      <section className="relative overflow-hidden bg-linear-to-b from-navy-deep to-navy px-5 py-12 md:px-14 md:py-24">
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0" />
        <ContourLayer />
        <div className="relative mx-auto grid max-w-[1328px] grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-[72px]">
          <div className="flex flex-col gap-6 lg:pt-3">
            <MonoLabel tone="accent" className="tracking-[0.22em]">
              {t("eyebrow")}
            </MonoLabel>
            <h1 className="text-[32px] leading-[1.45] font-light text-fg-on-dark md:text-[46px]">
              {t("pageTitleLine1")}
              <br />
              {t("pageTitleLine2")}
            </h1>
            <p className="max-w-[380px] text-[16px] leading-loose text-fg-on-dark/60 md:leading-[2.1]">
              {t("pageLead")}
            </p>
            <div aria-hidden className="my-2 h-px bg-fg-on-dark/8" />
            <ul className="flex flex-col gap-4">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="size-1.5 flex-none rounded-full bg-accent-soft"
                  />
                  <span className="text-sm text-fg-on-dark/60">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card variant="light" className="shadow-marketing">
            <div className="flex flex-col gap-6 p-5.5 md:gap-7 md:p-12">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[20px] font-medium text-navy md:text-[22px]">
                  {t("formTitle")}
                </h2>
                {/* which service this request is for */}
                <Chip>{serviceName}</Chip>
              </div>
              <div aria-hidden className="h-px bg-border-light-subtle" />
              <RequestForm serviceSlug={service.slug} />
            </div>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
