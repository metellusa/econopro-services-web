-- Phase 3: Project phases, tasks, templates, progress

create type public.phase_status as enum (
  'not_started',
  'ready',
  'in_progress',
  'blocked',
  'awaiting_review',
  'completed'
);

create type public.task_status as enum (
  'pending',
  'in_progress',
  'completed',
  'skipped'
);

-- ---------------------------------------------------------------------------
-- Templates
-- ---------------------------------------------------------------------------
create table public.phase_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_category text not null,
  description text,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.phase_template_phases (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.phase_templates (id) on delete cascade,
  name text not null,
  description text,
  sort_order int not null default 0,
  client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.phase_template_tasks (
  id uuid primary key default gen_random_uuid(),
  template_phase_id uuid not null references public.phase_template_phases (id) on delete cascade,
  title text not null,
  description text,
  is_required boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create trigger phase_templates_set_updated_at
before update on public.phase_templates
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Live project phases / tasks
-- ---------------------------------------------------------------------------
create table public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  description text,
  sort_order int not null default 0,
  status public.phase_status not null default 'not_started',
  start_date date,
  due_date date,
  completed_at timestamptz,
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  progress_manual_override boolean not null default false,
  blocked_reason text,
  client_visible boolean not null default true,
  client_facing_update text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_phases_project_idx
  on public.project_phases (project_id, sort_order);

-- Staff-only phase notes
create table public.project_phase_internal_notes (
  phase_id uuid primary key references public.project_phases (id) on delete cascade,
  notes text,
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.project_phase_assignees (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.project_phases (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references public.profiles (id) on delete set null,
  unique (phase_id, profile_id)
);

create table public.project_phase_tasks (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.project_phases (id) on delete cascade,
  title text not null,
  description text,
  is_required boolean not null default true,
  status public.task_status not null default 'pending',
  sort_order int not null default 0,
  due_date date,
  assigned_profile_id uuid references public.profiles (id) on delete set null,
  completed_by uuid references public.profiles (id) on delete set null,
  completed_at timestamptz,
  client_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_phase_tasks_phase_idx
  on public.project_phase_tasks (phase_id, sort_order);

alter table public.projects
  add column if not exists progress_percent int not null default 0
    check (progress_percent between 0 and 100),
  add column if not exists progress_manual_override boolean not null default false,
  add column if not exists template_id uuid references public.phase_templates (id) on delete set null;

create trigger project_phases_set_updated_at
before update on public.project_phases
for each row execute function public.set_updated_at();

create trigger project_phase_tasks_set_updated_at
before update on public.project_phase_tasks
for each row execute function public.set_updated_at();

create trigger project_phase_internal_notes_set_updated_at
before update on public.project_phase_internal_notes
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Progress calculation (phase/task based unless manual override)
-- ---------------------------------------------------------------------------
create or replace function public.recalculate_phase_progress(p_phase_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  total_tasks int;
  done_tasks int;
  phase_row public.project_phases;
  next_percent int;
begin
  select * into phase_row from public.project_phases where id = p_phase_id;
  if not found then
    return;
  end if;

  if phase_row.progress_manual_override then
    return;
  end if;

  select count(*), count(*) filter (where status in ('completed', 'skipped'))
  into total_tasks, done_tasks
  from public.project_phase_tasks
  where phase_id = p_phase_id;

  if total_tasks = 0 then
    next_percent := case when phase_row.status = 'completed' then 100 else 0 end;
  else
    next_percent := round((done_tasks::numeric / total_tasks::numeric) * 100);
  end if;

  update public.project_phases
  set progress_percent = next_percent,
      updated_at = now()
  where id = p_phase_id;
end;
$$;

create or replace function public.recalculate_project_progress(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  project_row public.projects;
  avg_progress numeric;
begin
  select * into project_row from public.projects where id = p_project_id;
  if not found then
    return;
  end if;

  if project_row.progress_manual_override then
    return;
  end if;

  select coalesce(avg(progress_percent), 0)
  into avg_progress
  from public.project_phases
  where project_id = p_project_id;

  update public.projects
  set progress_percent = round(avg_progress),
      updated_at = now()
  where id = p_project_id;
end;
$$;

create or replace function public.phase_progress_touch()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
  project_id uuid;
begin
  if tg_table_name = 'project_phase_tasks' then
    pid := coalesce(new.phase_id, old.phase_id);
    perform public.recalculate_phase_progress(pid);
    select pp.project_id into project_id from public.project_phases pp where pp.id = pid;
    if project_id is not null then
      perform public.recalculate_project_progress(project_id);
    end if;
  elsif tg_table_name = 'project_phases' then
    perform public.recalculate_phase_progress(coalesce(new.id, old.id));
    perform public.recalculate_project_progress(coalesce(new.project_id, old.project_id));
  end if;
  return coalesce(new, old);
end;
$$;

create trigger project_phase_tasks_progress_aiud
after insert or update or delete on public.project_phase_tasks
for each row execute function public.phase_progress_touch();

create trigger project_phases_progress_aiud
after insert or update of status, progress_manual_override or delete
on public.project_phases
for each row execute function public.phase_progress_touch();

-- Phase completion rules
create or replace function public.enforce_phase_completion_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  open_required int;
  override_flag boolean := coalesce((current_setting('app.phase_complete_override', true) = 'on'), false);
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    select count(*) into open_required
    from public.project_phase_tasks
    where phase_id = new.id
      and is_required = true
      and status not in ('completed', 'skipped');

    if open_required > 0 and not override_flag then
      raise exception 'Required tasks incomplete. Set app.phase_complete_override=on to override.';
    end if;

    new.completed_at := coalesce(new.completed_at, now());
    if not new.progress_manual_override then
      new.progress_percent := 100;
    end if;

    perform public.log_project_activity(
      new.project_id,
      'phase_completed',
      format('Phase completed: %s', new.name),
      jsonb_build_object('phase_id', new.id, 'override', override_flag)
    );
  end if;

  if new.status = 'blocked' and old.status is distinct from 'blocked' then
    perform public.log_project_activity(
      new.project_id,
      'phase_blocked',
      format('Phase blocked: %s', new.name),
      jsonb_build_object('phase_id', new.id, 'reason', new.blocked_reason)
    );
  end if;

  if new.status = 'in_progress' and old.status is distinct from 'in_progress' then
    new.start_date := coalesce(new.start_date, current_date);
    perform public.log_project_activity(
      new.project_id,
      'phase_started',
      format('Phase started: %s', new.name),
      jsonb_build_object('phase_id', new.id)
    );
  end if;

  return new;
end;
$$;

create trigger project_phases_completion_rules
before update of status on public.project_phases
for each row execute function public.enforce_phase_completion_rules();

create or replace function public.complete_phase_with_override(
  p_phase_id uuid,
  p_override boolean default false,
  p_override_reason text default null
)
returns public.project_phases
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.project_phases;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  if p_override then
    perform set_config('app.phase_complete_override', 'on', true);
    perform public.log_project_activity(
      (select project_id from public.project_phases where id = p_phase_id),
      'staff_override',
      'Staff overrode required-task completion check',
      jsonb_build_object('phase_id', p_phase_id, 'reason', p_override_reason)
    );
  end if;

  update public.project_phases
  set status = 'completed'
  where id = p_phase_id
  returning * into result;

  return result;
end;
$$;

revoke all on function public.complete_phase_with_override(uuid, boolean, text) from public;
grant execute on function public.complete_phase_with_override(uuid, boolean, text) to authenticated;

-- Task completion logging
create or replace function public.task_completion_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  project_id uuid;
  phase_name text;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    new.completed_at := coalesce(new.completed_at, now());
    new.completed_by := coalesce(new.completed_by, auth.uid());

    select pp.project_id, pp.name into project_id, phase_name
    from public.project_phases pp
    where pp.id = new.phase_id;

    perform public.log_project_activity(
      project_id,
      'task_completed',
      format('Task completed: %s (%s)', new.title, phase_name),
      jsonb_build_object('task_id', new.id, 'phase_id', new.phase_id)
    );
  end if;
  return new;
end;
$$;

create trigger project_phase_tasks_completion
before update of status on public.project_phase_tasks
for each row execute function public.task_completion_activity();

-- Apply template to project (copies snapshot; later template edits do not rewrite)
create or replace function public.apply_phase_template(
  p_project_id uuid,
  p_template_id uuid,
  p_replace_existing boolean default false
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  phase_count int := 0;
  template_phase record;
  new_phase_id uuid;
  template_task record;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  if p_replace_existing then
    delete from public.project_phases where project_id = p_project_id;
  elsif exists (select 1 from public.project_phases where project_id = p_project_id) then
    raise exception 'Project already has phases. Pass replace flag to overwrite.';
  end if;

  for template_phase in
    select *
    from public.phase_template_phases
    where template_id = p_template_id
    order by sort_order asc, created_at asc
  loop
    insert into public.project_phases (
      project_id, name, description, sort_order, client_visible, status
    )
    values (
      p_project_id,
      template_phase.name,
      template_phase.description,
      template_phase.sort_order,
      template_phase.client_visible,
      'not_started'
    )
    returning id into new_phase_id;

    for template_task in
      select *
      from public.phase_template_tasks
      where template_phase_id = template_phase.id
      order by sort_order asc, created_at asc
    loop
      insert into public.project_phase_tasks (
        phase_id, title, description, is_required, sort_order, status
      )
      values (
        new_phase_id,
        template_task.title,
        template_task.description,
        template_task.is_required,
        template_task.sort_order,
        'pending'
      );
    end loop;

    phase_count := phase_count + 1;
  end loop;

  update public.projects
  set template_id = p_template_id
  where id = p_project_id;

  perform public.log_project_activity(
    p_project_id,
    'template_applied',
    'Phase template applied',
    jsonb_build_object('template_id', p_template_id, 'phase_count', phase_count)
  );

  perform public.recalculate_project_progress(p_project_id);
  return phase_count;
end;
$$;

revoke all on function public.apply_phase_template(uuid, uuid, boolean) from public;
grant execute on function public.apply_phase_template(uuid, uuid, boolean) to authenticated;

create or replace function public.project_phases_created_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.log_project_activity(
    new.project_id,
    'phase_created',
    format('Phase created: %s', new.name),
    jsonb_build_object('phase_id', new.id)
  );
  return new;
end;
$$;

create trigger project_phases_created_ai
after insert on public.project_phases
for each row execute function public.project_phases_created_activity();

-- Seed a flooring template
insert into public.phase_templates (name, service_category, description, is_active)
values (
  'Flooring Standard',
  'Flooring Installation',
  'Default flooring workflow from prep through final walkthrough.',
  true
);

insert into public.phase_template_phases (template_id, name, description, sort_order, client_visible)
select t.id, x.name, x.description, x.sort_order, true
from public.phase_templates t
cross join (
  values
    (1, 'Site Preparation', 'Protect areas and confirm materials.'),
    (2, 'Demolition', 'Remove existing flooring as needed.'),
    (3, 'Surface / Subfloor Preparation', 'Level and prep substrate.'),
    (4, 'Installation', 'Install new flooring materials.'),
    (5, 'Trim / Finishing', 'Transitions, trim, and cleanup.'),
    (6, 'Final Walkthrough', 'Client walkthrough and punch list.')
) as x(sort_order, name, description)
where t.name = 'Flooring Standard';

insert into public.phase_template_tasks (template_phase_id, title, is_required, sort_order)
select p.id, x.title, true, x.sort_order
from public.phase_template_phases p
join public.phase_templates t on t.id = p.template_id
cross join lateral (
  select * from (values
    (1, 'Confirm scope with client'),
    (2, 'Document existing conditions')
  ) as tasks(sort_order, title)
) x
where t.name = 'Flooring Standard'
  and p.sort_order = 1;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.phase_templates enable row level security;
alter table public.phase_template_phases enable row level security;
alter table public.phase_template_tasks enable row level security;
alter table public.project_phases enable row level security;
alter table public.project_phase_internal_notes enable row level security;
alter table public.project_phase_assignees enable row level security;
alter table public.project_phase_tasks enable row level security;

create policy "Staff manage templates"
  on public.phase_templates for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff manage template phases"
  on public.phase_template_phases for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff manage template tasks"
  on public.phase_template_tasks for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff manage project phases"
  on public.project_phases for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Contractors read assigned project phases"
  on public.project_phases for select
  to authenticated
  using (
    public.is_project_contractor(project_id)
    or exists (
      select 1 from public.project_phase_assignees a
      where a.phase_id = project_phases.id
        and a.profile_id = auth.uid()
    )
  );

create policy "Clients read visible phases on own projects"
  on public.project_phases for select
  to authenticated
  using (
    client_visible = true
    and public.client_owns_project(project_id)
  );

create policy "Staff manage phase internal notes"
  on public.project_phase_internal_notes for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Staff manage phase assignees"
  on public.project_phase_assignees for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Users read own phase assignments"
  on public.project_phase_assignees for select
  to authenticated
  using (profile_id = auth.uid() or public.is_staff());

create policy "Staff manage phase tasks"
  on public.project_phase_tasks for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Contractors read tasks on accessible phases"
  on public.project_phase_tasks for select
  to authenticated
  using (
    exists (
      select 1
      from public.project_phases pp
      where pp.id = project_phase_tasks.phase_id
        and (
          public.is_project_contractor(pp.project_id)
          or exists (
            select 1 from public.project_phase_assignees a
            where a.phase_id = pp.id and a.profile_id = auth.uid()
          )
        )
    )
  );

create policy "Contractors update assigned tasks"
  on public.project_phase_tasks for update
  to authenticated
  using (
    assigned_profile_id = auth.uid()
    or exists (
      select 1 from public.project_phase_assignees a
      where a.phase_id = project_phase_tasks.phase_id
        and a.profile_id = auth.uid()
    )
  )
  with check (
    assigned_profile_id = auth.uid()
    or exists (
      select 1 from public.project_phase_assignees a
      where a.phase_id = project_phase_tasks.phase_id
        and a.profile_id = auth.uid()
    )
  );

create policy "Clients read visible tasks"
  on public.project_phase_tasks for select
  to authenticated
  using (
    client_visible = true
    and exists (
      select 1
      from public.project_phases pp
      where pp.id = project_phase_tasks.phase_id
        and pp.client_visible = true
        and public.client_owns_project(pp.project_id)
    )
  );
