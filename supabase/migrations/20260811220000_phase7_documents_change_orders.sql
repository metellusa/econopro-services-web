-- Phase 7: Documents, change orders, client approvals

create type public.document_kind as enum (
  'estimate',
  'contract',
  'scope',
  'invoice',
  'change_order',
  'completion',
  'client_attachment',
  'internal_attachment'
);

create type public.document_visibility as enum (
  'internal',
  'contractor',
  'client'
);

create type public.change_order_status as enum (
  'draft',
  'internal_review',
  'awaiting_client',
  'approved',
  'declined',
  'cancelled'
);

create table public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind public.document_kind not null default 'client_attachment',
  title text not null,
  description text,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  visibility public.document_visibility not null default 'internal',
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index project_documents_project_idx on public.project_documents (project_id);

create table public.change_orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text not null,
  reason text,
  cost_adjustment numeric(12,2),
  schedule_impact_days int,
  status public.change_order_status not null default 'draft',
  source_issue_id uuid references public.project_issues (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  published_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  client_response text,
  client_comment text,
  client_responded_at timestamptz,
  client_responded_by uuid references public.profiles (id) on delete set null,
  guest_verification_code_hash text,
  guest_verification_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index change_orders_project_idx on public.change_orders (project_id, created_at desc);
create index change_orders_status_idx on public.change_orders (status);

create table public.change_order_files (
  id uuid primary key default gen_random_uuid(),
  change_order_id uuid not null references public.change_orders (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  visibility public.document_visibility not null default 'client',
  created_at timestamptz not null default now()
);

create table public.change_order_events (
  id uuid primary key default gen_random_uuid(),
  change_order_id uuid not null references public.change_orders (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create trigger change_orders_set_updated_at
before update on public.change_orders
for each row execute function public.set_updated_at();

create or replace function public.log_change_order_event(
  p_change_order_id uuid,
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
  insert into public.change_order_events (change_order_id, actor_id, event_type, summary, metadata)
  values (p_change_order_id, auth.uid(), p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create or replace function public.publish_change_order(p_change_order_id uuid)
returns public.change_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.change_orders;
  project_title text;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  update public.change_orders
  set
    status = 'awaiting_client',
    published_by = auth.uid(),
    published_at = now()
  where id = p_change_order_id
  returning * into result;

  perform public.log_change_order_event(
    result.id,
    'published',
    'Change order sent for client approval',
    '{}'::jsonb
  );

  perform public.log_project_activity(
    result.project_id,
    'change_order_sent',
    format('Change order sent: %s', result.title),
    jsonb_build_object('change_order_id', result.id)
  );

  select title into project_title from public.projects where id = result.project_id;

  begin
    perform public.enqueue_client_notifications(
      result.project_id,
      'change_order_approval',
      'Action needed: change order approval',
      format(
        E'Hello,\n\nA change order needs your review for "%s":\n\n%s\n\nReview and respond: {{link}}\n\nEconoPro Services',
        project_title,
        result.title
      ),
      format('EconoPro: Please review a change order for "%s". {{link}}', project_title),
      jsonb_build_object('change_order_id', result.id)
    );
  exception when others then
    perform public.log_project_activity(
      result.project_id,
      'notification_enqueue_failed',
      'Failed to enqueue change-order notification',
      jsonb_build_object('error', SQLERRM, 'change_order_id', result.id)
    );
  end;

  return result;
end;
$$;

create or replace function public.respond_to_change_order(
  p_change_order_id uuid,
  p_response text,
  p_comment text default null,
  p_guest_token text default null,
  p_verification_code text default null
)
returns public.change_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.change_orders;
  project_client uuid;
  access_ok boolean := false;
begin
  if p_response not in ('approved', 'declined') then
    raise exception 'Invalid response';
  end if;

  select * into result from public.change_orders where id = p_change_order_id;
  if not found then
    raise exception 'Change order not found';
  end if;

  if result.status <> 'awaiting_client' then
    raise exception 'Change order is not awaiting client response';
  end if;

  select client_id into project_client from public.projects where id = result.project_id;

  if public.client_owns_project(result.project_id) then
    access_ok := true;
  elsif p_guest_token is not null then
    access_ok := exists (
      select 1
      from public.validate_guest_access(p_guest_token) v
      where v.client_id = project_client
        and (
          cardinality(v.allowed_project_ids) = 0
          or result.project_id = any (v.allowed_project_ids)
        )
    );

    if access_ok and result.guest_verification_code_hash is not null then
      if p_verification_code is null
        or public.hash_access_token(p_verification_code) <> result.guest_verification_code_hash
        or (result.guest_verification_expires_at is not null and result.guest_verification_expires_at < now()) then
        raise exception 'Verification code required or invalid';
      end if;
    end if;
  end if;

  if not access_ok and not public.is_staff() then
    raise exception 'not authorized';
  end if;

  update public.change_orders
  set
    status = p_response::public.change_order_status,
    client_response = p_response,
    client_comment = p_comment,
    client_responded_at = now(),
    client_responded_by = auth.uid()
  where id = p_change_order_id
  returning * into result;

  perform public.log_change_order_event(
    result.id,
    'client_' || p_response,
    format('Client %s the change order', p_response),
    jsonb_build_object('comment', p_comment)
  );

  perform public.log_project_activity(
    result.project_id,
    'change_order_' || p_response,
    format('Change order %s: %s', p_response, result.title),
    jsonb_build_object('change_order_id', result.id)
  );

  return result;
end;
$$;

create or replace function public.request_change_order_verification(p_change_order_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  code text := lpad((floor(random() * 1000000))::int::text, 6, '0');
  result public.change_orders;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  update public.change_orders
  set
    guest_verification_code_hash = public.hash_access_token(code),
    guest_verification_expires_at = now() + interval '30 minutes'
  where id = p_change_order_id
  returning * into result;

  perform public.log_change_order_event(
    result.id,
    'verification_issued',
    'Guest verification code issued',
    '{}'::jsonb
  );

  -- Return plaintext once for staff/SMS delivery path
  return code;
end;
$$;

revoke all on function public.publish_change_order(uuid) from public;
grant execute on function public.publish_change_order(uuid) to authenticated;
revoke all on function public.respond_to_change_order(uuid, text, text, text, text) from public;
grant execute on function public.respond_to_change_order(uuid, text, text, text, text) to anon, authenticated;
revoke all on function public.request_change_order_verification(uuid) from public;
grant execute on function public.request_change_order_verification(uuid) to authenticated;

alter table public.project_documents enable row level security;
alter table public.change_orders enable row level security;
alter table public.change_order_files enable row level security;
alter table public.change_order_events enable row level security;

create policy "Staff manage documents"
  on public.project_documents for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Contractors read contractor+client documents"
  on public.project_documents for select
  to authenticated
  using (
    visibility in ('contractor', 'client')
    and public.can_access_project_as_contractor(project_id)
  );

create policy "Clients read client documents"
  on public.project_documents for select
  to authenticated
  using (
    visibility = 'client'
    and public.client_owns_project(project_id)
  );

create policy "Staff manage change orders"
  on public.change_orders for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Clients read awaiting/responded change orders"
  on public.change_orders for select
  to authenticated
  using (
    public.client_owns_project(project_id)
    and status in ('awaiting_client', 'approved', 'declined')
  );

create policy "Staff manage change order files"
  on public.change_order_files for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Clients read client change order files"
  on public.change_order_files for select
  to authenticated
  using (
    visibility = 'client'
    and exists (
      select 1 from public.change_orders co
      where co.id = change_order_files.change_order_id
        and public.client_owns_project(co.project_id)
        and co.status in ('awaiting_client', 'approved', 'declined')
    )
  );

create policy "Staff manage change order events"
  on public.change_order_events for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Clients read events for visible change orders"
  on public.change_order_events for select
  to authenticated
  using (
    exists (
      select 1 from public.change_orders co
      where co.id = change_order_events.change_order_id
        and public.client_owns_project(co.project_id)
        and co.status in ('awaiting_client', 'approved', 'declined')
    )
  );
