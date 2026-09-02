import { cn } from "@/lib/cn";

export type FieldSurface = "light" | "dark";

// Shared label + error scaffolding for Input / Textarea / Select.
// Light surface per design "INPUTS · LIGHT SURFACE" (form cards, admin);
// dark surface per the TRACK panel (navy inputs on the dark section).
export function FieldWrapper({
  label,
  htmlFor,
  error,
  labelEnd,
  surface = "light",
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  /** Trailing element on the label row (e.g. the textarea character counter) */
  labelEnd?: React.ReactNode;
  surface?: FieldSurface;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center justify-between gap-4">
        <label
          htmlFor={htmlFor}
          className={cn(
            "text-[13px]",
            surface === "dark" ? "text-fg-on-dark/55" : "text-fg-on-light-muted"
          )}
        >
          {label}
        </label>
        {labelEnd}
      </span>
      {children}
      {error ? <p className="text-[13px] text-danger">{error}</p> : null}
    </div>
  );
}

export function fieldClasses(
  error?: string,
  surface: FieldSurface = "light",
  extra?: string
) {
  const dark = surface === "dark";
  return cn(
    "rounded-brand border px-3.5 py-[13px] text-[15px] outline-none",
    dark
      ? "bg-navy-deep/60 placeholder:text-fg-on-dark/35"
      : "bg-canvas-light placeholder:text-mono-label",
    error
      ? "border-danger text-danger"
      : dark
        ? "border-fg-on-dark/14 text-fg-on-dark focus:border-accent focus:ring-[3px] focus:ring-accent/25"
        : "border-border-light text-navy focus:border-accent focus:ring-[3px] focus:ring-accent/16",
    extra
  );
}
