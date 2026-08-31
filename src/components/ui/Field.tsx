import { cn } from "@/lib/cn";

// Shared label + error scaffolding for Input / Textarea / Select.
// Light-surface styling per design/template.html "INPUTS · LIGHT SURFACE".
export function FieldWrapper({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[13px] text-fg-on-light-muted">
        {label}
      </label>
      {children}
      {error ? <p className="text-[13px] text-danger">{error}</p> : null}
    </div>
  );
}

export function fieldClasses(error?: string, extra?: string) {
  return cn(
    "rounded-brand border bg-canvas-light px-3.5 py-[13px] text-[15px] outline-none",
    "placeholder:text-mono-label",
    error
      ? "border-danger text-danger"
      : "border-border-light text-navy focus:border-accent focus:ring-[3px] focus:ring-accent/16",
    extra
  );
}
