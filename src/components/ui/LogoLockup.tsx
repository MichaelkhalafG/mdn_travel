import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

// "MDN" (Space Grotesk 700) + 1px vertical hairline + "TRAVEL" (Space Grotesk
// 600, letter-spacing 0.26em, lavender on dark). Sizes from the design file:
// md = page header (26/15), sm = nav bar (20/13).
export function LogoLockup({
  size = "md",
  className,
}: {
  size?: "md" | "sm";
  className?: string;
}) {
  const t = useTranslations("brand");
  const md = size === "md";
  return (
    <span className={cn("flex items-baseline", md ? "gap-4" : "gap-3.5", className)}>
      <span
        className={cn(
          "font-sans font-bold tracking-[-0.01em] text-fg-on-dark",
          md ? "text-[26px]" : "text-xl"
        )}
      >
        {t("name")}
      </span>
      <span
        aria-hidden
        className={cn("w-px self-center bg-fg-on-dark/22", md ? "h-[22px]" : "h-[18px]")}
      />
      <span
        className={cn(
          "font-sans font-semibold tracking-[0.26em] text-lavender",
          md ? "text-[15px]" : "text-[13px]"
        )}
      >
        {t("suffix")}
      </span>
    </span>
  );
}
