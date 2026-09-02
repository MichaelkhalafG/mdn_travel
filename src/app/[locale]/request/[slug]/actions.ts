"use server";

import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { generateReferenceCode } from "@/lib/reference-code";
import { ticketRequestSchema, type TicketRequestInput } from "@/lib/schemas";

// Field errors carry i18n KEYS (e.g. "errors.required") — the form resolves
// them with next-intl so client and server stay localized the same way.
export type RequestFormState = {
  fieldErrors?: Partial<Record<keyof TicketRequestInput, string>>;
  formError?: string;
};

export async function submitTicketRequest(
  serviceSlug: string,
  input: TicketRequestInput
): Promise<RequestFormState | undefined> {
  const parsed = ticketRequestSchema.safeParse(input);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    const fieldErrors: RequestFormState["fieldErrors"] = {};
    for (const [field, messages] of Object.entries(flat)) {
      if (messages?.[0]) {
        fieldErrors[field as keyof TicketRequestInput] = messages[0];
      }
    }
    return { fieldErrors };
  }

  const service = await prisma.service.findUnique({
    where: { slug: serviceSlug },
    select: { id: true },
  });
  if (!service) return { formError: "request.submitError" };

  // Ticket + initial RECEIVED event are one atomic create (nested write =
  // single transaction); on a reference-code collision we retry with a new
  // code rather than aborting.
  let referenceCode: string | null = null;
  for (let attempt = 0; attempt < 5 && !referenceCode; attempt++) {
    const candidate = generateReferenceCode();
    try {
      await prisma.ticket.create({
        data: {
          referenceCode: candidate,
          serviceId: service.id,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          email: parsed.data.email,
          contactMethod: parsed.data.contactMethod,
          details: parsed.data.details,
          statusEvents: { create: { status: "RECEIVED" } },
        },
      });
      referenceCode = candidate;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }
      throw error;
    }
  }
  if (!referenceCode) return { formError: "request.submitError" };

  const locale = await getLocale();
  redirect({ href: `/request/success/${referenceCode}`, locale });
}
