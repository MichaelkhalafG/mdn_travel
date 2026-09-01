"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

// Ambient hero video layer. Renders nothing (so nothing downloads) until we
// know the user allows motion; prefers-reduced-motion users keep the static
// poster image underneath. preload="metadata" so the poster carries LCP; the
// video fades in only once it can actually play. Decorative — the poster
// image carries the alt.
export function HeroVideo({
  webmSrc,
  mp4Src,
  poster,
  className,
}: {
  webmSrc: string;
  mp4Src: string;
  poster: string;
  className?: string;
}) {
  const [motionOk, setMotionOk] = useState(false);
  const [ready, setReady] = useState(false);

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
      poster={poster}
      preload="metadata"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      onCanPlay={() => setReady(true)}
      className={cn(
        "absolute inset-0 size-full object-cover transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
    </video>
  );
}
