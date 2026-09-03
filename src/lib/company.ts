// Real company contact values (source: design/company-facts.md, from
// https://mdn.international/contact/). Env wins at runtime; the fallbacks are
// the REAL published values, not placeholders. NEXT_PUBLIC_ so client
// components (e.g. the tracking help mailto) get them too.
export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+966 12 512 4965",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@mdn.international",
} as const;
