"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TICKET_STATUSES, type TicketStatusValue } from "@/lib/status";

// Every action re-checks the session server-side — middleware alone is never
// trusted. Error strings are i18n keys resolved by the client components.

type ActionResult = { ok: true } | { ok: false; error: string };

export async function changeTicketStatus(
  ticketId: string,
  status: TicketStatusValue
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "admin.errors.unauthorized" };
  if (!TICKET_STATUSES.includes(status)) {
    return { ok: false, error: "admin.errors.failed" };
  }
  try {
    // status change + its StatusEvent are one transaction (CLAUDE.md: every
    // change creates an event)
    await prisma.$transaction([
      prisma.ticket.update({ where: { id: ticketId }, data: { status } }),
      prisma.statusEvent.create({ data: { ticketId, status } }),
    ]);
  } catch {
    return { ok: false, error: "admin.errors.failed" };
  }
  revalidatePath("/[locale]/admin", "page");
  return { ok: true };
}

export async function saveAdminNotes(
  ticketId: string,
  notes: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "admin.errors.unauthorized" };
  if (notes.length > 5000) return { ok: false, error: "admin.errors.failed" };
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { adminNotes: notes.trim() || null },
    });
  } catch {
    return { ok: false, error: "admin.errors.failed" };
  }
  return { ok: true };
}
