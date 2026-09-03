// Mono timestamp formats (Latin digits in both locales, rendered dir=ltr).
const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-08-28 · 14:20" — timelines and detail meta */
export function formatDateTime(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** "08-28" — compact table column */
export function formatShortDate(date: Date): string {
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
