import { cn } from "@/lib/cn";

// Mono eyebrow / section label. Tones from the design file:
// muted = section indices, accent = eyebrows on dark, royal = eyebrows on light.
const toneClasses = {
  muted: "text-mono-label",
  accent: "text-accent-soft",
  royal: "text-accent",
} as const;

export function MonoLabel({
  tone = "muted",
  className,
  children,
}: {
  tone?: keyof typeof toneClasses;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "mono text-[11px] tracking-[0.18em]",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
