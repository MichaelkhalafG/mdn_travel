import { z } from "zod";
import { sanitizeMultiline, sanitizeText } from "./sanitize";

// Shared client + server. Error messages are i18n KEYS (resolved with
// next-intl in the form / server action so both sides stay localized).
// Every text field passes through the sanitize layer (control/bidi-char
// stripping, NFC, trim) BEFORE validation; limits REJECT, never truncate.
export const contactMethods = ["WHATSAPP", "PHONE", "EMAIL"] as const;

// Formatting chars allowed in a phone as typed; after stripping them the
// result must be + and 8-15 digits — letters or other symbols reject.
const PHONE_SHAPE = /^[+\d\s()-]+$/;
const PHONE_NORMALIZED = /^\+?\d{8,15}$/;

const phoneField = z
  .string({ error: "errors.required" })
  .transform(sanitizeText)
  .pipe(
    z
      .string()
      .max(20, "errors.invalidPhone")
      .regex(PHONE_SHAPE, "errors.invalidPhone")
      .refine(
        (value) => PHONE_NORMALIZED.test(value.replace(/[\s()-]/g, "")),
        "errors.invalidPhone"
      )
  );

export const ticketRequestSchema = z.object({
  fullName: z
    .string({ error: "errors.required" })
    .transform(sanitizeText)
    .pipe(z.string().min(2, "errors.tooShort").max(120, "errors.tooLong")),
  phone: phoneField,
  email: z
    .string()
    .transform(sanitizeText)
    .pipe(
      z.union([
        z.email("errors.invalidEmail").max(254, "errors.tooLong"),
        z.literal(""),
      ])
    )
    .optional()
    .transform((v) => (v ? v : null)),
  contactMethod: z.enum(contactMethods, { error: "errors.required" }),
  details: z
    .string({ error: "errors.required" })
    .transform(sanitizeMultiline)
    .pipe(z.string().min(10, "errors.tooShort").max(2000, "errors.tooLong")),
});

export type TicketRequestInput = z.input<typeof ticketRequestSchema>;
export type TicketRequest = z.output<typeof ticketRequestSchema>;

export const trackSchema = z.object({
  // Accepts the code with or without the MDN- prefix and normalizes
  // ("8f3k2", "mdn8F3K2", "MDN-8F3K2" → "MDN-8F3K2"). Strict charset check
  // (code alphabet, no I/O/0/1) runs BEFORE any DB lookup.
  referenceCode: z
    .string({ error: "errors.required" })
    .transform((value) => {
      let code = sanitizeText(value).toUpperCase().replace(/\s+/g, "");
      if (!code.startsWith("MDN-")) {
        code = code.startsWith("MDN") ? `MDN-${code.slice(3)}` : `MDN-${code}`;
      }
      return code;
    })
    .pipe(z.string().regex(/^MDN-[A-HJ-NP-Z2-9]{5}$/, "track.invalidCode")),
  phone: phoneField,
});

export type TrackInput = z.input<typeof trackSchema>;

export const adminNotesSchema = z
  .string()
  .transform(sanitizeMultiline)
  .pipe(z.string().max(4000, "errors.tooLong"));

export const adminLoginSchema = z.object({
  email: z
    .string({ error: "errors.required" })
    .transform(sanitizeText)
    .pipe(z.email("errors.invalidEmail").max(254, "errors.tooLong")),
  password: z
    .string({ error: "errors.required" })
    .min(1, "errors.required")
    .max(200, "errors.tooLong"),
});
