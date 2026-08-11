/**
 * Notification provider adapters.
 * Real credentials stay in Netlify env / function runtime, never in the Vite bundle.
 */

export const NOTIFICATION_TYPES = Object.freeze({
  PROJECT_CREATED: "project_created",
  PROJECT_SCHEDULED: "project_scheduled",
  WORK_STARTED: "work_started",
  PHASE_STARTED: "phase_started",
  PHASE_COMPLETED: "phase_completed",
  PROGRESS_UPDATE_PUBLISHED: "progress_update_published",
  CLIENT_PHOTOS_PUBLISHED: "client_photos_published",
  SCHEDULE_CHANGED: "schedule_changed",
  ISSUE_CLIENT_ATTENTION: "issue_client_attention",
  CHANGE_ORDER_APPROVAL: "change_order_approval",
  FINAL_WALKTHROUGH_READY: "final_walkthrough_ready",
  PROJECT_COMPLETED: "project_completed",
});

export function isNotificationDevMode() {
  return (
    import.meta.env.VITE_NOTIFICATIONS_MODE === "development" ||
    import.meta.env.DEV ||
    import.meta.env.VITE_NOTIFICATIONS_MODE !== "production"
  );
}

export async function consoleEmailAdapter({ to, subject, body }) {
  console.info("[notifications:dev:email]", { to, subject, body });
  return {
    ok: true,
    provider: "console",
    providerRef: `console-email-${Date.now()}`,
  };
}

export async function consoleSmsAdapter({ to, body }) {
  console.info("[notifications:dev:sms]", { to, body });
  return {
    ok: true,
    provider: "console",
    providerRef: `console-sms-${Date.now()}`,
  };
}

export async function httpEmailAdapter(payload) {
  const endpoint =
    import.meta.env.VITE_NOTIFICATION_FUNCTION_URL ||
    "/.netlify/functions/send-notification";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel: "email", ...payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Email provider request failed");
  }
  return data;
}

export async function httpSmsAdapter(payload) {
  const endpoint =
    import.meta.env.VITE_NOTIFICATION_FUNCTION_URL ||
    "/.netlify/functions/send-notification";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel: "sms", ...payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "SMS provider request failed");
  }
  return data;
}

export function getEmailAdapter() {
  return isNotificationDevMode() ? consoleEmailAdapter : httpEmailAdapter;
}

export function getSmsAdapter() {
  return isNotificationDevMode() ? consoleSmsAdapter : httpSmsAdapter;
}
