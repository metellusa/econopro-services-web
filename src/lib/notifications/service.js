import { requireSupabase } from "../supabase";
import { getEmailAdapter, getSmsAdapter, isNotificationDevMode } from "./adapters";

export async function enqueueClientNotifications({
  projectId,
  type,
  subject,
  emailBody,
  smsBody,
  metadata = {},
}) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("enqueue_client_notifications", {
    p_project_id: projectId,
    p_notification_type: type,
    p_subject: subject,
    p_body_email: emailBody,
    p_body_sms: smsBody,
    p_metadata: metadata,
  });
  if (error) throw error;
  return data || [];
}

export async function listNotificationLogs({ projectId, status } = {}) {
  const supabase = requireSupabase();
  let query = supabase
    .from("notification_logs")
    .select(
      `
      id,
      client_id,
      project_id,
      notification_type,
      channel,
      destination_masked,
      subject,
      body,
      status,
      provider,
      provider_ref,
      error_message,
      retry_count,
      sent_at,
      created_at,
      projects:project_id (title)
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (projectId) query = query.eq("project_id", projectId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function processNotificationLog(logId) {
  const supabase = requireSupabase();
  const { data: log, error } = await supabase
    .from("notification_logs")
    .select("*")
    .eq("id", logId)
    .single();
  if (error) throw error;

  if (!["queued", "failed"].includes(log.status)) {
    return log;
  }

  await supabase
    .from("notification_logs")
    .update({ status: "sending" })
    .eq("id", logId);

  const destination = log.metadata?.destination;
  if (!destination) {
    const failed = {
      status: "failed",
      error_message: "Missing destination in metadata",
      retry_count: (log.retry_count || 0) + 1,
    };
    await supabase.from("notification_logs").update(failed).eq("id", logId);
    return { ...log, ...failed };
  }

  try {
    const adapter =
      log.channel === "email" ? getEmailAdapter() : getSmsAdapter();
    const result = await adapter({
      to: destination,
      subject: log.subject,
      body: log.body,
      notificationId: log.id,
    });

    const sent = {
      status: "sent",
      provider: result.provider || (isNotificationDevMode() ? "console" : "http"),
      provider_ref: result.providerRef || null,
      sent_at: new Date().toISOString(),
      error_message: null,
    };

    await supabase.from("notification_logs").update(sent).eq("id", logId);

    await supabase.rpc("log_project_activity", {
      p_project_id: log.project_id,
      p_event_type: `${log.channel}_sent`,
      p_summary: `${log.channel.toUpperCase()} notification sent`,
      p_metadata: { notification_id: log.id, type: log.notification_type },
    });

    return { ...log, ...sent };
  } catch (err) {
    const failed = {
      status: "failed",
      error_message: err.message || "Send failed",
      retry_count: (log.retry_count || 0) + 1,
      provider: isNotificationDevMode() ? "console" : "http",
    };
    await supabase.from("notification_logs").update(failed).eq("id", logId);
    throw err;
  }
}

export async function processQueuedNotifications(limit = 20) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("notification_logs")
    .select("id")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;

  const results = [];
  for (const row of data || []) {
    try {
      results.push(await processNotificationLog(row.id));
    } catch (err) {
      results.push({ id: row.id, status: "failed", error: err.message });
    }
  }
  return results;
}
