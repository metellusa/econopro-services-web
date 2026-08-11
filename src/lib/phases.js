export const PHASE_STATUSES = Object.freeze([
  "not_started",
  "ready",
  "in_progress",
  "blocked",
  "awaiting_review",
  "completed",
]);

export const PHASE_STATUS_LABELS = Object.freeze({
  not_started: "Not started",
  ready: "Ready",
  in_progress: "In progress",
  blocked: "Blocked",
  awaiting_review: "Awaiting review",
  completed: "Completed",
});

export const TASK_STATUSES = Object.freeze([
  "pending",
  "in_progress",
  "completed",
  "skipped",
]);

export function phaseStatusLabel(status) {
  return PHASE_STATUS_LABELS[status] || status;
}
