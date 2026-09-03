import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Button,
  DarkPanel,
  Eyebrow,
  MeridianLayer,
  MonoLabel,
} from "@/components/ui";

// Texture lab — reference for the ADOPTED two-tier texture system, rendered
// at final values so the layers can be tuned side by side:
//   HERO TIER    → MeridianLayer (one instance per view)
//   SURFACE TIER → ContourLayer (DarkPanel / dark Card default)
export default async function TexturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("devTexture");
  const tUi = await getTranslations("devUi");
  const tHome = await getTranslations("home");

  const panelContent = (
    <div className="relative flex min-h-[460px] flex-col justify-center gap-6 p-10">
      <Eyebrow>{t("panelEyebrow")}</Eyebrow>
      <h2 className="text-[30px] leading-snug font-light text-fg-on-dark">
        {tUi("panelTitle")}
      </h2>
      <p className="max-w-[420px] text-[15px] leading-loose text-fg-on-dark/60">
        {tUi("panelBody")}
      </p>
      <div className="flex items-baseline gap-3">
        <span className="mono text-[34px] text-fg-on-dark">{tHome("stat3Value")}</span>
        <span className="text-sm text-fg-on-dark/50">{tHome("stat3Label")}</span>
      </div>
      <div>
        <Button size="md">{tUi("requestService")}</Button>
      </div>
    </div>
  );

  return (
    <main className="mx-auto flex min-h-dvh max-w-[1280px] flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-medium text-fg-on-dark">{t("title")}</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-fg-on-dark-muted">
          {t("tagline")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <MonoLabel tone="accent" className="tracking-[0.2em]">
              {t("aLabel")}
            </MonoLabel>
            <p className="max-w-md text-[13px] leading-relaxed text-fg-on-dark-muted">
              {t("aDesc")}
            </p>
          </div>
          <DarkPanel contours={false} className="min-h-[460px]">
            <MeridianLayer />
            {panelContent}
          </DarkPanel>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <MonoLabel tone="accent" className="tracking-[0.2em]">
              {t("bLabel")}
            </MonoLabel>
            <p className="max-w-md text-[13px] leading-relaxed text-fg-on-dark-muted">
              {t("bDesc")}
            </p>
          </div>
          <DarkPanel className="min-h-[460px]">{panelContent}</DarkPanel>
        </section>
      </div>
    </main>
  );
}
