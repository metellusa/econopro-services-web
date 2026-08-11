# EconoPro Services Website

Marketing and lead-generation site for **EconoPro Services** (Orlando & Tampa, FL), plus an operations/project-tracking layer.

## Tech Stack

- Vite + React 18 + React Router + Tailwind CSS
- Netlify Forms (public estimate/cleaning)
- Supabase (auth, Postgres RLS, storage) for portals
- Netlify Functions for transactional email/SMS adapters

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Marketing pages work without Supabase. Portals require env vars from `.env.example`.

Full backend docs: [docs/BACKEND.md](docs/BACKEND.md)

## Build

```bash
npm run build
```

## Key routes

### Marketing
`/`, `/services`, `/projects`, `/bookings`, `/about`, `/reviews`, `/faq`, `/contact`, `/privacy`, `/terms`

### Operations
- `/sign-in` auth
- `/admin` staff ops dashboard
- `/admin/projects` project management
- `/admin/clients` guest/registered clients
- `/admin/reviews` progress + issues
- `/admin/notifications` email/SMS log
- `/contractor` field portal
- `/client` registered client portal
- `/project-access/:token` guest project tracking

## Notes

- Do not invent credentials. Configure Supabase + Resend/Twilio via env.
- Guest clients do not need accounts.
- Contractor updates never publish to clients without staff review.
