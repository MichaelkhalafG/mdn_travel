import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <section className="panel-dark shadow-marketing w-full max-w-2xl overflow-hidden">
        <div className="grid-motif flex flex-col items-start gap-6 p-10 sm:p-14">
          <p className="flex items-center gap-3">
            <span className="text-xl font-bold text-fg-on-dark">
              {tBrand("name")}
            </span>
            <span aria-hidden className="h-5 w-px bg-fg-on-dark-muted" />
            <span className="text-sm font-semibold tracking-[0.26em] text-lavender">
              {tBrand("suffix")}
            </span>
          </p>

          <h1 className="text-4xl font-bold text-fg-on-dark sm:text-5xl">
            {t("heroTitle")}
          </h1>

          <p className="max-w-md text-fg-on-dark-muted">{t("heroTagline")}</p>

          <p className="flex items-center gap-3 rounded-brand bg-lavender px-3 py-1.5 text-navy">
            <span className="text-sm">{t("sampleReferenceLabel")}</span>
            <span className="mono text-sm font-semibold">MDN-7Q4KX</span>
          </p>

          <p className="text-sm text-fg-on-dark-muted">{t("placeholderNote")}</p>
        </div>
      </section>
    </main>
  );
}
