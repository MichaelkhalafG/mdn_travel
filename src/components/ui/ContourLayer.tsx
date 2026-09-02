import { cn } from "@/lib/cn";

// SURFACE-TIER texture (brand system): six concentric irregular contour
// lines — a nautical-chart fragment flowing from the inline-end top corner,
// 1px white @15%, fading toward the content side via a CSS mask (which flips
// along with the RTL scaleX mirror). Default on DarkPanel, dark Cards, the
// mobile drawer, and any repeated dark surface.
function contourPath(cx: number, cy: number, r: number, seed: number): string {
  const n = 10;
  const wobble = 0.11;
  const pts = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI;
    const rad =
      r *
      (1 +
        wobble * Math.sin(seed * 3.7 + i * 1.9) +
        0.05 * Math.cos(seed + i * 3.3));
    return [cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)];
  });
  let d = "";
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    if (i === 0) d += `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} `;
    d += `C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} `;
  }
  return d + "Z";
}

const CONTOUR_PATHS = [90, 165, 245, 330, 420, 515].map((r, i) =>
  contourPath(640, -30, r, i + 1)
);

export function ContourLayer({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn(
        "contour-fade pointer-events-none absolute inset-0 size-full rtl:-scale-x-100",
        className
      )}
      viewBox="0 0 600 460"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        {CONTOUR_PATHS.map((d) => (
          <path key={d.slice(0, 24)} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
