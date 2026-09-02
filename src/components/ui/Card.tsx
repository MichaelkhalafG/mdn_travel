import { cn } from "@/lib/cn";
import { ContourLayer } from "./ContourLayer";

// Dark variant: gradient panel + surface-tier contours + soft navy marketing shadow.
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
      <ContourLayer />
      <div className="relative">{children}</div>
    </div>
  );
}
