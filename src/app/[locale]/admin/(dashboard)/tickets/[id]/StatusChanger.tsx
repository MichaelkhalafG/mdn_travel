"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Select } from "@/components/ui";
import { TICKET_STATUSES, type TicketStatusValue } from "@/lib/status";
import { changeTicketStatus } from "./actions";

const TERMINAL: TicketStatusValue[] = ["NO_AGREEMENT", "PAID"];

// Select any status + update; the two terminal states require an inline
// confirm step (a styled dialog, not window.confirm) before the action runs.
export function StatusChanger({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: TicketStatusValue;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [selected, setSelected] = useState<TicketStatusValue>(currentStatus);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const apply = () => {
    startTransition(async () => {
      const result = await changeTicketStatus(ticketId, selected);
      setConfirming(false);
      if (!result.ok) {
        setError(t(result.error));
        return;
      }
      setError(null);
      router.refresh();
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pending || selected === currentStatus) return;
    setError(null);
    if (TERMINAL.includes(selected)) {
      setConfirming(true);
      return;
    }
    apply();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Select
        label={t("admin.detail.changeStatus")}
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value as TicketStatusValue);
          setConfirming(false);
        }}
      >
        {TICKET_STATUSES.map((status) => (
          <option key={status} value={status}>
            {t(`status.${status}`)}
          </option>
        ))}
      </Select>

      {confirming ? (
        <div
          role="alertdialog"
          aria-live="assertive"
          className="flex flex-col gap-3 rounded-brand border border-danger/35 bg-danger/4 p-3.5"
        >
          <p className="text-[13px] leading-relaxed text-navy">
            {t("admin.detail.confirmTerminal", { status: t(`status.${selected}`) })}
          </p>
          <div className="flex gap-2.5">
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={pending}
              onClick={apply}
            >
              {t("admin.detail.confirm")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="border-border-light text-navy"
              onClick={() => setConfirming(false)}
            >
              {t("admin.detail.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="submit"
          variant="accent"
          size="sm"
          surface="light"
          disabled={pending || selected === currentStatus}
          className="self-start"
        >
          {t("admin.detail.updateStatus")}
        </Button>
      )}

      {error ? (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}
