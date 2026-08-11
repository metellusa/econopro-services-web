-- Phase 2: Project management core

create type public.project_status as enum (
  'estimate',
  'approved',
  'scheduled',
  'in_progress',
  'final_review',
  'completed',
  'cancelled'
);

create type public.project_assignee_role as enum (
  'project_manager',
  'staff',
  'contractor'
);

create type public.project_file_visibility as enum (
  'internal',
  'client'
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_id uuid not null references public.clients (id) on delete restrict,
  property_address text not null,
  service_type text not null,
  scope text,
  status public.project_status not null default 'estimate',
  start_date date,
  estimated_completion_date date,
  actual_completion_date date,
  client_summary text,
  archived_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_dates_valid check (
    estimated_completion_date is null
    or start_date is null
    or estimated_completion_date >= start_date
  ),
  constraint projects_completion_date_valid check (
    actual_completion_date is null
    or start_date is null
    or actual_completion_date >= start_date
  )
);

create index projects_client_id_idx on public.projects (client_id);
create index projects_status_idx on public.projects (status);
create index projects_service_type_idx on public.projects (service_type);
create index projects_created_at_idx on public.projects (created_at desc);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

-- Internal notes live in a staff-only table so clients/contractors/guests
-- cannot select them even with row access to projects.
create table public.project_internal_notes (
  project_id uuid primary key references public.projects (id) on delete cascade,
  notes text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger project_internal_notes_set_updated_at
before update on public.project_internal_notes
for each row execute function public.set_updated_at();

create table public.project_assignees (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  assignee_role public.project_assignee_role not null,
  assigned_by uuid references public.profiles (id) on delete set null,
  assigned_at timestamptz not null default now(),
  unique (project_id, profile_id, assignee_role)
);

create index project_assignees_profile_idx on public.project_assignees (profile_id);
create index project_assignees_project_idx on public.project_assignees (project_id);

create table public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  visibility public.project_file_visibility not null default 'internal',
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index project_files_project_idx on public.project_files (project_id);

create table public.project_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index project_activity_project_idx
  on public.project_activity (project_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_project_assignee(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.project_assignees
    where project_id = p_project_id
      and profile_id = auth.uid()
  );
$$;

create or replace function public.is_project_contractor(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.project_assignees
    where project_id = p_project_id
      and profile_id = auth.uid()
      and assignee_role = 'contractor'
  );
$$;

create or replace function public.client_owns_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects p
    join public.clients c on c.id = p.client_id
    where p.id = p_project_id
      and c.user_id = auth.uid()
  );
$$;

create or replace function public.log_project_activity(
  p_project_id uuid,
  p_event_type text,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_activity (project_id, actor_id, event_type, summary, metadata)
  values (p_project_id, auth.uid(), p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create or replace function public.projects_activity_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_project_activity(
      new.id,
      'project_created',
      'Project created',
      jsonb_build_object('status', new.status, 'client_id', new.client_id)
    );
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      perform public.log_project_activity(
        new.id,
        'status_changed',
        format('Status changed from %s to %s', old.status, new.status),
        jsonb_build_object('from', old.status, 'to', new.status)
      );
    end if;

    if new.client_id is distinct from old.client_id then
      perform public.log_project_activity(
        new.id,
        'client_changed',
        'Client changed',
        jsonb_build_object('from', old.client_id, 'to', new.client_id)
      );
    end if;

    if new.start_date is distinct from old.start_date
      or new.estimated_completion_date is distinct from old.estimated_completion_date
      or new.actual_completion_date is distinct from old.actual_completion_date then
      perform public.log_project_activity(
        new.id,
        'dates_changed',
        'Project dates updated',
        jsonb_build_object(
          'start_date', new.start_date,
          'estimated_completion_date', new.estimated_completion_date,
          'actual_completion_date', new.actual_completion_date
        )
      );
    end if;

    if new.title is distinct from old.title
      or new.property_address is distinct from old.property_address
      or new.service_type is distinct from old.service_type
      or new.scope is distinct from old.scope
      or new.client_summary is distinct from old.client_summary
      or new.archived_at is distinct from old.archived_at then
      perform public.log_project_activity(
        new.id,
        'project_updated',
        'Project details updated',
        '{}'::jsonb
      );
    end if;

    return new;
  end if;

  return new;
end;
$$;

create trigger projects_activity_aiu
after insert or update on public.projects
for each row execute function public.projects_activity_trigger();

create or replace function public.project_assignees_activity_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_project_activity(
      new.project_id,
      'assignee_added',
      format('Assigned %s (%s)', new.assignee_role, new.profile_id),
      jsonb_build_object(
        'profile_id', new.profile_id,
        'assignee_role', new.assignee_role
      )
    );
    return new;
  end if;

  if tg_op = 'DELETE' then
    perform public.log_project_activity(
      old.project_id,
      'assignee_removed',
      format('Removed %s (%s)', old.assignee_role, old.profile_id),
      jsonb_build_object(
        'profile_id', old.profile_id,
        'assignee_role', old.assignee_role
      )
    );
    return old;
  end if;

  return null;
end;
$$;

create trigger project_assignees_activity_aid
after insert or delete on public.project_assignees
for each row execute function public.project_assignees_activity_trigger();

-- Optional status transition guard (practical, not overly strict)
create or replace function public.enforce_project_status_transition()
returns trigger
language plpgsql
as $$
begin
  if old.status = new.status then
    return new;
  end if;

  -- Allow any transition to cancelled
  if new.status = 'cancelled' then
    return new;
  end if;

  -- Soft rules: completed only from final_review or in_progress; reopen allowed by staff
  if new.status = 'completed'
    and old.status not in ('final_review', 'in_progress', 'completed') then
    raise exception 'Invalid status transition: % -> completed', old.status;
  end if;

  return new;
end;
$$;

create trigger projects_status_transition
before update of status on public.projects
for each row execute function public.enforce_project_status_transition();

-- Extend guest tokens: ensure allowed project ids must belong to same client (when set)
create or replace function public.validate_guest_token_projects()
returns trigger
language plpgsql
as $$
declare
  mismatched int;
begin
  if new.allowed_project_ids is null or cardinality(new.allowed_project_ids) = 0 then
    return new;
  end if;

  select count(*) into mismatched
  from unnest(new.allowed_project_ids) as pid
  where not exists (
    select 1 from public.projects p
    where p.id = pid and p.client_id = new.client_id
  );

  if mismatched > 0 then
    raise exception 'Guest token project IDs must belong to the same client';
  end if;

  return new;
end;
$$;

create trigger guest_access_tokens_validate_projects
before insert or update on public.guest_access_tokens
for each row execute function public.validate_guest_token_projects();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.project_internal_notes enable row level security;
alter table public.project_assignees enable row level security;
alter table public.project_files enable row level security;
alter table public.project_activity enable row level security;

-- Projects
create policy "Staff manage projects"
  on public.projects for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Contractors read assigned projects"
  on public.projects for select
  to authenticated
  using (public.is_project_contractor(id));

create policy "Clients read own projects"
  on public.projects for select
  to authenticated
  using (public.client_owns_project(id));

-- Internal notes: staff only
create policy "Staff manage internal notes"
  on public.project_internal_notes for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Assignees
create policy "Staff manage assignees"
  on public.project_assignees for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Assignees read own assignment rows"
  on public.project_assignees for select
  to authenticated
  using (profile_id = auth.uid() or public.is_staff());

-- Files
create policy "Staff manage project files"
  on public.project_files for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Contractors read internal+client files on assigned projects"
  on public.project_files for select
  to authenticated
  using (public.is_project_contractor(project_id));

create policy "Clients read client-visible files"
  on public.project_files for select
  to authenticated
  using (
    visibility = 'client'
    and public.client_owns_project(project_id)
  );

-- Activity
create policy "Staff read/write activity"
  on public.project_activity for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Assignees read activity on assigned projects"
  on public.project_activity for select
  to authenticated
  using (public.is_project_assignee(project_id));

create policy "Clients read activity on own projects"
  on public.project_activity for select
  to authenticated
  using (public.client_owns_project(project_id));

-- Contractors can read profiles of people on shared projects (names only via select)
create policy "Users read assignee profiles on shared projects"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or public.is_staff()
    or exists (
      select 1
      from public.project_assignees mine
      join public.project_assignees theirs
        on mine.project_id = theirs.project_id
      where mine.profile_id = auth.uid()
        and theirs.profile_id = profiles.id
    )
  );

-- Allow authenticated users with contractor/staff roles to be listed by staff for assignment
-- (already covered by staff is_staff() on profiles select from phase 1)

grant execute on function public.log_project_activity(uuid, text, text, jsonb) to authenticated;
