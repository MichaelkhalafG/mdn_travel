import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { TicketStatusValue } from "@/lib/status";

// Badge treatments extracted from design/template.html:
// "CHIPS · BADGES" (dark surface) + admin table rows (light surface).
// RECEIVED = lavender chip; in-flight states = tinted royal outline;
// AGREED = solid royal (a "moment"); NO_AGREEMENT = tinted danger outline;
// PAID = quiet neutral outline.
const darkClasses: Record<TicketStatusValue, string> = {
  RECEIVED: "bg-lavender px-3.5 py-[7px] text-navy-deep",
  IN_PROGRESS:
    "border border-accent-soft/35 bg-accent/15 px-[13px] py-1.5 text-accent-soft",
  PREPARING_OFFER:
    "border border-accent-soft/40 bg-accent/16 px-3.5 py-[7px] text-accent-soft",
  CONTACTED:
    "border border-accent-soft/35 bg-accent/15 px-[13px] py-1.5 text-accent-soft",
  AGREED: "bg-accent px-3.5 py-[7px] font-medium text-fg-on-dark",
  NO_AGREEMENT:
    "border border-danger/40 bg-danger/12 px-[13px] py-1.5 text-danger",
  PAID: "border border-fg-on-dark/16 px-[13px] py-1.5 text-fg-on-dark/60",
};

const lightClasses: Record<TicketStatusValue, string> = {
  RECEIVED: "bg-lavender px-2.5 py-1 text-navy-deep",
  IN_PROGRESS:
    "border border-accent/30 bg-accent/10 px-[9px] py-[3px] text-accent",
  PREPARING_OFFER:
    "border border-accent/30 bg-accent/10 px-[9px] py-[3px] text-accent",
  CONTACTED:
    "border border-accent/30 bg-accent/10 px-[9px] py-[3px] text-accent",
  AGREED: "bg-accent px-2.5 py-1 text-fg-on-dark",
  NO_AGREEMENT:
    "border border-danger/35 bg-danger/8 px-[9px] py-[3px] text-danger",
  PAID: "border border-border-light px-[9px] py-[3px] text-fg-on-light-muted",
};

export function StatusBadge({
  status,
  surface = "dark",
  className,
}: {
  status: TicketStatusValue;
  surface?: "dark" | "light";
  className?: string;
}) {
  const t = useTranslations("status");
  const classes = surface === "light" ? lightClasses : darkClasses;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-brand",
        surface === "light" ? "text-xs" : "text-[13px]",
        classes[status],
        className
      )}
    >
      {t(status)}
    </span>
  );
}
