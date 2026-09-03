"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button, Input, RadioPills, Textarea } from "@/components/ui";
import {
  contactMethods,
  ticketRequestSchema,
  type TicketRequestInput,
} from "@/lib/schemas";
import { submitTicketRequest } from "./actions";

type FieldName = keyof TicketRequestInput;
type FieldErrors = Partial<Record<FieldName, string>>;

const DETAILS_MAX = 2000;

// Client + server run the SAME Zod schema; both return i18n keys that are
// resolved here, so inline errors stay localized either way.
export function RequestForm({ serviceSlug }: { serviceSlug: string }) {
  const t = useTranslations();
  const [values, setValues] = useState<TicketRequestInput>({
    fullName: "",
    phone: "",
    email: "",
    contactMethod: "WHATSAPP",
    details: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (field: FieldName) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }) as TicketRequestInput);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setFormError(null);
    const parsed = ticketRequestSchema.safeParse(values);
    if (!parsed.success) {
      const flat = z.flattenError(parsed.error).fieldErrors;
      const next: FieldErrors = {};
      for (const [field, messages] of Object.entries(flat)) {
        if (messages?.[0]) next[field as FieldName] = messages[0];
      }
      setErrors(next);
      return;
    }
    setErrors({});
    startTransition(async () => {
      const result = await submitTicketRequest(serviceSlug, values);
      if (result?.fieldErrors) setErrors(result.fieldErrors);
      if (result?.formError) setFormError(result.formError);
    });
  };

  const fieldError = (field: FieldName) =>
    errors[field] ? t(errors[field]) : undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 md:gap-7">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-5.5">
        <Input
          label={t("request.fullName")}
          name="fullName"
          maxLength={120}
          autoComplete="name"
          placeholder={t("request.fullNamePlaceholder")}
          value={values.fullName}
          onChange={(e) => update("fullName")(e.target.value)}
          error={fieldError("fullName")}
        />
        <Input
          label={t("request.phone")}
          name="phone"
          mono
          dir="ltr"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t("request.phonePlaceholder")}
          value={values.phone}
          onChange={(e) => update("phone")(e.target.value)}
          error={fieldError("phone")}
        />
      </div>
      <Input
        label={t("request.email")}
        name="email"
        mono
        dir="ltr"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={t("request.emailPlaceholder")}
        value={values.email ?? ""}
        onChange={(e) => update("email")(e.target.value)}
        error={fieldError("email")}
      />
      <RadioPills
        label={t("request.contactMethod")}
        name="contactMethod"
        options={contactMethods.map((method) => ({
          value: method,
          label: t(`contactMethod.${method}`),
        }))}
        value={values.contactMethod}
        onChange={update("contactMethod")}
        error={fieldError("contactMethod")}
      />
      <Textarea
        label={t("request.details")}
        name="details"
        rows={5}
        maxLength={DETAILS_MAX}
        counter={{ value: values.details.length, max: DETAILS_MAX }}
        placeholder={t("request.detailsPlaceholder")}
        value={values.details}
        onChange={(e) => update("details")(e.target.value)}
        error={fieldError("details")}
      />
      <div aria-hidden className="h-px bg-border-light-subtle" />
      {formError ? (
        <p role="alert" className="text-[13px] text-danger">
          {t(formError)}
        </p>
      ) : null}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[13px] leading-relaxed text-fg-on-light-muted">
          {t("request.privacyNote")}
        </p>
        <Button
          type="submit"
          variant="navy"
          size="lg"
          disabled={pending}
          className="whitespace-nowrap max-sm:w-full"
        >
          {pending ? t("request.submitting") : t("request.submit")}
        </Button>
      </div>
    </form>
  );
}
