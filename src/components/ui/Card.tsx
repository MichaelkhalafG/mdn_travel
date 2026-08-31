import { cn } from "@/lib/cn";

// Dark variant: gradient panel + faint grid motif + soft navy marketing shadow.
// Light variant: flat Primer-style surface for the admin UI (no heavy shadow).
export function Card({
  variant = "dark",
  className,
  children,
}: {
  variant?: "dark" | "light";
  className?: string;
  children: React.ReactNode;
}) {
  if (variant === "light") {
    return (
      <div
        className={cn(
          "rounded-brand border border-border-light bg-canvas-light",
          className
        )}
      >
        {children}
      </div>
    );
  }
  return (
    <div className={cn("panel-dark shadow-marketing relative overflow-hidden", className)}>
      <div aria-hidden className="grid-motif pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </div>
  );
}
