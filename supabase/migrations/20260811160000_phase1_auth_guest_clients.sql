-- Phase 1: Auth, profiles, clients, guest access, invitations
-- Apply with Supabase CLI (`supabase db push`) or SQL editor.

create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'staff', 'contractor', 'client');
create type public.contact_method as enum ('email', 'sms', 'phone', 'either');
create type public.profile_status as enum ('active', 'invited', 'disabled');

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role public.app_role not null default 'client',
  status public.profile_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
create index profiles_email_idx on public.profiles (email);

-- ---------------------------------------------------------------------------
-- Clients (may exist without an authenticated user)
-- ---------------------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  preferred_contact_method public.contact_method not null default 'email',
  email_notifications_enabled boolean not null default true,
  sms_notifications_enabled boolean not null default false,
  email_consent_at timestamptz,
  sms_consent_at timestamptz,
  sms_consent_source text,
  user_id uuid unique references public.profiles (id) on delete set null,
  is_guest boolean not null default true,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_email_or_phone check (
    email is not null or phone is not null
  )
);

create index clients_email_idx on public.clients (lower(email));
create index clients_phone_idx on public.clients (phone);
create index clients_user_id_idx on public.clients (user_id);

-- ---------------------------------------------------------------------------
-- Guest project access tokens (store hash only; never sequential public IDs)
-- ---------------------------------------------------------------------------
create table public.guest_access_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  client_id uuid not null references public.clients (id) on delete cascade,
  allowed_project_ids uuid[] not null default '{}',
  label text,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create index guest_access_tokens_client_idx on public.guest_access_tokens (client_id);
create index guest_access_tokens_active_idx
  on public.guest_access_tokens (token_hash)
  where revoked_at is null;

-- ---------------------------------------------------------------------------
-- Invitations (staff/contractor/client account invites)
-- ---------------------------------------------------------------------------
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.app_role not null,
  token_hash text not null unique,
  invited_by uuid references public.profiles (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint invitations_client_role check (
    (role = 'client' and client_id is not null)
    or (role <> 'client')
  )
);

create index invitations_email_idx on public.invitations (lower(email));

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'staff')
      and status = 'active'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.hash_access_token(raw_token text)
returns text
language sql
immutable
as $$
  select encode(digest(raw_token, 'sha256'), 'hex');
$$;

-- Auto-create profile on signup (role defaults to client; elevate via invite/admin)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'client',
    'active'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Link registered client profile to existing client row (no duplicate person)
create or replace function public.link_client_to_user(
  p_client_id uuid,
  p_user_id uuid
)
returns public.clients
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.clients;
begin
  if not public.is_staff() and auth.uid() is distinct from p_user_id then
    raise exception 'not authorized';
  end if;

  update public.clients
  set
    user_id = p_user_id,
    is_guest = false,
    updated_at = now()
  where id = p_client_id
  returning * into result;

  return result;
end;
$$;

-- Validate guest token; returns access metadata only (no internal notes)
create or replace function public.validate_guest_access(raw_token text)
returns table (
  token_id uuid,
  client_id uuid,
  client_name text,
  allowed_project_ids uuid[],
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  hashed text := public.hash_access_token(raw_token);
begin
  return query
  update public.guest_access_tokens gat
  set last_used_at = now()
  from public.clients c
  where gat.token_hash = hashed
    and gat.client_id = c.id
    and gat.revoked_at is null
    and (gat.expires_at is null or gat.expires_at > now())
  returning
    gat.id,
    gat.client_id,
    c.full_name,
    gat.allowed_project_ids,
    gat.expires_at;
end;
$$;

revoke all on function public.validate_guest_access(text) from public;
grant execute on function public.validate_guest_access(text) to anon, authenticated;

revoke all on function public.link_client_to_user(uuid, uuid) from public;
grant execute on function public.link_client_to_user(uuid, uuid) to authenticated;

-- Staff helper to create a guest token (returns plaintext once)
create or replace function public.create_guest_access_token(
  p_client_id uuid,
  p_allowed_project_ids uuid[] default '{}',
  p_label text default null,
  p_expires_at timestamptz default null
)
returns table (
  token_id uuid,
  raw_token text,
  access_path text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_token text := encode(gen_random_bytes(32), 'hex');
  new_id uuid;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  insert into public.guest_access_tokens (
    token_hash,
    client_id,
    allowed_project_ids,
    label,
    expires_at,
    created_by
  )
  values (
    public.hash_access_token(generated_token),
    p_client_id,
    coalesce(p_allowed_project_ids, '{}'),
    p_label,
    p_expires_at,
    auth.uid()
  )
  returning id into new_id;

  return query
  select
    new_id,
    generated_token,
    '/project-access/' || generated_token;
end;
$$;

revoke all on function public.create_guest_access_token(uuid, uuid[], text, timestamptz) from public;
grant execute on function public.create_guest_access_token(uuid, uuid[], text, timestamptz) to authenticated;

create or replace function public.revoke_guest_access_token(p_token_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  update public.guest_access_tokens
  set revoked_at = now()
  where id = p_token_id
    and revoked_at is null;
end;
$$;

revoke all on function public.revoke_guest_access_token(uuid) from public;
grant execute on function public.revoke_guest_access_token(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.guest_access_tokens enable row level security;
alter table public.invitations enable row level security;

-- Profiles
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_staff());

create policy "Users can update own non-role fields"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (
    public.is_admin()
    or (
      id = auth.uid()
      and role = (select p.role from public.profiles p where p.id = auth.uid())
    )
  );

create policy "Staff can insert profiles"
  on public.profiles for insert
  to authenticated
  with check (public.is_staff());

-- Clients
create policy "Staff manage clients"
  on public.clients for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Registered clients read own client record"
  on public.clients for select
  to authenticated
  using (user_id = auth.uid());

create policy "Registered clients update own contact prefs"
  on public.clients for update
  to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and internal_notes is not distinct from (
      select c.internal_notes from public.clients c where c.id = clients.id
    )
  );

-- Guest tokens: staff only (validation goes through security definer RPC)
create policy "Staff manage guest tokens"
  on public.guest_access_tokens for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Invitations
create policy "Staff manage invitations"
  on public.invitations for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Storage bucket for project files (used in later phases)
insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

create policy "Staff read project files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'project-files' and public.is_staff());

create policy "Staff upload project files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-files' and public.is_staff());

create policy "Staff update project files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-files' and public.is_staff())
  with check (bucket_id = 'project-files' and public.is_staff());

create policy "Staff delete project files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-files' and public.is_staff());
