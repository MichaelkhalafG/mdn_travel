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
  referenceCode: z
    .string({ error: "errors.required" })
    .trim()
    .toUpperCase()
    .regex(/^MDN-[A-Z0-9]{5}$/, "track.notFound"),
  phone: z
    .string({ error: "errors.required" })
    .trim()
    .min(6, "errors.invalidPhone"),
});

export const adminLoginSchema = z.object({
  email: z.email("errors.invalidEmail"),
  password: z.string({ error: "errors.required" }).min(1, "errors.required"),
});
