// Status flow: RECEIVED → IN_PROGRESS → PREPARING_OFFER → CONTACTED →
// (AGREED | NO_AGREEMENT) → PAID. Mirrors the Prisma TicketStatus enum
// without pulling @prisma/client into client bundles.
export const TICKET_STATUSES = [
  "RECEIVED",
  "IN_PROGRESS",
  "PREPARING_OFFER",
  "CONTACTED",
  "AGREED",
  "NO_AGREEMENT",
  "PAID",
] as const;

export type TicketStatusValue = (typeof TICKET_STATUSES)[number];
