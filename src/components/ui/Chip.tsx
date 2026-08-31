import { cn } from "@/lib/cn";

// Lavender chip, navy-deep text — per design chips row.
export function Chip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-brand bg-lavender px-3.5 py-[7px] text-[13px] text-navy-deep",
        className
      )}
    >
      {children}
    </span>
  );
}

// Reference codes always render mono with wide tracking (MDN-XXXXX).
export function ReferenceCode({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <Chip className={cn("mono tracking-[0.08em]", className)}>{code}</Chip>
  );
}
