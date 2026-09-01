import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { MediaImage } from "./MediaImage";
import { MonoLabel } from "./MonoLabel";

// Landing services grid card per design: hairline border, faint white wash,
// media block with navy fallback, name + mono index row.
export function ServiceCard({
  slug,
  name,
  image,
  order,
  className,
}: {
  slug: string;
  name: string;
  image: string;
  order: number;
  className?: string;
}) {
  return (
    <Link
      href={`/services/${slug}`}
      className={cn(
        "group block overflow-hidden rounded-brand border border-fg-on-dark/7 bg-fg-on-dark/2 outline-none transition-colors",
        "hover:border-fg-on-dark/15 hover:bg-fg-on-dark/5 focus-visible:ring-[3px] focus-visible:ring-accent/40",
        className
      )}
    >
      <MediaImage src={image} alt={name} className="h-[150px] md:h-[190px]" />
      <span className="flex items-center justify-between gap-3 p-4.5 md:p-6">
        <span className="text-[17px] font-medium text-fg-on-dark md:text-[19px]">
          {name}
        </span>
        <MonoLabel tone="accent" className="tracking-normal">
          {String(order).padStart(2, "0")}
        </MonoLabel>
      </span>
    </Link>
  );
}
