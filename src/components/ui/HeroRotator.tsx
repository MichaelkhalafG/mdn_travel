"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const SLIDE_MS = 7000;

type Still = { src: string; alt: string };

// Rotating cinematic hero per design (02 — LANDING, "01 / 04" pager).
// Slide 1 is the ambient video (desktop, motion allowed, no Save-Data) or the
// poster still; slides 2-4 are service stills with a slow Ken Burns. Pure
// ambience — no click interaction. Under prefers-reduced-motion: static first
// slide only. Slides 2-4 mount after hydration so they never compete with LCP.
export function HeroRotator({
  video,
  poster,
  posterAlt,
  stills,
  className,
}: {
  video: { webm: string; mp4: string };
  poster: string;
  posterAlt: string;
  stills: Still[];
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0); // bumps on every slide change → restarts kenburns/progress
  const [hidden, setHidden] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const slideCount = 1 + stills.length;
  const rotating = mounted && !reduced;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = mq.matches;
    setReduced(isReduced);
    // gate the video: desktop viewports only, no Save-Data, motion allowed
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    setShowVideo(
      !isReduced &&
        window.matchMedia("(min-width: 768px)").matches &&
        !nav.connection?.saveData
    );
    setMounted(true);
  }, []);

  // auto-advance, paused while the tab is hidden
  useEffect(() => {
    if (!rotating) return;
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [rotating]);

  useEffect(() => {
    if (!rotating || hidden) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
      setTick((n) => n + 1);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [rotating, hidden, slideCount]);

  // keep the video playing only while its slide shows
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (index === 0 && !hidden) el.play().catch(() => {});
    else el.pause();
  }, [index, hidden, showVideo]);

  const fade = (active: boolean) =>
    cn(
      "absolute inset-0 transition-opacity duration-[1200ms] ease-linear",
      active ? "opacity-100" : "opacity-0"
    );

  return (
    <div className={cn("overflow-hidden", className)}>
      {/* Slide 1 — poster always painted (owns LCP); video fades in over it */}
      <div className={fade(index === 0)}>
        <Image
          src={poster}
          alt={posterAlt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        {showVideo ? (
          <video
            ref={videoRef}
            poster={poster}
            preload="metadata"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            onCanPlay={() => setVideoReady(true)}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-700",
              videoReady ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </video>
        ) : null}
      </div>

      {/* Slides 2-4 — mounted after first paint, slow Ken Burns while active */}
      {rotating
        ? stills.map((still, i) => {
            const active = index === i + 1;
            return (
              <div key={still.src} className={fade(active)}>
                <div
                  key={active ? `kb-${tick}` : "idle"}
                  className={cn("absolute inset-0", active && "kenburns")}
                >
                  <Image
                    src={still.src}
                    alt={still.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })
        : null}

      {/* Pager — mono counter + hairline progress track, inline-start bottom */}
      {rotating ? (
        <div
          aria-hidden
          className="absolute bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] start-5 z-10 flex items-center gap-6 md:bottom-10 md:start-14"
        >
          {/* dir=ltr: bidi isolation so "01 / 04" doesn't reorder in RTL */}
          <span dir="ltr" className="mono text-xs text-fg-on-dark/45">
            {`0${index + 1} / 0${slideCount}`}
          </span>
          <span className="relative block h-px w-[120px] overflow-hidden bg-fg-on-dark/16">
            <span
              key={`p-${tick}`}
              className={cn(
                "progress-fill absolute inset-y-0 start-0 bg-lavender",
                hidden && "[animation-play-state:paused]"
              )}
            />
          </span>
        </div>
      ) : null}
    </div>
  );
}
