import { requireSupabase } from "./supabase";

export async function listPhaseTemplates({ activeOnly = false } = {}) {
  const supabase = requireSupabase();
  let query = supabase
    .from("phase_templates")
    .select(
      `
      id,
      name,
      service_category,
      description,
      is_active,
      created_at,
      phase_template_phases (
        id,
        name,
        description,
        sort_order,
        client_visible,
        phase_template_tasks (
          id,
          title,
          description,
          is_required,
          sort_order
        )
      )
    `
    )
    .order("name", { ascending: true });

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((template) => ({
    ...template,
    phase_template_phases: [...(template.phase_template_phases || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }));
}

export async function createPhaseTemplate(payload) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { phases = [], ...template } = payload;
  const { data: created, error } = await supabase
    .from("phase_templates")
    .insert({ ...template, created_by: user?.id ?? null })
    .select("*")
    .single();
  if (error) throw error;

  for (const [index, phase] of phases.entries()) {
    const { tasks = [], ...phaseFields } = phase;
    const { data: phaseRow, error: phaseError } = await supabase
      .from("phase_template_phases")
      .insert({
        template_id: created.id,
        name: phaseFields.name,
        description: phaseFields.description || null,
        sort_order: phaseFields.sort_order ?? index + 1,
        client_visible: phaseFields.client_visible !== false,
      })
      .select("*")
      .single();
    if (phaseError) throw phaseError;

    if (tasks.length) {
      const { error: taskError } = await supabase.from("phase_template_tasks").insert(
        tasks.map((task, taskIndex) => ({
          template_phase_id: phaseRow.id,
          title: task.title,
          description: task.description || null,
          is_required: task.is_required !== false,
          sort_order: task.sort_order ?? taskIndex + 1,
        }))
      );
      if (taskError) throw taskError;
    }
  }

  return created;
}

export async function setTemplateActive(templateId, isActive) {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("phase_templates")
    .update({ is_active: isActive })
    .eq("id", templateId);
  if (error) throw error;
}

export async function applyPhaseTemplate(projectId, templateId, replaceExisting = false) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("apply_phase_template", {
    p_project_id: projectId,
    p_template_id: templateId,
    p_replace_existing: replaceExisting,
  });
  if (error) throw error;
  return data;
}

export async function listProjectPhases(projectId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("project_phases")
    .select(
      `
      *,
      project_phase_tasks (*),
      project_phase_assignees (
        id,
        profile_id,
        profiles:profile_id (id, full_name, email)
      ),
      project_phase_internal_notes (notes)
    `
    )
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data || []).map((phase) => ({
    ...phase,
    project_phase_tasks: [...(phase.project_phase_tasks || [])].sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }));
}

export async function createProjectPhase(projectId, payload) {
  const supabase = requireSupabase();
  const { data: existing } = await supabase
    .from("project_phases")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order || 0) + 1;
  const { data, error } = await supabase
    .from("project_phases")
    .insert({
      project_id: projectId,
      name: payload.name,
      description: payload.description || null,
      sort_order: payload.sort_order ?? nextOrder,
      status: payload.status || "not_started",
      due_date: payload.due_date || null,
      client_visible: payload.client_visible !== false,
      client_facing_update: payload.client_facing_update || null,
    })
    .select("*")
    .single();
  if (error) throw error;

  if (payload.internal_notes) {
    await supabase.from("project_phase_internal_notes").upsert({
      phase_id: data.id,
      notes: payload.internal_notes,
    });
  }

  return data;
}

export async function updateProjectPhase(phaseId, patch) {
  const supabase = requireSupabase();
  const { internal_notes, assignee_ids, ...fields } = patch;

  const { data, error } = await supabase
    .from("project_phases")
    .update(fields)
    .eq("id", phaseId)
    .select("*")
    .single();
  if (error) throw error;

  if (typeof internal_notes === "string") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("project_phase_internal_notes").upsert({
      phase_id: phaseId,
      notes: internal_notes,
      updated_by: user?.id ?? null,
    });
  }

  if (Array.isArray(assignee_ids)) {
    const { data: existing } = await supabase
      .from("project_phase_assignees")
      .select("id, profile_id")
      .eq("phase_id", phaseId);

    const desired = new Set(assignee_ids);
    const toDelete = (existing || []).filter((row) => !desired.has(row.profile_id));
    if (toDelete.length) {
      await supabase
        .from("project_phase_assignees")
        .delete()
        .in(
          "id",
          toDelete.map((row) => row.id)
        );
    }

    const existingIds = new Set((existing || []).map((row) => row.profile_id));
    const toInsert = assignee_ids.filter((id) => !existingIds.has(id));
    if (toInsert.length) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("project_phase_assignees").insert(
        toInsert.map((profile_id) => ({
          phase_id: phaseId,
          profile_id,
          assigned_by: user?.id ?? null,
        }))
      );
    }
  }

  return data;
}

export async function completePhase(phaseId, { override = false, reason = "" } = {}) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("complete_phase_with_override", {
    p_phase_id: phaseId,
    p_override: override,
    p_override_reason: reason || null,
  });
  if (error) throw error;
  return data;
}

export async function reorderProjectPhases(projectId, orderedPhaseIds) {
  const supabase = requireSupabase();
  for (const [index, phaseId] of orderedPhaseIds.entries()) {
    const { error } = await supabase
      .from("project_phases")
      .update({ sort_order: index + 1 })
      .eq("id", phaseId)
      .eq("project_id", projectId);
    if (error) throw error;
  }
}

export async function upsertPhaseTask(phaseId, task) {
  const supabase = requireSupabase();
  if (task.id) {
    const { data, error } = await supabase
      .from("project_phase_tasks")
      .update({
        title: task.title,
        description: task.description || null,
        is_required: task.is_required !== false,
        status: task.status,
        due_date: task.due_date || null,
        assigned_profile_id: task.assigned_profile_id || null,
        client_visible: Boolean(task.client_visible),
        sort_order: task.sort_order,
      })
      .eq("id", task.id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("project_phase_tasks")
    .insert({
      phase_id: phaseId,
      title: task.title,
      description: task.description || null,
      is_required: task.is_required !== false,
      status: task.status || "pending",
      due_date: task.due_date || null,
      assigned_profile_id: task.assigned_profile_id || null,
      client_visible: Boolean(task.client_visible),
      sort_order: task.sort_order || 1,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProjectPhase(phaseId) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("project_phases").delete().eq("id", phaseId);
  if (error) throw error;
}
