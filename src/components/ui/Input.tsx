"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FieldWrapper, fieldClasses } from "./Field";

export function Input({
  label,
  error,
  mono,
  className,
  id,
  ...props
}: ComponentProps<"input"> & {
  label: string;
  error?: string;
  /** Phone numbers / codes render in IBM Plex Mono with tabular figures */
  mono?: boolean;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldWrapper label={label} htmlFor={inputId} error={error}>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClasses(error), mono && "mono", className)}
        {...props}
      />
    </FieldWrapper>
  );
}
