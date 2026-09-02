import { cn } from "@/lib/cn";
import { ContourLayer } from "./ContourLayer";

// Trust/USP strip per design: navy gradient section with a royal bloom at the
// inline-end bottom corner (mirrors in RTL), mono figures, hairline cell gaps.
// Contours flow from the inline-START corner here — alternating the origin
// with the services band above so the page doesn't repeat mechanically.
export function StatStrip({
  stats,
  className,
}: {
  stats: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-linear-to-b from-navy to-navy-deep px-6 py-16 md:px-14 md:py-[88px]",
        className
      )}
    >
      <div aria-hidden className="bloom-stats pointer-events-none absolute inset-0" />
      <ContourLayer origin="start" className="opacity-60" />
      <div className="relative mx-auto grid max-w-[1328px] grid-cols-2 gap-px bg-fg-on-dark/6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2.5 px-6 py-4 md:px-8"
          >
            <span className="mono text-[28px] text-fg-on-dark md:text-[38px]">
              {stat.value}
            </span>
            <span className="text-sm text-fg-on-dark/55">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
