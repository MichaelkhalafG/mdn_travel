import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Button,
  Card,
  Chip,
  DarkPanel,
  Input,
  LogoLockup,
  ReferenceCode,
  Select,
  StatusBadge,
  Textarea,
  Timeline,
} from "@/components/ui";
import { TICKET_STATUSES } from "@/lib/status";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mono text-[11px] font-normal tracking-[0.16em] text-mono-label">
      {children}
    </h2>
  );
}

export default async function DevUiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("devUi");
  const tStatus = await getTranslations("status");
  const tRequest = await getTranslations("request");
  const tContact = await getTranslations("contactMethod");
  const tErrors = await getTranslations("errors");
  const tTrack = await getTranslations("track");

  const trackingSteps = [
    {
      label: tStatus("RECEIVED"),
      meta: t("timelineMetaReceived"),
      state: "completed" as const,
    },
    {
      label: tStatus("IN_PROGRESS"),
      meta: t("timelineMetaInProgress"),
      state: "completed" as const,
    },
    {
      label: tStatus("PREPARING_OFFER"),
      note: t("timelineNoteCurrent"),
      state: "current" as const,
    },
    { label: tStatus("CONTACTED"), state: "future" as const },
    { label: tStatus("AGREED"), state: "future" as const },
    { label: tStatus("PAID"), state: "future" as const },
  ];

  const adminSteps = [
    {
      label: tStatus("RECEIVED"),
      meta: t("adminMetaReceived"),
      state: "completed" as const,
    },
    {
      label: tStatus("IN_PROGRESS"),
      meta: t("adminMetaInProgress"),
      state: "current" as const,
    },
    { label: tStatus("PREPARING_OFFER"), state: "future" as const },
    { label: tStatus("CONTACTED"), state: "future" as const },
  ];

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-4">
        <LogoLockup />
        <h1 className="text-3xl font-medium text-fg-on-dark">{t("title")}</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-fg-on-dark-muted">
          {t("tagline")}
        </p>
      </header>

      <section className="flex flex-col gap-5">
        <SectionLabel>{t("sectionLogo")}</SectionLabel>
        <div className="flex flex-wrap items-center gap-10">
          <LogoLockup size="md" />
          <LogoLockup size="sm" />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionLabel>{t("sectionButtons")}</SectionLabel>
        <div className="flex flex-wrap items-center gap-3.5">
          <Button variant="primary">{t("requestService")}</Button>
          <Button variant="lavender">{t("trackRequest")}</Button>
          <Button variant="ghost">{t("aboutUs")}</Button>
          <Button variant="accent">{t("activeState")}</Button>
          <Button variant="danger">{t("markNoAgreement")}</Button>
          <Button variant="primary" disabled>
            {t("disabledState")}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <Button size="sm" variant="primary">
            {t("requestService")}
          </Button>
          <Button size="sm" variant="ghost">
            {t("aboutUs")}
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionLabel>{t("sectionInputs")}</SectionLabel>
        <Card variant="light" className="p-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input label={tRequest("fullName")} defaultValue={t("sampleName")} />
            <Input
              label={tRequest("phone")}
              mono
              dir="ltr"
              defaultValue={t("samplePhone")}
            />
            <Input
              label={tRequest("email")}
              defaultValue={t("sampleBadEmail")}
              error={tErrors("invalidEmail")}
            />
            <Select label={tRequest("contactMethod")} defaultValue="WHATSAPP">
              <option value="WHATSAPP">{tContact("WHATSAPP")}</option>
              <option value="PHONE">{tContact("PHONE")}</option>
              <option value="EMAIL">{tContact("EMAIL")}</option>
            </Select>
            <div className="sm:col-span-2">
              <Textarea
                label={tRequest("details")}
                placeholder={tRequest("details")}
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-5">
        <SectionLabel>{t("sectionChips")}</SectionLabel>
        <div className="flex flex-wrap items-center gap-2.5">
          <Chip>{t("chipLabel")}</Chip>
          <ReferenceCode code={t("sampleCode")} />
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionLabel>{t("sectionBadgesDark")}</SectionLabel>
        <div className="flex flex-wrap items-center gap-2.5">
          {TICKET_STATUSES.map((status) => (
            <StatusBadge key={status} status={status} surface="dark" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionLabel>{t("sectionBadgesLight")}</SectionLabel>
        <Card variant="light" className="p-5">
          <div className="flex flex-wrap items-center gap-2.5">
            {TICKET_STATUSES.map((status) => (
              <StatusBadge key={status} status={status} surface="light" />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionLabel>{t("sectionTimeline")}</SectionLabel>
          <Timeline steps={trackingSteps} surface="dark" />
        </div>
        <div className="flex flex-col gap-5">
          <SectionLabel>{t("sectionTimelineLight")}</SectionLabel>
          <Card variant="light" className="p-6">
            <Timeline steps={adminSteps} surface="light" />
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionLabel>{t("sectionCards")}</SectionLabel>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card variant="dark" className="p-8">
            <h3 className="mb-2 text-xl font-medium text-fg-on-dark">
              {t("cardDarkTitle")}
            </h3>
            <p className="text-sm leading-relaxed text-fg-on-dark-muted">
              {t("cardDarkBody")}
            </p>
          </Card>
          <Card variant="light" className="p-8">
            <h3 className="mb-2 text-xl font-medium text-navy">
              {t("cardLightTitle")}
            </h3>
            <p className="text-sm leading-relaxed text-fg-on-light-muted">
              {t("cardLightBody")}
            </p>
          </Card>
        </div>
        <DarkPanel className="p-10">
          <div className="flex flex-col items-start gap-3">
            <h3 className="text-2xl font-medium text-fg-on-dark">
              {t("panelTitle")}
            </h3>
            <p className="max-w-xl text-[15px] leading-relaxed text-fg-on-dark-muted">
              {t("panelBody")}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3.5">
              <Button variant="primary">{t("requestService")}</Button>
              <Button variant="ghost">{tTrack("title")}</Button>
            </div>
          </div>
        </DarkPanel>
      </section>
    </main>
  );
}
