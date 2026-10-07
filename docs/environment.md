# Environment variables

The application reads these names from the process environment. This page lists names only. Do not put values in git.

`.gitignore` ignores every file that matches `.env*`.

The names below come from the code. This page does not claim that every name is present on Vercel today.

## Where a name is set

| Place | Use |
| --- | --- |
| `.env.local` in the repo root | Local values. `next dev` loads this file. |
| Vercel project `jamiegray.net` | Deployed values. The team slug is `sirjamesgrays-projects`. Production reads the Production target. A preview deploy reads the Preview target. |
| Host | `NODE_ENV` only. Next.js sets it. Do not set `NODE_ENV` in `.env.local`. |

`VERCEL_TOKEN`, `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID` are names this repo reads. They are not the automatic Vercel system variables.

## Names

| Name | Need | Where it is set | What reads it |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | `.env.local` and the Vercel project | `lib/supabase/*`, `proxy.ts`, auth routes, the Calendly webhook |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | `.env.local` and the Vercel project | Same readers as the Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for admin, webhooks, and the cron | `.env.local` and the Vercel project | `lib/supabase/admin.ts`, Calendly webhook, `scripts/seed-test-data.ts`, `scripts/cleanup-opted-out.ts` |
| `STRIPE_SECRET_KEY` | Required when code imports `lib/stripe.ts` | `.env.local` and the Vercel project | `lib/stripe.ts` throws when the name is missing |
| `STRIPE_WEBHOOK_SECRET` | Required for the Stripe webhook outside local override | `.env.local` and the Vercel project | `getWebhookSecret()` in `lib/stripe.ts` |
| `STRIPE_WEBHOOK_SECRET_LOCAL` | Optional | `.env.local` | Used only when `NODE_ENV` is `development` and this name is set |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | Required for the Calendly webhook | `.env.local` and the Vercel project | `app/api/webhooks/calendly/route.ts` returns 503 when the name is missing |
| `RESEND_API_KEY` | Optional | `.env.local` and the Vercel project | `lib/email/resend.ts`. Email send is skipped when the name is missing |
| `EMAIL_FROM` | Optional | `.env.local` and the Vercel project | `lib/email/resend.ts`. The file uses a built-in sender when the name is missing |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | `.env.local` and the Vercel project | Login page and start-project page. The widget renders when the name is set |
| `TURNSTILE_SECRET_KEY` | Optional | `.env.local` and the Vercel project | `lib/turnstile.ts`. Verification is skipped when the name is missing |
| `NEXT_PUBLIC_GA_ID` | Optional | `.env.local` and the Vercel project | `app/layout.tsx` |
| `CRON_SECRET` | Required on Production for the cron | Vercel project. Optional in `.env.local` | `app/api/cron/telemetry-snapshot/route.ts` |
| `VERCEL_TOKEN` | Optional | Vercel project | Cron visitor count. The count stays 0 when any of the three Vercel names is missing |
| `VERCEL_TEAM_ID` | Optional | Vercel project | Same cron reader |
| `VERCEL_PROJECT_ID` | Optional | Vercel project | Same cron reader |
| `HELM_TELEMETRY_URL` | Optional | Vercel project. Optional in `.env.local` | `lib/telemetry/helm.ts`. The file uses a built-in URL when the name is missing |
| `HELM_INGEST_TOKEN` | Optional | Vercel project. Optional in `.env.local` | `lib/telemetry/helm.ts`. The push is skipped when the name is missing |
| `RECRUITER_SESSION_SECRET` | Required for recruiter sessions | `.env.local` and the Vercel project | `lib/recruiter-auth.ts` throws when the name is missing |
| `PORTFOLIO_PASSWORD` | Required for the creative portfolio check | `.env.local` and the Vercel project | `app/api/creative-portfolio/verify/route.ts` throws when the name is missing |
| `ENABLE_DEV_LOGIN` | Local only | `.env.local` | `app/api/auth/dev-login/route.ts`. Set the value to `true`. The route also requires `NODE_ENV` `development` |
| `NEXT_PUBLIC_DEV_LOGIN_ENABLED` | Local only | `.env.local` | `app/login/page.tsx`. Set the value to `true` to show the dev login control |
| `DATABASE_URL` | Script only | `.env.local` | `scripts/run-migration.ts`. The Next.js app does not read this name |
| `NODE_ENV` | Host | Next.js and Vercel | `next dev` sets `development`. A Production deploy sets `production` |

Do not set `ENABLE_DEV_LOGIN` or `NEXT_PUBLIC_DEV_LOGIN_ENABLED` on the Production target.
