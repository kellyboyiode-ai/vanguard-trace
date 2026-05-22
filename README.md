# Vanguard Trace

Vanguard Trace is a React + Vite + Tailwind frontend with logistics intelligence UI, routing, and tracking flows.

This repo now supports a phased path:

1. Frontend-only demo mode (default)
2. Supabase-backed live mode (optional)

## Current Stack

- Frontend: React + Vite
- Styling: Tailwind + custom CSS
- Routing: React Router
- Optional backend services: Supabase (PostgreSQL, Auth, Storage, Realtime)
- Hosting target: Cloudflare Pages

## Why This Flow

Trying to build frontend + backend + auth + APIs + database + hosting at the same time is usually overwhelming.

Use this order:

1. Build and polish frontend UX
2. Ship demo functionality with hardcoded/sample data
3. Turn on live data by connecting Supabase
4. Add auth, file uploads, reports, and admin capabilities incrementally

## What Is Already Integrated

This project now includes a non-breaking Supabase integration foundation.

- `src/lib/supabase.js`: Supabase client + readiness checks
- `src/services/trackingService.js`: Tracking lookup and summary (live-or-demo fallback)
- `src/services/contactService.js`: Contact submission (live-or-demo fallback)
- `src/services/authService.js`: Email/password auth helpers
- `src/services/reportsService.js`: Saved reports API helpers
- `src/services/messagesService.js`: Messaging helpers
- `src/services/uploadsService.js`: Storage upload helper
- `src/services/customersService.js`: Customer profile helpers
- `src/services/adminService.js`: Admin dashboard snapshot helper
- `supabase/schema.sql`: Base schema and policies for core features

Tracking and Contact pages are already wired to use these services while preserving demo behavior.

## Project Guides

For deeper project-level documentation, use:

- `VANGUARDTRACE_TEARDOWN.md`: structured end-to-end architecture, runtime, feature, and operational teardown
- `VANGUARDTRACE_COMPLETE_GUIDE.md`: fuller reference guide for routes, services, environment, and deployment shape
- `CLOUDFLARE_DEPLOYMENT.md`: deployment-specific Cloudflare Pages instructions

## Supabase Setup

### 1) Create a Supabase project

- Open the Supabase dashboard
- Create a project named `vanguard-trace`
- Pick region and database password

### 2) Get API credentials

In Supabase project settings, copy:

- Project URL
- `anon` public key

### 3) Configure environment

Copy `.env.example` to `.env` and set values:

```env
VITE_ENABLE_SUPABASE=true
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_SUPABASE_STORAGE_BUCKET=documents
VITE_VT_PORTAL_BASE_URL=https://portal.your-provider.example
VITE_VT_MARKETING_BASE_URL=https://www.your-company.example
VITE_VT_FCL_RATE_BASE_URL=https://rates.your-company.example
VITE_VT_LTL_RATE_URL=https://ltl.your-company.example
VITE_VT_CARGO_INSURANCE_URL=https://insurance.your-company.example
VITE_SAILINGS_API_BASE=https://api.your-company.example
```

If `VITE_ENABLE_SUPABASE=false`, app stays in demo mode.

If your hosted Supabase project is paused on the free tier, auth and other live requests will fail until you unpause it in the Supabase dashboard. For local recovery, run `npm run dev:full` to boot the local Supabase stack and regenerate `.env.local` against that local instance.

### 4) Apply database schema

In Supabase SQL Editor, run:

- `supabase/schema.sql`

That creates base tables for:

- customers
- shipments
- reports
- messages
- uploads
- saved_reports

and inserts demo shipment rows for tracking lookups.

### 5) Create storage bucket

Create a bucket named `documents` (or match your env value).

## Feature Coverage Matrix

| Feature                | Supported in this repo                   |
| ---------------------- | ---------------------------------------- |
| User accounts/login    | Service layer ready (`authService`)      |
| Real shipment tracking | Implemented in `Tracking` page + service |
| Contact submissions    | Implemented in `Contact` page + service  |
| Saved reports          | Service layer ready (`reportsService`)   |
| Admin dashboard data   | Service layer ready (`adminService`)     |
| Uploading files        | Service layer ready (`uploadsService`)   |
| Customer data          | Service layer ready (`customersService`) |
| Messaging system       | Service layer ready (`messagesService`)  |

## Development

Install dependencies:

```bash
npm install
```

Run the complete local stack (Supabase + env wiring + frontend on 4173):

```bash
npm run dev:full
```

This command will:

- start local Supabase services
- reset local DB and apply `supabase/schema.sql`
- generate `.env.local` with local Supabase URL/key
- start Vite on `http://127.0.0.1:4173`

If you only want frontend after backend is already running:

```bash
npm run dev:4173
```

Manage local backend manually:

```bash
npm run backend:start
npm run backend:stop
```

Start dev server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Deploy to Cloudflare Pages (safe mode, blocks dirty working tree):

```bash
npm run deploy
```

Deploy a preview branch build (safe mode):

```bash
npm run deploy:preview
```

If you intentionally need to deploy with uncommitted changes:

```bash
npm run deploy:dirty
npm run deploy:preview:dirty
```

Every build now embeds deployment metadata shown in the footer banner:

- UTC deployment timestamp
- Git commit
- Git branch
- clean/dirty working tree state

Auto-commit local changes:

```bash
npm run auto-commit
```

This watches the repo by polling git status every 30 seconds and creates a commit whenever there are changes. If `origin` exists, it also pushes that commit automatically. Use `AUTO_COMMIT_INTERVAL_MS=5000 npm run auto-commit` to change the interval, `AUTO_COMMIT_PUSH=false npm run auto-commit` to disable pushes, or `npm run auto-commit:once` to perform a single check-and-commit run.

## Security Notes

Because this app handles tracking, messages, reports, and uploads:

- Use Supabase Auth for authentication flows
- Keep Row Level Security enabled on all tables
- Never store passwords manually in your own tables
- Never store card data, PINs, OTPs, or sensitive financial secrets in app tables
- Keep service role keys out of frontend code

## Deployment Model

- Frontend: Cloudflare Pages
- Data/Auth/Storage: Supabase

This gives a modern production-ready architecture without requiring a full custom backend on day one.
