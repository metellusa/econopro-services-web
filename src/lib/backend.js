import { requireSupabase } from "./supabase";

export async function fetchProfile(userId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, role, status, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function validateGuestAccessToken(rawToken) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("validate_guest_access", {
    raw_token: rawToken,
  });

  if (error) throw error;
  return Array.isArray(data) ? data[0] ?? null : data;
}

export async function createGuestAccessToken({
  clientId,
  allowedProjectIds = [],
  label = null,
  expiresAt = null,
}) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("create_guest_access_token", {
    p_client_id: clientId,
    p_allowed_project_ids: allowedProjectIds,
    p_label: label,
    p_expires_at: expiresAt,
  });

  if (error) throw error;
  return Array.isArray(data) ? data[0] ?? null : data;
}

export async function revokeGuestAccessToken(tokenId) {
  const supabase = requireSupabase();
  const { error } = await supabase.rpc("revoke_guest_access_token", {
    p_token_id: tokenId,
  });
  if (error) throw error;
}

export async function linkClientToUser(clientId, userId) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("link_client_to_user", {
    p_client_id: clientId,
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}
