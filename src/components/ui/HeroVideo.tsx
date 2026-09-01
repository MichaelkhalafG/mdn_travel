"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

// Ambient hero video layer. Renders nothing (so nothing downloads) until we
// know the user allows motion; prefers-reduced-motion users keep the static
// poster image underneath. Decorative — the poster image carries the alt.
export function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!motionOk) return null;
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      className={cn("absolute inset-0 size-full object-cover", className)}
    />
  );
}
