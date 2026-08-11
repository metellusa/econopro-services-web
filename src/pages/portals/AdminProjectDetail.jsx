import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import { fieldClassName } from "../../components/ui/FormControls";
import { StatusBadge } from "../../components/portal/ProjectBadges";
import ProjectPhasesPanel from "../../components/portal/ProjectPhasesPanel";
import { getProject, updateProject, uploadProjectFile } from "../../lib/projectApi";
import { projectStatusLabel } from "../../lib/projects";

const TABS = [
  "Overview",
  "Phases",
  "Team",
  "Client",
  "Files",
  "Notes",
  "Activity",
];

export default function AdminProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [visibility, setVisibility] = useState("internal");

  async function reload() {
    const data = await getProject(projectId);
    setProject(data);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getProject(projectId);
        if (!cancelled) {
          if (!data) setError("Project not found.");
          setProject(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load project.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const activity = useMemo(() => {
    const rows = project?.project_activity || [];
    return [...rows].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [project]);

  const internalNotes =
    project?.project_internal_notes?.notes ??
    project?.project_internal_notes?.[0]?.notes ??
    "";

  async function handleArchiveToggle() {
    if (!project) return;
    try {
      await updateProject(project.id, {
        project: {
          archived_at: project.archived_at ? null : new Date().toISOString(),
          status: project.archived_at ? project.status : "cancelled",
        },
      });
      await reload();
    } catch (err) {
      setError(err.message || "Unable to update archive state.");
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file || !project) return;
    setUploading(true);
    setError("");
    try {
      await uploadProjectFile({
        projectId: project.id,
        file,
        visibility,
      });
      await reload();
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  if (loading) {
    return (
      <Section tone="cream">
        <Container>
          <p className="text-sm text-brand-muted">Loading project…</p>
        </Container>
      </Section>
    );
  }

  if (!project) {
    return (
      <Section tone="cream">
        <Container>
          <p className="text-sm text-red-700">{error || "Project not found."}</p>
          <Button to="/admin/projects" variant="outline" size="md" className="mt-4">
            Back to projects
          </Button>
        </Container>
      </Section>
    );
  }

  return (
    <Section tone="cream">
      <Container>
        <Link
          to="/admin/projects"
          className="text-sm font-semibold text-brand-navy hover:text-brand-gold"
        >
          ← All projects
        </Link>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-display-md text-brand-navy">
                {project.title}
              </h1>
              <StatusBadge status={project.status} />
              <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-navy">
                {project.progress_percent ?? 0}% complete
              </span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              {project.service_type} · {project.property_address}
            </p>
            {project.archived_at ? (
              <p className="mt-2 text-sm font-semibold text-rose-700">Archived</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={`/admin/projects/${project.id}/edit`} variant="secondary" size="md">
              Edit
            </Button>
            <Button type="button" variant="outline" size="md" onClick={handleArchiveToggle}>
              {project.archived_at ? "Restore" : "Cancel / Archive"}
            </Button>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-brand-border pb-px">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={[
                "whitespace-nowrap px-4 py-3 text-sm font-semibold transition",
                tab === item
                  ? "border-b-2 border-brand-gold text-brand-navy"
                  : "text-slate-500 hover:text-brand-navy",
              ].join(" ")}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-section border border-brand-border bg-white p-6 shadow-card">
          {tab === "Overview" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <Field label="Status" value={projectStatusLabel(project.status)} />
              <Field label="Progress" value={`${project.progress_percent ?? 0}%`} />
              <Field label="Service type" value={project.service_type} />
              <Field label="Start date" value={project.start_date || "—"} />
              <Field
                label="Estimated completion"
                value={project.estimated_completion_date || "—"}
              />
              <Field
                label="Actual completion"
                value={project.actual_completion_date || "—"}
              />
              <Field label="Address" value={project.property_address} />
              <div className="lg:col-span-2">
                <Field label="Scope" value={project.scope || "—"} />
              </div>
              <div className="lg:col-span-2">
                <Field
                  label="Client-facing summary"
                  value={project.client_summary || "—"}
                />
              </div>
            </div>
          ) : null}

          {tab === "Phases" ? (
            <ProjectPhasesPanel
              projectId={project.id}
              projectProgress={project.progress_percent ?? 0}
            />
          ) : null}

          {tab === "Team" ? (
            <AssigneeList assignees={project.project_assignees || []} />
          ) : null}

          {tab === "Client" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={project.clients?.full_name || "—"} />
              <Field
                label="Type"
                value={project.clients?.is_guest ? "Guest client" : "Registered / linked"}
              />
              <Field label="Email" value={project.clients?.email || "—"} />
              <Field label="Phone" value={project.clients?.phone || "—"} />
              <Field
                label="Preferred contact"
                value={project.clients?.preferred_contact_method || "—"}
              />
              <Field
                label="Notifications"
                value={`Email ${project.clients?.email_notifications_enabled ? "on" : "off"} · SMS ${project.clients?.sms_notifications_enabled ? "on" : "off"}`}
              />
            </div>
          ) : null}

          {tab === "Files" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-brand-navy">
                    Visibility
                  </label>
                  <select
                    className={fieldClassName()}
                    value={visibility}
                    onChange={(event) => setVisibility(event.target.value)}
                  >
                    <option value="internal">Internal only</option>
                    <option value="client">Client-visible</option>
                  </select>
                </div>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">
                  {uploading ? "Uploading…" : "Upload file"}
                  <input
                    type="file"
                    className="hidden"
                    disabled={uploading}
                    onChange={handleUpload}
                  />
                </label>
              </div>
              {(project.project_files || []).length === 0 ? (
                <p className="text-sm text-brand-muted">No files yet.</p>
              ) : (
                <ul className="divide-y divide-brand-border rounded-2xl border border-brand-border">
                  {(project.project_files || []).map((file) => (
                    <li
                      key={file.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-brand-navy">{file.file_name}</p>
                        <p className="text-xs text-brand-muted">
                          {file.visibility} ·{" "}
                          {new Date(file.created_at).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          {tab === "Notes" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold text-brand-navy">Client-facing summary</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-brand-muted">
                  {project.client_summary || "No client summary yet."}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <h3 className="font-semibold text-brand-navy">Internal notes</h3>
                <p className="mt-1 text-xs text-amber-900/80">Staff only</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-brand-ink">
                  {internalNotes || "No internal notes."}
                </p>
              </div>
            </div>
          ) : null}

          {tab === "Activity" ? (
            activity.length === 0 ? (
              <p className="text-sm text-brand-muted">No activity yet.</p>
            ) : (
              <ul className="space-y-4">
                {activity.map((item) => (
                  <li key={item.id} className="border-l-2 border-brand-gold/50 pl-4">
                    <p className="text-sm font-semibold text-brand-navy">
                      {item.summary}
                    </p>
                    <p className="mt-1 text-xs text-brand-muted">
                      {item.profiles?.full_name || item.profiles?.email || "System"} ·{" "}
                      {new Date(item.created_at).toLocaleString()} · {item.event_type}
                    </p>
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm leading-7 text-brand-ink whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}

function AssigneeList({ assignees }) {
  if (!assignees.length) {
    return <p className="text-sm text-brand-muted">No team members assigned.</p>;
  }

  const groups = {
    project_manager: "Project managers",
    staff: "Staff",
    contractor: "Contractors",
  };

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([role, label]) => {
        const people = assignees.filter((row) => row.assignee_role === role);
        if (!people.length) return null;
        return (
          <div key={role}>
            <h3 className="text-sm font-semibold text-brand-navy">{label}</h3>
            <ul className="mt-3 space-y-2">
              {people.map((row) => (
                <li key={row.id} className="text-sm text-brand-muted">
                  {row.profiles?.full_name || row.profiles?.email || row.profile_id}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
