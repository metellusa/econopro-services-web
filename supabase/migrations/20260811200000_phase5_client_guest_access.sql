-- Phase 5: Client-safe project views + guest project payload RPC

create or replace function public.get_client_project_payload(p_project_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb;
begin
  if not public.is_staff() and not public.client_owns_project(p_project_id) then
    raise exception 'not authorized';
  end if;

  select jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'property_address', p.property_address,
    'service_type', p.service_type,
    'status', p.status,
    'progress_percent', p.progress_percent,
    'start_date', p.start_date,
    'estimated_completion_date', p.estimated_completion_date,
    'actual_completion_date', p.actual_completion_date,
    'client_summary', p.client_summary,
    'phases', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', pp.id,
          'name', pp.name,
          'description', pp.description,
          'status', pp.status,
          'sort_order', pp.sort_order,
          'progress_percent', pp.progress_percent,
          'due_date', pp.due_date,
          'client_facing_update', pp.client_facing_update,
          'completed_at', pp.completed_at
        )
        order by pp.sort_order
      )
      from public.project_phases pp
      where pp.project_id = p.id
        and pp.client_visible = true
    ), '[]'::jsonb),
    'updates', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', u.id,
          'message', coalesce(u.published_client_update, u.proposed_client_update),
          'published_at', u.published_at,
          'phase_id', u.phase_id,
          'media', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', m.id,
                'file_name', m.file_name,
                'caption', m.caption,
                'storage_path', m.storage_path
              )
            )
            from public.progress_update_media m
            where m.progress_update_id = u.id
              and m.visibility = 'client'
          ), '[]'::jsonb)
        )
        order by u.published_at desc
      )
      from public.progress_updates u
      where u.project_id = p.id
        and u.status = 'published'
    ), '[]'::jsonb),
    'files', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', f.id,
          'file_name', f.file_name,
          'created_at', f.created_at,
          'storage_path', f.storage_path
        )
      )
      from public.project_files f
      where f.project_id = p.id
        and f.visibility = 'client'
    ), '[]'::jsonb),
    'managers', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'full_name', pr.full_name,
          'email', pr.email,
          'phone', pr.phone
        )
      )
      from public.project_assignees a
      join public.profiles pr on pr.id = a.profile_id
      where a.project_id = p.id
        and a.assignee_role in ('project_manager', 'staff')
    ), '[]'::jsonb)
  )
  into payload
  from public.projects p
  where p.id = p_project_id;

  return payload;
end;
$$;

create or replace function public.get_guest_project_payload(raw_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  access_row record;
  project_id uuid;
  payload jsonb;
begin
  select * into access_row
  from public.validate_guest_access(raw_token)
  limit 1;

  if access_row.token_id is null then
    return null;
  end if;

  if access_row.allowed_project_ids is null
    or cardinality(access_row.allowed_project_ids) = 0 then
    select p.id into project_id
    from public.projects p
    where p.client_id = access_row.client_id
      and p.archived_at is null
    order by p.updated_at desc
    limit 1;
  else
    project_id := access_row.allowed_project_ids[1];
  end if;

  if project_id is null then
    return jsonb_build_object(
      'token_id', access_row.token_id,
      'client_name', access_row.client_name,
      'project', null
    );
  end if;

  -- Ensure project belongs to token client
  if not exists (
    select 1 from public.projects p
    where p.id = project_id
      and p.client_id = access_row.client_id
  ) then
    return null;
  end if;

  payload := public.get_client_project_payload(project_id);

  return jsonb_build_object(
    'token_id', access_row.token_id,
    'client_name', access_row.client_name,
    'client_id', access_row.client_id,
    'expires_at', access_row.expires_at,
    'project', payload
  );
end;
$$;

-- Bypass ownership check inside guest RPC by temporarily trusting security definer path:
-- redefine guest to build payload inline without calling get_client_project_payload's auth gate.
create or replace function public.get_guest_project_payload(raw_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  access_row record;
  project_id uuid;
  p public.projects;
  payload jsonb;
begin
  select * into access_row
  from public.validate_guest_access(raw_token)
  limit 1;

  if access_row.token_id is null then
    return null;
  end if;

  if access_row.allowed_project_ids is null
    or cardinality(access_row.allowed_project_ids) = 0 then
    select proj.id into project_id
    from public.projects proj
    where proj.client_id = access_row.client_id
      and proj.archived_at is null
    order by proj.updated_at desc
    limit 1;
  else
    project_id := access_row.allowed_project_ids[1];
  end if;

  if project_id is null then
    return jsonb_build_object(
      'token_id', access_row.token_id,
      'client_name', access_row.client_name,
      'client_id', access_row.client_id,
      'project', null
    );
  end if;

  select * into p from public.projects where id = project_id and client_id = access_row.client_id;
  if not found then
    return null;
  end if;

  select jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'property_address', p.property_address,
    'service_type', p.service_type,
    'status', p.status,
    'progress_percent', p.progress_percent,
    'start_date', p.start_date,
    'estimated_completion_date', p.estimated_completion_date,
    'actual_completion_date', p.actual_completion_date,
    'client_summary', p.client_summary,
    'phases', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', pp.id,
          'name', pp.name,
          'description', pp.description,
          'status', pp.status,
          'sort_order', pp.sort_order,
          'progress_percent', pp.progress_percent,
          'due_date', pp.due_date,
          'client_facing_update', pp.client_facing_update,
          'completed_at', pp.completed_at
        )
        order by pp.sort_order
      )
      from public.project_phases pp
      where pp.project_id = p.id and pp.client_visible = true
    ), '[]'::jsonb),
    'updates', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', u.id,
          'message', coalesce(u.published_client_update, u.proposed_client_update),
          'published_at', u.published_at,
          'phase_id', u.phase_id
        )
        order by u.published_at desc
      )
      from public.progress_updates u
      where u.project_id = p.id and u.status = 'published'
    ), '[]'::jsonb),
    'files', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', f.id,
          'file_name', f.file_name,
          'created_at', f.created_at
        )
      )
      from public.project_files f
      where f.project_id = p.id and f.visibility = 'client'
    ), '[]'::jsonb),
    'managers', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'full_name', pr.full_name,
          'email', pr.email,
          'phone', pr.phone
        )
      )
      from public.project_assignees a
      join public.profiles pr on pr.id = a.profile_id
      where a.project_id = p.id
        and a.assignee_role in ('project_manager', 'staff')
    ), '[]'::jsonb)
  ) into payload;

  return jsonb_build_object(
    'token_id', access_row.token_id,
    'client_name', access_row.client_name,
    'client_id', access_row.client_id,
    'expires_at', access_row.expires_at,
    'project', payload
  );
end;
$$;

revoke all on function public.get_client_project_payload(uuid) from public;
grant execute on function public.get_client_project_payload(uuid) to authenticated;
revoke all on function public.get_guest_project_payload(text) from public;
grant execute on function public.get_guest_project_payload(text) to anon, authenticated;

-- List guest tokens for a client (staff)
create or replace function public.list_guest_tokens_for_client(p_client_id uuid)
returns setof public.guest_access_tokens
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'not authorized';
  end if;
  return query
  select *
  from public.guest_access_tokens
  where client_id = p_client_id
  order by created_at desc;
end;
$$;

revoke all on function public.list_guest_tokens_for_client(uuid) from public;
grant execute on function public.list_guest_tokens_for_client(uuid) to authenticated;
