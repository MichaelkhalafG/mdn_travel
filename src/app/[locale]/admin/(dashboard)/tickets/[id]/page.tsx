import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/dates";
import { normalizePhone } from "@/lib/phone";
import { Link } from "@/i18n/routing";
import { StatusBadge, Timeline, type TimelineStep } from "@/components/ui";
import type { TicketStatusValue } from "@/lib/status";
import { StatusChanger } from "./StatusChanger";
import { NotesEditor } from "./NotesEditor";

export const dynamic = "force-dynamic";

// Canonical flow for the history timeline (same shape as the tracking page;
// NO_AGREEMENT replaces AGREED as a terminal branch).
const STATUS_PATH: TicketStatusValue[] = [
  "RECEIVED",
  "IN_PROGRESS",
  "PREPARING_OFFER",
  "CONTACTED",
  "AGREED",
  "PAID",
];

const cardClasses = "rounded-brand border border-border-light bg-canvas-light p-6";
const contactLinkClasses =
  "rounded-brand border border-border-light px-3.5 py-2 text-[13px] text-navy outline-none transition-colors hover:bg-canvas-subtle focus-visible:ring-[3px] focus-visible:ring-accent/40";

// 09 — ADMIN / TICKET DETAIL
export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) redirect(`/${locale}/admin/login`);

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      service: { select: { nameEn: true, nameAr: true } },
      statusEvents: {
        orderBy: { createdAt: "asc" },
        select: { status: true, createdAt: true },
      },
    },
  });
  if (!ticket) notFound();

  const t = await getTranslations("admin.detail");
  const tStatus = await getTranslations("status");
  const tContact = await getTranslations("contactMethod");
  const serviceName = locale === "ar" ? ticket.service.nameAr : ticket.service.nameEn;

  const fields = [
    { label: t("fieldName"), value: ticket.fullName, mono: false },
    { label: t("fieldPhone"), value: ticket.phone, mono: true },
    { label: t("fieldEmail"), value: ticket.email ?? "—", mono: !!ticket.email },
    { label: t("fieldContact"), value: tContact(ticket.contactMethod), mono: false },
    { label: t("fieldCreated"), value: formatDateTime(ticket.createdAt), mono: true },
    { label: t("fieldUpdated"), value: formatDateTime(ticket.updatedAt), mono: true },
  ];

  // history timeline — completed up to the current status, current
  // highlighted, futures hairline; terminal states end the timeline
  const eventTimes = new Map<TicketStatusValue, string>();
  for (const event of ticket.statusEvents) {
    eventTimes.set(event.status, formatDateTime(event.createdAt));
  }
  const current = ticket.status;
  const terminal = current === "NO_AGREEMENT" || current === "PAID";
  const currentIndex = current === "NO_AGREEMENT" ? 4 : STATUS_PATH.indexOf(current);
  const steps: TimelineStep[] = [];
  for (let i = 0; i < STATUS_PATH.length; i++) {
    const status =
      i === 4 && current === "NO_AGREEMENT" ? "NO_AGREEMENT" : STATUS_PATH[i];
    if (i < currentIndex) {
      steps.push({ label: tStatus(status), meta: eventTimes.get(status), state: "completed" });
    } else if (i === currentIndex) {
      steps.push({
        label: tStatus(status),
        meta: eventTimes.get(status),
        state: "current",
        tone: current === "NO_AGREEMENT" ? "danger" : undefined,
      });
      if (terminal) break;
    } else {
      steps.push({ label: tStatus(status), state: "future" });
    }
  }

  // quick contact — wa.me needs the international form of the phone
  const waPhone = `20${normalizePhone(ticket.phone)}`;

  return (
    <div className="flex flex-col gap-5">
      <nav className="flex items-center gap-2.5 text-[13px] text-fg-on-light-muted">
        <Link
          href="/admin"
          className="rounded-brand outline-none hover:text-navy focus-visible:ring-[3px] focus-visible:ring-accent/40"
        >
          {t("breadcrumb")}
        </Link>
        <span aria-hidden>/</span>
        <span dir="ltr" className="mono text-navy">
          {ticket.referenceCode}
        </span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          {/* request info */}
          <div className={cardClasses}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span dir="ltr" className="mono text-[20px] tracking-[0.1em] text-navy">
                  {ticket.referenceCode}
                </span>
                <span className="text-sm text-fg-on-light-muted">{serviceName}</span>
              </div>
              <StatusBadge status={ticket.status} surface="light" />
            </div>
            <div aria-hidden className="my-5 h-px bg-border-light-subtle" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field) => (
                <div key={field.label} className="flex flex-col gap-1.5">
                  <span className="text-xs text-fg-on-light-muted">{field.label}</span>
                  {field.mono ? (
                    <span dir="ltr" className="mono self-start text-[14px] text-navy">
                      {field.value}
                    </span>
                  ) : (
                    <span className="text-[15px] text-navy">{field.value}</span>
                  )}
                </div>
              ))}
            </div>
            <div aria-hidden className="my-5 h-px bg-border-light-subtle" />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-fg-on-light-muted">{t("detailsLabel")}</span>
              <p className="text-[15px] leading-[2.1] whitespace-pre-line text-navy">
                {ticket.details}
              </p>
            </div>
          </div>

          {/* internal notes */}
          <div className={cardClasses}>
            <NotesEditor ticketId={ticket.id} initialNotes={ticket.adminNotes ?? ""} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* status history + changer */}
          <div className={cardClasses}>
            <h2 className="mb-4 text-[16px] font-medium text-navy">{t("historyTitle")}</h2>
            <Timeline steps={steps} surface="light" />
            <div aria-hidden className="my-4 h-px bg-border-light-subtle" />
            <StatusChanger ticketId={ticket.id} currentStatus={ticket.status} />
          </div>

          {/* quick contact — the admin reaches the client off-site */}
          <div className={cardClasses}>
            <h2 className="mb-3.5 text-[16px] font-medium text-navy">
              {t("quickContact")}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noreferrer"
                className={contactLinkClasses}
              >
                {t("whatsapp")}
              </a>
              <a href={`tel:${ticket.phone.replace(/[^\d+]/g, "")}`} className={contactLinkClasses}>
                {t("call")}
              </a>
              {ticket.email ? (
                <a href={`mailto:${ticket.email}`} className={contactLinkClasses}>
                  {t("sendEmail")}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
