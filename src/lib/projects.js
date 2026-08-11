export const PROJECT_STATUSES = Object.freeze([
  "estimate",
  "approved",
  "scheduled",
  "in_progress",
  "final_review",
  "completed",
  "cancelled",
]);

export const PROJECT_STATUS_LABELS = Object.freeze({
  estimate: "Estimate",
  approved: "Approved",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  final_review: "Final Review",
  completed: "Completed",
  cancelled: "Cancelled",
});

export const ACTIVE_PROJECT_STATUSES = Object.freeze([
  "approved",
  "scheduled",
  "in_progress",
  "final_review",
]);

export const UPCOMING_PROJECT_STATUSES = Object.freeze([
  "estimate",
  "approved",
  "scheduled",
]);

export const AWAITING_ACTION_STATUSES = Object.freeze([
  "estimate",
  "final_review",
]);

export const SERVICE_TYPE_OPTIONS = Object.freeze([
  "Flooring Installation",
  "Flooring Repair",
  "Drywall Installation",
  "Drywall Repair",
  "Interior Painting",
  "Exterior Painting",
  "Interior Design",
  "Property Maintenance",
  "Cleaning",
  "Other",
]);

export const ASSIGNEE_ROLES = Object.freeze({
  PROJECT_MANAGER: "project_manager",
  STAFF: "staff",
  CONTRACTOR: "contractor",
});

export function projectStatusLabel(status) {
  return PROJECT_STATUS_LABELS[status] || status;
}
