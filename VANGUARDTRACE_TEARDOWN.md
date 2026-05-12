# VanguardTrace.site Technical Teardown

This is the Vanguard Trace equivalent of a full end-to-end project breakdown, based on the actual source repository and a quick verification against the live domain.

The key truth is:

This is a modern React single-page application with optional live Supabase services and a Cloudflare Pages deployment target.
It is not a static mirror, and it is not currently a full custom backend stack.
The frontend is fully source-driven, with a real auth gate and a small set of implemented live workflows layered over a broader logistics intelligence dashboard shell.

## 1. Project Identity And Scope

Repository root: `vanguard-trace`
Deployment target: `vanguardtrace.site`
App type: React SPA built with Vite
Primary hosting model: Cloudflare Pages
Primary data/auth/storage backend: Supabase

Quick repository composition, excluding generated/vendor folders such as `.git`, `node_modules`, and `dist`:

- 84 tracked source/config files
- 26 `.jsx` files
- 24 `.js` files
- 10 `.css` files
- 7 `.json` files
- 1 SQL schema
- 1 GitHub Actions workflow

This repo is a real maintainable source project, not an archived deploy artifact.

## 2. What The Live Site Is Right Now

A fetch of `https://vanguardtrace.site` matches the repo's public unauthenticated experience:

- Users land on a `Sign In` screen when they are not authenticated
- The footer and navigation labels match the current source tree
- The app is client-rendered and route-driven rather than page-per-file HTML

That means the repository and the live domain are aligned at a high level.

## 3. Core Technology Stack

Current frontend/runtime stack from `package.json`:

- React `19.2.6`
- React DOM `19.2.6`
- React Router DOM `7.15.0`
- Vite `8.0.12`
- Tailwind CSS `4.3.0` via `@tailwindcss/vite`
- Framer Motion `12.38.0`
- Three `0.184.0`
- `@react-three/fiber` `9.6.1`
- Lucide React `1.14.0`
- Supabase JS `2.105.4`

Supporting tooling:

- ESLint `10`
- Prettier `3.5.3`
- Wrangler `4.90.0`
- GitHub Actions CI/CD

This is an updated frontend stack by current standards, not a legacy jQuery or server-rendered system.

## 4. Runtime Architecture

Entry path:

- `src/main.jsx` mounts the app under `BrowserRouter`
- `src/App.jsx` wraps all routes in `AuthProvider`
- `ProtectedRoute` blocks protected pages until session state resolves
- Unauthenticated access redirects to `/login`

Auth ownership:

- `src/context/AuthContext.jsx` subscribes to Supabase auth session changes
- If Supabase is not ready, the provider exits early and the app never establishes a session
- `ProtectedRoute` then sends the user to `/login`

That creates an important operational behavior:

The app is documented as supporting frontend-only demo mode, but the route tree is still auth-gated. In practice, full navigation depends on a valid Supabase auth session unless the auth strategy is expanded.

## 5. Application Information Architecture

Actual route map from `src/App.jsx`:

Public routes:

- `/login`
- `/signup`

Protected routes:

- `/`
- `/home`
- `/tracking`
- `/operations`
- `/services`
- `/intel`
- `/contact`
- `/traces`
- `/settings`

Fallback:

- `*` -> not-found page

Additional note:

- `About.jsx` exists and is exported from `src/pages/index.js`, but is not currently wired into routing

So the repo contains more page surfaces than the live route table currently exposes.

## 6. Shared UI Shell

The app uses a stable dashboard shell rather than page-specific layouts.

Shared shell structure:

- `ShellLayout.jsx` renders the top bar, page eyebrow, title, and description
- `Navbar.jsx` maps links from `src/data/navigation.js`
- `Footer.jsx` renders a global footer with deep links and static legal anchors

Styling model:

- Tailwind is available and used heavily on auth pages
- The dashboard pages also rely on a substantial custom CSS layer under `src/styles/`
- Global design tokens live in `src/index.css`
- Typography uses Google Fonts: Orbitron, JetBrains Mono, IBM Plex Mono
- Visual direction is surveillance/logistics themed rather than generic SaaS

This is a mixed styling architecture: utility-first for some surfaces, custom authored CSS for the shell and feature panels.

## 7. Visual And Motion Layer

The main visual differentiator is the hero/intelligence presentation layer.

Primary motion/visual components:

- `VanguardHeroScene.jsx`
- `src/animations/vanguardTraceMotion.js`
- `src/data/vanguardTraceContent.js`

What it does:

- Uses Framer Motion for reveal, floating-node, and radar-sweep animations
- Uses Lucide icons for logistics and monitoring symbology
- Simulates a route-map / command-terminal / radar interface
- Supplies brand framing such as `Secure Freight Intelligence`

Although `three` and `@react-three/fiber` are installed, the current hero implementation shown in source is still DOM/SVG/motion-driven rather than an actual WebGL scene. That means 3D capability is present in dependencies but not yet central to the implementation shown here.

## 8. Data Model: Static Content vs Dynamic Services

There are two distinct data paths in this app.

Static content path:

- Overview stats and feed items come from `src/data/dashboardData.js`
- Navigation comes from `src/data/navigation.js`
- Hero messaging and animated node coordinates come from `src/data/vanguardTraceContent.js`
- Most non-form pages are currently content/config driven rather than API-driven

Dynamic service path:

- Tracking lookup and summary
- Contact submission
- Auth sign-in/sign-up/sign-out
- Customer profile helpers
- Reports, messages, uploads, admin snapshot helpers

The repo is structured so static UI works as a branded product shell while live services can be enabled incrementally.

## 9. Feature Breakdown By User Surface

### A. Authentication

Implemented in:

- `src/pages/LoginPage.jsx`
- `src/pages/SignupPage.jsx`
- `src/services/authService.js`

Behavior:

- Email/password sign-in through Supabase Auth
- Email/password sign-up through Supabase Auth
- Inline error feedback from Supabase responses
- Signup confirmation message instructs users to verify email

Failure mode:

- If Supabase is not configured, auth service methods throw because auth is treated as required for login/signup

### B. Overview Dashboard

Implemented in:

- `src/pages/OverviewPage.jsx`

Behavior:

- Renders KPI cards from static data
- Renders a trace event feed from static data
- Provides CTA into `/tracking`

This is currently a polished dashboard landing page, but not yet wired to live analytics.

### C. Home Experience

Implemented in:

- `src/pages/Home.jsx`
- `src/components/VanguardHeroScene.jsx`

Behavior:

- Hero visualization
- Static tracking input field
- Service module cards
- Simulated operations map
- Static intelligence metrics and alert banner

Important nuance:

The tracking form on Home is presentation-only right now. It prevents default submit and does not invoke the tracking service.

### D. Shipment Tracking

Implemented in:

- `src/pages/Tracking.jsx`
- `src/services/trackingService.js`

Behavior:

- Summary counters load on mount through `getTrackingSummary()`
- User can submit a tracking code through `getTrackingByCode()`
- UI shows whether data came from `supabase` or `demo`
- Displays error messages for empty or unknown codes

Live backend behavior:

- Reads from `shipments` table in Supabase
- Falls back to hardcoded demo shipments when Supabase is unavailable or rows are missing

Demo shipment examples included:

- `VGX-44591`
- `VGX-20391`
- `VGX-44291`

This is the strongest implemented operational workflow in the app today.

### E. Contact / Support Submission

Implemented in:

- `src/pages/Contact.jsx`
- `src/services/contactService.js`

Behavior:

- Captures `name`, `email`, `subject`, `message`
- Performs required-field validation in service layer
- Submits to Supabase `messages` table when configured
- Falls back to accepting locally in demo mode
- Shows different success copy for live vs demo mode

There is no CAPTCHA, email delivery pipeline, or external CRM integration in the current code.

### F. Operations, Services, Intel, Traces, Settings

Implemented in:

- `Operations.jsx`
- `Services.jsx`
- `Intel.jsx`
- `TracesPage.jsx`
- `SettingsPage.jsx`

Behavior today:

- These pages are present, styled, and navigable
- Their content is mostly static dashboard/panel data
- They communicate intended product direction more than fully integrated business workflows

This is important architecturally:

The app already has product surface area and information architecture for a much larger platform, but only selected flows currently persist or fetch real data.

## 10. Backend And Integration Surface

Current backend integration is exclusively Supabase from the frontend.

Observed live integration classes:

- Supabase Auth
- Supabase Postgres tables
- Supabase Storage
- Supabase Row Level Security policies

No custom REST API server is present in the repository.

No Cloudflare Worker API entrypoint is currently implemented.

Service modules currently exposed in source:

- `authService.js`
- `trackingService.js`
- `contactService.js`
- `customersService.js`
- `reportsService.js`
- `messagesService.js`
- `uploadsService.js`
- `adminService.js`

Meaning:

This project uses frontend-to-Supabase integration directly, not frontend -> custom backend -> database.

## 11. Supabase Data Contract

The schema in `supabase/schema.sql` creates these tables:

- `customers`
- `shipments`
- `reports`
- `messages`
- `uploads`
- `saved_reports`

What is already enforced:

- `pgcrypto` extension for UUID support
- `updated_at` trigger function for mutable tables
- RLS enabled on all core tables
- Policies for user-owned profile/report/upload access
- Public insertion policy for contact-form messages
- Demo shipment seed data for tracking lookups

This is a credible baseline schema for the current UI, and it is ahead of the actual page integration level.

## 12. Deployment And Operations

Deployment model implemented in source:

- Build tool: Vite
- Host: Cloudflare Pages
- CLI deploy: `wrangler pages deploy dist --project-name=vanguardtrace`
- SPA rewrite config: `public/_routes.json`
- CI: `.github/workflows/cloudflare-deploy.yml`

GitHub Actions flow:

- Trigger on push to `main` or `production`
- Trigger on pull request to `main`
- `npm ci`
- `npm run lint`
- `npm run build`
- Validate Cloudflare credentials on push events
- Deploy `dist` via Wrangler Pages

Important operational note:

The workflow will fail before deploy if lint fails, even when the build itself would otherwise succeed.

## 13. Environment And Mode Switching

Supabase readiness is derived from:

- `VITE_ENABLE_SUPABASE`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY`
- Optional `VITE_SUPABASE_STORAGE_BUCKET`

Behavior model from `src/lib/supabase.js`:

- If no meaningful credentials are present, the client is not created
- Placeholder strings such as `your_url` and `your_anon_key` are scrubbed out
- Some services fall back to demo/local behavior
- Auth does not currently have a demo fallback path

This creates a partially live-capable architecture rather than a pure offline/demo architecture.

## 14. What Is Fully Working vs Prepared vs Missing

### Clearly Working In Current Source

- React SPA routing
- Protected navigation model
- Login/sign-up UI tied to Supabase auth
- Tracking summary and per-code lookup with demo/live fallback
- Contact form submission with validation and Supabase/local fallback
- Cloudflare Pages build and deploy flow
- Baseline Supabase schema and policies

### Prepared In Service Layer But Not Fully Surfaced In UI

- Customer profile reads/upserts
- Report creation and listing
- Message listing and direct send operations
- File uploads to Supabase Storage
- Admin dashboard aggregate snapshot

### Not Yet Present As Full Product Workflows

- Real-time subscriptions
- Webhooks/event ingestion
- External carrier integrations
- Search/filter-heavy operational tooling
- Admin control panel UI
- Report management UI
- Upload/document center UI
- Privacy and terms pages behind the footer anchors
- A production-grade unauthenticated demo mode

## 15. Known Constraints And Behavioral Gaps

1. Auth is effectively mandatory for route access even though the repo messaging emphasizes demo mode.
2. Home page tracking input is currently visual only and does not connect to the tracking workflow.
3. Footer privacy/terms links are anchors, not routed legal pages.
4. Several service-layer capabilities exist without corresponding page-level integration.
5. Cloudflare deployment docs mention future Worker possibilities, but the actual implemented backend path is Supabase.
6. The route shell is comprehensive, but much of the operational data is still static placeholder content.

## 16. Security And Data Handling Posture

Positive signs in current repo:

- Row Level Security is enabled across core tables
- Public message submission is constrained by policy intent
- The README explicitly warns against storing passwords or sensitive payment secrets
- Service-role usage is kept out of the frontend

Things to keep in mind:

- Public contact insertion is intentionally open and should eventually add abuse controls
- Frontend-only auth flows depend on correct Supabase project configuration
- Storage policies beyond app-side upload helpers are not defined in this repo and must be managed in Supabase

## 17. Architectural Summary In One Shot

VanguardTrace.site is a modern React 19 logistics intelligence SPA deployed to Cloudflare Pages and backed directly by Supabase for authentication, persistence, and storage.

The codebase is already structured like a product platform: protected route shell, branded monitoring UI, service abstractions, deploy automation, and a baseline database schema with RLS. But the implementation depth is uneven by design. Tracking, contact, and auth are the main integrated flows today; the rest of the app establishes the platform surface area and service contracts for future expansion.

In short:

- This is a real source repo, not a mirrored website snapshot
- The frontend architecture is current and maintainable
- The backend model is integrated through Supabase, not a custom API server
- The deployment path is Cloudflare Pages with GitHub Actions automation
- The project is already highly structured, but still mid-transition from branded product shell to fully integrated logistics platform

## 18. If You Want The Next Layer

Natural follow-up deliverables from this repo would be:

1. A route-by-route functionality matrix with exact data sources, auth requirements, and live/demo behavior
2. A service-by-service integration map showing which UI surfaces consume each Supabase table and which are still unused
3. A gap-closure plan that preserves the current architecture and only adds the missing integrations needed to make the whole platform feel complete
