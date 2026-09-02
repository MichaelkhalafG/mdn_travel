import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ButtonLink, ContourLayer, MonoLabel, ReferenceCode } from "@/components/ui";
import { CopyCodeButton } from "./CopyCodeButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("successTitle") };
}

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  // PRIVACY: the URL is shareable — only confirm the code exists. Never
  // select or render any ticket details (name, phone, request text).
  const normalized = code.toUpperCase();
  const ticket = /^MDN-[A-Z0-9]{5}$/.test(normalized)
    ? await prisma.ticket.findUnique({
        where: { referenceCode: normalized },
        select: { referenceCode: true },
      })
    : null;
  if (!ticket) notFound();

  const t = await getTranslations("success");

  return (
    <div className="bg-navy-deep">
      <SiteNav />

      {/* 05 — SUCCESS: centered confirmation under a top bloom */}
      <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden bg-linear-to-b from-navy-deep to-navy px-5 py-16 md:min-h-[720px] md:px-10">
        <div aria-hidden className="bloom-top pointer-events-none absolute inset-0" />
        <ContourLayer />
        <div className="relative flex max-w-[720px] flex-col items-center gap-6 text-center md:gap-8">
          <span
            aria-hidden
            className="mono flex size-12 items-center justify-center rounded-brand border border-lavender/40 bg-lavender/8 text-lg text-lavender md:size-14 md:text-xl"
          >
            ✓
          </span>
          <h1 className="text-[34px] leading-[1.4] font-light text-fg-on-dark md:text-[54px]">
            {t("title")}
          </h1>
          <p className="max-w-[560px] text-[15px] leading-loose text-fg-on-dark/65 md:text-lg md:leading-[2.1]">
            {t("body")}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3.5">
            <MonoLabel tone="accent" className="tracking-[0.2em]">
              {t("refLabel")}
            </MonoLabel>
            <div className="flex flex-col items-stretch gap-2.5 sm:flex-row">
              <ReferenceCode code={ticket.referenceCode} size="lg" />
              <CopyCodeButton code={ticket.referenceCode} />
            </div>
          </div>
          <div className="mt-3 flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href="/track" size="md">
              {t("trackCta")}
            </ButtonLink>
            <ButtonLink href="/" variant="ghost" size="md">
              {t("backHome")}
            </ButtonLink>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
