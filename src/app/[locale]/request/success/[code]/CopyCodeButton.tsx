"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

export function CopyCodeButton({ code }: { code: string }) {
  const t = useTranslations("success");
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (permissions / insecure context) — leave the
      // label unchanged so we never claim a copy that didn't happen
    }
  };

  return (
    <Button variant="ghost" size="md" onClick={copy} aria-live="polite">
      {copied ? t("copied") : t("copy")}
    </Button>
  );
}
