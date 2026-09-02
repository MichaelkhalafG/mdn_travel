import { cn } from "@/lib/cn";

// Mono label for DATA ONLY: indices, reference codes, timestamps, prices.
// NOT an eyebrow / section-label treatment — that's the Eyebrow component
// (text font). Tones: muted = indices/meta, accent = data on dark, royal =
// data on light.
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
