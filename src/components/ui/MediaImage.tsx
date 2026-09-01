"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

// Image with the navy hatch fallback painted underneath, so a missing asset
// never flashes broken — the brand gradient shows instead.
export function MediaImage({
  src,
  alt,
  className,
  fallback = "hatch",
}: {
  src: string;
  alt: string;
  className?: string;
  /** "none" when the parent already paints its own navy base (hero) */
  fallback?: "hatch" | "none";
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
        // Plain <img>: placeholder assets may not exist yet; onError degrades
        // to the navy fallback instead of a broken-image glyph. The ref check
        // catches images that already failed before hydration attached onError.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          ref={(el) => {
            if (el?.complete && el.naturalWidth === 0) setFailed(true);
          }}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </span>
  );
}
