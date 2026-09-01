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
        "font-sans text-[13px] tracking-[0.08em] text-fg-on-dark/50 transition-colors hover:text-fg-on-dark",
        className
      )}
    >
      {t("localeSwitch")}
    </Link>
  );
}
