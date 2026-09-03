"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import {
  Button,
  ButtonLink,
  Chip,
  Eyebrow,
  Input,
  StatusBadge,
  Timeline,
  type TimelineStep,
} from "@/components/ui";
import { trackSchema, type TrackInput } from "@/lib/schemas";
import type { TicketStatusValue } from "@/lib/status";
import { CONTACT } from "@/lib/company";
import { trackTicket, type TrackResult, type TrackTicketResult } from "./actions";

type FieldErrors = Partial<Record<keyof TrackInput, string>>;

// Canonical flow; NO_AGREEMENT replaces AGREED as a terminal branch.
const STATUS_PATH: TicketStatusValue[] = [
  "RECEIVED",
  "IN_PROGRESS",
  "PREPARING_OFFER",
  "CONTACTED",
  "AGREED",
  "PAID",
];

const panelClasses =
  "rounded-brand border border-fg-on-dark/8 bg-fg-on-dark/2 p-6 md:p-8";

export function TrackClient() {
  const t = useTranslations();
  const locale = useLocale();
  const [values, setValues] = useState<TrackInput>({ referenceCode: "", phone: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<TrackResult | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (field: keyof TrackInput) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    const parsed = trackSchema.safeParse(values);
    if (!parsed.success) {
      const flat = z.flattenError(parsed.error).fieldErrors;
      const next: FieldErrors = {};
      for (const [field, messages] of Object.entries(flat)) {
        if (messages?.[0]) next[field as keyof TrackInput] = messages[0];
      }
      setErrors(next);
      return;
    }
    setErrors({});
    startTransition(async () => {
      const response = await trackTicket(values);
      if (response.status === "invalid") {
        setErrors(response.fieldErrors);
        return;
      }
      setResult(response);
    });
  };

  // Timeline per design: steps before the current status render completed
  // (royal), the current one glows with its StatusEvent timestamp, the rest
  // are hairline futures. NO_AGREEMENT and PAID are terminal — nothing
  // renders after them.
  const buildSteps = (ticket: TrackTicketResult): TimelineStep[] => {
    const eventTimes = new Map<TicketStatusValue, string>();
    for (const event of ticket.events) eventTimes.set(event.status, event.at);
    const current = ticket.currentStatus;
    const terminal = current === "NO_AGREEMENT" || current === "PAID";
    const currentIndex =
      current === "NO_AGREEMENT" ? 4 : STATUS_PATH.indexOf(current);

    const steps: TimelineStep[] = [];
    for (let i = 0; i < STATUS_PATH.length; i++) {
      const status =
        i === 4 && current === "NO_AGREEMENT" ? "NO_AGREEMENT" : STATUS_PATH[i];
      if (i < currentIndex) {
        steps.push({
          label: t(`status.${status}`),
          meta: eventTimes.get(status),
          state: "completed",
        });
      } else if (i === currentIndex) {
        steps.push({
          label: t(`status.${status}`),
          meta: eventTimes.get(status),
          note: terminal ? undefined : t("track.currentStep"),
          state: "current",
          tone: current === "NO_AGREEMENT" ? "danger" : undefined,
        });
        if (terminal) break;
      } else {
        steps.push({
          label: t(`status.${status}`),
          note: status === "AGREED" ? t("track.orNoAgreement") : undefined,
          state: "future",
        });
      }
    }
    return steps;
  };

  const emptySteps: TimelineStep[] = STATUS_PATH.map((status) => ({
    label: t(`status.${status}`),
    state: "future",
  }));

  return (
    <div className="relative mx-auto grid max-w-[1328px] grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-[72px]">
      <div className="flex flex-col gap-6 md:gap-7">
        <Eyebrow>{t("track.eyebrow")}</Eyebrow>
        <h1 className="text-[32px] leading-[1.45] font-light text-fg-on-dark md:text-[46px]">
          {t("track.title")}
        </h1>
        <p className="max-w-[400px] text-[16px] leading-loose text-fg-on-dark/60 md:leading-[2.1]">
          {t("track.lead")}
        </p>

        {/* Lookup — POST via server action; the phone never reaches a URL and
            the result renders in place (no shareable result link). */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-5.5 rounded-brand border border-fg-on-dark/8 bg-fg-on-dark/2 p-6 md:p-[34px]"
        >
          <Input
            label={t("track.referenceCode")}
            name="referenceCode"
            surface="dark"
            mono
            dir="ltr"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={t("track.codePlaceholder")}
            className="tracking-[0.12em]"
            value={values.referenceCode}
            onChange={(e) => update("referenceCode")(e.target.value.toUpperCase())}
            error={errors.referenceCode ? t(errors.referenceCode) : undefined}
          />
          <Input
            label={t("track.phone")}
            name="phone"
            surface="dark"
            mono
            dir="ltr"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t("track.phonePlaceholder")}
            value={values.phone}
            onChange={(e) => update("phone")(e.target.value)}
            error={errors.phone ? t(errors.phone) : undefined}
          />
          <Button type="submit" variant="lavender" size="md" disabled={pending} className="w-full">
            {pending ? t("track.checking") : t("track.submit")}
          </Button>
        </form>
      </div>

      {/* Result column — all states render as styled panels */}
      <div aria-live="polite" className="flex flex-col">
        {result?.status === "found" ? (
          <div className={cnPanel("flex flex-col gap-7 md:p-11")}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <span dir="ltr" className="mono text-[20px] tracking-[0.12em] text-fg-on-dark md:text-[22px]">
                  {result.ticket.referenceCode}
                </span>
                <Chip className="self-start">
                  {locale === "ar" ? result.ticket.serviceNameAr : result.ticket.serviceNameEn}
                </Chip>
              </div>
              <StatusBadge status={result.ticket.currentStatus} />
            </div>
            <div aria-hidden className="h-px bg-fg-on-dark/7" />
            <Timeline steps={buildSteps(result.ticket)} />
            <div aria-hidden className="h-px bg-fg-on-dark/7" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-fg-on-dark/50">{t("track.helpText")}</span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center justify-center rounded-brand border border-fg-on-dark/22 px-6 py-3 text-sm text-fg-on-dark outline-none transition-colors hover:border-fg-on-dark/40 focus-visible:ring-[3px] focus-visible:ring-accent/40"
              >
                {t("track.helpCta")}
              </a>
            </div>
          </div>
        ) : result?.status === "notFound" ? (
          <div className={cnPanel("flex flex-col items-start gap-4 md:p-11")}>
            <h2 className="text-[20px] font-medium text-fg-on-dark">
              {t("track.notFoundTitle")}
            </h2>
            <p className="text-[15px] leading-loose text-fg-on-dark/60">
              {t("track.notFound")} {t("track.notFoundHint")}
            </p>
            <ButtonLink href="/#services" variant="ghost" size="md" className="mt-2">
              {t("track.requestNew")}
            </ButtonLink>
          </div>
        ) : result?.status === "rateLimited" ? (
          <div className={cnPanel("flex flex-col items-start gap-4 md:p-11")}>
            <h2 className="text-[20px] font-medium text-fg-on-dark">
              {t("track.rateLimitedTitle")}
            </h2>
            <p className="text-[15px] leading-loose text-fg-on-dark/60">
              {t("track.rateLimited")}
            </p>
          </div>
        ) : (
          // Empty state: the canonical journey as quiet hairline steps
          <div className={cnPanel("flex flex-col gap-7 md:p-11")}>
            <div className="flex flex-col gap-2">
              <h2 className="text-[18px] font-medium text-fg-on-dark/80">
                {t("track.emptyTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-fg-on-dark/45">
                {t("track.emptyBody")}
              </p>
            </div>
            <div aria-hidden className="h-px bg-fg-on-dark/7" />
            <Timeline steps={emptySteps} className="opacity-60" />
          </div>
        )}
      </div>
    </div>
  );
}

function cnPanel(extra: string) {
  return `${panelClasses} ${extra}`;
}
