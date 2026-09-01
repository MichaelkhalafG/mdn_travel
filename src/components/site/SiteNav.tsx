"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ButtonLink, LogoLockup } from "@/components/ui";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/cn";

const linkClass =
  "text-[15px] text-fg-on-dark/60 transition-colors hover:text-fg-on-dark";

export function SiteNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <Link href="/" className="text-[15px] text-fg-on-dark">
        {t("home")}
      </Link>
      <Link href="/#services" className={linkClass}>
        {t("services")}
      </Link>
      <Link href="/track" className={linkClass}>
        {t("track")}
      </Link>
      <a href="#" className={linkClass}>
        {t("about")}
      </a>
    </>
  );

  return (
    <header className="border-b border-border-on-dark bg-navy-deep/70">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-14 md:py-6">
        <Link href="/" className="outline-none focus-visible:ring-[3px] focus-visible:ring-accent/40">
          <LogoLockup size="sm" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">{links}</nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <ButtonLink href="/#services" size="sm">
            {t("requestCta")}
          </ButtonLink>
        </div>

        <button
          type="button"
          aria-label={t("menu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-[22px] flex-col gap-1 py-2 md:hidden"
        >
          <span className="h-px bg-fg-on-dark/70" />
          <span className="h-px bg-fg-on-dark/70" />
        </button>
      </div>

      <nav
        className={cn(
          "flex-col gap-5 border-t border-border-on-dark px-5 pt-5 pb-6 md:hidden",
          open ? "flex" : "hidden"
        )}
      >
        {links}
        <div className="flex items-center gap-5 pt-1">
          <ButtonLink href="/#services" size="sm" onClick={() => setOpen(false)}>
            {t("requestCta")}
          </ButtonLink>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
