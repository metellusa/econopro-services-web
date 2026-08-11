import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { fieldClassName } from "../../components/ui/FormControls";
import {
  completeContractorTask,
  createProgressUpdate,
  createProjectIssue,
  getContractorProject,
  listMyProgressUpdates,
  submitProgressUpdate,
  uploadProgressMedia,
} from "../../lib/contractorApi";
import { phaseStatusLabel } from "../../lib/phases";

const ISSUE_CATEGORIES = [
  { value: "material", label: "Material issue" },
  { value: "property_condition", label: "Property condition" },
  { value: "access", label: "Access issue" },
  { value: "scope_discrepancy", label: "Scope discrepancy" },
  { value: "safety", label: "Safety concern" },
  { value: "client_request", label: "Client request" },
  { value: "other", label: "Other" },
];

export default function ContractorProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panel, setPanel] = useState("tasks");

  const [internalNote, setInternalNote] = useState("");
  const [proposedUpdate, setProposedUpdate] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoVisibility, setPhotoVisibility] = useState("internal");
  const [submitting, setSubmitting] = useState(false);

  const [issueForm, setIssueForm] = useState({
    category: "other",
    title: "",
    description: "",
    phase_id: "",
  });

  async function reload() {
    const [projectRow, updateRows] = await Promise.all([
      getContractorProject(projectId),
      listMyProgressUpdates(projectId),
    ]);
    setProject(projectRow);
    setUpdates(updateRows);
    if (!phaseId && projectRow?.project_phases?.[0]) {
      setPhaseId(projectRow.project_phases[0].id);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        await reload();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const managers = (project?.project_assignees || []).filter((row) =>
    ["project_manager", "staff"].includes(row.assignee_role)
  );

  async function handleCompleteTask(task) {
    const note = window.prompt("Optional completion note", task.completion_note || "");
    if (note === null) return;
    try {
      await completeContractorTask(task.id, note);
      await reload();
    } catch (err) {
      setError(err.message || "Unable to complete task.");
    }
  }

  async function handleSubmitUpdate(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!internalNote.trim() && !proposedUpdate.trim()) {
        throw new Error("Add an internal note and/or proposed client update.");
      }
      const created = await createProgressUpdate({
        project_id: projectId,
        phase_id: phaseId || null,
        internal_note: internalNote.trim(),
        proposed_client_update: proposedUpdate.trim(),
      });

      if (photo) {
        await uploadProgressMedia({
          updateId: created.id,
          projectId,
          file: photo,
          visibility: photoVisibility,
        });
      }

      await submitProgressUpdate(created.id);
      setInternalNote("");
      setProposedUpdate("");
      setPhoto(null);
      setPanel("updates");
      await reload();
    } catch (err) {
      setError(err.message || "Unable to submit update.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleIssueSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createProjectIssue({
        project_id: projectId,
        phase_id: issueForm.phase_id || null,
        category: issueForm.category,
        title: issueForm.title.trim(),
        description: issueForm.description.trim(),
      });
      setIssueForm({
        category: "other",
        title: "",
        description: "",
        phase_id: "",
      });
      setPanel("tasks");
      await reload();
    } catch (err) {
      setError(err.message || "Unable to report issue.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-10">
        <p className="text-sm text-brand-muted">Loading job…</p>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="py-10">
        <p className="text-sm text-red-700">{error || "Job not found or not assigned to you."}</p>
        <Link to="/contractor" className="mt-4 inline-block font-semibold text-brand-navy">
          ← Back to jobs
        </Link>
      </Container>
    );
  }

  const phases = [...(project.project_phases || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="bg-brand-cream pb-24">
      <Container className="py-6 space-y-6">
        <Link to="/contractor" className="text-sm font-semibold text-brand-navy">
          ← Jobs
        </Link>

        <div className="rounded-section bg-brand-navy p-5 text-white shadow-soft">
          <h1 className="font-display text-3xl">{project.title}</h1>
          <p className="mt-2 text-sm text-slate-300">{project.property_address}</p>
          <p className="mt-4 text-sm text-slate-200">
            {project.scope || project.client_summary || "Follow assigned phases and tasks."}
          </p>
          <p className="mt-4 text-xs uppercase tracking-wide text-brand-gold">
            {project.progress_percent || 0}% complete
          </p>
        </div>

        {managers.length ? (
          <div className="rounded-2xl border border-brand-border bg-white p-4 text-sm">
            <p className="font-semibold text-brand-navy">Project contact</p>
            {managers.map((row) => (
              <p key={`${row.assignee_role}-${row.profiles?.email}`} className="mt-2 text-brand-muted">
                {row.profiles?.full_name || row.profiles?.email}
                {row.profiles?.phone ? ` · ${row.profiles.phone}` : ""}
              </p>
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-3 gap-2">
          {[
            ["tasks", "Tasks"],
            ["update", "Update"],
            ["issue", "Issue"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPanel(id)}
              className={[
                "rounded-2xl px-3 py-3 text-sm font-semibold",
                panel === id
                  ? "bg-brand-navy text-white"
                  : "bg-white text-brand-navy border border-brand-border",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {panel === "tasks" ? (
          <div className="space-y-4">
            {phases.map((phase) => (
              <section
                key={phase.id}
                className="rounded-2xl border border-brand-border bg-white p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-brand-navy">{phase.name}</h2>
                    <p className="text-xs text-brand-muted">
                      {phaseStatusLabel(phase.status)}
                      {phase.due_date ? ` · due ${phase.due_date}` : ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-brand-navy">
                    {phase.progress_percent}%
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {(phase.project_phase_tasks || []).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-brand-cream/50 px-3 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-brand-ink">{task.title}</p>
                        <p className="text-xs capitalize text-brand-muted">{task.status}</p>
                      </div>
                      {task.status !== "completed" ? (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCompleteTask(task)}
                        >
                          Done
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700">Complete</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <button
              type="button"
              className="text-sm font-semibold text-brand-navy"
              onClick={() => setPanel("updates")}
            >
              View my submitted updates →
            </button>
            {updates.length ? (
              <div className="space-y-3">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-2xl border border-brand-border bg-white p-4 text-sm"
                  >
                    <p className="font-semibold capitalize text-brand-navy">{update.status}</p>
                    <p className="mt-2 text-brand-muted">
                      Internal: {update.internal_note || "—"}
                    </p>
                    <p className="mt-1 text-brand-muted">
                      Proposed client: {update.proposed_client_update || "—"}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {panel === "update" ? (
          <form
            onSubmit={handleSubmitUpdate}
            className="space-y-4 rounded-2xl border border-brand-border bg-white p-4 shadow-card"
          >
            <h2 className="font-display text-xl text-brand-navy">Submit progress</h2>
            <select
              className={fieldClassName()}
              value={phaseId}
              onChange={(event) => setPhaseId(event.target.value)}
            >
              <option value="">Select phase</option>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))}
            </select>

            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-navy">
                Internal note (staff only)
              </label>
              <textarea
                className={fieldClassName()}
                rows={4}
                value={internalNote}
                onChange={(event) => setInternalNote(event.target.value)}
                placeholder="Found water damage under flooring. Need PM inspection before continuing."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-navy">
                Proposed client update
              </label>
              <p className="mb-2 text-xs text-brand-muted">
                Never sent automatically. Staff must review and publish.
              </p>
              <textarea
                className={fieldClassName()}
                rows={4}
                value={proposedUpdate}
                onChange={(event) => setProposedUpdate(event.target.value)}
                placeholder="During demolition we found an area that needs additional evaluation."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-navy">
                Photo evidence
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="block w-full text-sm"
                onChange={(event) => setPhoto(event.target.files?.[0] || null)}
              />
              <select
                className={`${fieldClassName()} mt-3`}
                value={photoVisibility}
                onChange={(event) => setPhotoVisibility(event.target.value)}
              >
                <option value="internal">Internal only</option>
                <option value="client">Suggest client-visible</option>
              </select>
            </div>

            <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit for staff review"}
            </Button>
          </form>
        ) : null}

        {panel === "issue" ? (
          <form
            onSubmit={handleIssueSubmit}
            className="space-y-4 rounded-2xl border border-brand-border bg-white p-4 shadow-card"
          >
            <h2 className="font-display text-xl text-brand-navy">Report an issue</h2>
            <select
              className={fieldClassName()}
              value={issueForm.category}
              onChange={(event) =>
                setIssueForm((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              {ISSUE_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <input
              className={fieldClassName()}
              placeholder="Short title"
              required
              value={issueForm.title}
              onChange={(event) =>
                setIssueForm((prev) => ({ ...prev, title: event.target.value }))
              }
            />
            <textarea
              className={fieldClassName()}
              rows={4}
              required
              placeholder="What happened?"
              value={issueForm.description}
              onChange={(event) =>
                setIssueForm((prev) => ({ ...prev, description: event.target.value }))
              }
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send to EconoPro staff"}
            </Button>
          </form>
        ) : null}
      </Container>
    </div>
  );
}
