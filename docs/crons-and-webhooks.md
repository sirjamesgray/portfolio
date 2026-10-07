# Crons and webhooks

## Cron

`vercel.json` schedules one cron.

| Path | Schedule | Method |
| --- | --- | --- |
| `/api/cron/telemetry-snapshot` | `0 6 * * *` | `GET` |

The schedule is 06:00 UTC each day.

The route compares the `Authorization` header with `Bearer` plus `CRON_SECRET`.
When `CRON_SECRET` is missing and `NODE_ENV` is not `production`, the route allows the call.
When `CRON_SECRET` is missing in production, the route returns 401.

The route counts projects with `show_on_landing_page` set and no `deleted_at`.
The route counts `activity_log` rows whose action is `project_submitted`.
The route reads a visitor count from the Vercel Web Analytics API.
That call needs `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID`.
The route then posts the counts to Helm.
The post uses `HELM_INGEST_TOKEN`.
The route sends counts only.

## Stripe webhook

Path: `POST /api/webhooks/stripe`

The route reads the `stripe-signature` header.
`stripe.webhooks.constructEvent` checks the body.
The secret comes from `getWebhookSecret()` in `lib/stripe.ts`.
In development, that function uses `STRIPE_WEBHOOK_SECRET_LOCAL` when the name is set.
In other cases, the function uses `STRIPE_WEBHOOK_SECRET`.

| Event | Effect |
| --- | --- |
| `invoice.finalized` | Sets the local invoice status to `sent`. Stores the hosted URL and the PDF URL when `metadata.invoice_id` is present. |
| `invoice.paid` | Sets the local invoice status to `paid`. Adds the paid amount on the project when `metadata.project_id` is present. Inserts an `activity_log` row. |
| `invoice.payment_failed` | Sets the local invoice status to `overdue` when `metadata.invoice_id` is present. |
| `invoice.voided` | Sets the local invoice status to `canceled` when `metadata.invoice_id` is present. |

Any other event type is logged and ignored.

## Calendly webhook

Path: `POST /api/webhooks/calendly`

`GET /api/webhooks/calendly` returns a status object. Calendly can call `GET` to check the endpoint.

The `POST` handler allows 30 calls per minute for one IP.
The handler requires `CALENDLY_WEBHOOK_SIGNING_KEY`.
When that name is missing, the handler returns 503.

The handler reads the `Calendly-Webhook-Signature` header.
The check is HMAC SHA-256 over the timestamp and the raw body.
The compare uses `crypto.timingSafeEqual`.

The handler acts on `invitee.created` only.
Any other event name returns a message and does no write.

On `invitee.created`, the handler finds or creates a contact.
The handler then creates a project with status `consultation`.
The handler then inserts an `activity_log` row.
The handler then sends a guest email and an admin email through Resend.
An email error does not fail the webhook.
