"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FieldWrapper, fieldClasses, type FieldSurface } from "./Field";

export function Input({
  label,
  error,
  mono,
  surface = "light",
  className,
  id,
  ...props
}: ComponentProps<"input"> & {
  label: string;
  error?: string;
  /** Phone numbers / codes render in IBM Plex Mono with tabular figures */
  mono?: boolean;
  surface?: FieldSurface;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldWrapper label={label} htmlFor={inputId} error={error} surface={surface}>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClasses(error, surface), mono && "mono", className)}
        {...props}
      />
    </FieldWrapper>
  );
}
