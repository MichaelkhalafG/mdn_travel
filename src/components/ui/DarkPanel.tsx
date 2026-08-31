import { cn } from "@/lib/cn";

// Section wrapper: navy gradient mesh + radial royal-blue bloom (mirrors in
// RTL via globals.css) + faint 1px grid motif at white @5%.
export function DarkPanel({
  className,
  grid = true,
  children,
}: {
  className?: string;
  /** Set false to drop the grid motif overlay */
  grid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("panel-dark relative overflow-hidden", className)}>
      {grid ? (
        <div aria-hidden className="grid-motif pointer-events-none absolute inset-0" />
      ) : null}
      <div className="relative">{children}</div>
    </section>
  );
}
