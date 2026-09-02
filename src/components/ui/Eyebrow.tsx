import { cn } from "@/lib/cn";

// Eyebrow / section label: TEXT font (Space Grotesk / Plex Arabic via the
// locale stack — never mono), uppercase, medium, quiet tracking, white/55 on
// dark. No dash, no hairline prefix, no accent color. Mono is reserved for
// data (codes, numbers, timestamps) — see MonoLabel.
const toneClasses = {
  dark: "text-fg-on-dark/55",
  light: "text-fg-on-light-muted",
} as const;

export function Eyebrow({
  tone = "dark",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  tone?: keyof typeof toneClasses;
}) {
  return (
    <span
      className={cn(
        "text-[12.5px] font-medium tracking-[0.14em] uppercase",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
