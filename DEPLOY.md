# Deploying MDN Travel to Hostinger

Target: **travel.mdneg.com** (subdomain of `mdneg.com`) on **Hostinger Node.js
Web Apps**, deployed by **Git import** from
`https://github.com/MichaelkhalafG/mdn_travel` (branch `main`).

> This is a Node.js app (SSR + API + Prisma), **not** a static upload. It must
> run on Hostinger's Node.js hosting tier.

---

## 0. Prerequisites

- **Confirm the GitHub repo is PRIVATE.** It contains project memory under
  `design/` (spec, extracted design, company facts). None of it is secret, but
  it is internal — keep the repo private.
- A Hostinger plan that offers **"Node.js Apps"** in hPanel (Business / Cloud
  tiers). If hPanel only shows shared hosting / "public_html" file management
  and **no Node.js Apps option, STOP** — this plan cannot run the app. The
  static `public_html` model does not apply here.

  > ⚠️ The path `…/public_html/travel` is **NOT used** in this deploy model.
  > The subdomain is attached to the Node.js app, which serves everything —
  > do not point the subdomain at a `public_html/travel` folder.

---

## 1. Create the subdomain

hPanel → **Domains → Subdomains** → create **`travel`** under `mdneg.com`
→ result: `travel.mdneg.com`.

Do not bind it to a document root here. In the next step it is **attached to the
Node.js app** during app creation (the app owns the domain, not a folder).

---

## 2. Create the Node.js app from Git

hPanel → **Websites → Add Website → Node.js Apps** (wording may be "Create
application") → **Import from Git / Git Repository**:

- **Connect GitHub** and authorize access to `MichaelkhalafG/mdn_travel`.
- **Repository:** `MichaelkhalafG/mdn_travel`  **Branch:** `main`
- **Node version:** **20** (matches `.nvmrc` / `engines`).
- **Attach domain:** `travel.mdneg.com` (select it as the app's domain).
- **Build command:** `npm run build`
  (Hostinger runs `npm install` first — `postinstall` runs `prisma generate`,
  and `postbuild` copies static assets into `.next/standalone`.)
- **Start command:** `npm start`
  (runs `node .next/standalone/server.js` — binds `0.0.0.0`, uses Hostinger's
  injected `PORT` automatically).

Don't start the first build until the env vars (step 4) and DB (step 3) exist.

---

## 3. Create the MySQL database

hPanel → **Databases → MySQL Databases**:

- Create a database (e.g. `uXXXXXXXX_mdn_travel`) and a database user, and
  **assign the user to the database** with all privileges.
- Set the charset/collation to **utf8mb4 / utf8mb4_unicode_ci** if offered (we
  store Arabic). Prisma's migration also enforces this.
- Note the **database name, username, password, host** (host is usually
  `localhost` for a DB on the same Hostinger server). These go into
  `DATABASE_URL`:

  ```
  DATABASE_URL="mysql://DBUSER:DBPASSWORD@localhost:3306/DBNAME"
  ```

  URL-encode any special characters in the password (`@`→`%40`, `#`→`%23`, …).

---

## 4. Environment variables

hPanel → the app's **Environment Variables** panel → add each of these
(values are examples — fill in the real DB creds and a fresh secret):

```
DATABASE_URL=mysql://DBUSER:DBPASSWORD@localhost:3306/DBNAME
AUTH_SECRET=<output of: npx auth secret>
AUTH_URL=https://travel.mdneg.com
AUTH_TRUST_HOST=true
NEXT_PUBLIC_SITE_URL=https://travel.mdneg.com
ADMIN_EMAIL=ops@mdn.travel
ADMIN_PASSWORD=<a strong password>
NEXT_PUBLIC_CONTACT_PHONE=+966 12 512 4965
NEXT_PUBLIC_CONTACT_EMAIL=info@mdn.international
NODE_ENV=production
```

- `AUTH_URL` **must** be the real `https://travel.mdneg.com` or admin sign-in
  callbacks break.
- `AUTH_TRUST_HOST=true` lets Auth.js trust the proxied host header.
- `NEXT_PUBLIC_SITE_URL` is the canonical origin used as `metadataBase`, so OG /
  Twitter image URLs are absolute (not `localhost`) in production.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` are the only admin login — keep them strong
  and private.
- Do **not** set `PRISMA_LOG` in production.

Now trigger the first deploy (build + start).

---

## 5. First-deploy one-time commands

The build does **not** touch the database. After the first successful deploy,
open the app's **terminal/SSH** in hPanel (Node.js app → "Open terminal" /
"Run command"), `cd` to the app directory, and run — in order:

```bash
# 1. apply the schema (creates tables; safe/idempotent)
npx prisma migrate deploy

# 2. seed the 9 services (idempotent upsert — NO fake tickets)
npm run seed:services

# 3. create the admin from ADMIN_EMAIL / ADMIN_PASSWORD (idempotent)
npm run create-admin
```

> Use these, **not** `npm run db:seed` — the dev seed also inserts ~10 fake
> demo tickets, which you do not want in production.

To rotate the admin password later: update `ADMIN_PASSWORD` in the env panel,
redeploy (or just re-run `npm run create-admin` in the terminal).

---

## 6. SSL for the subdomain

hPanel → **Security → SSL** (or the app's SSL section) → issue a free **Let's
Encrypt** certificate for `travel.mdneg.com`. Wait for it to go active, then
confirm `https://travel.mdneg.com` loads and HTTP redirects to HTTPS. `AUTH_URL`
is already `https://…`, so sign-in works only once SSL is live.

---

## 7. Verify

- `https://travel.mdneg.com` → redirects to `/en`, landing renders with images.
- `/ar` → RTL. Pick a service → request form → submit → success code.
- `/en/track` → look up that code + phone → status timeline.
- `/en/admin` → redirects to login → sign in with `ADMIN_EMAIL/PASSWORD` →
  the request appears in the table.
- `/en/dev/ui` → should **404** (dev surfaces are gated off in production).

---

## Redeploys

Push to `main` → redeploy from hPanel (or enable auto-deploy on push). Routine
pushes need **no** DB commands. Re-run `npm run seed:services` only after
changing the seed service copy; re-run `npx prisma migrate deploy` only after
adding a new Prisma migration.
