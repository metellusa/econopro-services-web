import { requireSupabase } from "./supabase";
import { listSubmittedProgressUpdates, listOpenIssues } from "./contractorApi";
import { listNotificationLogs } from "./notifications/service";
import { listChangeOrders } from "./changeOrderApi";
import { listProjects, listClients, listAssignableProfiles } from "./projectApi";

export async function getOperationsSnapshot() {
  const today = new Date().toISOString().slice(0, 10);

  const [projects, updates, issues, notifications, changeOrders, clients, profiles] =
    await Promise.all([
      listProjects({ includeArchived: false }),
      listSubmittedProgressUpdates(),
      listOpenIssues(),
      listNotificationLogs({ status: "failed" }),
      listChangeOrders(),
      listClients(),
      listAssignableProfiles(),
    ]);

  const active = projects.filter((p) =>
    ["approved", "scheduled", "in_progress", "final_review"].includes(p.status)
  );
  const startingSoon = projects.filter((p) => {
    if (!p.start_date) return false;
    const start = p.start_date;
    return start >= today && start <= addDays(today, 7);
  });
  const awaitingReview = updates.filter((u) =>
    ["submitted", "approved"].includes(u.status)
  );
  const awaitingClient = changeOrders.filter((o) => o.status === "awaiting_client");
  const blocked = [];
  const overduePhases = [];
  const overdueTasks = [];

  projects.forEach((project) => {
    (project.project_assignees || []).forEach(() => {});
  });

  // Lightweight overdue scan via phases query
  const supabase = requireSupabase();
  const { data: phases } = await supabase
    .from("project_phases")
    .select(
      `
      id,
      name,
      status,
      due_date,
      project_id,
      projects:project_id (id, title, status),
      project_phase_tasks (id, title, status, due_date, assigned_profile_id)
    `
    )
    .is("projects.archived_at", null);

  (phases || []).forEach((phase) => {
    if (phase.status === "blocked") {
      blocked.push(phase);
    }
    if (
      phase.due_date &&
      phase.due_date < today &&
      phase.status !== "completed"
    ) {
      overduePhases.push(phase);
    }
    (phase.project_phase_tasks || []).forEach((task) => {
      if (
        task.due_date &&
        task.due_date < today &&
        task.status !== "completed" &&
        task.status !== "skipped"
      ) {
        overdueTasks.push({ ...task, phase });
      }
    });
  });

  const contractors = profiles.filter((p) => p.role === "contractor");
  const contractorWorkload = contractors.map((person) => {
    const assignedProjects = projects.filter((project) =>
      (project.project_assignees || []).some(
        (row) =>
          row.assignee_role === "contractor" && row.profile_id === person.id
      )
    );
    const personOverdue = overdueTasks.filter(
      (task) => task.assigned_profile_id === person.id
    );
    return {
      ...person,
      activeAssignments: assignedProjects.length,
      overdueTasks: personOverdue.length,
    };
  });

  return {
    counts: {
      active: active.length,
      startingSoon: startingSoon.length,
      awaitingReview: awaitingReview.length,
      openIssues: issues.length,
      awaitingClient: awaitingClient.length,
      blocked: blocked.length,
      overduePhases: overduePhases.length,
      failedNotifications: notifications.length,
      clients: clients.length,
    },
    active,
    startingSoon,
    awaitingReview,
    issues,
    awaitingClient,
    blocked,
    overduePhases,
    overdueTasks,
    failedNotifications: notifications,
    contractorWorkload,
    clients,
  };
}

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export async function searchClients(term = "") {
  const clients = await listClients();
  if (!term.trim()) return clients;
  const q = term.trim().toLowerCase();
  return clients.filter((client) =>
    [client.full_name, client.email, client.phone]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}
