import { cn } from "@/lib/cn";
import { ContourLayer } from "./ContourLayer";

// Section wrapper: navy gradient mesh + radial royal-blue bloom (mirrors in
// RTL via globals.css) + the surface-tier topography contours.
export function DarkPanel({
  className,
  contours = true,
  children,
}: {
  className?: string;
  /** Set false to drop the surface-tier contour layer */
  contours?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("panel-dark relative overflow-hidden", className)}>
      {contours ? <ContourLayer /> : null}
      <div className="relative">{children}</div>
    </section>
  );
}
