import { setRequestLocale } from "next-intl/server";
import { LogoLockup, MeridianLayer } from "@/components/ui";

// og.jpg generator: renders the 1200×630 social card at the page's top-left
// corner for browser capture (screenshot the [0,0,1200,630] region, re-encode
// with sharp to public/og.jpg). Hero-tier meridian treatment per CLAUDE.md.
export default async function OgPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-dvh bg-page">
      <style>{`nextjs-portal { display: none; }`}</style>
      <div
        id="og-card"
        className="relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-linear-to-br from-page via-navy-deep to-navy"
      >
        <div aria-hidden className="bloom-hero pointer-events-none absolute inset-0 opacity-70" />
        <MeridianLayer />
        <div className="relative scale-[3.4]">
          <LogoLockup size="md" asLink={false} />
        </div>
      </div>
    </main>
  );
}
