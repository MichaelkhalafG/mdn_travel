"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

// next/image with the navy hatch fallback painted underneath, so a missing
// asset never flashes broken — the brand gradient shows instead.
export function MediaImage({
  src,
  alt,
  className,
  fallback = "hatch",
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** "none" when the parent already paints its own navy base (hero) */
  fallback?: "hatch" | "none";
  /** next/image sizes attribute — set from the layout so cards don't ship full-res */
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={cn(
        "relative block overflow-hidden",
        fallback === "hatch" && "media-fallback",
        className
      )}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : null}
    </span>
  );
}
