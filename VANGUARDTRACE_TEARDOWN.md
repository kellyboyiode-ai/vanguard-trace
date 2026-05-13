# Vanguard Trace End-to-End Technical Teardown

This document is the repo-accurate, source-level equivalent of a full architecture and behavior teardown.

It uses the same structured style as a deep mirrored-site analysis, but it is updated for the real Vanguard Trace codebase as it exists today.

The key truth is:

This is a modern React single-page application with a real source tree, a Cloudflare Pages deployment target, and an optional Supabase-backed live mode.
The UI shell is fully implemented.
Several workflows already talk to live backend services.
Some surfaces are still dashboard-grade scaffolding or static product framing rather than complete operational modules.

## 1. Project Identity And Scope

Repository root:

- `vanguard-trace`

Deployment identity:

- Cloudflare Pages project: `vanguardtrace`
- Live domain target: `vanguardtrace.site`

Project type:

- React 19 single-page application
- Vite 8 frontend build
- Cloudflare Pages static hosting target
- Optional Supabase backend for auth, database, and storage

This is not a mirrored production snapshot.
This is a source repository with components, services, routes, styling, schema, and deployment configuration.

## 2. Repository Information Architecture

Top-level structure:

- `public/`: static files copied as-is into build output
- `scripts/`: repo automation utilities
- `src/`: all frontend application code
- `supabase/`: schema and local Supabase config

Important top-level files:

- `index.html`: Vite HTML shell
- `package.json`: scripts and dependency contract
- `vite.config.js`: Vite plugins and build config
- `tailwind.config.js`: Tailwind content scan config
- `wrangler.toml`: Cloudflare Pages config
- `README.md`: setup and architecture overview
- `VANGUARDTRACE_COMPLETE_GUIDE.md`: long-form system guide
- `VANGUARDTRACE_TEARDOWN.md`: this repo-accurate technical teardown
- `CLOUDFLARE_DEPLOYMENT.md`: deployment instructions

Main source grouping under `src/`:

- `components/`: reusable UI elements
- `context/`: auth context and hooks
- `data/`: static content and seeded UI content
- `layouts/`: app shell layout
- `pages/`: route surfaces
- `services/`: Supabase-facing and feature service layer
- `store/`: Zustand client state
- `styles/`: page and component CSS
- `animations/`: motion presets and page animation variants
- `lib/`: infrastructure helpers such as Supabase client bootstrapping

## 3. Core Technology Stack

Current runtime stack from `package.json`:

- `react` `^19.2.6`
- `react-dom` `^19.2.6`
- `react-router-dom` `^7.15.0`
- `@supabase/supabase-js` `^2.105.4`
- `framer-motion` `^12.38.0`
- `three` `^0.184.0`
- `@react-three/fiber` `^9.6.1`
- `lucide-react` `^1.14.0`
- `react-hook-form` `^7.75.0`
- `@hookform/resolvers` `^5.2.2`
- `zod` `^4.4.3`
- `recharts` `^3.8.1`
- `zustand` `^5.0.13`
- `tailwindcss` `^4.3.0`
- `@tailwindcss/vite` `^4.3.0`

Developer tooling:

- `vite` `^8.0.12`
- `@vitejs/plugin-react` `^6.0.1`
- `eslint` `^10.3.0`
- `prettier` `^3.5.3`
- `wrangler` `^4.90.0`

This is a current-generation frontend stack, not a legacy jQuery or server-rendered HTML system.

## 4. Runtime Architecture

Startup flow:

1. `index.html` provides the Vite mount shell.
2. `src/main.jsx` mounts the React tree into `#root`.
3. The app renders inside `BrowserRouter`.
4. `src/App.jsx` wraps the route tree in `AuthProvider`.
5. `AuthProvider` checks Supabase session state if Supabase is ready.
6. Protected routes render only when a session exists.
7. Unauthenticated users are redirected to `/login`.

Architectural consequence:

The repo documentation describes a frontend-only demo path, but the actual route tree is still centered on authenticated access for all major product pages.
That means demo mode currently preserves service fallbacks, not anonymous product navigation.

## 5. Route And Page Information Architecture

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
- `/about`
- `/traces`
- `/settings`

Fallback route:

- `*` -> `NotFoundPage`

Navigation model:

- Centralized in `src/data/navigation.js`
- Rendered in `src/components/Navbar.jsx`
- Shared shell provided by `src/layouts/ShellLayout.jsx`

This is a route-driven SPA with a consistent product shell rather than a page-per-file HTML site.

## 6. Shared Shell, Layout, And Styling System

Shared UI shell includes:

- top bar with page title and eyebrow label
- primary navigation links
- logout action
- hero-style content wrapper
- global footer

Styling architecture is mixed but intentional:

- Tailwind 4 is available and used heavily on auth surfaces
- Dashboard and feature pages rely on custom CSS in `src/App.css` and `src/styles/*`
- Global tokens and typography live in `src/index.css`

Typography and visual direction:

- `Orbitron` for display headings
- `JetBrains Mono` and `IBM Plex Mono` for UI and console-like surfaces
- warm neutral background with logistics-console accent colors
- glass panels, gradients, and operational dashboard styling rather than generic SaaS defaults

## 7. Visual, Motion, And Frontend Presentation Layer

Primary branded visual surface:

- `src/components/VanguardHeroScene.jsx`

Animation support:

- `src/animations/motionPresets.js`
- `src/animations/vanguardTraceMotion.js`

Current behavior:

- Framer Motion powers reveal and UI motion
- hero image and content tags come from `src/data/vanguardTraceContent.js`
- operations-map style visuals are DOM/CSS driven

Important nuance:

`three` and `@react-three/fiber` are installed, but the current hero implementation shown in source is not a live 3D canvas experience.
The codebase has 3D-capable dependencies, but the shipped branded hero is still motion-driven UI rather than a deeply integrated WebGL scene.

## 8. Functional Features (User-Facing)

### A. Authentication

Implemented in:

- `src/pages/LoginPage.jsx`
- `src/pages/SignupPage.jsx`
- `src/services/authService.js`

Behavior:

- email/password sign-in through Supabase Auth
- email/password sign-up through Supabase Auth
- inline error rendering from Supabase responses
- success guidance after signup for email confirmation

Operational reality:

- if Supabase auth is not configured, login and signup cannot function
- auth is currently required for access to all primary product routes

### B. Overview Dashboard

Implemented in:

- `src/pages/OverviewPage.jsx`

Behavior:

- renders headline KPI cards
- renders a live-events style feed
- links the user into tracking flow

Data source:

- static data from `src/data/dashboardData.js`

Current state:

- polished visual dashboard
- not yet wired to live analytics or admin snapshot data

### C. Home Experience

Implemented in:

- `src/pages/Home.jsx`
- `src/components/VanguardHeroScene.jsx`

Behavior:

- animated hero section
- static shipment tracking form UI
- services module cards
- simulated operations coverage map
- static intelligence metrics

Important nuance:

- the tracking form on this page is presentation-only
- it calls `event.preventDefault()` and does not invoke tracking lookup services

### D. Tracking

Implemented in:

- `src/pages/Tracking.jsx`
- `src/services/trackingService.js`

Behavior:

- loads summary counters on mount
- looks up shipment by tracking code
- reports whether result came from `supabase` or `demo`
- renders tracking result with code, status, location, and ETA

Live behavior:

- reads from `public.shipments` in Supabase

Demo fallback:

- uses built-in demo shipment rows when live data is unavailable

Built-in sample tracking codes:

- `VGX-44591`
- `VGX-20391`
- `VGX-44291`

This is one of the most complete live workflows in the app today.

### E. Contact

Implemented in:

- `src/pages/Contact.jsx`
- `src/services/contactService.js`

Behavior:

- captures `name`, `email`, `subject`, and `message`
- validates required values in service layer
- inserts message into Supabase when configured
- falls back to demo/local acceptance when live backend is unavailable
- changes success copy depending on source

What is not present:

- captcha
- email delivery pipeline
- CRM integration
- ticket routing or threaded support workflow

### F. Operations

Implemented in:

- `src/pages/Operations.jsx`
- `src/services/operationsService.js`
- `src/store/uiStore.js`

Behavior:

- renders an operations queue
- supports a critical-only filter using Zustand UI state
- can load grouped queue items from `operations_events`
- exposes a file upload control

Operational reality:

- queue data can be live
- surrounding workflow is still dashboard-grade rather than full task orchestration

### G. Intel

Implemented in:

- `src/pages/Intel.jsx`
- `src/services/intelService.js`

Behavior:

- renders active alert board
- calculates high-risk corridor count
- charts weekly risk trend with Recharts

Live behavior:

- reads from `intel_alerts`
- derives alert severity from numeric `risk_score`

Fallback behavior:

- uses static seeded alerts and trend values

### H. Services

Implemented in:

- `src/pages/Services.jsx`

Behavior:

- displays service health cards
- shows p95 latency bar chart
- renders an SLO snapshot list

Operational reality:

- this page is currently static and presentation-led
- no live service health backend is wired in the current implementation

### I. Traces

Implemented in:

- `src/pages/TracesPage.jsx`
- `src/services/tracesService.js`

Behavior:

- displays route medians under watch
- draws route median trends with Recharts
- exposes file upload control

Live behavior:

- reads from `trace_events`
- computes medians by route and time bucket in client-side service layer

Fallback behavior:

- uses local demo telemetry arrays

### J. Settings

Implemented in:

- `src/pages/SettingsPage.jsx`
- `src/services/settingsService.js`

Behavior:

- uses React Hook Form with Zod validation
- loads user settings from `customer_settings`
- saves alert threshold, retention period, preferred corridor, and digest flag
- shows toast feedback on save

Important nuance:

- this page reads `userId` from Zustand auth store, while the main auth gate is driven by `AuthContext`
- unless the auth store is hydrated elsewhere, settings can behave as if the user is unsigned even when route access is allowed

This is a real integration gap in the current architecture.

### K. About

Implemented in:

- `src/pages/About.jsx`

Behavior:

- static mission, product framing, and enterprise integration copy

## 9. Service Layer And Data Flow

Current service modules in `src/services/`:

- `authService.js`
- `trackingService.js`
- `contactService.js`
- `customersService.js`
- `reportsService.js`
- `messagesService.js`
- `uploadsService.js`
- `adminService.js`
- `settingsService.js`
- `intelService.js`
- `operationsService.js`
- `tracesService.js`

Observed integration pattern:

- page components call service functions
- services talk directly to Supabase client
- most services degrade to local/demo mode when Supabase is not ready
- no custom API server exists between frontend and Supabase

This means the repo is using frontend-to-Supabase integration directly rather than frontend-to-custom-backend-to-database.

## 10. Backend And Integration Surface

Current backend classes actually used by the app:

- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Row Level Security

What is not currently present in the repo:

- custom REST API server
- Express app
- Next.js API routes
- Cloudflare Worker API implementation
- server-side job processor

This is a frontend-first architecture with direct managed-backend integration.

## 11. Supabase Schema And Data Contract

The schema in `supabase/schema.sql` creates these core tables:

- `customers`
- `shipments`
- `reports`
- `messages`
- `uploads`
- `saved_reports`
- `operations_events`
- `intel_alerts`
- `trace_events`
- `customer_settings`

It also includes:

- `pgcrypto` extension enablement
- `updated_at` touch triggers for mutable tables
- RLS enablement on core tables
- ownership and public-insert policies
- indexes for tracking, status, and analytics-style queries
- seed shipment rows for demo tracking lookups

Current schema posture is credible and aligned with the intended app surface.
The data model is ahead of the actual UI coverage, which is a good sign for expansion.

## 12. File Upload And Storage Reality

Upload UI:

- `src/components/FileUpload.jsx`

Storage helper:

- `src/services/uploadsService.js`

Behavior:

- user selects a file
- app uploads it directly to the configured Supabase Storage bucket
- success or error state is shown inline

Important nuance:

- the current upload flow does not also insert upload metadata into the `uploads` SQL table
- storage and relational upload history are therefore not yet fully integrated end-to-end

## 13. State Management Model

The app uses three state strategies:

- React local state for most page interactions
- React context for session access
- Zustand for supplemental client state

Zustand stores:

- `authStore.js`
- `shipmentStore.js`
- `uiStore.js`

Current architectural issue:

- auth truth is split between `AuthContext` and `authStore`
- route protection uses context
- some page logic uses store state
- this can create drift and inconsistent behavior

If this project is being pushed toward a highly integrated production state, unifying auth ownership is one of the most important cleanup steps.

## 14. Runtime Behavior: What Works Live vs What Is Still Shell-Level

Already functional with real backend support:

- sign in
- sign up
- sign out
- tracking summary
- tracking lookup
- contact submission
- operations queue reads
- intel alert reads
- trace analytics reads
- settings load/save
- direct file upload to Supabase Storage

Present but mostly static or incomplete:

- overview dashboard metrics
- home page tracking form
- services health data
- admin dashboard exposure in UI
- reports workflow in UI
- messages inbox workflow in UI
- customer profile management in UI
- upload metadata/history view

This is not a fake shell, but it is not yet a fully integrated logistics operations platform either.

## 15. Dependency And Operational Details

Current npm scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run format`
- `npm run format:check`
- `npm run deploy`
- `npm run deploy:preview`
- `npm run auto-commit`
- `npm run auto-commit:once`

Environment variables for live mode:

- `VITE_ENABLE_SUPABASE`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_STORAGE_BUCKET`

Supabase readiness rules:

- placeholder env values are stripped out
- live mode activates when valid credentials are present
- services fall back when client is unavailable

## 16. Deployment Model

Current deployment target:

- Cloudflare Pages

Key config files:

- `vite.config.js`
- `wrangler.toml`
- `public/_routes.json`
- `public/_headers`
- `.github/workflows/cloudflare-deploy.yml`

Wrangler config currently specifies:

- project name `vanguardtrace`
- build output `dist`
- compatibility date `2024-12-16`
- `nodejs_compat` flag

CI/CD posture:

- local `npm run build` passes
- local `npm run lint` passes
- editor diagnostics currently flag GitHub Actions context access warnings around Cloudflare secret fallbacks, which is an operational cleanup item rather than an application build failure

## 17. Performance And Complexity Characteristics

Observed build behavior:

- production build succeeds
- main JS bundle is large, roughly `1.09 MB` before gzip in the current build output
- Vite warns that chunks exceed the default warning limit

Likely causes:

- route tree ships largely as one application bundle
- charting, motion, iconography, and 3D-capable dependencies are bundled together

Implication:

- app is healthy enough to build and deploy now
- route-level code splitting is one of the clearest next technical optimizations

## 18. Security And Operational Risk Notes

Current positives:

- Supabase keys are expected via env vars rather than hardcoded in source
- RLS is enabled in schema
- contact form allows limited public insert behavior instead of broad table access

Current cautions:

- auth requirement and demo-mode messaging are not fully aligned
- split auth ownership can create subtle permission UX issues
- storage uploads are not fully reconciled to upload metadata table
- footer contains placeholder privacy/terms anchors rather than real policy routes

## 19. Architectural Summary In One Shot

This project is:

- a real source-based React + Vite application
- visually positioned as a logistics intelligence and freight tracking platform
- deployed to Cloudflare Pages
- optionally backed by Supabase for auth, data, and storage
- partially integrated today, with several real workflows already live-capable
- still evolving from branded operational dashboard into a more complete product system

The best exact description is:

Vanguard Trace is not a static mirror, not a legacy site, and not just a landing page.
It is a modern frontend platform with a real service layer, real auth/data integration points, and a solid deployment model, but it still contains several dashboard-grade surfaces and a few architectural gaps that need to be closed to make it fully integrated end-to-end.

## 20. Best Next Upgrade Path

If the goal is the best, updated, and highly integrated version of this project, the highest-value next steps are:

1. Unify auth ownership so both route protection and page persistence use the same source of truth.
2. Make demo mode and route access consistent so frontend-only previews do not dead-end at auth.
3. Replace static Overview and Services metrics with live service-backed aggregations.
4. Connect uploads to both Storage and the `uploads` metadata table.
5. Surface reports, messages, customers, and admin snapshot helpers in real UI routes.
6. Introduce route-level code splitting to reduce the large initial JS bundle.
7. Replace footer placeholder links with real content routes or policies.

That path would move Vanguard Trace from a strong product shell with selected live workflows into a cohesive, production-grade integrated platform.
