"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/phone";
import { trackSchema, type TrackInput } from "@/lib/schemas";
import type { TicketStatusValue } from "@/lib/status";

// SECURITY (per docs/PROJECT.md): a ticket is returned ONLY when BOTH the code and
// the phone match, and a wrong phone returns the exact same "notFound" as a
// nonexistent code — the response never reveals that a code exists. The
// result carries ONLY service name, reference code, and the status history:
// no customer name, no phone echo, no request details.

export type TrackTicketResult = {
  referenceCode: string;
  serviceNameEn: string;
  serviceNameAr: string;
  currentStatus: TicketStatusValue;
  /** oldest → newest; `at` preformatted "YYYY-MM-DD · HH:mm" for the mono meta */
  events: { status: TicketStatusValue; at: string }[];
};

export type TrackResult =
  | { status: "invalid"; fieldErrors: Partial<Record<keyof TrackInput, string>> }
  | { status: "rateLimited" }
  | { status: "notFound" }
  | { status: "found"; ticket: TrackTicketResult };

// Lookup is enumerable by design — make enumeration expensive: 10 attempts
// per IP per 10 minutes. In-memory is fine for the single-node Hostinger
// deployment; every attempt (hit or miss) counts.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 10;
const attemptsByIp = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (attemptsByIp.size > 1000) {
    for (const [key, entry] of attemptsByIp) {
      if (entry.resetAt <= now) attemptsByIp.delete(key);
    }
  }
  const entry = attemptsByIp.get(ip);
  if (!entry || entry.resetAt <= now) {
    attemptsByIp.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX_ATTEMPTS;
}

function formatEventTime(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())} · ${p(date.getHours())}:${p(date.getMinutes())}`;
}

export async function trackTicket(input: TrackInput): Promise<TrackResult> {
  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (isRateLimited(ip)) return { status: "rateLimited" };

  const parsed = trackSchema.safeParse(input);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    const fieldErrors: Partial<Record<keyof TrackInput, string>> = {};
    for (const [field, messages] of Object.entries(flat)) {
      if (messages?.[0]) fieldErrors[field as keyof TrackInput] = messages[0];
    }
    return { status: "invalid", fieldErrors };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { referenceCode: parsed.data.referenceCode },
    select: {
      referenceCode: true,
      phone: true,
      status: true,
      service: { select: { nameEn: true, nameAr: true } },
      statusEvents: {
        orderBy: { createdAt: "asc" },
        select: { status: true, createdAt: true },
      },
    },
  });

  if (!ticket || normalizePhone(ticket.phone) !== normalizePhone(parsed.data.phone)) {
    return { status: "notFound" };
  }

  return {
    status: "found",
    ticket: {
      referenceCode: ticket.referenceCode,
      serviceNameEn: ticket.service.nameEn,
      serviceNameAr: ticket.service.nameAr,
      currentStatus: ticket.status,
      events: ticket.statusEvents.map((event) => ({
        status: event.status,
        at: formatEventTime(event.createdAt),
      })),
    },
  };
}
