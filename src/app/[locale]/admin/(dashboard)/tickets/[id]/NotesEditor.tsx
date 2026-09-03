"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button, Textarea } from "@/components/ui";
import { saveAdminNotes } from "./actions";

// Internal notes — stored on the ticket, rendered NOWHERE public (the
// tracking lookup never selects adminNotes).
export function NotesEditor({
  ticketId,
  initialNotes,
}: {
  ticketId: string;
  initialNotes: string;
}) {
  const t = useTranslations();
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await saveAdminNotes(ticketId, notes);
      if (!result.ok) {
        setError(t(result.error));
        return;
      }
      setSaved(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
      <Textarea
        label={t("admin.detail.notesTitle")}
        rows={4}
        maxLength={5000}
        placeholder={t("admin.detail.notesPlaceholder")}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {error ? (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <Button type="submit" variant="navy" size="sm" surface="light" disabled={pending}>
          {pending ? t("admin.detail.saving") : t("admin.detail.saveNotes")}
        </Button>
        <span aria-live="polite" className="text-[13px] text-fg-on-light-muted">
          {saved ? t("admin.detail.notesSaved") : ""}
        </span>
      </div>
    </form>
  );
}
