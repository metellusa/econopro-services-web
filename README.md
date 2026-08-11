# EconoPro Services Website

Marketing and lead-generation site for **EconoPro Services** (Orlando & Tampa, FL), built with **Vite + React + Tailwind CSS**.

## Tech Stack

- Vite
- React 18
- React Router
- Tailwind CSS
- Lucide React icons
- Netlify Forms (estimate + cleaning requests)

## Run locally

```bash
npm install
npm run dev
```

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

## Key routes

- `/` Home
- `/services` and `/services/:slug`
- `/projects` and `/projects/:slug`
- `/bookings` Request estimate / cleaning
- `/financing-options`
- `/about`, `/reviews`, `/faq`, `/contact`
- `/thank-you` (noindex)

## Notes

- Contact info lives in `src/data/site.js`.
- Analytics events are prepared in `src/lib/analytics.js` (no provider ID required yet).
- Prefer WebP via `OptimizedImage` where variants exist in `/public`.
