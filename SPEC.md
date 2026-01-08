# Jamie Gray Portfolio & Client Management System

## Overview

A freelance web development portfolio and client management platform that handles the complete client lifecycle: from lead capture through project delivery and payment collection.

**Target Scale:** 5-15 concurrent active projects (busy freelancer)

---

## Architecture

### Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Database:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments:** Stripe (Invoicing, Webhooks)
- **Styling:** Tailwind CSS, shadcn/ui, Magic UI
- **Deployment:** Vercel

### Authentication
- Supabase Auth with OAuth providers
- **Open signup** - clients can register independently and view their projects if any exist
- Admin identified by email allowlist (`lib/constants.ts`)
- Mirror mode allows admin to view dashboard as specific client (with mutation warnings)

---

## Data Model

### Core Entities

#### Projects
The central entity tracking client engagements from lead to completion.

```
projects
├── id (UUID)
├── title
├── status: lead | contacted | in_progress | completed | canceled
├── project_type
├── price (fixed project price)
├── amount_paid
├── end_date
├── github_url
├── vercel_url
├── meeting_time
├── requirements (rich text, collaborative)
├── requirements_updated_at
├── requirements_updated_by
├── user_id (FK → auth.users, nullable for prospecting)
├── contact_id (FK → contacts, nullable for prospecting)
├── accepted_quote_id (FK → quotes)
├── stripe_customer_id
├── cancellation_reason (required when status = canceled)
├── created_at
├── updated_at
```

**Status Flow:**
- Fully flexible - any status can transition to any other
- Admin judgment trusted for status management
- Cancellation requires a reason and allows future reactivation

#### Contacts
Client contact information, can be linked to multiple projects.

```
contacts
├── id (UUID)
├── name
├── email
├── phone
├── company
├── created_at
```

**Multi-project Support:** Multiple contacts can be linked to one project (teams), and one contact can have multiple projects.

#### Quotes
Fixed-price quotes for project work.

```
quotes
├── id (UUID)
├── project_id (FK)
├── status: draft | sent | accepted | rejected | expired
├── title
├── description
├── amount
├── line_items (JSONB)
├── terms
├── valid_until
├── sent_at
├── responded_at
├── created_at
├── updated_at
```

**Quote Behavior:**
- "Sent" status is currently a marker only (email integration planned)
- Quote expiry: Reminder sent X days before `valid_until`, then auto-expires
- **Accepted quote auto-generates a draft invoice** for the same amount

#### Invoices
Stripe-integrated invoicing.

```
invoices
├── id (UUID)
├── project_id (FK)
├── quote_id (FK, optional)
├── stripe_invoice_id
├── stripe_payment_intent_id
├── status: draft | pending | sent | paid | overdue | canceled
├── amount
├── amount_paid
├── due_date
├── paid_at
├── invoice_url
├── invoice_pdf
├── created_at
├── updated_at
```

**Payment Collection:**
- Stripe Smart Retries handles failed payments and dunning
- Webhooks update local invoice status on payment events
- `amount_paid` on project tracks cumulative payments

#### Activity Log
System-generated audit trail (no manual notes).

```
activity_log
├── id (UUID)
├── project_id (FK)
├── action (e.g., quote_sent, invoice_paid, requirements_updated)
├── details
├── created_at
```

#### Requirements Versions
Version history for collaborative requirements editing.

```
requirements_versions
├── id (UUID)
├── project_id (FK)
├── content
├── updated_by (FK → auth.users)
├── updated_by_name
├── created_at
```

#### Files (Planned)
Version-controlled file attachments.

```
files
├── id (UUID)
├── project_id (FK)
├── filename
├── storage_path
├── file_type: asset | document | deliverable
├── version
├── uploaded_by
├── created_at
```

---

## User Roles & Permissions

### Admin
- Full access to all projects, quotes, invoices
- Can create/edit/delete any entity
- Access to analytics dashboard
- Mirror mode to view as any client
- Receives notifications for all project activity

### Client
- **Minimal view** of their projects:
  - Requirements (collaborative editing with version history)
  - Quotes (view, accept/reject)
  - Invoices (view, pay via Stripe)
  - Deliverables (GitHub/Vercel URLs - always visible)
- Cannot see internal admin activity or status changes
- Open signup - auto-linked to projects by email match

---

## Features

### Landing Page
- Public portfolio (manually curated, separate from project system)
- Contact form that **auto-creates a project** in "lead" status
- Service showcase with Magic UI components

### Pricing Model

**Sprint-Based Packages:**
- **1-Week MVP Sprint** - $2,500
  - Landing page or simple app
  - Core functionality only
  - Basic styling
  - Deployed & live
  - Ideal for: Validating an idea quickly

- **2-Week Build Sprint** - $5,000 (Most Popular)
  - Full-featured app or website
  - Custom design implementation
  - Database & authentication
  - Deployed & live
  - Ideal for: Launching a real product

- **3-Week Ship Sprint** - $9,000
  - Complex functionality
  - Integrations & APIs
  - Admin dashboard
  - Performance optimization
  - Deployed & live
  - Ideal for: Comprehensive builds

**All Sprints Include:**
- Daily async updates
- Direct Slack/Discord access
- Source code ownership
- Deployment setup
- 1 week of bug fixes post-launch

**Not Included (Available Separately):**
- Ongoing maintenance (available as retainer)
- Content writing
- SEO optimization
- Marketing strategy

**Retainers:**
- Monthly retainers available for ongoing maintenance, new features, and technical support
- Starting at $1,500/month

### Lead Capture Flow

**Via Start Project Questionnaire:**
1. Visitor completes 3-step questionnaire:
   - Step 1: Sprint type (1-week MVP, 2-week build, or "help me decide")
   - Step 2: Timeline (ASAP, within a month, flexible)
   - Step 3: Free-text description ("What's the idea?")
2. Click "Book a Call" opens Calendly in new tab
   - Calendly captures name/email and creates contact via webhook
   - Project created with meeting_time set
3. If logged in: Project record also created with sprint preference
4. System creates contact record (if new email)
5. System auto-creates project in "lead" status
6. Admin notified of new lead

**Via Calendly Direct Booking:**
1. Invitee schedules via Calendly link
2. Webhook `invitee.created` triggers:
   - Contact created/updated
   - Project created with status: lead, meeting_time set
   - Custom question answers stored in notes
3. If canceled: Webhook `invitee.canceled` sets project status to canceled

### Quote Flow
1. Admin creates quote (pre-filled with "Web Development Services" template)
2. Admin sends quote (requires client email)
3. Client receives notification (email integration planned)
4. Client accepts or rejects via dashboard
5. **On accept:** Draft invoice auto-generated for quote amount
6. Quote expiry reminders sent before `valid_until` date

### Invoice Flow
1. Invoice created (from accepted quote or manually)
2. Admin sends via Stripe (requires client email)
3. Stripe handles delivery, payment collection, retries
4. Webhooks update local status:
   - `invoice.finalized` → status: sent, store invoice_url
   - `invoice.paid` → status: paid, update amount_paid on project
   - `invoice.payment_failed` → status: overdue
   - `invoice.voided` → status: canceled

### Project Management
- Rich text requirements with collaborative editing
- Version history for requirements changes
- Flexible status transitions (no enforcement)
- Manual time logging for profitability analysis
- Deliverables (GitHub/Vercel URLs) visible immediately

### Admin Dashboard
- Project list with status filters
- Activity timeline per project
- **Subtle reminders** for quotes/invoices awaiting response (badges showing "no response in X days")
- **Full analytics dashboard:**
  - Revenue trends
  - Lead conversion rates
  - Client lifetime value
  - Average project value
  - Revenue forecasting

### Mirror Mode
- Admin can view dashboard as any client
- **Warns before mutations** - confirmation that admin is acting on behalf of client
- Useful for debugging client experience or demonstrating features

---

## Notifications

### Channels
- **Email:** Primary channel for all notifications (integration planned)
- **SMS:** Urgent items only (payments, critical deadlines)

### Triggers
- New lead/contact form submission
- Quote sent/accepted/rejected/expiring
- Invoice sent/paid/overdue
- Requirements updated by client
- Project status changes

---

## Integrations

### Stripe
- Customer management (find or create by email)
- Invoice creation and delivery
- Payment collection with Smart Retries
- Webhook handling for status sync

### Calendly
- Webhook integration for `invitee.created` and `invitee.canceled`
- Auto-creates contacts and projects from scheduled consultations
- Captures custom question answers in project notes

### Planned Integrations
- **Email Service:** Resend or SendGrid for transactional emails
- **SMS:** Twilio for urgent notifications

---

## Security & Access Control

### Row Level Security (RLS)
All tables have RLS policies:
- Clients can only access their own projects (via `user_id`)
- Admin bypasses RLS via service role client
- API routes verify admin status before using admin client

### Data Protection
- Sensitive operations require re-authentication
- Activity log provides audit trail
- Requirements versions enable rollback
- Soft delete for canceled projects (no hard deletion)

---

## File Management (Planned)

### Structure
- **Assets:** Client-provided images, logos, brand materials
- **Documents:** Contracts, briefs, specifications
- **Deliverables:** Final outputs, exports

### Features
- Version control for iterative files (design revisions)
- Preview support for common formats
- Supabase Storage backend
- Organized by type within each project

---

## API Routes

### Public
- `POST /api/contact` - Lead form submission

### Authenticated (Client)
- `GET /api/projects` - List client's projects
- `GET /api/projects/[id]` - Project details
- `POST /api/quotes/[id]/respond` - Accept/reject quote

### Admin Only
- `POST /api/quotes` - Create quote
- `POST /api/invoices` - Create invoice
- `GET /api/admin/projects/[id]/quotes-invoices` - Fetch quotes/invoices (bypasses RLS)
- `POST /api/admin/mirror` - Enter mirror mode
- `POST /api/admin/projects` - Create project

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment events
- `POST /api/webhooks/calendly` - Calendly scheduling events

---

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_WEBHOOK_SECRET_LOCAL= (for development)

# Calendly
CALENDLY_WEBHOOK_SIGNING_KEY=

# Planned
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

---

## Future Considerations

### Not In Scope (Current)
- Real-time chat (defer to external tools like Slack/email)
- Hourly billing/time-based invoicing
- Team/multi-admin support
- White-labeling for agencies

### Roadmap Items
1. Email integration for quote/invoice delivery
2. SMS notifications for urgent items
3. Quote expiry reminder automation
4. File upload with version control
5. Analytics dashboard implementation
6. Time logging UI for profitability tracking
