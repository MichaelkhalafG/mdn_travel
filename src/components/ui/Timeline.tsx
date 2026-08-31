import { cn } from "@/lib/cn";

export type TimelineStep = {
  label: string;
  /** Mono meta line under the label (timestamp, actor) */
  meta?: string;
  /** Plain-text note, e.g. "current step — preparing your offer" */
  note?: string;
  state: "completed" | "current" | "future";
};

// Vertical status timeline per design/template.html (tracking + admin history):
// completed steps royal blue, current step glowing, future steps hairline
// outlines. Pure flex column layout — mirrors automatically in RTL.
export function Timeline({
  steps,
  surface = "dark",
  className,
}: {
  steps: TimelineStep[];
  surface?: "dark" | "light";
  className?: string;
}) {
  const dark = surface === "dark";
  return (
    <ol className={cn("flex list-none flex-col", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={index} className="flex items-start gap-4">
            <span className="flex flex-none flex-col items-center">
              <span
                className={cn(
                  "rounded-full",
                  dark ? "size-3" : "size-2.5",
                  step.state === "completed" && "bg-accent",
                  step.state === "current" && "glow-accent bg-accent",
                  step.state === "future" &&
                    (dark
                      ? "border border-fg-on-dark/28"
                      : "border border-border-light")
                )}
              />
              {!isLast ? (
                <span
                  className={cn(
                    "w-px",
                    dark ? "h-9" : "h-12",
                    step.state === "completed"
                      ? "bg-accent"
                      : dark
                        ? "bg-fg-on-dark/14"
                        : "bg-border-light"
                  )}
                />
              ) : null}
            </span>
            <span className="-mt-1 flex flex-col gap-1 pb-2">
              <span
                className={cn(
                  "text-[15px]",
                  step.state === "completed" &&
                    (dark ? "text-fg-on-dark" : "text-navy"),
                  step.state === "current" &&
                    (dark ? "font-medium text-lavender" : "font-medium text-navy"),
                  step.state === "future" &&
                    (dark ? "text-fg-on-dark/40" : "text-mono-label")
                )}
              >
                {step.label}
              </span>
              {step.meta ? (
                <span
                  className={cn(
                    "mono text-xs",
                    dark ? "text-fg-on-dark/40" : "text-mono-label"
                  )}
                >
                  {step.meta}
                </span>
              ) : null}
              {step.note ? (
                <span
                  className={cn(
                    "text-[13px]",
                    dark ? "text-fg-on-dark/45" : "text-fg-on-light-muted"
                  )}
                >
                  {step.note}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
