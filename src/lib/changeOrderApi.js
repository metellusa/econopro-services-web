import { requireSupabase } from "./supabase";

export async function listProjectDocuments(projectId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("project_documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function uploadProjectDocument({
  projectId,
  file,
  title,
  kind = "client_attachment",
  visibility = "client",
  description = "",
}) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const storagePath = `${projectId}/documents/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("project-files")
    .upload(storagePath, file, { contentType: file.type || undefined });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("project_documents")
    .insert({
      project_id: projectId,
      kind,
      title: title || file.name,
      description: description || null,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      file_size: file.size,
      visibility,
      uploaded_by: user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listChangeOrders(projectId) {
  const supabase = requireSupabase();
  let query = supabase
    .from("change_orders")
    .select(
      `
      *,
      change_order_files (*),
      change_order_events (*)
    `
    )
    .order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createChangeOrder(payload) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("change_orders")
    .insert({
      project_id: payload.project_id,
      title: payload.title,
      description: payload.description,
      reason: payload.reason || null,
      cost_adjustment: payload.cost_adjustment ?? null,
      schedule_impact_days: payload.schedule_impact_days ?? null,
      source_issue_id: payload.source_issue_id || null,
      status: "draft",
      created_by: user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;

  await supabase.rpc("log_project_activity", {
    p_project_id: payload.project_id,
    p_event_type: "change_order_created",
    p_summary: `Change order drafted: ${payload.title}`,
    p_metadata: { change_order_id: data.id },
  });

  return data;
}

export async function publishChangeOrder(changeOrderId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("publish_change_order", {
    p_change_order_id: changeOrderId,
  });
  if (error) throw error;
  return data;
}

export async function respondToChangeOrder({
  changeOrderId,
  response,
  comment = "",
  guestToken = null,
  verificationCode = null,
}) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("respond_to_change_order", {
    p_change_order_id: changeOrderId,
    p_response: response,
    p_comment: comment || null,
    p_guest_token: guestToken,
    p_verification_code: verificationCode,
  });
  if (error) throw error;
  return data;
}

export async function issueGuestVerification(changeOrderId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("request_change_order_verification", {
    p_change_order_id: changeOrderId,
  });
  if (error) throw error;
  return data;
}

export async function convertIssueToChangeOrder(issue) {
  return createChangeOrder({
    project_id: issue.project_id,
    title: `Change order: ${issue.title}`,
    description: issue.description,
    reason: issue.category,
    source_issue_id: issue.id,
  });
}
