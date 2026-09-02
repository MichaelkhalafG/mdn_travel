"use client";

import { cn } from "@/lib/cn";

// Segmented radio row for light surfaces (design: contact-method picker —
// selected pill is lavender with an accent border). Real radio inputs
// underneath so keyboard and screen-reader semantics come for free.
export function RadioPills({
  label,
  name,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-[13px] text-fg-on-light-muted">{label}</legend>
      <div className="flex gap-2.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex-1 cursor-pointer rounded-brand border py-3.5 text-center text-[15px] transition-colors",
                "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-accent/40",
                selected
                  ? "border-accent bg-lavender font-medium text-navy-deep"
                  : "border-border-light text-fg-on-light-muted hover:border-mono-label"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error ? <p className="text-[13px] text-danger">{error}</p> : null}
    </fieldset>
  );
}
