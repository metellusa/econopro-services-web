# Backend & Operations Portals

EconoPro’s marketing site remains a Vite + React SPA on Netlify. Project tracking uses **Supabase** (Postgres + Auth + Storage + Row Level Security) so authorization is enforced in the database, not only in the UI.

## What Phase 1 provides

- Secure auth for `admin`, `staff`, `contractor`, and `client` roles
- `clients` records that can exist **without** a user account (guest clients)
- Optional link from a client record to a registered user (`link_client_to_user`)
- Hashed, revocable guest access tokens (`/project-access/<token>`)
- Protected portal shells: `/admin`, `/contractor`, `/client`
- Storage bucket `project-files` (private; staff policies)

## Environment variables

Copy `.env.example` to `.env.local` (or `.env`) and fill in real values:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (safe for browser; RLS still applies) |
| `VITE_APP_URL` | App origin used for password-reset redirects |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server/scripts only.** Never put this in Vite `VITE_*` vars. |

Without Supabase env vars, the public marketing site still builds and runs. Portal routes show a clear “not configured” message.

## Local development

```bash
npm install
cp .env.example .env.local
# fill Supabase values
npm run dev
```

Marketing site: `http://localhost:5173`  
Sign in: `http://localhost:5173/sign-in`

## Database migrations

Migrations live in `supabase/migrations/`.

### Option A: Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### Option B: SQL editor

1. Open the Supabase SQL editor.
2. Paste and run `supabase/migrations/20260811160000_phase1_auth_guest_clients.sql`.

## Auth setup checklist

1. Create a Supabase project.
2. Enable Email auth (and disable open public sign-ups in production if invites-only).
3. Apply the Phase 1 migration.
4. Create the first admin user in Authentication, then set `profiles.role = 'admin'` in the Table Editor (or via SQL).
5. Add `http://localhost:5173/update-password` and your production `/update-password` URL under Auth → URL configuration → Redirect URLs.
6. Set Site URL to your production domain (and local URL for development).

### Invitation flow (foundation)

- `invitations` table stores hashed invite tokens, role, optional `client_id`, and expiry.
- Staff create invites; acceptance UI/API expands in later phases.
- Prefer inviting users rather than open registration for staff/contractors.

### Guest access

Staff call RPC `create_guest_access_token(client_id, project_ids, label, expires_at)` which returns the plaintext token **once**. Only the SHA-256 hash is stored.

- Public path: `/project-access/<token>`
- Validate via RPC `validate_guest_access(raw_token)`
- Revoke via RPC `revoke_guest_access_token(token_id)`

Guest/client-facing queries must never expose `clients.internal_notes` or contractor-only fields (enforced later with views/policies as project tables land).

## Authorization model

| Actor | Access |
| --- | --- |
| Admin / Staff | Company client + token management (RLS `is_staff()`) |
| Contractor | Own profile; project assignment policies arrive in later phases |
| Registered client | Own linked `clients` row only |
| Guest token | Only through `validate_guest_access`; scoped project IDs |

Frontend `ProtectedRoute` checks roles for UX, but **RLS is the source of truth**.

## Phase 2: Project management

Apply `supabase/migrations/20260811170000_phase2_project_management.sql` after Phase 1.

Staff routes:
- `/admin/projects` dashboard (search + filters)
- `/admin/projects/new` create project / guest client
- `/admin/projects/:id` detail tabs (Overview, Team, Client, Files, Notes, Activity)
- `/admin/projects/:id/edit`

Data notes:
- `projects.client_summary` is client-safe.
- `project_internal_notes` is a separate staff-only table (never exposed to clients/guests).
- Assignments live in `project_assignees`.
- Files support `internal` vs `client` visibility.
- Activity is written automatically on create/update/assignment changes.

## Phase 3: Phases, tasks, templates

Apply `supabase/migrations/20260811180000_phase3_phases_templates.sql`.

- `/admin/templates` create/activate reusable phase templates by service
- Project detail → **Phases** tab: apply template, reorder, assign contractors, tasks, completion override
- Progress is calculated from phase/task completion unless `progress_manual_override` is set
- `client_visible` flags keep internal phases/tasks out of client policies
- Staff override of required-task completion is audited via `staff_override` activity

## Production build

```bash
npm run build
```

Deploy remains Netlify (`netlify.toml`). Add the same `VITE_*` variables in the Netlify UI for production builds.
