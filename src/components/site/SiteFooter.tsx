import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Eyebrow, LogoLockup, MeridianLayer } from "@/components/ui";
import { CONTACT } from "@/lib/company";

const itemClass =
  "text-sm text-fg-on-dark/62 transition-colors hover:text-fg-on-dark";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="relative overflow-hidden border-t border-border-on-dark bg-navy-deep px-6 pt-16 pb-8 md:px-14 md:pt-[88px] md:pb-10">
      {/* hero-tier meridian instance for the large footer panel */}
      <MeridianLayer align="top" />
      <div className="relative mx-auto flex max-w-[1328px] flex-col gap-12 md:gap-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12">
          <div className="flex flex-col gap-5">
            <LogoLockup size="md" />
            <p className="max-w-[300px] text-sm leading-loose text-fg-on-dark/50">
              {t("tagline")}
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <Eyebrow>{t("colServices")}</Eyebrow>
            <Link href="/services/hotels-resorts" className={itemClass}>
              {t("linkHotels")}
            </Link>
            <Link href="/services/yachts" className={itemClass}>
              {t("linkYachts")}
            </Link>
            <Link href="/services/conferences-events" className={itemClass}>
              {t("linkConferences")}
            </Link>
            <Link href="/services/business-services" className={itemClass}>
              {t("linkBusiness")}
            </Link>
          </div>

          <div className="flex flex-col gap-3.5">
            <Eyebrow>{t("colPlatform")}</Eyebrow>
            <Link href="/track" className={itemClass}>
              {t("linkTrack")}
            </Link>
            <Link href="/about" className={itemClass}>
              {t("linkAbout")}
            </Link>
            <Link href="/faq" className={itemClass}>
              {t("linkFaq")}
            </Link>
            <Link href="/privacy" className={itemClass}>
              {t("linkPrivacy")}
            </Link>
          </div>

          <div className="flex flex-col gap-3.5">
            <Eyebrow>{t("colContact")}</Eyebrow>
            <a
              href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`}
              className="mono rounded-brand text-sm text-fg-on-dark/62 outline-none transition-colors hover:text-fg-on-dark focus-visible:ring-[3px] focus-visible:ring-accent/40"
              dir="ltr"
            >
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mono rounded-brand text-sm text-fg-on-dark/62 outline-none transition-colors hover:text-fg-on-dark focus-visible:ring-[3px] focus-visible:ring-accent/40"
            >
              {CONTACT.email}
            </a>
            <span className="text-sm text-fg-on-dark/62">{t("cities")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border-on-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
          {/* dir=ltr: bidi isolation so "© 2026 MDN GROUP" doesn't reorder in RTL */}
          <span dir="ltr" className="mono text-xs text-fg-on-dark/35">
            {t("copyright")}
          </span>
          <span className="text-[13px] text-fg-on-dark/35">{t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
