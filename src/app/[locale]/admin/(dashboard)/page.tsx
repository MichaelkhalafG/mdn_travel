import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatShortDate } from "@/lib/dates";
import { Link } from "@/i18n/routing";
import { StatusBadge } from "@/components/ui";
import { TICKET_STATUSES, type TicketStatusValue } from "@/lib/status";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const IN_FLIGHT: TicketStatusValue[] = ["IN_PROGRESS", "PREPARING_OFFER", "CONTACTED"];

// 08 — ADMIN / TICKETS: stats cards + filterable, searchable, paginated
// table. Filters live in the URL (shareable views; no PII beyond the search
// term the admin typed).
export default async function AdminOverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; status?: string; q?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // server-side session check (middleware is only the first layer)
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/admin/login`);

  const sp = await searchParams;
  const service = sp.service ?? "";
  const status = TICKET_STATUSES.includes(sp.status as TicketStatusValue)
    ? (sp.status as TicketStatusValue)
    : "";
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const t = await getTranslations("admin.dashboard");
  const tStatus = await getTranslations("status");
  const tContact = await getTranslations("contactMethod");

  const where: Prisma.TicketWhereInput = {
    ...(service ? { service: { slug: service } } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q } },
            { phone: { contains: q } },
            { referenceCode: { contains: q.toUpperCase() } },
          ],
        }
      : {}),
  };

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [tickets, total, services, statNew, statInFlight, statAgreements] =
    await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          referenceCode: true,
          fullName: true,
          contactMethod: true,
          status: true,
          createdAt: true,
          service: { select: { nameEn: true, nameAr: true } },
        },
      }),
      prisma.ticket.count({ where }),
      prisma.service.findMany({
        orderBy: { order: "asc" },
        select: { slug: true, nameEn: true, nameAr: true },
      }),
      prisma.ticket.count({ where: { status: "RECEIVED" } }),
      prisma.ticket.count({ where: { status: { in: IN_FLIGHT } } }),
      prisma.ticket.count({
        where: { status: { in: ["AGREED", "PAID"] }, updatedAt: { gte: monthStart } },
      }),
    ]);

  const stats = [
    { label: t("statNew"), value: statNew, accent: false },
    { label: t("statInFlight"), value: statInFlight, accent: false },
    { label: t("statAgreements"), value: statAgreements, accent: true },
  ];

  const serviceName = (s: { nameEn: string; nameAr: string }) =>
    locale === "ar" ? s.nameAr : s.nameEn;

  const pageHref = (target: number) => {
    const query = new URLSearchParams();
    if (service) query.set("service", service);
    if (status) query.set("status", status);
    if (q) query.set("q", q);
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return `/admin${qs ? `?${qs}` : ""}`;
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const hasPrev = page > 1;
  const hasNext = to < total;

  const inputClasses =
    "rounded-brand border border-border-light bg-canvas-light px-3 py-2 text-[13px] text-navy outline-none placeholder:text-mono-label focus:border-accent focus:ring-[3px] focus:ring-accent/16";
  const gridCols =
    "grid min-w-[860px] grid-cols-[110px_150px_1fr_110px_150px_70px] items-center gap-3.5 px-4";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[22px] font-medium text-navy">{t("title")}</h1>

      {/* stats cards — mono numbers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-brand border border-border-light bg-canvas-light p-5"
          >
            <span className="text-[13px] text-fg-on-light-muted">{stat.label}</span>
            <span
              dir="ltr"
              className={cn(
                "mono self-start text-[32px]",
                stat.accent ? "text-accent" : "text-navy"
              )}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-brand border border-border-light bg-canvas-light">
        {/* filter bar — plain GET form so views are bookmarkable */}
        <form
          method="get"
          className="flex flex-wrap items-center gap-2.5 border-b border-border-light bg-canvas-subtle p-3.5"
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t("searchPlaceholder")}
            className={cn(inputClasses, "min-w-[200px] flex-1")}
          />
          <select name="service" defaultValue={service} className={inputClasses}>
            <option value="">{t("allServices")}</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {serviceName(s)}
              </option>
            ))}
          </select>
          <select name="status" defaultValue={status} className={inputClasses}>
            <option value="">{t("allStatuses")}</option>
            {TICKET_STATUSES.map((value) => (
              <option key={value} value={value}>
                {tStatus(value)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-brand bg-navy px-4 py-2 text-[13px] font-medium text-fg-on-dark outline-none focus-visible:ring-[3px] focus-visible:ring-accent/40"
          >
            {t("apply")}
          </button>
        </form>

        {/* table — contained horizontal scroll on narrow screens */}
        <div className="overflow-x-auto">
          <div
            className={cn(
              gridCols,
              "border-b border-border-light bg-canvas-subtle py-2.5 text-xs text-fg-on-light-muted"
            )}
          >
            <span>{t("colCode")}</span>
            <span>{t("colClient")}</span>
            <span>{t("colService")}</span>
            <span>{t("colContact")}</span>
            <span>{t("colStatus")}</span>
            <span>{t("colDate")}</span>
          </div>

          {tickets.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 px-4 py-14 text-center">
              <span className="text-[15px] text-navy">{t("empty")}</span>
              <span className="text-[13px] text-fg-on-light-muted">{t("emptyHint")}</span>
            </div>
          ) : (
            tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className={cn(
                  gridCols,
                  "border-b border-border-light-subtle py-3 outline-none transition-colors last:border-b-0 hover:bg-canvas-subtle focus-visible:bg-canvas-subtle"
                )}
              >
                <span dir="ltr" className="mono self-center justify-self-start text-[13px] text-accent">
                  {ticket.referenceCode}
                </span>
                <span className="truncate text-sm text-navy">{ticket.fullName}</span>
                <span className="truncate text-sm text-navy">
                  {serviceName(ticket.service)}
                </span>
                <span className="text-[13px] text-fg-on-light-muted">
                  {tContact(ticket.contactMethod)}
                </span>
                <span className="justify-self-start">
                  <StatusBadge status={ticket.status} surface="light" />
                </span>
                <span dir="ltr" className="mono text-xs text-fg-on-light-muted">
                  {formatShortDate(ticket.createdAt)}
                </span>
              </Link>
            ))
          )}
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between border-t border-border-light bg-canvas-subtle px-4 py-2.5">
          <span dir="ltr" className="mono text-xs text-fg-on-light-muted">
            {t("range", { from, to, total })}
          </span>
          <div className="flex gap-2">
            <PaginationLink href={pageHref(page - 1)} disabled={!hasPrev}>
              {t("prev")}
            </PaginationLink>
            <PaginationLink href={pageHref(page + 1)} disabled={!hasNext}>
              {t("next")}
            </PaginationLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const classes =
    "rounded-brand border border-border-light bg-canvas-light px-3 py-1.5 text-xs";
  if (disabled) {
    return <span className={cn(classes, "text-mono-label")}>{children}</span>;
  }
  return (
    <Link
      href={href}
      className={cn(
        classes,
        "text-navy outline-none transition-colors hover:bg-canvas-subtle focus-visible:ring-[3px] focus-visible:ring-accent/40"
      )}
    >
      {children}
    </Link>
  );
}
