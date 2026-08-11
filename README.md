# EconoPro Services Website

Marketing and lead-generation site for **EconoPro Services** (Orlando & Tampa, FL), built with **Vite + React + Tailwind CSS**. Project-tracking portals use **Supabase** for auth, Postgres, and RLS.

## Tech Stack

- Vite
- React 18
- React Router
- Tailwind CSS
- Lucide React icons
- Netlify Forms (estimate + cleaning requests)
- Supabase (auth, database, storage for operations portals)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Public marketing pages work without Supabase credentials. Portal routes require the env vars in `.env.example`.

See [docs/BACKEND.md](docs/BACKEND.md) for auth setup, migrations, and guest access.

## Build for production

```bash
npm run build
```

## Deploy to Netlify

1. Connect the repo to Netlify (or deploy the project folder).
2. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. SPA redirects are configured in `netlify.toml`.
4. Netlify Forms are detected via hidden form stubs in `index.html` (`onsite-estimate` and `cleaning-service`).
5. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_APP_URL` in Netlify environment settings for portals.

## Key routes

### Marketing
- `/` Home
- `/services` and `/services/:slug`
- `/projects` and `/projects/:slug`
- `/bookings` Request estimate / cleaning
- `/financing-options`
- `/about`, `/reviews`, `/faq`, `/contact`
- `/thank-you` (noindex)

### Portals / auth
- `/sign-in`, `/reset-password`, `/update-password`
- `/admin` Staff / admin (protected)
- `/contractor` Contractor (protected)
- `/client` Registered client (protected)
- `/project-access/:token` Guest project access (tokenized)

## Notes

- Contact info lives in `src/data/site.js`.
- Analytics events are prepared in `src/lib/analytics.js` (no provider ID required yet).
- Prefer WebP via `OptimizedImage` where variants exist in `/public`.
- Never commit real Supabase keys. Use `.env.local` and host env vars only.
