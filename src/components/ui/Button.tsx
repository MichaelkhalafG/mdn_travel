import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "lavender" | "ghost" | "accent" | "danger";
type ButtonSize = "md" | "sm";

// Per design/template.html "BUTTONS ON DARK": white/lavender fills carry
// navy-deep text; royal blue is reserved for active moments (glowing);
// danger is a hairline-outlined action, never a heavy fill.
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-fg-on-dark text-navy-deep font-semibold",
  lavender: "bg-lavender text-navy-deep font-semibold",
  ghost: "border border-fg-on-dark/22 bg-transparent text-fg-on-dark font-medium",
  accent: "bg-accent text-fg-on-dark font-semibold glow-accent",
  danger: "border border-danger/35 bg-transparent text-danger font-normal",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-[30px] py-3.5 text-[15px]",
  sm: "px-[22px] py-2.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-brand outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-accent/40",
        variantClasses[variant],
        sizeClasses[size],
        "disabled:border-0 disabled:bg-fg-on-dark/6 disabled:text-fg-on-dark/35 disabled:font-medium disabled:animate-none disabled:shadow-none",
        className
      )}
      {...props}
    />
  );
}
