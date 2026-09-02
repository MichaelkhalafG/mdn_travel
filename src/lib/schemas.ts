import { z } from "zod";

// Shared client + server. Error messages are i18n KEYS (resolved with
// next-intl in the form / server action so both sides stay localized).
export const contactMethods = ["WHATSAPP", "PHONE", "EMAIL"] as const;

export const ticketRequestSchema = z.object({
  fullName: z
    .string({ error: "errors.required" })
    .trim()
    .min(2, "errors.tooShort")
    .max(100, "errors.tooLong"),
  phone: z
    .string({ error: "errors.required" })
    .trim()
    .min(6, "errors.invalidPhone")
    .max(20, "errors.invalidPhone")
    .regex(/^\+?[0-9 ()-]+$/, "errors.invalidPhone"),
  email: z
    .union([z.email("errors.invalidEmail"), z.literal("")])
    .optional()
    .transform((v) => (v ? v : null)),
  contactMethod: z.enum(contactMethods, { error: "errors.required" }),
  details: z
    .string({ error: "errors.required" })
    .trim()
    .min(10, "errors.tooShort")
    .max(2000, "errors.tooLong"),
});

export type TicketRequestInput = z.input<typeof ticketRequestSchema>;
export type TicketRequest = z.output<typeof ticketRequestSchema>;

export const trackSchema = z.object({
  // Accepts the code with or without the MDN- prefix and normalizes
  // ("8f3k2", "mdn8F3K2", "MDN-8F3K2" → "MDN-8F3K2").
  referenceCode: z
    .string({ error: "errors.required" })
    .trim()
    .transform((value) => {
      let code = value.toUpperCase().replace(/\s+/g, "");
      if (!code.startsWith("MDN-")) {
        code = code.startsWith("MDN") ? `MDN-${code.slice(3)}` : `MDN-${code}`;
      }
      return code;
    })
    .pipe(z.string().regex(/^MDN-[A-Z0-9]{5}$/, "track.invalidCode")),
  phone: z
    .string({ error: "errors.required" })
    .trim()
    .min(6, "errors.invalidPhone")
    .max(20, "errors.invalidPhone"),
});

export type TrackInput = z.input<typeof trackSchema>;

export const adminLoginSchema = z.object({
  email: z.email("errors.invalidEmail"),
  password: z.string({ error: "errors.required" }).min(1, "errors.required"),
});
