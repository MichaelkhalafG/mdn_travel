"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FieldWrapper, fieldClasses } from "./Field";

export function Textarea({
  label,
  error,
  className,
  id,
  rows = 4,
  ...props
}: ComponentProps<"textarea"> & {
  label: string;
  error?: string;
}) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  return (
    <FieldWrapper label={label} htmlFor={textareaId} error={error}>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClasses(error), "resize-y", className)}
        {...props}
      />
    </FieldWrapper>
  );
}
