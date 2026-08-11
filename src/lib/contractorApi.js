import { requireSupabase } from "./supabase";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function listContractorProjects() {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: assignments, error: assignError } = await supabase
    .from("project_assignees")
    .select("project_id")
    .eq("profile_id", user.id)
    .eq("assignee_role", "contractor");
  if (assignError) throw assignError;

  const { data: phaseAssignments, error: phaseError } = await supabase
    .from("project_phase_assignees")
    .select("phase_id, project_phases!inner(project_id)")
    .eq("profile_id", user.id);
  if (phaseError) throw phaseError;

  const projectIds = [
    ...new Set([
      ...(assignments || []).map((row) => row.project_id),
      ...(phaseAssignments || []).map((row) => row.project_phases.project_id),
    ]),
  ];

  if (!projectIds.length) return [];

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      property_address,
      service_type,
      scope,
      status,
      start_date,
      estimated_completion_date,
      client_summary,
      progress_percent,
      project_phases (
        id,
        name,
        status,
        due_date,
        sort_order,
        progress_percent,
        project_phase_tasks (
          id,
          title,
          status,
          due_date,
          is_required,
          assigned_profile_id,
          completion_note
        )
      ),
      project_assignees (
        assignee_role,
        profiles:profile_id (full_name, email, phone, role)
      )
    `
    )
    .in("id", projectIds)
    .is("archived_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getContractorProject(projectId) {
  const rows = await listContractorProjects();
  return rows.find((row) => row.id === projectId) || null;
}

export async function completeContractorTask(taskId, completionNote = "") {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("project_phase_tasks")
    .update({
      status: "completed",
      completion_note: completionNote || null,
      completed_by: user?.id ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createProgressUpdate(payload) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("progress_updates")
    .insert({
      project_id: payload.project_id,
      phase_id: payload.phase_id || null,
      author_id: user.id,
      internal_note: payload.internal_note || "",
      proposed_client_update: payload.proposed_client_update || "",
      status: "draft",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function submitProgressUpdate(updateId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("submit_progress_update", {
    p_update_id: updateId,
  });
  if (error) throw error;
  return data;
}

export async function uploadProgressMedia({
  updateId,
  projectId,
  file,
  caption = "",
  visibility = "internal",
}) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Photos must be 8MB or smaller.");
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, or HEIC photos are allowed.");
  }

  const supabase = requireSupabase();
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const storagePath = `${projectId}/progress/${updateId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(storagePath, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("progress_update_media")
    .insert({
      progress_update_id: updateId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      file_size: file.size,
      caption: caption || null,
      visibility,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createProjectIssue(payload) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("project_issues")
    .insert({
      project_id: payload.project_id,
      phase_id: payload.phase_id || null,
      reported_by: user.id,
      category: payload.category,
      title: payload.title,
      description: payload.description,
      status: "open",
    })
    .select("*")
    .single();
  if (error) throw error;

  await supabase.rpc("log_project_activity", {
    p_project_id: payload.project_id,
    p_event_type: "issue_reported",
    p_summary: `Issue reported: ${payload.title}`,
    p_metadata: { issue_id: data.id, category: payload.category },
  });

  return data;
}

export async function listMyProgressUpdates(projectId) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("progress_updates")
    .select("*, progress_update_media(*)")
    .eq("project_id", projectId)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listSubmittedProgressUpdates() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("progress_updates")
    .select(
      `
      *,
      projects:project_id (id, title),
      project_phases:phase_id (id, name),
      profiles:author_id (full_name, email),
      progress_update_media (*)
    `
    )
    .in("status", ["submitted", "approved", "rejected"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function listOpenIssues() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("project_issues")
    .select(
      `
      *,
      projects:project_id (id, title),
      profiles:reported_by (full_name, email)
    `
    )
    .in("status", ["open", "acknowledged"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function reviewProgressUpdate(updateId, action, publishedText, reviewNotes) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("review_progress_update", {
    p_update_id: updateId,
    p_action: action,
    p_published_client_update: publishedText || null,
    p_review_notes: reviewNotes || null,
  });
  if (error) throw error;
  return data;
}

export async function updateIssueStatus(issueId, status, staffNotes = "") {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("project_issues")
    .update({ status, staff_notes: staffNotes || null })
    .eq("id", issueId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
