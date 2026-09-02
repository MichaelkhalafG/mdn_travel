import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

// MDN TRAVEL lockup: the real `logo-mdn.png` wordmark + 1px hairline divider +
// "TRAVEL" (Space Grotesk 600, tracking 0.26em, lavender on dark). The raster
// is navy; `variant="dark"` (our nav/footer default) inverts it to white via
// `brightness-0 invert` — same asset, no second file. `variant="navy"` keeps
// the navy mark for the admin's light surfaces. Sizes: sm = nav (23px mark),
// md = footer / page headers (26px mark).
export function LogoLockup({
  variant = "dark",
  size = "md",
  asLink = true,
  priority = false,
  className,
}: {
  variant?: "dark" | "navy";
  size?: "md" | "sm";
  /**
   * Render the lockup as a link to the localized home page (default). Set
   * `false` where navigating away would destroy the user's context — there the
   * lockup is pure branding, announced as an image with its accessible name.
   */
  asLink?: boolean;
  /** Set on the above-the-fold nav instance so the mark never pops in late. */
  priority?: boolean;
  className?: string;
}) {
  const t = useTranslations("brand");
  const dark = variant === "dark";
  const md = size === "md";
  const label = `${t("name")} ${t("suffix")}`;

  const lockupClassName = cn(
    "flex flex-none items-center",
    md ? "gap-3" : "gap-[11px]",
    className
  );

  const lockup = (
    <>
      <Image
        src="/img/logo-mdn.png"
        alt={t("name")}
        width={1855}
        height={752}
        priority={priority}
        className={cn(
          "block w-auto",
          md ? "h-[26px]" : "h-[23px]",
          dark && "brightness-0 invert"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "w-px",
          md ? "h-[22px]" : "h-5",
          dark ? "bg-fg-on-dark/22" : "bg-border-light"
        )}
      />
      <span
        className={cn(
          "font-sans font-semibold tracking-[0.26em]",
          md ? "text-xs" : "text-[11.5px]",
          dark ? "text-lavender" : "text-mono-label"
        )}
      >
        {t("suffix")}
      </span>
    </>
  );

  if (!asLink) {
    return (
      <span role="img" aria-label={label} className={lockupClassName}>
        {lockup}
      </span>
    );
  }

  return (
    <Link
      href="/"
      aria-label={label}
      className={cn(
        lockupClassName,
        "rounded-brand outline-none focus-visible:ring-[3px] focus-visible:ring-accent/40"
      )}
    >
      {lockup}
    </Link>
  );
}
