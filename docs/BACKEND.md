# EconoPro Backend & Operations

## Architecture

- **Marketing site:** Vite + React SPA (Netlify)
- **Operations layer:** Same SPA + **Supabase** (Auth, Postgres, RLS, Storage)
- **Notifications:** Queue in Postgres + Netlify Function adapters (Resend email, Twilio SMS)
- **Dev safety:** `VITE_NOTIFICATIONS_MODE=development` logs only (no live customer messages)

Public marketing routes stay unchanged. Portal routes are separate shells under `/admin`, `/contractor`, `/client`, plus `/project-access/:token`.

## Roles

| Role | Portal | Capabilities |
| --- | --- | --- |
| admin / staff | `/admin` | Projects, templates, reviews, notifications, clients, guest links, publish updates |
| contractor | `/contractor` | Assigned jobs, tasks, progress drafts, issues, photos |
| client | `/client` | Own projects, published updates, approvals |
| guest | `/project-access/:token` | Token-scoped client-facing project view (no account) |

Authorization is enforced with **Supabase RLS** and security-definer RPCs. UI route guards are convenience only.

## Migrations

Apply in order from `supabase/migrations/`:

1. Phase 1 auth/clients/guest tokens
2. Phase 2 projects
3. Phase 3 phases/templates
4. Phase 4 contractor progress/issues
5. Phase 5 client/guest payloads
6. Phase 6 notifications
7. Phase 7 documents/change orders

```bash
npx supabase db push
# or paste each SQL file into the Supabase SQL editor
```

## Environment

See `.env.example`.

Client (Vite):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL`
- `VITE_NOTIFICATIONS_MODE`

Netlify function only:
- `NOTIFICATIONS_MODE`
- `RESEND_API_KEY`
- `NOTIFICATION_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`

Never commit real secrets. Never put service-role keys in `VITE_*`.

## Core workflows

1. Staff create guest/registered client + project
2. Apply phase template / assign contractors
3. Contractor submits progress (internal + proposed client text)
4. Staff reviews/publishes → notifications queued
5. Guest opens secure link or registered client uses `/client`
6. Change orders published for approval (guest may need verification code)

## Security checklist

- [x] Role checks on portal routes
- [x] RLS on projects, notes, files, updates, documents, change orders
- [x] Internal notes in staff-only tables
- [x] Guest tokens hashed, revocable, optional expiry
- [x] Public guest URLs use opaque tokens (not DB ids)
- [x] Contractor submit does not notify clients
- [x] Notification failures do not roll back publish
- [x] Upload size/type validation for contractor photos
- [x] Destinations masked in notification UI logs
- [ ] Configure production provider credentials in Netlify
- [ ] Disable open public signup for staff/contractor roles in Supabase Auth
- [ ] Add rate limiting / WAF at Netlify edge if abuse appears

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Production build

```bash
npm run build
```

Deploy with Netlify (`netlify.toml`). Configure the same `VITE_*` vars for build, and function secrets for live messaging.
