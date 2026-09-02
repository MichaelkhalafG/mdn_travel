"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FieldWrapper, fieldClasses } from "./Field";

export function Select({
  label,
  error,
  className,
  id,
  children,
  ...props
}: ComponentProps<"select"> & {
  label: string;
  error?: string;
}) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <FieldWrapper label={label} htmlFor={selectId} error={error}>
      <span className="relative flex">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={cn(fieldClasses(error, "light", "w-full appearance-none pe-10"), className)}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-mono-label"
        >
          ▾
        </span>
      </span>
    </FieldWrapper>
  );
}
