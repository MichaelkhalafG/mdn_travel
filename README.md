# MDN Travel

Luxury concierge & booking-request platform by MDN. See `docs/PROJECT.md` for the
full product spec, brand tokens, and working rules, and `DEPLOY.md` for the
Hostinger production runbook.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + MySQL (Hostinger
managed in production) · Auth.js (admin only) · next-intl (`en` default, `ar` RTL) · Zod.

## Local development

### 1. Database (MySQL 8)

With Docker:

```bash
docker compose up -d db
```

This starts `mysql:8` with database `mdn_travel`, charset `utf8mb4` and collation
`utf8mb4_unicode_ci` (required — we store Arabic text). Root password is `root`, so
the connection string is:

```
DATABASE_URL="mysql://root:root@localhost:3306/mdn_travel"
```

Without Docker: install MySQL 8 locally (or use XAMPP/MariaDB for dev) and create
the database yourself:

```sql
CREATE DATABASE mdn_travel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. App

```bash
cp .env.example .env   # then fill in DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npx prisma migrate dev # apply migrations
npm run db:seed        # 9 services + admin (from ADMIN_EMAIL/ADMIN_PASSWORD) + fake tickets
npm run dev
```

Open http://localhost:3000 — `/` redirects to `/en`; Arabic lives at `/ar`.

## Deployment

Hostinger Node.js Web Apps via GitHub integration — see **`DEPLOY.md`** for the
full step-by-step runbook (subdomain, Git import, MySQL, env vars, first-deploy
migrate/seed, SSL). `next.config.ts` uses `output: "standalone"`; `npm run build`
copies static assets into the standalone tree and `npm start` runs
`.next/standalone/server.js` (binds `0.0.0.0`, respects `PORT`).
