import { requireSupabase } from "./supabase";

export async function listClients() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, full_name, email, phone, preferred_contact_method, is_guest, user_id, email_notifications_enabled, sms_notifications_enabled"
    )
    .order("full_name", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createClient(payload) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("clients")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listAssignableProfiles() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status")
    .in("role", ["admin", "staff", "contractor"])
    .eq("status", "active")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listProjects({
  search = "",
  status = "",
  serviceType = "",
  clientId = "",
  contractorId = "",
  includeArchived = false,
} = {}) {
  const supabase = requireSupabase();

  let query = supabase
    .from("projects")
    .select(
      `
      id,
      title,
      client_id,
      property_address,
      service_type,
      scope,
      status,
      start_date,
      estimated_completion_date,
      actual_completion_date,
      client_summary,
      archived_at,
      created_at,
      updated_at,
      clients:client_id (
        id,
        full_name,
        email,
        phone,
        is_guest
      ),
      project_assignees (
        id,
        profile_id,
        assignee_role,
        profiles:profile_id (
          id,
          full_name,
          email,
          role
        )
      )
    `
    )
    .order("updated_at", { ascending: false });

  if (!includeArchived) {
    query = query.is("archived_at", null);
  }
  if (status) query = query.eq("status", status);
  if (serviceType) query = query.eq("service_type", serviceType);
  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw error;

  let rows = data || [];

  if (contractorId) {
    rows = rows.filter((project) =>
      (project.project_assignees || []).some(
        (assignee) =>
          assignee.assignee_role === "contractor" &&
          assignee.profile_id === contractorId
      )
    );
  }

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    rows = rows.filter((project) => {
      const haystack = [
        project.title,
        project.property_address,
        project.service_type,
        project.clients?.full_name,
        project.clients?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }

  return rows;
}

export async function getProject(projectId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      clients:client_id (
        id,
        full_name,
        email,
        phone,
        preferred_contact_method,
        is_guest,
        user_id,
        email_notifications_enabled,
        sms_notifications_enabled
      ),
      project_assignees (
        id,
        profile_id,
        assignee_role,
        assigned_at,
        profiles:profile_id (
          id,
          full_name,
          email,
          role,
          phone
        )
      ),
      project_files (
        id,
        file_name,
        mime_type,
        file_size,
        visibility,
        storage_path,
        created_at,
        uploaded_by
      ),
      project_activity (
        id,
        event_type,
        summary,
        metadata,
        created_at,
        actor_id,
        profiles:actor_id (
          full_name,
          email
        )
      ),
      project_internal_notes (
        notes,
        updated_at,
        updated_by
      )
    `
    )
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProject({
  project,
  internalNotes = "",
  assigneeIds = { managers: [], staff: [], contractors: [] },
}) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: created, error } = await supabase
    .from("projects")
    .insert({
      ...project,
      created_by: user?.id ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  if (internalNotes?.trim()) {
    const { error: notesError } = await supabase
      .from("project_internal_notes")
      .upsert({
        project_id: created.id,
        notes: internalNotes.trim(),
        updated_by: user?.id ?? null,
      });
    if (notesError) throw notesError;
  }

  await syncProjectAssignees(created.id, assigneeIds);
  return created;
}

export async function updateProject(
  projectId,
  { project, internalNotes, assigneeIds }
) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: updated, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", projectId)
    .select("*")
    .single();

  if (error) throw error;

  if (typeof internalNotes === "string") {
    const { error: notesError } = await supabase
      .from("project_internal_notes")
      .upsert({
        project_id: projectId,
        notes: internalNotes,
        updated_by: user?.id ?? null,
      });
    if (notesError) throw notesError;
  }

  if (assigneeIds) {
    await syncProjectAssignees(projectId, assigneeIds);
  }

  return updated;
}

async function syncProjectAssignees(projectId, assigneeIds) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const desired = [
    ...(assigneeIds.managers || []).map((profile_id) => ({
      project_id: projectId,
      profile_id,
      assignee_role: "project_manager",
      assigned_by: user?.id ?? null,
    })),
    ...(assigneeIds.staff || []).map((profile_id) => ({
      project_id: projectId,
      profile_id,
      assignee_role: "staff",
      assigned_by: user?.id ?? null,
    })),
    ...(assigneeIds.contractors || []).map((profile_id) => ({
      project_id: projectId,
      profile_id,
      assignee_role: "contractor",
      assigned_by: user?.id ?? null,
    })),
  ];

  const { data: existing, error: existingError } = await supabase
    .from("project_assignees")
    .select("id, profile_id, assignee_role")
    .eq("project_id", projectId);

  if (existingError) throw existingError;

  const desiredKeys = new Set(
    desired.map((row) => `${row.profile_id}:${row.assignee_role}`)
  );
  const toDelete = (existing || []).filter(
    (row) => !desiredKeys.has(`${row.profile_id}:${row.assignee_role}`)
  );

  if (toDelete.length) {
    const { error: deleteError } = await supabase
      .from("project_assignees")
      .delete()
      .in(
        "id",
        toDelete.map((row) => row.id)
      );
    if (deleteError) throw deleteError;
  }

  const existingKeys = new Set(
    (existing || []).map((row) => `${row.profile_id}:${row.assignee_role}`)
  );
  const toInsert = desired.filter(
    (row) => !existingKeys.has(`${row.profile_id}:${row.assignee_role}`)
  );

  if (toInsert.length) {
    const { error: insertError } = await supabase
      .from("project_assignees")
      .insert(toInsert);
    if (insertError) throw insertError;
  }
}

export async function uploadProjectFile({
  projectId,
  file,
  visibility = "internal",
}) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const storagePath = `${projectId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("project_files")
    .insert({
      project_id: projectId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      file_size: file.size ?? null,
      visibility,
      uploaded_by: user?.id ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabase.rpc("log_project_activity", {
    p_project_id: projectId,
    p_event_type: "file_uploaded",
    p_summary: `File uploaded: ${file.name}`,
    p_metadata: { visibility, storage_path: storagePath },
  });

  return data;
}
