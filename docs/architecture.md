# Architecture

jamiegray.net is a Next.js App Router application. The framework version is Next.js 16. The UI uses React 19 and TypeScript. Vercel hosts the application. Supabase provides Postgres, Auth, and Storage.

## Request path

Page routes and route handlers live in `app/`. Shared UI lives in `components/`. Server helpers live in `lib/`.

`proxy.ts` refreshes the Supabase session. A guest who opens `/dashboard` goes to `/login`. The dashboard layout checks the user again.

## Site areas

The public site includes the home page, projects, pricing, contact, experience, resume, experiments, and the design system.

`/start-project` collects a project request. `/for-recruiters` is a recruiter gate. `/creative-portfolio` checks `PORTFOLIO_PASSWORD`.

`/dashboard` is the signed-in area. `isAdmin` in `lib/constants.ts` reads `ADMIN_EMAILS`. An admin opens the admin tools. A client opens projects and payments. An admin can use mirror mode to view the app as a client.

Feature flags live in the `feature_flags` table. The code reads `customer-dashboard` and `active-landing-page`.

## Services

| Service | Role in this repo |
| --- | --- |
| Vercel | Host, Production deploys from `main`, one cron, Web Analytics, Speed Insights |
| Supabase | Postgres, Google OAuth, email one-time code, Storage |
| Stripe | Invoice create, send, and payment webhooks |
| Resend | Transactional email |
| Calendly | Consultation link and booking webhook |
| Cloudflare Turnstile | Bot check on login and on the start-project form |
| Google Analytics | Optional. Loads only when `NEXT_PUBLIC_GA_ID` is set |
| Helm | Daily count telemetry from the cron route |

Auth uses Supabase. The login page offers Google and an email code.

Schema changes live in `supabase/migrations/` (35 SQL files). CRM tables use Row Level Security.

The Storage bucket name is `project-assets`. `next.config.ts` allows public images from the Supabase storage host.

Admin invoice create lives in `app/api/invoices/route.ts`. Quote acceptance can also create a Stripe invoice in `app/api/quotes/[id]/respond/route.ts`.

Email templates live in `emails/`. The Resend client lives in `lib/email/resend.ts`.

Video compositions live in `remotion/`. They are not on the request path.

## Main paths

```text
app/                  pages and route handlers
app/api/              HTTP handlers
components/           UI
lib/                  clients and helpers
emails/               email templates
supabase/migrations/  SQL
remotion/             video compositions
scripts/              local data scripts
vercel.json           cron schedule
proxy.ts              session refresh and dashboard gate
```
