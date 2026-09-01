import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LogoLockup, MonoLabel } from "@/components/ui";

const itemClass =
  "text-sm text-fg-on-dark/62 transition-colors hover:text-fg-on-dark";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-on-dark bg-navy-deep px-6 pt-16 pb-8 md:px-14 md:pt-[88px] md:pb-10">
      <div className="mx-auto flex max-w-[1328px] flex-col gap-12 md:gap-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12">
          <div className="flex flex-col gap-5">
            <LogoLockup size="sm" />
            <p className="max-w-[300px] text-sm leading-loose text-fg-on-dark/50">
              {t("tagline")}
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <MonoLabel tone="accent">{t("colServices")}</MonoLabel>
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
            <MonoLabel tone="accent">{t("colPlatform")}</MonoLabel>
            <Link href="/track" className={itemClass}>
              {t("linkTrack")}
            </Link>
            <a href="#" className={itemClass}>
              {t("linkAbout")}
            </a>
            <a href="#" className={itemClass}>
              {t("linkFaq")}
            </a>
            <a href="#" className={itemClass}>
              {t("linkPrivacy")}
            </a>
          </div>

          <div className="flex flex-col gap-3.5">
            <MonoLabel tone="accent">{t("colContact")}</MonoLabel>
            <span className="mono text-sm text-fg-on-dark/62" dir="ltr">
              {t("phone")}
            </span>
            <span className="mono text-sm text-fg-on-dark/62">{t("email")}</span>
            <span className="text-sm text-fg-on-dark/62">{t("cities")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border-on-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="mono text-xs text-fg-on-dark/35">{t("copyright")}</span>
          <span className="text-[13px] text-fg-on-dark/35">{t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
