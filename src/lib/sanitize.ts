import DOMPurify from "isomorphic-dompurify";

// Shared text sanitization, applied inside the Zod schemas so it runs on BOTH
// client and server for every text field. Strips:
// - C0/C1 control characters (except \n and \t in multiline fields)
// - zero-width + bidi-control characters (U+200B-200F, U+202A-202E,
//   U+2066-2069, U+FEFF) - bidi controls can visually spoof content in our
//   mixed AR/EN context (e.g. reversing how a name or amount reads)
// then NFC-normalizes, collapses 3+ newlines, and trims.

const STRIP_SINGLE_LINE = new RegExp(
  "[\\u0000-\\u001F\\u007F-\\u009F\\u200B-\\u200F\\u202A-\\u202E\\u2066-\\u2069\\uFEFF]",
  "g"
);
// multiline keeps \n (u000A) and \t (u0009); \r is normalized to \n first
const STRIP_MULTILINE = new RegExp(
  "[\\u0000-\\u0008\\u000B-\\u001F\\u007F-\\u009F\\u200B-\\u200F\\u202A-\\u202E\\u2066-\\u2069\\uFEFF]",
  "g"
);

/** Single-line fields: names, emails, codes, search terms. */
export function sanitizeText(value: string): string {
  return value.normalize("NFC").replace(STRIP_SINGLE_LINE, "").trim();
}

/** Multiline fields: request details, admin notes. */
export function sanitizeMultiline(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(STRIP_MULTILINE, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Defense-in-depth for the ONE surface where long free text from the public
// is shown to a privileged user (the admin ticket detail). React already
// escapes everything it renders as text — this exists purely as
// belt-and-suspenders against some future refactor accidentally introducing
// raw-HTML rendering. It strips ALL tags and keeps text only. Do NOT extend
// this into an "allowed HTML" feature; user content is plain text, always.
export function sanitizeForDisplay(value: string): string {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
