"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ButtonLink, ContourLayer, LogoLockup } from "@/components/ui";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/cn";

const FOCUSABLE = 'a[href], button:not([disabled])';

const navLinkClass = (active: boolean) =>
  cn(
    "rounded-brand outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-accent/40",
    active ? "text-fg-on-dark" : "text-fg-on-dark/60 hover:text-fg-on-dark"
  );

export function SiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // translucent over the hero, solid navy-deep once scrolled past it
  useEffect(() => {
    const onScroll = () =>
      setSolid(window.scrollY > (window.innerWidth >= 768 ? 640 : 400));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // route change closes the drawer (same-page anchors close via onClick)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // open drawer: lock body scroll, move focus in, trap Tab, Escape closes;
  // cleanup restores scroll and returns focus to the hamburger
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      } else if (!panelRef.current.contains(current)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      toggleRef.current?.focus();
    };
  }, [open]);

  const links = [
    { key: "home", href: "/", label: t("home"), active: pathname === "/" },
    {
      key: "services",
      href: "/#services",
      label: t("services"),
      active: pathname.startsWith("/services"),
    },
    {
      key: "track",
      href: "/track",
      label: t("track"),
      active: pathname.startsWith("/track"),
    },
    {
      key: "about",
      href: "/about",
      label: t("about"),
      active: pathname.startsWith("/about"),
    },
  ] as const;

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border-on-dark transition-colors duration-300",
        solid || open ? "bg-navy-deep" : "bg-navy-deep/70"
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-14 md:py-6">
        <LogoLockup size="sm" priority />

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn("text-[15px]", navLinkClass(link.active))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LanguageSwitcher />
          <ButtonLink href="/#services" size="sm">
            {t("requestCta")}
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label={t("menu")}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="-me-2.5 flex size-11 items-center justify-center rounded-brand outline-none focus-visible:ring-[3px] focus-visible:ring-accent/40 md:hidden"
        >
          <span aria-hidden className="flex w-[22px] flex-col gap-[5px]">
            <span className="h-px bg-fg-on-dark/70" />
            <span className="h-px bg-fg-on-dark/70" />
          </span>
        </button>
      </div>

      {/* Mobile drawer — full-height panel sliding from the inline-end
          (mirrored in RTL), DarkPanel treatment: navy gradient + bloom + contours.
          Kept mounted for the slide-out; `inert` removes it from the tab order
          while closed. Reduced motion collapses the slide via the global
          transition override. */}
      <div
        id="mobile-drawer"
        inert={!open}
        className={cn("fixed inset-0 z-50 md:hidden", !open && "pointer-events-none")}
      >
        <div
          aria-hidden
          onClick={close}
          className={cn(
            "absolute inset-0 bg-page/70 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          className={cn(
            "panel-dark absolute inset-y-0 end-0 flex w-[86%] max-w-[400px] flex-col overflow-hidden rounded-none border-0 border-s border-border-on-dark transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
          )}
        >
          <ContourLayer />

          <div className="relative flex items-center justify-between py-2 ps-5 pe-2">
            <LogoLockup size="sm" />
            <button
              ref={closeRef}
              type="button"
              aria-label={t("closeMenu")}
              onClick={close}
              className="flex size-11 items-center justify-center rounded-brand outline-none focus-visible:ring-[3px] focus-visible:ring-accent/40"
            >
              <span aria-hidden className="relative block size-4">
                <span className="absolute top-1/2 start-0 h-px w-full rotate-45 bg-fg-on-dark/80" />
                <span className="absolute top-1/2 start-0 h-px w-full -rotate-45 bg-fg-on-dark/80" />
              </span>
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col items-start gap-7 overflow-y-auto px-6 pt-12">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={close}
                className={cn("text-[21px]", navLinkClass(link.active))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex flex-col items-start gap-6 px-6 pt-6 pb-[calc(1.5rem_+_env(safe-area-inset-bottom))]">
            <LanguageSwitcher />
            <ButtonLink
              href="/#services"
              size="md"
              onClick={close}
              className="w-full"
            >
              {t("requestCta")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
