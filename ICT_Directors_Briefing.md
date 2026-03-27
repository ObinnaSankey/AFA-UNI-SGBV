# Uni SGBV Reporting Platform
## ICT Directors Briefing — Infrastructure & Platform Overview

---

## Slide 1 — What We Built and Why

Universities across Nigeria face a persistent challenge: incidents of Sexual and Gender-Based Violence (SGBV) are significantly under-reported because reporters fear exposure, retaliation, or institutional inaction.

This platform solves that problem by providing a **secure, anonymous, web-based reporting channel** that:

- Requires no account, no login, and no identity disclosure from the reporter
- Delivers incident reports immediately and privately to designated institutional officers
- Generates a unique Tracking ID so reporters can follow up without re-exposing themselves
- Is accessible from any smartphone, tablet, or computer — no app installation required

**The platform is live, production-ready, and deployable at any Nigerian university in under one hour.**

---

## Slide 2 — The Four-Step Reporter Journey

From the reporter's perspective, the process is intentionally simple:

| Step | What Happens |
|------|-------------|
| 1 | Reporter visits the platform URL or scans a QR code on a poster |
| 2 | Selects the type and location of the incident (required) |
| 3 | Optionally writes a narrative, chooses anonymity level, and uploads evidence |
| 4 | Submits — receives a Tracking ID on-screen immediately |

The entire process takes approximately **3–5 minutes**.

The designated Gender Center officer receives a full email notification within **seconds** of submission.

---

## Slide 3 — Platform Pages and Access Points

| URL Path | Purpose | Audience |
|----------|---------|----------|
| `/` | Landing page — overview, safety notice, call to action | Students, staff |
| `/report` | 3-step anonymous incident report form | Students, staff |
| `/confirmation` | Tracking ID display, next steps, emergency contacts | Reporter (post-submission) |
| `/edudeck` | Education hub — rights, definitions, safety planning, FAQ | Students, staff |
| `/qr` | QR-code-optimised page for printing on posters and handouts | ICT/Print team |
| `/admin` | Password-protected admin panel | Gender Center officers, ICT team |

**No page other than `/admin` requires any login or account.**

---

## Slide 4 — Technology Stack

The platform is built on a deliberately **simple, low-cost, high-reliability** stack using globally trusted services.

### Frontend (User Interface)
| Component | Technology | Role |
|-----------|-----------|------|
| Framework | React 18 + TypeScript | UI rendering and state management |
| Build Tool | Vite | Fast builds, production optimisation |
| Styling | Tailwind CSS | Responsive design, mobile-first |
| Icons | Lucide React | Consistent iconography |
| Routing | React Router v7 | Client-side page navigation |

### Backend & Infrastructure
| Component | Technology | Role |
|-----------|-----------|------|
| Database | Supabase (PostgreSQL) | Stores report metadata, config, universities |
| Authentication | Supabase Auth | Admin login (email + password) |
| Backend Logic | Supabase Edge Functions (Deno runtime) | Report processing, email dispatch |
| Email Delivery | Resend API | Delivers reports to designated officers |
| Frontend Hosting | Vercel | Serves the web application globally |

### Monthly Cost at Scale
- **Supabase Free Tier:** Up to 500MB database, 500K Edge Function invocations/month — free
- **Resend Free Tier:** Up to 3,000 emails/month — free
- **Vercel Free Tier:** Unlimited static hosting — free
- **Total baseline cost: NGN 0**

---

## Slide 5 — Database Architecture

Three tables store all platform data in Supabase PostgreSQL.

### `universities`
Stores all registered institutions. Each record holds the university name, short code (used in Tracking IDs), and the designated officer email addresses.

```
id | name | short_code | routing_email_1 | routing_email_2 | is_active
```

**12 Nigerian universities are pre-loaded** (UNILAG, UI, ABU, UNN, OAU, UNIBEN, BUK, FUTA, LASU, RSU, UNIPORT, NAU).

### `reports`
Stores submitted report metadata. **Narrative text is NOT stored by default** — it is emailed to officers and discarded.

```
id | tracking_id | university_id | incident_type | location_type |
   location_detail | incident_date_approx | wants_followup |
   consent_given | has_attachment | status | created_at
```

**Tracking ID format:** `UNI-YYYYMMDD-XXXXXX` (e.g. `UNI-20260601-AB3X9M`)

### `app_config`
Key-value store for all platform settings: institution name, routing emails, storage mode, email sender address, rate limits. Managed entirely through the admin panel — no code changes needed.

---

## Slide 6 — Report Submission: What Happens Under the Hood

When a reporter clicks **Submit**, the following sequence executes in under 2 seconds:

```
Reporter's Browser
      |
      |  POST FormData (incident details + optional files)
      v
Supabase Edge Function  (submit-report)
      |
      |-- 1. Validates required fields (incident type, location, consent)
      |-- 2. Generates unique Tracking ID
      |-- 3. Writes minimal metadata to reports table (if storage enabled)
      |-- 4. Composes full report email (including narrative)
      |-- 5. Sends email to routing_email_1 (and routing_email_2 if set)  -->  Resend API
      |-- 6. If reporter named + wants follow-up: sends acknowledgement email to reporter
      |
      v
Returns { success: true, trackingId }
      |
      v
Reporter sees Confirmation page with Tracking ID
```

**Critical design decision:** The full narrative text travels by email only. It is not persisted in the database unless the institution explicitly enables that option. This minimises data exposure risk.

---

## Slide 7 — Email Delivery

**Provider:** Resend (resend.com) — chosen for reliability, Nigerian-accessible API, and free tier.

### Officer Notification Email

Every submitted report triggers an immediate email to the designated Gender Center officer:

```
Subject: New SGBV Report – University of Lagos – UNI-20260601-AB3X9M

SGBV REPORTING PLATFORM — NEW REPORT
=====================================
Tracking ID:    UNI-20260601-AB3X9M
Institution:    University of Lagos
Submitted:      27 Mar 2026, 14:30 (WAT)

INCIDENT DETAILS
----------------
Type:           Sexual Harassment
Location:       On Campus — Faculty of Law, Block C
Date (approx):  Last week

NARRATIVE
---------
[Reporter's full description here]

REPORTER INFORMATION
--------------------
Anonymous: Yes    Follow-up: No
=====================================
```

### Acknowledgement Email (Optional)
If the reporter provides their email and requests follow-up, they receive an acknowledgement with their Tracking ID.

**The Resend API key is stored exclusively as a Supabase secret — it is never exposed in the frontend code or browser.**

---

## Slide 8 — Security Architecture

Security is enforced at multiple independent layers.

### Layer 1: Row-Level Security (RLS) — Database
Every table has RLS enabled. Policies are restrictive by default:

| Table | Anonymous Users | Authenticated Admins |
|-------|----------------|---------------------|
| universities | Read active records only | Full access |
| reports | Submit only (INSERT with consent) | Read + update status |
| app_config | Read public keys only | Full access |

**An anonymous user cannot read any report, ever — even their own.**

### Layer 2: Authentication — Admin Panel
- Admin panel protected by Supabase Auth (email + password)
- Admin accounts created only via Supabase dashboard — no self-registration
- Multiple officers can each have their own login

### Layer 3: Anonymity by Design
- Anonymity is the **default and recommended** option
- When anonymous: zero personal data is collected, transmitted, or stored
- No IP address logging in the application layer
- No cookies, fingerprinting, or tracking

### Layer 4: Data Minimisation
- Narrative text emailed but **not stored** in database by default
- Storage modes: `None` (email only), `Minimal Metadata`, `Full` — admin configurable
- File attachments transmitted directly to officers, not stored in cloud storage

### Layer 5: Secrets Management
- Resend API key stored in Supabase Edge Function Secrets (server-side only)
- Database credentials never exposed to frontend
- Frontend uses only the Supabase `anon` key (public, safe for browser)

### Layer 6: Input Validation
- Incident type and location validated against fixed enum values
- Consent checkbox is mandatory (enforced both client and server-side)
- File uploads limited: max 3 files, 10MB each, whitelisted MIME types only
- Rate limiting: configurable maximum submissions per session per hour

---

## Slide 9 — Admin Panel Capabilities

Administrators access the platform at `/admin` using their Supabase credentials.

### Configuration Tab
All settings are managed through a UI form — no code editing required:

- **Institution Name & Platform Name** — appears in emails and confirmation pages
- **Primary & Secondary Routing Email** — who receives report notifications
- **Sender Email (From address)** — the address reports appear to come from
- **Storage Mode** — control how much data is retained in the database
- **Narrative Storage** — toggle whether written descriptions are persisted
- **Rate Limit** — prevent form abuse (default: 5 submissions per hour per session)
- **Google Sheets Logging** — optional integration to log metadata to a spreadsheet

### Reports Log Tab
A live dashboard of all submitted reports showing:
- Tracking ID, submission timestamp, incident type, location type
- Current status: Submitted → Received → In Progress → Resolved
- Flags: "Follow-up requested", "Has attachment"
- Status can be updated inline by the admin

---

## Slide 10 — Deployment & Integration Options

### Hosting
The platform is deployed on **Vercel** (recommended) or Netlify. Both are free-tier eligible and require no server management.

**Deployment requires only two environment variables:**

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project endpoint |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase key (safe for browser) |

### Integration Options for Universities

**Option 1 — Subdomain (Most Professional)**
Point a DNS CNAME record to Vercel:
`report.unilag.edu.ng` → Vercel deployment

**Option 2 — Iframe Embed**
Embed the reporting form directly into your student portal or LMS:
```html
<iframe src="https://your-deployment.vercel.app/report"
        width="100%" height="800" frameborder="0"></iframe>
```
Compatible with WordPress, Moodle, and custom university portals.

**Option 3 — QR Code + Direct Link**
Print the `/qr` page onto orientation materials, notice boards, and ID card inserts. The page is intentionally minimal and printer-friendly. QR code generation requires no technical skill.

---

## Summary

| Dimension | Detail |
|-----------|--------|
| Platform type | Web SPA, mobile-responsive, no app install required |
| Languages/frameworks | TypeScript, React 18, Vite, Tailwind CSS |
| Database | Supabase PostgreSQL with Row-Level Security |
| Authentication | Supabase Auth (admin only; reporters need no account) |
| Email delivery | Resend API (3,000 emails/month free) |
| Hosting | Vercel (free tier, global CDN) |
| Baseline monthly cost | NGN 0 |
| Time to deploy | ~30–45 minutes |
| Supported universities | 12 pre-loaded; unlimited via admin panel |
| Anonymity | Default and enforced by design |
| Narrative storage | Off by default; email-only delivery |
| Admin access | Email + password via `/admin` |
| SPA routing fix | `vercel.json` rewrite rule included |

**The platform is production-ready, privacy-first, and requires no ongoing engineering maintenance for day-to-day operation.**

---

*Uni SGBV Reporting Platform — Built for safe, confidential institutional reporting.*
