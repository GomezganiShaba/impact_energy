# Impact Energy Solution Website & Inquiry System

Official web platform for **Impact Energy Solution**, a renewable energy engineering company based in Lilongwe, Malawi (Area 23 & Area 49), licensed by the Malawi Energy Regulatory Authority (MERA).

Built with Next.js 15 App Router, React 18, Tailwind CSS, Framer Motion, Prisma ORM, Auth.js (NextAuth v5), Resend email, and Upstash Redis rate limiting.

---

## 1. Features

- **Editorial Brand Design:** Bespoke green and yellow palette strictly abiding by brand tokens (no white, no grey, no off-white; Fraunces & Inter typography).
- **Responsive Navigation:** Fixed header that transforms to solid pale yellow on scroll, complete with Framer Motion scroll progress indicator and full-screen mobile menu.
- **Interactive Sections:**
  - Hero with staggered entrance, headline highlights, and Area 23 & 49 stats.
  - About section with floating badge and duotone photo treatment.
  - Vision & Mission dual-card layout.
  - 6 Core Services with deep-linking quote query prefill (`/quote?service=<slug>`).
  - 4-step project execution workflow.
  - Filtered photo gallery with responsive lightbox modal and keyboard navigation (Esc, Arrow keys).
  - Executive leadership card (Mr. Steve Khomba, Co-founder & Director).
  - "Why Choose Us" value propositions.
  - Compact CTA quote band and WhatsApp / phone dial actions.
- **Inquiry & Quote Management (`/quote` & `/api/inquiries`):**
  - Unified client & server validation using Zod and React Hook Form.
  - Malawi phone number normalisation to international E.164 standard (`+265...`).
  - Multi-tier spam protection: hidden honeypot field, 3-second minimum submission timestamp check, and IP-hash rate limiting.
  - Asynchronous background email delivery using Next.js 15 `after()`.
  - Fail-safe persistence: DB storage succeeds even if third-party email provider is unconfigured.
- **Authenticated Admin Portal (`/admin`):**
  - Protected by Auth.js v5 with bcryptjs credential hashing.
  - Searchable, filterable inquiry table with status badges (`NEW`, `CONTACTED`, `QUOTED`, `WON`, `LOST`).
  - Inquiry detail inspector with customer notes, one-click WhatsApp/Call links, and audit email logs.
  - Re-send team notification trigger.
  - Filtered CSV data export.
- **SEO & Compliance:**
  - Rich JSON-LD `LocalBusiness` structured data.
  - Dynamic `sitemap.xml` and `robots.txt`.
  - OpenGraph and Twitter cards.
  - Full WCAG AA contrast compliance and `prefers-reduced-motion` animation support.

---

## 2. Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript strict mode)
- **UI & Styling:** Tailwind CSS v3 with CSS variable design tokens
- **Animations:** Framer Motion
- **Fonts:** `next/font` (Fraunces & Inter)
- **Forms & Validation:** React Hook Form + Zod
- **Database:** Prisma ORM with PostgreSQL (Neon / Supabase / Postgres compatible)
- **Authentication:** Auth.js v5 (NextAuth beta) Credentials provider
- **Email:** Resend API + React Email components
- **Rate Limiting:** Upstash Redis with in-memory fallback
- **Testing:** Vitest (unit & schema tests) + Playwright (E2E smoke tests)

---

## 3. Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/impact_energy?sslmode=require"

# Resend Email
RESEND_API_KEY="re_123456789"
EMAIL_FROM="Impact Energy Solution <quotes@yourdomain.com>"
CONTACT_TO_EMAIL="steve@impactenergysolution.com,quotes@impactenergysolution.com"

# Site URLs and Phone
NEXT_PUBLIC_SITE_URL="https://impactenergysolution.com"
NEXT_PUBLIC_PHONE="+265881682589"

# Auth.js (NextAuth v5)
AUTH_SECRET="generate-a-32-byte-secret-via-openssl-rand-hex-32"
ADMIN_EMAIL="admin@impactenergysolution.com"
ADMIN_PASSWORD_HASH="$2a$12$..." # generated via npm run seed:admin

# Security & Anti-Spam Salt
IP_HASH_SALT="random-cryptographic-salt-for-ip-hashing"

# Upstash Redis Rate Limiting (Optional - falls back to in-memory)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18.18+ or 20+
- npm (use `--legacy-peer-deps` during install)

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Apply Database Migrations
For local or cloud PostgreSQL:
```bash
npx prisma db push
```

### 4. Seed Admin User Credentials
Generate a secure bcrypt hash for the admin password:
```bash
npm run seed:admin "YourSecretPassword123!" "admin@impactenergysolution.com"
```
Copy the printed `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` to your `.env` file.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
Admin portal is accessible at [http://localhost:3000/admin](http://localhost:3000/admin).

### 6. Preview Transactional Emails
To preview the React Email templates in real time:
```bash
npm run email:dev
```
Open [http://localhost:3001](http://localhost:3001).

---

## 5. Running Tests & Quality Checks

```bash
# Run unit tests (Zod schema, phone normalisation, utils)
npm test

# Run TypeScript type check
npm run typecheck

# Run ESLint
npm run lint

# Run Production Build
npm run build

# Run Playwright E2E smoke tests
npm run test:e2e
```

---

## 6. Email DNS Configuration (SPF, DKIM, DMARC)

When setting up your sending domain in Resend for `EMAIL_FROM`:

1. **SPF Record (TXT):**
   - Host: `@` (or subdomain)
   - Value: `v=spf1 include:amazonses.com ~all`
2. **DKIM Records (CNAME):**
   - Add the 3 CNAME tokens provided by the Resend dashboard.
3. **DMARC Record (TXT):**
   - Host: `_dmarc.yourdomain.com`
   - Value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100; adkim=r; aspf=r`

---

## 7. Deployment to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the repository into Vercel.
3. Configure Environment Variables in the Vercel project settings matching `.env.example`.
4. Ensure `DATABASE_URL` connects to a pooled PostgreSQL instance (e.g. Neon serverless or Supabase).
5. Build Command: `prisma generate && next build` (configured automatically via `package.json`).
6. Deploy!

