# VanguardTrace Complete System Guide

This document is the exhaustive project-level reference for the current Vanguard Trace repository and its live deployment shape.

It covers:

- what the project is
- how it starts and runs
- every route and page
- every major component and service
- all required environment/configuration pieces
- Supabase schema and data flow
- Cloudflare deployment behavior
- current feature coverage, scaffolding, and gaps

## 1. Project Identity

Project name:

- `vanguard-trace` in the repository
- `vanguardtrace` as the Cloudflare Pages project name
- `vanguardtrace.site` as the production domain

Project type:

- React single-page application
- Vite-based frontend build
- Cloudflare Pages deployment target
- Optional Supabase backend integration for auth, database, and storage

This is a source repository, not a mirrored production snapshot.

## 2. High-Level Architecture

The current architecture is:

- Browser -> React SPA
- React Router handles client-side navigation
- Auth state is provided through Supabase Auth when configured
- Protected pages are wrapped in an auth gate
- Some features use live Supabase data
- Other features fall back to hardcoded demo/local behavior
- Static hosting is handled by Cloudflare Pages

There is no custom Node backend, Express server, or Cloudflare Worker API implemented in this repository.

## 3. Technology Stack

Runtime and app libraries from `package.json`:

- `react` `^19.2.6`
- `react-dom` `^19.2.6`
- `react-router-dom` `^7.15.0`
- `framer-motion` `^12.38.0`
- `lucide-react` `^1.14.0`
- `three` `^0.184.0`
- `@react-three/fiber` `^9.6.1`
- `react-type-animation` `^3.2.0`
- `@supabase/supabase-js` `^2.105.4`
- `tailwindcss` `^4.3.0`
- `@tailwindcss/vite` `^4.3.0`

Tooling:

- `vite` `^8.0.12`
- `@vitejs/plugin-react` `^6.0.1`
- `eslint` `^10.3.0`
- `@eslint/js` `^10.0.1`
- `eslint-plugin-react-hooks` `^7.1.1`
- `eslint-plugin-react-refresh` `^0.5.2`
- `prettier` `^3.5.3`
- `wrangler` `^4.90.0`

## 4. Repository Structure

Top-level directories and their roles:

- `public/`: static assets that ship as-is, including Cloudflare Pages SPA routing config
- `scripts/`: local automation scripts such as git auto-commit
- `src/`: application source code
- `supabase/`: Supabase local config and SQL schema
- `.github/workflows/`: CI/CD automation

Important top-level files:

- `index.html`: Vite HTML entry shell
- `package.json`: scripts and dependencies
- `vite.config.js`: Vite plugin configuration
- `tailwind.config.js`: Tailwind content scanning config
- `postcss.config.js`: intentionally empty object for this setup
- `eslint.config.js`: ESLint flat config
- `wrangler.toml`: Cloudflare Pages configuration
- `README.md`: primary setup and architecture summary
- `CLOUDFLARE_DEPLOYMENT.md`: Cloudflare deployment instructions

## 5. Startup And Runtime Flow

Application startup path:

1. `index.html` mounts a `div` with id `root`
2. `src/main.jsx` renders the React app inside `BrowserRouter`
3. `src/App.jsx` wraps the route tree in `AuthProvider`
4. `AuthProvider` reads Supabase session state if Supabase is ready
5. Protected routes render only when a session exists
6. Unauthenticated users are redirected to `/login`

Important runtime consequence:

Although the repo documents a demo/live progression, the actual page access model is still centered on authenticated sessions for all main routes. Without a valid session, users remain on the auth surfaces.

## 6. HTML Shell And Metadata

`index.html` defines:

- `<!doctype html>` HTML5 document
- charset UTF-8
- viewport meta for responsive layout
- description meta for SEO
- canonical URL set to `https://vanguardtrace.site`
- Open Graph title/description/type/url
- page title `VanguardTrace`
- favicon reference to `/favicon.svg`
- module entry script `/src/main.jsx`

This means the app relies on client rendering after an SEO-friendly static shell loads.

## 7. Environment Variables Required For Live Mode

From `.env.example` and the Supabase client:

- `VITE_ENABLE_SUPABASE=false`
- `VITE_SUPABASE_URL=`
- `VITE_SUPABASE_ANON_KEY=`
- `VITE_SUPABASE_STORAGE_BUCKET=documents`

Additional alias supported by code:

- `VITE_SUPABASE_PUBLISHABLE_KEY`

Supabase readiness logic:

- If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist, Supabase auto-enables
- `VITE_ENABLE_SUPABASE=true` also indicates intent to run live mode
- Placeholder values such as `your_url` or `your_anon_key` are scrubbed out
- If credentials are missing, the Supabase client is not created

## 8. Scripts You Need To Run The Project

From `package.json`:

- `npm run dev`: start Vite development server
- `npm run build`: create production build in `dist`
- `npm run preview`: preview the Vite production build locally
- `npm run lint`: run ESLint across the project
- `npm run format`: write formatting changes with Prettier
- `npm run format:check`: verify Prettier formatting
- `npm run deploy`: build and deploy to Cloudflare Pages project `vanguardtrace`
- `npm run deploy:preview`: build and deploy preview branch to Cloudflare Pages
- `npm run auto-commit`: watch repo changes and auto-commit repeatedly
- `npm run auto-commit:once`: do a single auto-commit check

## 9. What It Takes For The Project To Work

### Local frontend-only run

Minimum requirements:

- Node.js installed
- npm available
- dependencies installed via `npm install`

Then:

- `npm run dev`

This is enough to start the SPA locally, but protected pages still depend on session logic.

### Live Supabase-backed run

You also need:

- a Supabase project
- valid Supabase URL and anon key
- schema applied from `supabase/schema.sql`
- a storage bucket named `documents` or a matching bucket name via env var
- at least one auth user if you want to sign in

### Production deployment

You also need:

- Cloudflare account
- Cloudflare Pages project named `vanguardtrace`
- Pages custom domain for `vanguardtrace.site` if using the live domain
- GitHub Actions secrets or variables for Cloudflare token and account ID if using CI deployment

## 10. Route Inventory

Actual route map in `src/App.jsx`:

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

Fallback route:

- `*` -> `NotFoundPage`

Exported but not routed page:

- `About.jsx`

## 11. Page-By-Page Breakdown

### LoginPage

File:

- `src/pages/LoginPage.jsx`

What it does:

- collects email and password
- calls `signInWithEmail(email, password)`
- shows inline error state
- navigates to `/` on success

Dependencies:

- React state
- `useNavigate`
- `authService`

### SignupPage

File:

- `src/pages/SignupPage.jsx`

What it does:

- collects email, password, confirm password
- validates that password and confirm match
- calls `signUpWithEmail(email, password)`
- shows success message instructing email confirmation

Dependencies:

- React state
- `authService`

### OverviewPage

File:

- `src/pages/OverviewPage.jsx`

What it does:

- renders dashboard stat cards using `dashboardStats`
- renders event feed using `traceFeed`
- offers CTA button into `/tracking`

Data source:

- static data from `src/data/dashboardData.js`

### Home

File:

- `src/pages/Home.jsx`

What it does:

- renders the animated hero scene
- renders a shipment tracking input UI
- renders service feature cards
- renders a simulated operations map
- renders intelligence metrics and risk alert banner

Important nuance:

- the tracking form on this page is presentation-only
- it calls `event.preventDefault()` and does not invoke the tracking service

### Tracking

File:

- `src/pages/Tracking.jsx`

What it does:

- loads a summary snapshot on mount
- tracks shipment by code through a submit form
- shows whether data came from live Supabase or demo fallback
- renders result card with tracking code, status, location, and ETA

Default sample state:

- initial code `VGX-44591`
- initial example values for verified Rotterdam shipment

Dependencies:

- `getTrackingSummary()`
- `getTrackingByCode()`
- `ShellLayout`

### Operations

File:

- `src/pages/Operations.jsx`

What it does:

- renders static operations queue items
- shows counts for reroute approvals, customs checks, and carrier audits

Current state:

- styled and navigable
- not wired to backend data

### Services

File:

- `src/pages/Services.jsx`

What it does:

- renders static service health panel
- shows monitoring API, risk engine, and webhook gateway status

Current state:

- styled and navigable
- not wired to backend data

### Intel

File:

- `src/pages/Intel.jsx`

What it does:

- renders static intelligence metrics
- shows advisory count, corridor risk count, and sync recency

Current state:

- styled and navigable
- not wired to backend data

### Contact

File:

- `src/pages/Contact.jsx`

What it does:

- collects name, email, subject, and message
- submits through `submitContactSubmission()`
- resets form on success
- shows different success language for live vs demo mode
- shows error state if submission fails

### TracesPage

File:

- `src/pages/TracesPage.jsx`

What it does:

- renders a list of routes under watch
- shows example performance-like route stats for `/checkout`, `/search`, `/account`

Important nuance:

- this page reads more like application performance tracing than shipment trace history
- it is currently static and not connected to logistics data

### SettingsPage

File:

- `src/pages/SettingsPage.jsx`

What it does:

- renders static setting values such as alert threshold, weekly digest, and trace retention

Current state:

- not wired to persistence or profile settings

### NotFoundPage

File:

- `src/pages/NotFoundPage.jsx`

What it does:

- renders a branded 404 state
- offers a `Return home` link to `/`

### About

File:

- `src/pages/About.jsx`

What it does:

- presents company/mission marketing content
- outlines mission, what the platform does, and enterprise integration claims

Current state:

- present in source
- exported from `src/pages/index.js`
- not connected to the route tree

## 12. Layout And Navigation

### ShellLayout

File:

- `src/layouts/ShellLayout.jsx`

Responsibilities:

- renders topbar
- renders eyebrow, page title, description
- includes `Navbar`
- wraps page content inside main content area

### Navbar

File:

- `src/components/Navbar.jsx`

Responsibilities:

- renders primary app navigation via `NavLink`
- consumes `navigationLinks` from `src/data/navigation.js`
- applies active-link styling automatically

Navigation destinations:

- `/`
- `/home`
- `/tracking`
- `/operations`
- `/services`
- `/intel`
- `/contact`
- `/traces`
- `/settings`

### Footer

File:

- `src/components/Footer.jsx`

Responsibilities:

- renders brand footer and tagline
- includes hardcoded navigation and service links
- includes account links for settings plus hash anchors for privacy and terms

Important nuance:

- footer legal links point to `#privacy` and `#terms`, not dedicated routed pages
- footer uses plain anchor tags, not `NavLink`

## 13. Auth System

### AuthContext

File:

- `src/context/AuthContext.jsx`

Responsibilities:

- stores `user`, `session`, and `loading`
- reads initial Supabase session
- subscribes to Supabase auth state changes
- exposes auth state through context provider

Key behavior:

- initial loading state is derived from `supabaseState.ready`
- if Supabase is not ready, the effect returns immediately
- session remains null when auth is unavailable

### useAuth

File:

- `src/context/useAuth.jsx`

Responsibilities:

- returns auth context
- throws if used outside `AuthProvider`

### ProtectedRoute

File:

- `src/components/ProtectedRoute.jsx`

Responsibilities:

- shows loading spinner while auth is resolving
- redirects to `/login` when no session exists
- renders protected content when session exists

## 14. Component Inventory

### Presentational components

- `SectionHeader.jsx`: reusable section title and subtitle wrapper
- `StatCard.jsx`: KPI card with label and value
- `TraceFeedItem.jsx`: feed row with title, description, and status

### Interactive / specialized components

- `Navbar.jsx`: primary navigation
- `Footer.jsx`: global footer
- `ProtectedRoute.jsx`: auth gate
- `VanguardHeroScene.jsx`: animated visual hero
- `FileUpload.jsx`: upload control for Supabase storage

### FileUpload details

File:

- `src/components/FileUpload.jsx`

What it does:

- renders file input
- uploads selected file using `uploadDocument(filePath, file)`
- tracks `uploading`, `success`, and `error` states
- clears the file input after upload attempt

Current state:

- exported from component barrel
- not currently rendered by any routed page

## 15. Data Modules

### `src/data/navigation.js`

Contains navbar destinations.

### `src/data/dashboardData.js`

Contains:

- `dashboardStats`
- `traceFeed`

These populate the Overview dashboard.

### `src/data/vanguardTraceContent.js`

Contains:

- `vanguardTraceHero`
- `terminalEvents`
- `movingNodes`

These power the hero scene copy and animation positions.

### `src/data/index.js`

Acts as a barrel file for navigation, dashboard, and hero content.

## 16. Visual System And Styling

Global design tokens and global styles live in:

- `src/index.css`
- `src/App.css`
- `src/styles/`

Design direction:

- warm neutral background with orange and green radial accents
- display typography via Orbitron
- UI typography via JetBrains Mono
- mono/system backup fonts for operational tone
- glass-like panel styling with soft borders and layered gradients

CSS organization:

- `src/App.css`: shell, layout, stat cards, panels, responsive grid behavior
- `src/styles/navbar.css`: navigation styling
- `src/styles/footer.css`: footer styling
- `src/styles/homeLayout.css`: home page layout and sectional presentation
- `src/styles/trackingLayout.css`: tracking/contact panel form styling
- `src/styles/vanguardTraceHero.css`: hero scene styling
- `src/styles/animations.css`: shared animation styles
- `src/styles/tokens.css`: design token layer
- `src/styles/index.css`: style entry aggregation

## 17. Animation Layer

Animation sources:

- `src/animations/vanguardTraceMotion.js`
- `src/animations/motionPresets.js`
- `src/animations/index.js`

Verified motion behaviors in use:

- `panelReveal`
- `nodeFloat`
- `radarSpin`

Current actual hero implementation:

- Framer Motion + SVG + DOM elements
- animated radar sweep
- floating node pulses
- terminal telemetry lines
- icon dock and route-line map graphics

Dependency nuance:

- `three` and `@react-three/fiber` are installed
- the current checked implementation does not require a Three.js canvas to render the hero

## 18. Service Layer Inventory

All exported services are centralized through `src/services/index.js`.

### authService

File:

- `src/services/authService.js`

Exports:

- `signUpWithEmail`
- `signInWithEmail`
- `signOut`
- `getSession`

Behavior:

- requires Supabase to be configured for active auth operations
- throws if auth is not configured when sign-in or sign-up are attempted
- `getSession()` gracefully returns null session if Supabase is unavailable

### trackingService

File:

- `src/services/trackingService.js`

Exports:

- `getTrackingSummary`
- `getTrackingByCode`

Live behavior:

- queries `shipments` table in Supabase
- counts statuses for summary view
- fetches single shipment by `tracking_code`

Demo behavior:

- returns hardcoded summary counts
- supports demo tracking codes:
  - `VGX-44591`
  - `VGX-20391`
  - `VGX-44291`

### contactService

File:

- `src/services/contactService.js`

Exports:

- `submitContactSubmission`

Behavior:

- trims and validates required fields
- inserts into `messages` table with `channel: 'contact_form'` when live
- returns accepted success locally when Supabase is unavailable

### customersService

File:

- `src/services/customersService.js`

Exports:

- `getCustomerProfile`
- `upsertCustomerProfile`

Behavior:

- reads and writes rows in `customers`
- currently not consumed by a route page

### reportsService

File:

- `src/services/reportsService.js`

Exports:

- `listReports`
- `createReport`

Behavior:

- lists reports ordered by `created_at`
- inserts report rows
- currently not consumed by a route page

### messagesService

File:

- `src/services/messagesService.js`

Exports:

- `listMessages`
- `sendMessage`

Behavior:

- lists messages ordered by `created_at`
- inserts message rows
- currently not consumed by a route page

### uploadsService

File:

- `src/services/uploadsService.js`

Exports:

- `uploadDocument`

Behavior:

- uploads file into Supabase Storage bucket
- bucket defaults to `documents`
- currently only reachable through `FileUpload` component, which is not wired into a page

### adminService

File:

- `src/services/adminService.js`

Exports:

- `getAdminDashboardSnapshot`

Behavior:

- aggregates counts from shipments, pending reports, and unread messages
- returns zeroed local snapshot when Supabase is unavailable
- currently not consumed by a route page

## 19. Supabase Client Layer

File:

- `src/lib/supabase.js`

Responsibilities:

- sanitize environment values
- determine whether Supabase is enabled/configured/ready
- create Supabase client only when credentials are present
- expose readiness helpers

State exposed:

- `supabaseState.enabled`
- `supabaseState.configured`
- `supabaseState.ready`

Helpers:

- `getSupabaseReadinessMessage()`
- `isSupabaseReady()`
- `assertSupabaseReady()`

## 20. Supabase Database Schema

Schema file:

- `supabase/schema.sql`

Tables created:

- `public.customers`
- `public.shipments`
- `public.reports`
- `public.messages`
- `public.uploads`
- `public.saved_reports`

Extensions and functions:

- enables `pgcrypto`
- defines `touch_updated_at()` trigger function

Triggers created:

- customer `updated_at` trigger
- shipment `updated_at` trigger
- report `updated_at` trigger

Indexes created:

- `shipments_tracking_code_idx`
- `shipments_status_idx`
- `reports_status_idx`
- `messages_channel_idx`

Seed data inserted:

- `VGX-44591`
- `VGX-20391`
- `VGX-44291`

## 21. Supabase Row-Level Security Policies

RLS is enabled on:

- `customers`
- `shipments`
- `reports`
- `messages`
- `uploads`
- `saved_reports`

Policies defined:

### customers

- customer can read own profile
- customer can update own profile

### shipments

- authenticated users can read shipments

### reports

- authenticated users can read own reports
- authenticated users can create own reports

### messages

- authenticated users can read own messages
- public users can submit contact form messages

### uploads

- authenticated users can read own uploads
- authenticated users can create own uploads

### saved_reports

- authenticated users can read saved reports
- authenticated users can create saved reports

## 22. Cloudflare Configuration

### `wrangler.toml`

Defines:

- project name `vanguardtrace`
- Pages output directory `dist`
- compatibility date `2024-12-16`
- `nodejs_compat` flag

### `public/_routes.json`

Defines SPA behavior for Cloudflare Pages:

- includes all routes
- excludes `/api/*`, `/_*`, and `/public/*`
- rewrites non-API requests to `/index.html`
- allows future `/api/*` routes to fall through

This is what makes React Router paths work on direct refresh in production.

## 23. GitHub Actions Deployment Workflow

Workflow file:

- `.github/workflows/cloudflare-deploy.yml`

What it does:

- runs on push to `main`
- runs on push to `production`
- runs on PRs targeting `main`
- checks out source
- installs Node `22`
- runs `npm ci`
- runs `npm run lint`
- runs `npm run build`
- validates Cloudflare secrets on push events
- deploys `dist` to Cloudflare Pages using Wrangler

Secrets/variables expected:

- `CLOUDFLARE_API_TOKEN` or `CF_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID` or `CF_ACCOUNT_ID`

Project name used in deploy command:

- `vanguardtrace`

## 24. Auto-Commit Automation

Script file:

- `scripts/auto-commit.mjs`

What it does:

- checks that the repo is a git worktree
- polls git status on an interval
- stages all changes when changes exist
- creates timestamped commit messages
- optionally pushes to remote `origin`

Configurable env vars:

- `AUTO_COMMIT_INTERVAL_MS`
- `AUTO_COMMIT_PUSH`
- `AUTO_COMMIT_REMOTE`

Defaults:

- 30 second interval
- pushing enabled
- remote `origin`

## 25. What Is Fully Implemented Today

Clearly implemented and usable:

- React app shell and route system
- login UI
- signup UI
- session-based protected routes
- overview dashboard shell
- tracking summary and tracking lookup workflow
- contact submission workflow
- Supabase client bootstrapping
- base Supabase schema and RLS policies
- Cloudflare Pages deployment config
- GitHub Actions deployment workflow

## 26. What Exists But Is Only Partially Integrated

Present in code, but not fully connected across the product:

- hero page tracking input on Home
- file upload component
- customer profile service
- reports service
- messages listing/sending service
- admin dashboard aggregation service
- About page content

## 27. What Is Static Or Placeholder Today

Currently static/dashboard-like rather than fully backed by data:

- Operations page
- Services page
- Intel page
- Traces page
- Settings page
- overview KPI/feed content
- much of the Home experience

## 28. Important Gaps And Mismatches

1. The repo presents a demo/live progression, but route access still assumes auth for the main app.
2. `About.jsx` exists but is not routable from `App.jsx`.
3. The Home page tracking form is visual-only and does not call the tracking service.
4. Footer privacy/terms links are hash anchors, not dedicated content pages.
5. Several service modules are implemented without page-level UI integration.
6. Cloudflare deployment docs still discuss future Worker possibilities, but the actual implemented backend pattern is frontend -> Supabase.
7. The installed Three.js stack is not the main rendering path in the checked hero implementation.

## 29. Practical Setup Checklist

If you want the project working end-to-end in its current intended shape, do this:

1. Install Node.js.
2. Run `npm install`.
3. Create `.env` from `.env.example`.
4. Create a Supabase project.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. Optionally set `VITE_ENABLE_SUPABASE=true`.
7. Run `supabase/schema.sql` in Supabase SQL Editor.
8. Create the `documents` storage bucket in Supabase.
9. Create or confirm at least one auth user.
10. Run `npm run dev` and sign in.
11. Verify tracking with seeded shipment codes.
12. Verify contact form submission into `messages`.
13. Run `npm run lint`.
14. Run `npm run build`.
15. Configure Cloudflare Pages project `vanguardtrace`.
16. Set GitHub Actions secrets for Cloudflare if deploying from CI.

## 30. Bottom-Line Summary

Vanguard Trace is a current-generation React + Vite logistics intelligence SPA with a polished branded shell, a working auth gate, live-or-demo tracking, live-or-demo contact submission, and a broader Supabase-backed service foundation that is only partially surfaced in the UI.

What makes the project work today is not one thing but the combination of:

- Vite build and SPA entry setup
- React Router route tree
- Auth provider and protected route enforcement
- Supabase configuration and schema
- Cloudflare Pages rewrite/deploy configuration
- the seeded tracking data and service fallbacks

What is missing is not the core structure. The structure is already there. The missing parts are mainly the remaining UI integrations for services that already exist and the cleanup of mismatches between demo framing and auth-gated runtime behavior.
