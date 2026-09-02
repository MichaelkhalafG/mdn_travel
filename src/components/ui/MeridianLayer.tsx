import { cn } from "@/lib/cn";

// HERO-TIER texture (brand system): three great-circle arcs — 1px gradient
// hairlines, radii larger than the panel so only elegant segments show — the
// brightest carrying a small pulsing royal "destination" dot near its apex.
// ONE dramatic instance per view: landing hero, service heroes, the footer
// panel, og.jpg. Mirrors in RTL via scaleX(-1); the dot pulse collapses under
// prefers-reduced-motion via the global override.
//
// The defs use fixed ids: when two instances share a document (hero + footer)
// the references resolve to the first instance's identical defs.
export function MeridianLayer({
  align = "center",
  variant = "full",
  className,
}: {
  /** "top" keeps the arc apex + dot in view on short, wide panels (footer) */
  align?: "center" | "top";
  /** "route": ONE mid-height arc, no destination dot, accent-toned for light
      surfaces — the landing how-it-works journey line. */
  variant?: "full" | "route";
  className?: string;
}) {
  if (variant === "route") {
    return (
      <svg
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 size-full rtl:-scale-x-100",
          className
        )}
        viewBox="0 0 600 460"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="mdn-arc-route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#010ed0" stopOpacity="0" />
            <stop offset="0.5" stopColor="#010ed0" stopOpacity="0.3" />
            <stop offset="1" stopColor="#010ed0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="300"
          cy="1600"
          r="1370"
          fill="none"
          stroke="url(#mdn-arc-route)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 size-full rtl:-scale-x-100",
        className
      )}
      viewBox="0 0 600 460"
      preserveAspectRatio={align === "top" ? "xMidYMin slice" : "xMidYMid slice"}
    >
      <defs>
        <linearGradient id="mdn-arc-bright" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b7bff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#6b7bff" stopOpacity="0.85" />
          <stop offset="0.75" stopColor="#010ed0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#010ed0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mdn-arc-faint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b7bff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#6b7bff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#6b7bff" stopOpacity="0" />
        </linearGradient>
        <filter id="mdn-dot-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* bright arc, apex kept high (y=110) so the destination dot clears
          text even on 360px crops */}
      <circle
        cx="250"
        cy="1480"
        r="1370"
        fill="none"
        stroke="url(#mdn-arc-bright)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="700"
        cy="1700"
        r="1500"
        fill="none"
        stroke="url(#mdn-arc-faint)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="-250"
        cy="780"
        r="700"
        fill="none"
        stroke="url(#mdn-arc-faint)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="250" cy="110" r="11" fill="rgba(1,14,208,0.65)" filter="url(#mdn-dot-glow)" />
      <circle className="pulse-dot" cx="250" cy="110" r="3.2" fill="#6b7bff" />
    </svg>
  );
}
