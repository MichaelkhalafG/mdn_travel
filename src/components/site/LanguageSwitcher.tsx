"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";

// Swaps the locale on the CURRENT path (en ⇄ ar), never redirects home.
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      className={cn(
        "mono rounded-brand text-[13px] tracking-[0.08em] text-fg-on-dark/50 outline-none transition-colors hover:text-fg-on-dark focus-visible:ring-[3px] focus-visible:ring-accent/40",
        className
      )}
    >
      {t("localeSwitch")}
    </Link>
  );
}
