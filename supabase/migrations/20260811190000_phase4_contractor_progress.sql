-- Phase 4: Contractor progress updates, issues, evidence uploads

create type public.progress_update_status as enum (
  'draft',
  'submitted',
  'approved',
  'rejected',
  'published'
);

create type public.issue_category as enum (
  'material',
  'property_condition',
  'access',
  'scope_discrepancy',
  'safety',
  'client_request',
  'other'
);

create type public.issue_status as enum (
  'open',
  'acknowledged',
  'resolved',
  'closed'
);

create table public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  phase_id uuid references public.project_phases (id) on delete set null,
  author_id uuid not null references public.profiles (id) on delete restrict,
  internal_note text not null default '',
  proposed_client_update text not null default '',
  published_client_update text,
  status public.progress_update_status not null default 'draft',
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index progress_updates_project_idx on public.progress_updates (project_id, created_at desc);
create index progress_updates_status_idx on public.progress_updates (status);

create table public.progress_update_media (
  id uuid primary key default gen_random_uuid(),
  progress_update_id uuid not null references public.progress_updates (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  caption text,
  visibility public.project_file_visibility not null default 'internal',
  created_at timestamptz not null default now()
);

create table public.project_issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  phase_id uuid references public.project_phases (id) on delete set null,
  reported_by uuid not null references public.profiles (id) on delete restrict,
  category public.issue_category not null default 'other',
  title text not null,
  description text not null,
  status public.issue_status not null default 'open',
  staff_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_issues_project_idx on public.project_issues (project_id, created_at desc);
create index project_issues_status_idx on public.project_issues (status);

alter table public.project_phase_tasks
  add column if not exists completion_note text;

create trigger progress_updates_set_updated_at
before update on public.progress_updates
for each row execute function public.set_updated_at();

create trigger project_issues_set_updated_at
before update on public.project_issues
for each row execute function public.set_updated_at();

create or replace function public.can_access_project_as_contractor(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_project_contractor(p_project_id)
    or exists (
      select 1
      from public.project_phases pp
      join public.project_phase_assignees a on a.phase_id = pp.id
      where pp.project_id = p_project_id
        and a.profile_id = auth.uid()
    );
$$;

create or replace function public.submit_progress_update(p_update_id uuid)
returns public.progress_updates
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.progress_updates;
begin
  update public.progress_updates
  set status = 'submitted'
  where id = p_update_id
    and author_id = auth.uid()
    and status in ('draft', 'rejected')
  returning * into result;

  if result.id is null then
    raise exception 'Update not found or not editable';
  end if;

  perform public.log_project_activity(
    result.project_id,
    'progress_submitted',
    'Contractor submitted a progress update',
    jsonb_build_object('update_id', result.id)
  );

  return result;
end;
$$;

create or replace function public.review_progress_update(
  p_update_id uuid,
  p_action text,
  p_published_client_update text default null,
  p_review_notes text default null
)
returns public.progress_updates
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.progress_updates;
  next_status public.progress_update_status;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  if p_action = 'approve' then
    next_status := 'approved';
  elsif p_action = 'reject' then
    next_status := 'rejected';
  elsif p_action = 'publish' then
    next_status := 'published';
  else
    raise exception 'Invalid action';
  end if;

  update public.progress_updates
  set
    status = next_status,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    review_notes = p_review_notes,
    published_client_update = coalesce(p_published_client_update, proposed_client_update),
    published_at = case when next_status = 'published' then now() else published_at end
  where id = p_update_id
  returning * into result;

  perform public.log_project_activity(
    result.project_id,
    'progress_' || p_action,
    format('Progress update %s', p_action),
    jsonb_build_object('update_id', result.id)
  );

  return result;
end;
$$;

revoke all on function public.submit_progress_update(uuid) from public;
grant execute on function public.submit_progress_update(uuid) to authenticated;
revoke all on function public.review_progress_update(uuid, text, text, text) from public;
grant execute on function public.review_progress_update(uuid, text, text, text) to authenticated;

alter table public.progress_updates enable row level security;
alter table public.progress_update_media enable row level security;
alter table public.project_issues enable row level security;

create policy "Staff manage progress updates"
  on public.progress_updates for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Contractors manage own progress updates on assigned projects"
  on public.progress_updates for all
  to authenticated
  using (
    author_id = auth.uid()
    and public.can_access_project_as_contractor(project_id)
  )
  with check (
    author_id = auth.uid()
    and public.can_access_project_as_contractor(project_id)
    and status in ('draft', 'submitted', 'rejected')
  );

create policy "Clients read published progress updates"
  on public.progress_updates for select
  to authenticated
  using (
    status = 'published'
    and public.client_owns_project(project_id)
  );

create policy "Staff manage progress media"
  on public.progress_update_media for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Authors manage own progress media"
  on public.progress_update_media for all
  to authenticated
  using (
    exists (
      select 1 from public.progress_updates u
      where u.id = progress_update_media.progress_update_id
        and u.author_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.progress_updates u
      where u.id = progress_update_media.progress_update_id
        and u.author_id = auth.uid()
    )
  );

create policy "Clients read client-visible published media"
  on public.progress_update_media for select
  to authenticated
  using (
    visibility = 'client'
    and exists (
      select 1 from public.progress_updates u
      where u.id = progress_update_media.progress_update_id
        and u.status = 'published'
        and public.client_owns_project(u.project_id)
    )
  );

create policy "Staff manage issues"
  on public.project_issues for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Contractors manage own issues on assigned projects"
  on public.project_issues for all
  to authenticated
  using (
    reported_by = auth.uid()
    and public.can_access_project_as_contractor(project_id)
  )
  with check (
    reported_by = auth.uid()
    and public.can_access_project_as_contractor(project_id)
  );

-- Storage: allow contractors to upload into project-files under their project folder
create policy "Contractors upload project files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-files'
    and public.can_access_project_as_contractor((storage.foldername(name))[1]::uuid)
  );

create policy "Contractors read assigned project files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'project-files'
    and public.can_access_project_as_contractor((storage.foldername(name))[1]::uuid)
  );
