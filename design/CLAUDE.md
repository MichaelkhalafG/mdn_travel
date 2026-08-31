# MDN Travel

Luxury concierge & booking-request platform by MDN (sister product of MDN STACKMART).
Users pick a service → open a request (ticket) → admin handles everything offline and updates the ticket status. No online payments, no user accounts.

## Stack

- Next.js 15 (App Router) + TypeScript — one project for public site AND admin dashboard
- Tailwind CSS v4 (theme via CSS variables in globals.css, same approach as STACKMART — no tailwind.config)
- Prisma + PostgreSQL
- Auth.js (NextAuth) credentials — ADMIN ONLY. No public user auth, ever.
- next-intl for i18n
- Server Actions for all mutations (no separate API routes unless necessary)
- Zod for validation (shared between client + server)

## i18n — READ THIS FIRST

- Default locale: **en** (LTR). Secondary: **ar** (RTL).
- Locale routing: `/en/...` and `/ar/...` via next-intl middleware. `/` redirects to `/en`.
- `<html lang dir>` are set from the active locale. NEVER hardcode `dir="rtl"` or `dir="ltr"` in components.
- All UI strings live in `messages/en.json` and `messages/ar.json`. NEVER hardcode user-facing text in components — not even one word.
- Use CSS logical properties (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`) instead of left/right utilities so RTL works for free.
- Fonts (next/font, self-hosted):
  - Latin/UI + English: **Space Grotesk** (headings tracking -0.03em)
  - Arabic: **IBM Plex Sans Arabic**
  - Numbers, reference codes, prices: **IBM Plex Mono** with `tabular-nums` (class `.mono`) in BOTH locales
- Font stacks switch per locale on `<body>`; Latin chars inside Arabic text fall back to Space Grotesk.
- Admin dashboard is also bilingual (default en).

## Brand tokens (hard constraints — from MDN STACKMART, inverted for Travel)

Dark-first product. Deep navy is the canvas; white is text; royal blue is rare and precious.

```css
--navy: #032b42;            /* brand navy */
--navy-deep: #021d2e;       /* page bg base, gradient start */
--page-bg: #05090d;         /* outer canvas (from the design file) */
--accent: #010ed0;          /* royal blue — SPARINGLY: focus rings, active states, glows, small pills */
--accent-soft: #6b7bff;     /* ONLY as gradient terminus or mono-label color, never a fill */
--lavender: #dee0ff;        /* chips/tags bg, "TRAVEL" lockup text; navy text on it */
--danger: #cf222e;
--fg-on-dark: #ffffff;
--fg-on-dark-muted: rgba(255,255,255,0.55);
--canvas-light: #ffffff;    /* admin app surfaces + form cards */
--canvas-subtle: #f6f8fa;
--border-light: #d5d8dc;
--border-on-dark: rgba(255,255,255,0.06);
--radius: 6px;              /* EVERYWHERE. Uniform. No other radii. */
```

- Dark gradient panels: `linear-gradient(160deg, #021d2e 0%, #032b42 100%)` + radial royal-blue blooms + faint 1px grid motif (white @5%).
- Shadows: large soft navy-tinted on marketing surfaces (e.g. `0 40px 90px -30px rgba(2,29,46,0.9)`); flat/near-zero in admin UI (Primer-style).
- Borders: 1px hairlines always.
- Logo lockup: "MDN" (Space Grotesk 700) + 1px vertical hairline + "TRAVEL" (Space Grotesk 600, letter-spacing 0.26em, lavender on dark).
- Primary CTAs on dark = white or lavender button with navy text. Royal blue is for moments, not defaults.
- NO gold, NO amber, NO glassmorphism, NO extra colors.
- The full hi-fi design reference lives at `design/MDN_Travel.html` — open it when unsure about any screen.

## Data model (Prisma)

```prisma
enum TicketStatus {
  RECEIVED         // en: Request received      | ar: وصل الطلب
  IN_PROGRESS      // en: Being reviewed        | ar: جاري المتابعة
  PREPARING_OFFER  // en: Preparing your offer  | ar: جاري تجهيز عرض
  CONTACTED        // en: We contacted you      | ar: تم التواصل
  AGREED           // en: Agreement reached     | ar: تم الاتفاق
  NO_AGREEMENT     // en: No agreement          | ar: لم يتم الاتفاق
  PAID             // en: Paid                  | ar: تم الدفع
}

enum ContactMethod { WHATSAPP  PHONE  EMAIL }

model Service {
  id        String   @id @default(cuid())
  slug      String   @unique
  nameEn    String
  nameAr    String
  descEn    String
  descAr    String
  image     String
  order     Int
  tickets   Ticket[]
}

model Ticket {
  id            String        @id @default(cuid())
  referenceCode String        @unique   // format: MDN-XXXXX (A-Z0-9, no ambiguous chars)
  service       Service       @relation(fields: [serviceId], references: [id])
  serviceId     String
  fullName      String
  phone         String
  email         String?
  contactMethod ContactMethod
  details       String
  status        TicketStatus  @default(RECEIVED)
  adminNotes    String?
  statusEvents  StatusEvent[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model StatusEvent {
  id        String       @id @default(cuid())
  ticket    Ticket       @relation(fields: [ticketId], references: [id])
  ticketId  String
  status    TicketStatus
  createdAt DateTime     @default(now())
}

model AdminUser {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String
  name         String
}
```

- Status flow: RECEIVED → IN_PROGRESS → PREPARING_OFFER → CONTACTED → (AGREED | NO_AGREEMENT) → PAID. Admin can move freely, but every change creates a StatusEvent.
- The 9 services are seed data (no admin CRUD in v1):
  1. hotels-resorts — Hotels & Resorts — حجوزات الفنادق والمنتجعات
  2. apartments-suites — Apartments & Hotel Suites — الشقق والأجنحة الفندقية
  3. yachts — Yacht Charter & Rental — حجز وتأجير اليخوت
  4. car-rental — Car Rental — تأجير السيارات
  5. conferences-events — Conferences & Corporate Events — تنظيم المؤتمرات والفعاليات
  6. parties-festivals — Parties & Festivals — تنظيم الحفلات والمهرجانات
  7. exhibitions — Exhibitions Management — تنظيم وإدارة المعارض
  8. business-services — Business Services — خدمات رجال الأعمال
  9. leisure-tourism — Leisure & Tourism — الخدمات الترفيهية والسياحية

## Routes

Public (locale-prefixed):
- `/[locale]` — landing (hero, 9 service cards, how it works, footer)
- `/[locale]/services/[slug]` — service detail + CTA
- `/[locale]/request/[slug]` — request form (name, phone, email optional, contact method, details)
- `/[locale]/request/success/[code]` — success page, reference code in mono inside lavender chip, copy button
- `/[locale]/track` — enter code + phone → status timeline (completed steps royal blue, current glowing, future hairline)

Admin (light Primer-style UI):
- `/[locale]/admin/login`
- `/[locale]/admin` — stats cards (mono numbers) + tickets table (filter by service/status, search by name/phone/code, status badges)
- `/[locale]/admin/tickets/[id]` — full detail, status changer, internal notes, status history timeline

Tracking rule: ticket lookup requires BOTH referenceCode AND matching phone. Never expose tickets by code alone.

## Working rules

- Work in small tasks, one commit per task, conventional commit messages.
- Mobile-responsive from the start (the design file includes mobile screens).
- Every form: Zod schema shared client/server, localized error messages, loading + success states.
- Empty states and skeletons for admin table and tracking page.
- Respect `prefers-reduced-motion` for all animations.
- Seed script: 9 services + 1 admin (from env ADMIN_EMAIL/ADMIN_PASSWORD) + ~10 fake tickets in mixed statuses.
- Env vars documented in `.env.example`. Never commit `.env`.
- No payment integration, no user accounts, no service CRUD — out of scope for v1. Don't build them.
