import { Space_Grotesk, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";

// Latin/UI + English — headings tracking -0.03em (see globals.css)
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Arabic. Subset to "arabic" only so Latin chars inside Arabic text
// fall through the stack to Space Grotesk.
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

// Numbers, reference codes, prices — used via the `.mono` class in BOTH locales
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
