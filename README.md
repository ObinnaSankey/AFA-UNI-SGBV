# Uni SGBV Reporting Platform

A production-ready, confidential Sexual and Gender-Based Violence (SGBV) reporting platform for university communities. Students and staff can submit reports anonymously in 3 simple steps. Reports are routed securely by email to designated institutional officers.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [What You Need Before You Start](#2-what-you-need-before-you-start)
3. [Step 1 — Set Up Your Supabase Database](#3-step-1--set-up-your-supabase-database)
4. [Step 2 — Set Up Email Delivery (Resend)](#4-step-2--set-up-email-delivery-resend)
5. [Step 3 — Deploy the Frontend](#5-step-3--deploy-the-frontend)
   - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
   - [Option B: Netlify](#option-b-netlify)
6. [Step 4 — First-Time Admin Setup](#6-step-4--first-time-admin-setup)
7. [Step 5 — Configure Report Routing](#7-step-5--configure-report-routing)
8. [Integration Options](#8-integration-options)
   - [Option 1: Subdomain](#option-1-subdomain-e-g-reportunilagedulag)
   - [Option 2: Iframe Embed](#option-2-iframe-embed)
   - [Option 3: Direct Link + QR Code](#option-3-direct-link--qr-code)
9. [Environment Variables Reference](#9-environment-variables-reference)
10. [Updating the Platform](#10-updating-the-platform)
11. [Security & Privacy Notes](#11-security--privacy-notes)
12. [Troubleshooting](#12-troubleshooting)
13. [Platform Pages Reference](#13-platform-pages-reference)
14. [Support & Customisation](#14-support--customisation)

---

## 1. Platform Overview

### What the platform does

- Provides a 3-step anonymous (or named) report submission form
- Generates a unique **Tracking ID** (format: `UNI-YYYYMMDD-XXXXXX`) for every submission
- Emails the full report immediately to 1–2 designated officer email addresses you configure
- Stores only minimal metadata in the database by default (no narrative text stored unless you enable it)
- Includes an **EduDeck** (education hub) with rights, safety information, and FAQs
- Includes a **QR-code-friendly page** (`/qr`) for printing and physical distribution
- Includes a protected **Admin panel** (`/admin`) to manage configuration and view the reports log

### Who does what

| Role | Responsibility |
|------|---------------|
| **ICT Focal Person** | Deploys the platform, sets up accounts, configures routing emails |
| **Gender Center / Designated Officer** | Receives report emails, manages cases |
| **Admin (Supabase Auth user)** | Logs into `/admin` to update config and view the reports log |
| **Reporter** | Submits a report via the web form — no account needed |

---

## 2. What You Need Before You Start

You will need:

- A computer with a web browser
- A free **Supabase** account — [supabase.com](https://supabase.com)
- A free **Resend** account (for email delivery) — [resend.com](https://resend.com)
- A free **Vercel** or **Netlify** account (for hosting the frontend)
- A copy of this project's source code (ZIP download or Git repository)
- Approximately **30–45 minutes** to complete the full setup

No command-line experience is required for Vercel/Netlify deployment. A basic familiarity with copy-pasting values between browser tabs is sufficient.

---

## 3. Step 1 — Set Up Your Supabase Database

Supabase is the database and backend service that stores report metadata and application configuration.

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in.
2. Click **New Project**.
3. Choose your organisation (or create one — it is free).
4. Fill in:
   - **Project name**: e.g. `uni-sgbv-reporting`
   - **Database password**: Choose a strong password and save it somewhere safe.
   - **Region**: Choose the region closest to Nigeria (e.g. `eu-west-1` or `us-east-1`).
5. Click **Create new project** and wait for it to provision (about 1 minute).

### 3.2 Get Your API Keys

1. In your Supabase project, go to **Settings → API** (left sidebar).
2. Copy and save two values:
   - **Project URL** — looks like `https://abcdefghijklmn.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`

You will need these in Step 5 when configuring your deployment.

### 3.3 Run the Database Migrations

The platform includes migration files that create all necessary tables automatically. If you are deploying from the project source:

The migrations are located in `supabase/migrations/` and are run automatically if you use the Supabase CLI. However, the **simplest method for university ICT teams** is to run them via the Supabase SQL Editor:

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open each `.sql` file from the `supabase/migrations/` folder in a text editor, copy its contents, paste into the SQL Editor, and click **Run**.
4. Run them **in order** by file name:
   - `20260222200355_create_universities_table.sql`
   - `20260222200416_create_reports_table.sql`
   - `20260222200418_create_app_config_table.sql`
   - `20260222200428_seed_sample_universities.sql`
   - `20260223122138_add_routing_emails_to_app_config.sql`
   - `..._add_routing_emails_to_app_config.sql` (most recent)

> **Tip:** If you see "already exists" errors, that is fine — the migrations are written to be safe to run multiple times.

### 3.4 Create an Admin User

The admin panel at `/admin` is protected by Supabase Authentication.

1. In your Supabase dashboard, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter the email and a strong password for the Gender Center officer or ICT focal person who will manage the platform.
4. Click **Create user**.

> You can create multiple admin users by repeating this step. Each designated officer can have their own login.

---

## 4. Step 2 — Set Up Email Delivery (Resend)

Resend is the email service that delivers reports to your designated officers. It is free for up to 3,000 emails/month which is more than sufficient.

### 4.1 Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up.
2. Verify your email address.

### 4.2 Verify Your Sending Domain (Recommended)

For professional email delivery and to avoid spam filters, you should verify your institution's domain.

1. In the Resend dashboard, go to **Domains → Add Domain**.
2. Enter your institution's domain (e.g. `unilag.edu.ng`).
3. Resend will show you DNS records to add. Send these to your IT/DNS administrator or add them yourself in your domain management panel.
4. Once verified, you can send from addresses like `noreply@unilag.edu.ng`.

> **If you skip domain verification:** You can still use Resend's shared sending domain (`onboarding@resend.dev`) for testing. However, for production, domain verification is strongly recommended.

### 4.3 Get Your Resend API Key

1. In the Resend dashboard, go to **API Keys → Create API Key**.
2. Give it a name (e.g. `uni-sgbv-platform`).
3. Set permission to **Full Access**.
4. Click **Add** and **copy the key immediately** — it will not be shown again.

Save this key — you will add it as an environment variable in the next step.

---

## 5. Step 3 — Deploy the Frontend

### Option A: Vercel (Recommended)

Vercel is the simplest deployment option with no server management required.

#### 5A.1 Push the code to GitHub

If you have not already, push the project to a GitHub repository:

1. Create a free account at [github.com](https://github.com) if you do not have one.
2. Create a new repository (e.g. `uni-sgbv-platform`) — set it to **Private**.
3. Upload the project files (drag and drop the folder into the GitHub web interface, or use the GitHub Desktop app).

#### 5A.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in with your GitHub account.
2. Click **Add New → Project**.
3. Select your `uni-sgbv-platform` repository and click **Import**.
4. Under **Framework Preset**, select **Vite**.
5. Under **Environment Variables**, add the following (click **Add** for each):

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL from Step 3.2 |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 3.2 |

6. Click **Deploy**.
7. Wait about 2 minutes. Vercel will give you a URL like `https://uni-sgbv-platform.vercel.app`.

#### 5A.3 Add the Resend API Key to Supabase Edge Functions

The `RESEND_API_KEY` is used by the backend edge function, not the frontend. Add it in Supabase:

1. In your Supabase dashboard, go to **Edge Functions** (left sidebar).
2. Click on the `submit-report` function.
3. Go to **Secrets** tab.
4. Add a new secret:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key from Step 4.3
5. Click **Save**.

#### 5A.4 Set a Custom Domain (Optional)

1. In Vercel, go to your project → **Settings → Domains**.
2. Add your domain (e.g. `sgbv.unilag.edu.ng`).
3. Follow Vercel's instructions to add a CNAME record in your DNS settings.

---

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com) and sign up / log in.
2. Click **Add new site → Import an existing project** and connect your GitHub repository.
   - Alternatively, drag and drop your project's `dist/` folder (after running `npm run build` locally) directly onto the Netlify dashboard.
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `dist`
5. Click **Show advanced** and add the same environment variables as in the Vercel table above.
6. Click **Deploy site**.
7. Add your Resend API key to Supabase Edge Functions as described in Step 5A.3.

---

## 6. Step 4 — First-Time Admin Setup

1. Visit your deployed platform URL and go to `/admin` (e.g. `https://uni-sgbv-platform.vercel.app/admin`).
2. Sign in with the email and password you created in Step 3.4.
3. You will land on the **Configuration** tab.

---

## 7. Step 5 — Configure Report Routing

This is the most important configuration step. Without a routing email, submitted reports will not be delivered.

### 7.1 Set Routing Emails

In the Admin panel under **Configuration → Report Routing**:

1. **Primary Routing Email** — Enter the Gender Center or designated officer email address. This is the main recipient of all reports.
   - Example: `gendercenter@unilag.edu.ng`
2. **Secondary Routing Email** (optional) — Enter a backup address (e.g. Dean of Students office).
   - Example: `deanofstudents@unilag.edu.ng`

### 7.2 Set Institution Name

Under **Configuration → General**, set:
- **Institution Name**: Your university's full name (e.g. `University of Lagos`)
- **Platform Name**: Display name (e.g. `UniLag SGBV Reporting Platform`)

This name appears in report email subjects and on confirmation pages.

### 7.3 Configure the Sender Email

Under **Configuration → Email (SMTP) Configuration**, set:
- **Sender Email (From address)**: The email address reports will appear to come from.
  - If you verified a domain in Resend (Step 4.2): use `noreply@yourdomain.edu.ng`
  - If not yet verified: leave as `noreply@uni-sgbv.org` for now

### 7.4 Save Changes

Click **Save Changes** at the top right of the Configuration panel. Changes take effect immediately.

### 7.5 Test the Setup

1. Open your platform URL in a browser.
2. Click **Report an Incident**.
3. Fill in the 3-step form with test data.
4. Submit the report.
5. Check that:
   - A **Confirmation page** appears with a Tracking ID (format: `UNI-YYYYMMDD-XXXXXX`).
   - A report email arrives at your Primary Routing Email address within 1–2 minutes.

If the email does not arrive, see [Troubleshooting](#12-troubleshooting).

---

## 8. Integration Options

### Option 1: Subdomain (e.g. `report.unilag.edu.ng`)

This gives the most professional appearance. Your ICT team adds a DNS record pointing the subdomain to your deployment.

**For Vercel:**
1. In Vercel → Project → Settings → Domains: add `report.unilag.edu.ng`
2. Vercel will show you a CNAME value (e.g. `cname.vercel-dns.com`)
3. In your DNS control panel, add:
   ```
   Type:  CNAME
   Name:  report
   Value: cname.vercel-dns.com
   TTL:   3600
   ```
4. DNS propagation takes 15 minutes to 24 hours.

**For Netlify:**
1. In Netlify → Site settings → Domain management → Add custom domain
2. Follow Netlify's CNAME instructions (similar process)

---

### Option 2: Iframe Embed

Embed the reporting form directly into your university website or student portal.

Paste this HTML anywhere on your university webpage:

```html
<iframe
  src="https://your-deployment-url.vercel.app/report"
  width="100%"
  height="800"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid #e2e8f0;"
  title="SGBV Incident Report Form"
  allow="clipboard-write"
></iframe>
```

Replace `https://your-deployment-url.vercel.app` with your actual deployment URL.

**Recommended minimum dimensions:**
- Width: 100% (responsive)
- Height: 800px (or use `min-height: 800px` with overflow)

**For WordPress sites:**
1. In the page editor, switch to the **HTML / Text** tab.
2. Paste the iframe code above.
3. Save and publish.

**For Moodle (LMS):**
1. Add an HTML block to your course.
2. Enable "Allow iframe" in Site Administration → Security → Site policies if required.
3. Paste the iframe code.

---

### Option 3: Direct Link + QR Code

The simplest integration — no technical setup beyond deployment.

**Direct report link:**
```
https://your-deployment-url.vercel.app/report
```

**QR code page (optimised for printing):**
```
https://your-deployment-url.vercel.app/qr
```

The `/qr` page is specifically designed for printing onto:
- Student handbooks
- Notice boards and posters
- ID card inserts
- Orientation booklets

**Generating a QR code:**
1. Go to [qr-code-generator.com](https://www.qr-code-generator.com) (or any QR generator).
2. Enter your report URL (e.g. `https://report.unilag.edu.ng/report`).
3. Download the QR code as PNG or SVG.
4. Print it alongside the text: **"Scan to report an incident confidentially"**

---

## 9. Environment Variables Reference

These are set in your Vercel or Netlify project settings. Never commit these to a public Git repository.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL (from Supabase → Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key (from Supabase → Settings → API) |

The following are set as **Supabase Edge Function Secrets** (not in Vercel/Netlify):

| Secret | Required | Description |
|--------|----------|-------------|
| `RESEND_API_KEY` | Yes (for email) | Your Resend API key for email delivery |

> The Supabase `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_ANON_KEY` are automatically available inside edge functions — you do not need to set these manually.

---

## 10. Updating the Platform

When a new version of the platform is released:

### On Vercel / Netlify with GitHub:
1. Replace the files in your GitHub repository with the new version (or merge the update branch).
2. Vercel/Netlify automatically re-deploys within 2 minutes.
3. Your environment variables and Supabase data are unaffected.

### Manual update (without GitHub):
1. Download the new version.
2. Copy your `.env` values to the new version's `.env` file.
3. Run `npm run build` on your local machine to generate a new `dist/` folder.
4. Drag and drop the new `dist/` folder onto Netlify, replacing the old deployment.

### Database migrations:
If a new version includes new migration files in `supabase/migrations/`, run only the **new** migration files (those with timestamps newer than your last deployment) in the Supabase SQL Editor.

---

## 11. Security & Privacy Notes

- **Anonymity is the default.** Reporters are never required to provide personal details.
- **IP addresses are not stored** in the application database. The platform does not log or record IP addresses.
- **Narrative text is not stored by default.** Only minimal metadata (timestamp, incident type, location type, tracking ID, follow-up requested: yes/no) is stored in the database. The full narrative is delivered by email only.
- **All data is transmitted over HTTPS.** Both the frontend (Vercel/Netlify) and Supabase enforce HTTPS by default.
- **Row Level Security (RLS) is enabled** on all database tables. Anonymous users can only submit reports — they cannot read any data. Only authenticated admin users can read the reports log.
- **Admin access is protected** by Supabase Authentication (email + password). Do not share admin credentials.
- **Routing emails** are stored in the database (not in frontend code), so they are never exposed to the public.
- **Resend API key** is stored as a Supabase Edge Function Secret — it is never exposed to the browser.

### Recommended security practices for ICT teams:
- Use a dedicated, monitored email address for report routing (not a personal inbox).
- Limit the number of admin accounts to only those who need access.
- Rotate the Resend API key every 6–12 months.
- Review the Supabase Authentication logs monthly for unauthorised access attempts.

---

## 12. Troubleshooting

### Reports are submitted but no email arrives

1. Check that **Primary Routing Email** is set correctly in the Admin panel (Configuration → Report Routing).
2. Check that your **Resend API key** is set correctly in Supabase Edge Function Secrets.
3. In the Resend dashboard, go to **Emails** and check if the email shows as sent, failed, or bounced.
4. Check the spam/junk folder of the routing email inbox.
5. If you have not verified a sending domain, try adding the Resend-provided DNS records to improve deliverability.
6. In Supabase → Edge Functions → `submit-report` → Logs, check for error messages.

### The admin panel says "Invalid login credentials"

1. Verify the email and password with the one created in Supabase → Authentication → Users.
2. To reset the password: in Supabase → Authentication → Users, find the user and click **Send password reset email**.

### The platform shows a blank page or fails to load

1. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set in your Vercel/Netlify environment variables.
2. Redeploy the project after adding/changing environment variables (both Vercel and Netlify require a redeploy for new env vars to take effect).
3. Open browser developer tools (F12 → Console) and look for specific error messages.

### The QR code does not work

Ensure the QR code points to the full URL including `https://`, e.g.:
```
https://report.unilag.edu.ng/report
```
Not just `report.unilag.edu.ng`.

### Reports are submitted but not appearing in the Reports Log

Check the **Storage Mode** setting in Admin → Configuration → Data Storage:
- If set to `None`, no records are written to the database (email only).
- Change to `Minimal Metadata` to enable the reports log.

---

## 13. Platform Pages Reference

| Path | Description | Who Uses It |
|------|-------------|-------------|
| `/` | Home / landing page | Students, staff |
| `/report` | 3-step incident report form | Students, staff |
| `/confirmation` | Post-submission page with Tracking ID | Students, staff |
| `/edudeck` | Education hub (rights, safety, FAQ) | Students, staff |
| `/qr` | QR-code-friendly page for printing | ICT team (for posters) |
| `/admin` | Protected admin panel | Gender Center officers, ICT team |

---

## 14. Support & Customisation

### Changing the platform name or branding

1. Log into the Admin panel → Configuration → General.
2. Update **Platform Name** and **Institution Name**.
3. Click **Save Changes**.

To change the colour scheme or logo, a developer will need to modify `tailwind.config.js` and the header component (`src/components/Header.tsx`). The primary colour is `teal-600` throughout.

### Adding or removing content from EduDeck

The EduDeck content is in `src/pages/EduDeck.tsx`. A developer can edit the text, add sections, or update the emergency contact numbers listed.

### Changing the emergency contact numbers

In `src/pages/EduDeck.tsx` and `src/pages/Confirmation.tsx`, search for `112` and `NAPTIP` to find the emergency contacts section and update as needed.

### Printing and distribution materials

Use the `/qr` page for:
- Generating QR code print materials
- Orientation week handouts
- Poster campaigns

The page is intentionally minimal and printer-friendly.

---

## Quick Reference Card

For the Gender Center officer or ICT focal person to keep handy:

```
Platform URL:      https://[your-deployment].vercel.app
Admin Panel:       https://[your-deployment].vercel.app/admin
QR Code Page:      https://[your-deployment].vercel.app/qr
Report Form:       https://[your-deployment].vercel.app/report

Admin login:       [email set in Supabase Auth]
Supabase project:  https://supabase.com/dashboard/project/[your-project-id]
Resend dashboard:  https://resend.com/emails

Tracking ID format: UNI-YYYYMMDD-XXXXXX
                    (e.g. UNI-20260601-AB3X9M)
```

---

*Uni SGBV Reporting Platform — Built for safe, confidential institutional reporting.*
