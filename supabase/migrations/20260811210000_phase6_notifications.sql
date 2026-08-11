-- Phase 6: Notification engine foundation

create type public.notification_channel as enum ('email', 'sms');

create type public.notification_status as enum (
  'queued',
  'sending',
  'sent',
  'failed',
  'skipped'
);

create type public.notification_type as enum (
  'project_created',
  'project_scheduled',
  'work_started',
  'phase_started',
  'phase_completed',
  'progress_update_published',
  'client_photos_published',
  'schedule_changed',
  'issue_client_attention',
  'change_order_approval',
  'final_walkthrough_ready',
  'project_completed'
);

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  notification_type public.notification_type not null,
  channel public.notification_channel not null,
  destination_masked text not null,
  destination_hash text,
  subject text,
  body text not null,
  status public.notification_status not null default 'queued',
  provider text,
  provider_ref text,
  error_message text,
  retry_count int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notification_logs_project_idx on public.notification_logs (project_id, created_at desc);
create index notification_logs_status_idx on public.notification_logs (status);

create trigger notification_logs_set_updated_at
before update on public.notification_logs
for each row execute function public.set_updated_at();

create or replace function public.mask_destination(value text, channel public.notification_channel)
returns text
language plpgsql
immutable
as $$
begin
  if value is null or length(value) = 0 then
    return 'unknown';
  end if;
  if channel = 'email' then
    return regexp_replace(value, '(^.).*(@.*$)', '\1***\2');
  end if;
  return regexp_replace(value, '.(?=.{4})', '*');
end;
$$;

create or replace function public.enqueue_client_notifications(
  p_project_id uuid,
  p_notification_type public.notification_type,
  p_subject text,
  p_body_email text,
  p_body_sms text,
  p_metadata jsonb default '{}'::jsonb
)
returns setof public.notification_logs
language plpgsql
security definer
set search_path = public
as $$
declare
  client_row public.clients;
  app_url text := coalesce(current_setting('app.public_url', true), 'https://econoproservices.com');
  link text;
  email_body text;
  sms_body text;
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;

  select c.* into client_row
  from public.projects p
  join public.clients c on c.id = p.client_id
  where p.id = p_project_id;

  if not found then
    return;
  end if;

  if client_row.user_id is not null then
    link := app_url || '/client/projects/' || p_project_id::text;
  else
    link := app_url || '/project-access/REQUEST_GUEST_LINK';
  end if;

  email_body := replace(p_body_email, '{{link}}', link);
  sms_body := replace(p_body_sms, '{{link}}', link);

  if client_row.email_notifications_enabled and client_row.email is not null then
    return query
    insert into public.notification_logs (
      client_id, project_id, notification_type, channel, destination_masked,
      destination_hash, subject, body, status, provider, metadata, created_by
    )
    values (
      client_row.id,
      p_project_id,
      p_notification_type,
      'email',
      public.mask_destination(client_row.email, 'email'),
      encode(digest(lower(client_row.email), 'sha256'), 'hex'),
      p_subject,
      email_body,
      'queued',
      'pending',
      coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('destination', client_row.email),
      auth.uid()
    )
    returning *;
  else
    return query
    insert into public.notification_logs (
      client_id, project_id, notification_type, channel, destination_masked,
      subject, body, status, provider, metadata, created_by, error_message
    )
    values (
      client_row.id,
      p_project_id,
      p_notification_type,
      'email',
      public.mask_destination(coalesce(client_row.email, 'none'), 'email'),
      p_subject,
      email_body,
      'skipped',
      'preferences',
      coalesce(p_metadata, '{}'::jsonb),
      auth.uid(),
      'Email notifications disabled or missing email'
    )
    returning *;
  end if;

  if client_row.sms_notifications_enabled and client_row.phone is not null then
    return query
    insert into public.notification_logs (
      client_id, project_id, notification_type, channel, destination_masked,
      destination_hash, subject, body, status, provider, metadata, created_by
    )
    values (
      client_row.id,
      p_project_id,
      p_notification_type,
      'sms',
      public.mask_destination(client_row.phone, 'sms'),
      encode(digest(client_row.phone, 'sha256'), 'hex'),
      null,
      sms_body,
      'queued',
      'pending',
      coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('destination', client_row.phone),
      auth.uid()
    )
    returning *;
  else
    return query
    insert into public.notification_logs (
      client_id, project_id, notification_type, channel, destination_masked,
      subject, body, status, provider, metadata, created_by, error_message
    )
    values (
      client_row.id,
      p_project_id,
      p_notification_type,
      'sms',
      public.mask_destination(coalesce(client_row.phone, 'none'), 'sms'),
      null,
      sms_body,
      'skipped',
      'preferences',
      coalesce(p_metadata, '{}'::jsonb),
      auth.uid(),
      'SMS notifications disabled or missing phone'
    )
    returning *;
  end if;
end;
$$;

revoke all on function public.enqueue_client_notifications(uuid, public.notification_type, text, text, text, jsonb) from public;
grant execute on function public.enqueue_client_notifications(uuid, public.notification_type, text, text, text, jsonb) to authenticated;

-- Extend publish action to enqueue notifications without failing publish
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
  project_title text;
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

  if next_status = 'published' then
    select title into project_title from public.projects where id = result.project_id;
    begin
      perform public.enqueue_client_notifications(
        result.project_id,
        'progress_update_published',
        'Update on your EconoPro project',
        format(
          E'Hello,\n\nThere is a new update on your project "%s":\n\n%s\n\nView progress: {{link}}\n\nEconoPro Services',
          project_title,
          coalesce(result.published_client_update, '')
        ),
        format(
          'EconoPro: New update on your project "%s". View: {{link}}',
          project_title
        ),
        jsonb_build_object('update_id', result.id)
      );
    exception when others then
      -- Publishing must succeed even if notification enqueue fails
      perform public.log_project_activity(
        result.project_id,
        'notification_enqueue_failed',
        'Failed to enqueue client notifications',
        jsonb_build_object('error', SQLERRM, 'update_id', result.id)
      );
    end;
  end if;

  return result;
end;
$$;

alter table public.notification_logs enable row level security;

create policy "Staff manage notification logs"
  on public.notification_logs for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());
