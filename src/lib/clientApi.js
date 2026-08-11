import { requireSupabase } from "./supabase";
import { createGuestAccessToken, revokeGuestAccessToken } from "./backend";

export async function listClientProjects() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      property_address,
      service_type,
      status,
      progress_percent,
      estimated_completion_date,
      actual_completion_date,
      client_summary,
      updated_at
    `
    )
    .is("archived_at", null)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getClientProjectPayload(projectId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("get_client_project_payload", {
    p_project_id: projectId,
  });
  if (error) throw error;
  return data;
}

export async function getGuestProjectPayload(token) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("get_guest_project_payload", {
    raw_token: token,
  });
  if (error) throw error;
  return data;
}

export async function listGuestTokens(clientId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("list_guest_tokens_for_client", {
    p_client_id: clientId,
  });
  if (error) throw error;
  return data || [];
}

export async function generateGuestLink(clientId, projectIds = [], label = "Project access") {
  return createGuestAccessToken({
    clientId,
    allowedProjectIds: projectIds,
    label,
    expiresAt: null,
  });
}

export async function revokeGuestLink(tokenId) {
  return revokeGuestAccessToken(tokenId);
}

export async function requestClientAccountLink({ email, password, fullName }) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${import.meta.env.VITE_APP_URL || window.location.origin}/client`,
    },
  });
  if (error) throw error;

  // Staff can later call link_client_to_user; self-link if email matches a guest client.
  if (data.user?.id) {
    const { data: clients } = await supabase
      .from("clients")
      .select("id, email, user_id")
      .ilike("email", email)
      .is("user_id", null)
      .limit(1);

    if (clients?.[0]?.id) {
      const { error: linkError } = await supabase.rpc("link_client_to_user", {
        p_client_id: clients[0].id,
        p_user_id: data.user.id,
      });
      if (linkError) {
        // Profile may not yet allow self-link until email confirmed; surface softly.
        console.warn(linkError.message);
      }
    }
  }

  return data;
}
