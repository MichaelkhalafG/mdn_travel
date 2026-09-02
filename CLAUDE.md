# MDN Travel

Luxury concierge & booking-request platform by MDN (sister product of MDN STACKMART).
Users pick a service → open a request (ticket) → admin handles everything offline and updates the ticket status. No online payments, no user accounts.

## Stack

- Next.js 15 (App Router) + TypeScript — one project for public site AND admin dashboard
- Tailwind CSS v4 (theme via CSS variables in globals.css, same approach as STACKMART — no tailwind.config)
- Prisma + MySQL (Hostinger managed in production)
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
  - **IBM Plex Mono** (`.mono` / `MonoLabel`) is for DATA ONLY: reference codes, numbers, prices, timestamps, indices, the hero pager — in BOTH locales. It is NOT an eyebrow/section-label treatment.
  - Eyebrows / section labels use the `Eyebrow` component: TEXT font (Space Grotesk / Plex Arabic via the locale stack), uppercase, 12-13px, font-medium, letter-spacing 0.14em, white/55 on dark (`tone="light"` → fg-on-light-muted on light). No dash/hairline prefix, no accent color, never mono.
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
--mono-label: #8a94a3;          /* mono DATA labels (indices, meta) — not eyebrows */
--fg-on-light-muted: #57606a;   /* muted text on light surfaces */
--border-light-subtle: #eaeef2; /* table row hairlines on light surfaces */
/* neutral grays extracted from the design file — allowed. The "no extra colors"
   rule forbids new BRAND colors (gold, amber, etc.), not neutral shades. */
```

- Dark gradient panels: `linear-gradient(160deg, #021d2e 0%, #032b42 100%)` + radial royal-blue blooms + the two-tier texture system below.
- Texture system (two tiers — NO grid/hatch/repeating patterns, they are retired):
  - HERO-TIER = `MeridianLayer` (src/components/ui): three great-circle arc hairlines (1px, accent-soft→royal gradient strokes, non-scaling, circle radii larger than the panel) + one small pulsing royal "destination" dot near the bright arc's apex. Exactly ONE instance per view, only on: the landing hero, service detail heroes, the footer panel, and og.jpg.
  - SURFACE-TIER = `ContourLayer` (src/components/ui): six concentric irregular contour lines (nautical-chart fragment) from the inline-end top corner, 1px white @15%, CSS-masked fade toward the content side. Default on DarkPanel and dark Cards; also the mobile drawer and any repeated dark surface.
  - Both mirror in RTL via `rtl:-scale-x-100`; the dot pulse (`.pulse-dot`) collapses under prefers-reduced-motion. Tuning reference: `/[locale]/dev/texture`.
  - WHITESPACE: large dark gaps between sections must not render flat navy. Fill them with quiet life: ContourLayer bands at reduced opacity (`opacity-60/70`) positioned through empty zones, alternating `origin="end"/"start"` per band down the page; `.bloom-seam-top/bottom` (~10% royal) near section boundaries. Exception: the landing how-it-works section carries ONE `MeridianLayer variant="route"` arc (no dot, accent-toned) behind the step row — the only mid-page meridian. Textures never sit behind text blocks (mask/fade before reaching them); at mobile widths ContourLayer drops its two tightest rings automatically.
- Shadows: large soft navy-tinted on marketing surfaces (e.g. `0 40px 90px -30px rgba(2,29,46,0.9)`); flat/near-zero in admin UI (Primer-style).
- Borders: 1px hairlines always.
- Logo lockup: "MDN" (Space Grotesk 700) + 1px vertical hairline + "TRAVEL" (Space Grotesk 600, letter-spacing 0.26em, lavender on dark).
- Primary CTAs on dark = white or lavender button with navy text. Royal blue is for moments, not defaults.
- NO gold, NO amber, NO glassmorphism, NO extra colors.
- The design source of truth is `design/template.html` (extracted markup — read this). The original bundle is `design/MDN Travel.html` (note the space); if template.html is ever missing, regenerate it with: `node scripts/extract-design.mjs`

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
- StatusBadge: CONTACTED uses the same royal-outline badge family as IN_PROGRESS and PREPARING_OFFER (in-flight states) — a deliberate, approved inference; the design file never shows a CONTACTED badge.
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
- Deployment: Hostinger Node.js Web Apps via GitHub integration. next.config output: "standalone".
- No payment integration, no user accounts, no service CRUD — out of scope for v1. Don't build them.
