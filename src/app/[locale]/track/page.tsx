import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContourLayer } from "@/components/ui";
import { TrackClient } from "./TrackClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("trackTitle") };
}

// 06 — TRACK REQUEST: dark surface-tier section (contours, no meridian).
// Lookup + result are client-rendered in place — no result URLs.
export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-navy-deep">
      <SiteNav />
      <section className="relative overflow-hidden bg-linear-to-b from-navy-deep to-navy px-5 py-12 md:px-14 md:py-[88px]">
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0 opacity-80" />
        <ContourLayer className="opacity-70" />
        <TrackClient />
      </section>
      <SiteFooter />
    </div>
  );
}
