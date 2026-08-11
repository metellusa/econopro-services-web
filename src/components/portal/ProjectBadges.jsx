import {
  ACTIVE_PROJECT_STATUSES,
  AWAITING_ACTION_STATUSES,
  UPCOMING_PROJECT_STATUSES,
  projectStatusLabel,
} from "../../lib/projects";

export function StatusBadge({ status }) {
  const tones = {
    estimate: "bg-slate-100 text-slate-700",
    approved: "bg-blue-50 text-blue-800",
    scheduled: "bg-indigo-50 text-indigo-800",
    in_progress: "bg-amber-50 text-amber-900",
    final_review: "bg-orange-50 text-orange-900",
    completed: "bg-emerald-50 text-emerald-800",
    cancelled: "bg-rose-50 text-rose-800",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[status] || "bg-slate-100 text-slate-700",
      ].join(" ")}
    >
      {projectStatusLabel(status)}
    </span>
  );
}

export function groupProjects(projects) {
  return {
    awaiting: projects.filter((p) =>
      AWAITING_ACTION_STATUSES.includes(p.status)
    ),
    active: projects.filter((p) => ACTIVE_PROJECT_STATUSES.includes(p.status)),
    upcoming: projects.filter((p) =>
      UPCOMING_PROJECT_STATUSES.includes(p.status)
    ),
    completed: projects.filter((p) => p.status === "completed"),
  };
}
