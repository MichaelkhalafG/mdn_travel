import type { ComponentProps } from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "lavender" | "ghost" | "accent" | "danger" | "navy";
type ButtonSize = "lg" | "md" | "sm";

// Per design/template.html "BUTTONS ON DARK": white/lavender fills carry
// navy-deep text; royal blue is reserved for active moments (glowing);
// danger is a hairline-outlined action, never a heavy fill.
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-fg-on-dark text-navy-deep font-semibold",
  lavender: "bg-lavender text-navy-deep font-semibold",
  ghost: "border border-fg-on-dark/22 bg-transparent text-fg-on-dark font-medium",
  accent: "bg-accent text-fg-on-dark font-semibold glow-accent",
  danger: "border border-danger/35 bg-transparent text-danger font-normal",
  // Solid navy fill for LIGHT surfaces (form cards, admin) — the design's
  // submit button; the white `primary` fill would vanish on white.
  navy: "bg-navy text-fg-on-dark font-semibold",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "px-10 py-[17px] text-base",
  md: "px-[30px] py-3.5 text-[15px]",
  sm: "px-[22px] py-2.5 text-sm",
};

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center rounded-brand outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-accent/40",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button({
  variant = "primary",
  size = "md",
  surface = "dark",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Surface the button sits on — picks a legible disabled treatment */
  surface?: "dark" | "light";
}) {
  return (
    <button
      type={type}
      className={cn(
        buttonClasses(variant, size, className),
        "disabled:animate-none disabled:shadow-none",
        surface === "light"
          ? "disabled:border disabled:border-border-light disabled:bg-canvas-subtle disabled:font-medium disabled:text-mono-label"
          : "disabled:border-0 disabled:bg-fg-on-dark/6 disabled:font-medium disabled:text-fg-on-dark/35"
      )}
      {...props}
    />
  );
}

// Locale-aware link with button styling (CTAs, anchors to page sections).
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
