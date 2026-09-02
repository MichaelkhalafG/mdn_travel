"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FieldWrapper, fieldClasses } from "./Field";

export function Textarea({
  label,
  error,
  counter,
  className,
  id,
  rows = 4,
  ...props
}: ComponentProps<"textarea"> & {
  label: string;
  error?: string;
  /** Live character counter on the label row (design: "0 / 800" mono) */
  counter?: { value: number; max: number };
}) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  return (
    <FieldWrapper
      label={label}
      htmlFor={textareaId}
      error={error}
      labelEnd={
        counter ? (
          // dir=ltr: bidi isolation so "0 / 2000" doesn't reorder in RTL
          <span aria-hidden dir="ltr" className="mono text-xs text-mono-label">
            {counter.value} / {counter.max}
          </span>
        ) : undefined
      }
    >
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClasses(error, "light", "resize-y"), className)}
        {...props}
      />
    </FieldWrapper>
  );
}
