import { cn } from "@/lib/cn";

// Lavender chip, navy-deep text — per design chips row.
// lg = the SUCCESS page reference-code chip (30px mono on desktop).
const chipSizeClasses = {
  md: "px-3.5 py-[7px] text-[13px]",
  lg: "px-6 py-[15px] text-2xl md:px-8 md:py-[18px] md:text-[30px]",
} as const;

export function Chip({
  size = "md",
  className,
  children,
}: {
  size?: keyof typeof chipSizeClasses;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-brand bg-lavender text-navy-deep",
        chipSizeClasses[size],
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
  size = "md",
  className,
}: {
  code: string;
  size?: keyof typeof chipSizeClasses;
  className?: string;
}) {
  return (
    <Chip
      size={size}
      className={cn(
        "mono",
        size === "lg" ? "font-semibold tracking-[0.14em]" : "tracking-[0.08em]",
        className
      )}
    >
      {code}
    </Chip>
  );
}
