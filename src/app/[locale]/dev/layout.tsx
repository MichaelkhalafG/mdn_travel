import { notFound } from "next/navigation";

// /[locale]/dev/* are internal reference surfaces (component library, texture
// lab, OG-image generator) — useful in development, but they must NOT be
// reachable on the public production site. Gate the whole segment.
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
