# Technical & Architectural Decisions Log

This document records all architectural choices, assumptions, and implementation decisions made during the development of the **Impact Energy Solution** website and inquiry system.

---

## 1. Tech Stack & Versioning

- **React Version:** The npm registry yanked the experimental release candidate `react@19.0.0-rc-f994737d14-20240903`. We standardized on stable `react@^18.3.1` and `react-dom@^18.3.1` paired with `next@^15.0.3` to guarantee zero dependency resolution failures.
- **Bcrypt Implementation:** Native `bcrypt` requires node-gyp and native build toolchains that frequently fail in serverless / containerized deployments. We chose `bcryptjs@^2.4.3`, a battle-tested pure JavaScript implementation with identical API and security guarantees.
- **Tailwind Version:** Tailwind CSS v3 is used with CSS variable design tokens to avoid the breaking syntax transitions of early Tailwind v4, ensuring 100% theme reliability.
- **Peer Dependency Flag:** Next.js 15 and Auth.js v5 beta introduce peer dependency warnings. `--legacy-peer-deps` is used during installation to maintain clean CI/CD builds.

---

## 2. Design System & Palette Enforcement

- **Strict Green & Yellow Family Only:** Zero white (`#fff`), zero off-white, and zero neutral grey were used in any UI components.
  - `--ink`: `#0E2318` (primary text on light backgrounds)
  - `--paper`: `#F6E79A` (light background)
  - `--paper-deep`: `#EFDB74` (card & alternate background)
  - `--on-dark`: `#FBE98F` (text/icons on dark surfaces)
  - `--dusk`: `#163A28` (dark green sections)
  - `--dusk-deep`: `#08170F` (deepest dark green footer & overlays)
  - `--gold`: `#F2B705` (primary accents, CTA buttons)
  - `--gold-hi`: `#FFE066` (hover accents)
  - `--leaf`: `#2E7D4F` (mid-green accents)
  - `--leaf-deep`: `#1E5636` (deep green container borders)
- **Duotone Photography Treatment:** All imagery passes through the prescribed CSS filter (`sepia(0.45) saturate(1.6) hue-rotate(52deg) brightness(0.92)`). The company logo (`/public/brand/logo.png`) is strictly exempted from all filter treatments.
- **Reduced Motion:** All Framer Motion animations and CSS transitions respect `@media (prefers-reduced-motion: reduce)` by disabling positional transforms while retaining clean opacity transitions.

---

## 3. Brand Copy & Legal Compliance

- **Terminology:** The word "technicians" is strictly disallowed in client-facing copy; "engineers" or "renewable energy professionals" is used across all text.
- **Regulatory Body:** MERA (Malawi Energy Regulatory Authority) is cited as the regulatory licensor. Malawi Bureau of Standards is excluded as per client instructions.
- **Dual Location Standard:** Lilongwe Area 23 and Area 49 always appear together as the company's operating bases.
- **Leadership Representation:** Only Mr. Steve Khomba (Co-founder & Director of Marketing and Business Development) is shown in the Team section. No other individuals or personal email addresses are displayed.
- **Punctuation:** Em dashes (`—`) are excluded from copy and code comments.

---

## 4. Inquiry System & Spam Prevention

- **Single Source of Truth Schema:** A single Zod schema (`src/lib/schema.ts`) validates inquiries across both client (React Hook Form) and server (`POST /api/inquiries`).
- **Malawi Phone Number Normalisation:** Numbers entered with local prefixes (`088...`, `099...`) or international notation are transformed into standard E.164 format (`+265...`).
- **Triple-Layer Anti-Spam:**
  1. *Honeypot field (`_hp`):* Silent 200 response returned to bots without DB persistence.
  2. *Submission Velocity Check (`_submittedAt`):* Requests submitted faster than 3 seconds are rejected with HTTP 429.
  3. *Rate Limiting:* 5 submissions per IP hash per hour using Upstash Redis with a memory-cached fallback when Redis credentials are not supplied.
- **IP Privacy:** Client IP addresses are hashed using SHA-256 with a secret salt (`IP_HASH_SALT`) before persistence, ensuring GDPR and data privacy compliance.
- **Non-Blocking Delivery via `after()`:** Next.js 15 `after()` sends team notifications and customer confirmation emails asynchronously after returning HTTP 201 to the client. Email failures are logged in `EmailLog` without failing customer quote submissions.

---

## 5. Admin Authentication & Architecture

- **Auth.js v5 (NextAuth.js):** Credentials provider reading `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` from environment variables.
- **Route Segregation:** Admin authentication layout is isolated to prevent infinite redirect loops on `/admin/login`, while middleware safeguards all `/admin/*` protected routes.
- **Data Export:** `/api/admin/export` delivers sanitized CSV dumps conforming to RFC 4180 with proper quote escaping.

---

## 6. Environment Workarounds

- **Windows Native `realpath` Bug (Node.js 25 on Virtual Drives):** Node 25's `fs.promises.realpath` and `fs.realpathSync.native` throw false `ENOENT` on non-C: / virtual drives. A targeted patch was applied to Prisma's build runner and Vite's resolver to use Node's standard `fs.realpathSync`, enabling seamless builds and testing on all drive formats.

---

## 7. Webmail Subdomain (`mail.ies.engineer`) Architecture

- **Dedicated Service Directory:** All webmail client views, components, and server actions are strictly encapsulated in `src/app/mail/`, with mail service logic in `src/lib/mail/`.
- **Subdomain Routing in Middleware:** `src/middleware.ts` automatically rewrites requests matching `mail.ies.engineer` (or `mail.localhost` in development) to `/mail`, enabling the webmail portal to run as a native subdomain. Direct path access via `/mail` is also preserved.
- **Database Persistence:** Real-time persistence via Prisma (`MailMessage` model) with support for folders (`INBOX`, `SENT`, `STARRED`, `TRASH`) and account switching (`kombasteve@ies.engineer`, `lichaparichard@ies.engineer`, `thauzelouis@ies.engineer`, `info@ies.engineer`, `bussiness@ies.engineer`).
- **Inbound Webhook Support:** Inbound webhook at `/api/mail/webhook` ingests external incoming emails directly into the appropriate team mailboxes. Website inquiries automatically populate the inbox as well.
- **Outbound Email Dispatch:** Sent via Resend transactional email API using the verified `ies.engineer` domain and stored under the user's `SENT` folder.

