import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { fieldClassName } from "../ui/FormControls";
import {
  applyPhaseTemplate,
  completePhase,
  createProjectPhase,
  listPhaseTemplates,
  listProjectPhases,
  reorderProjectPhases,
  updateProjectPhase,
  upsertPhaseTask,
} from "../../lib/phaseApi";
import { listAssignableProfiles } from "../../lib/projectApi";
import { PHASE_STATUSES, phaseStatusLabel, TASK_STATUSES } from "../../lib/phases";

export default function ProjectPhasesPanel({ projectId, projectProgress = 0 }) {
  const [phases, setPhases] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPhaseName, setNewPhaseName] = useState("");

  async function reload() {
    const [phaseRows, templateRows, profiles] = await Promise.all([
      listProjectPhases(projectId),
      listPhaseTemplates({ activeOnly: true }),
      listAssignableProfiles(),
    ]);
    setPhases(phaseRows);
    setTemplates(templateRows);
    setContractors(profiles.filter((p) => p.role === "contractor"));
    if (!templateId && templateRows[0]) setTemplateId(templateRows[0].id);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        await reload();
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load phases.");
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

  async function handleApplyTemplate(replace = false) {
    setError("");
    try {
      await applyPhaseTemplate(projectId, templateId, replace);
      await reload();
    } catch (err) {
      setError(err.message || "Unable to apply template.");
    }
  }

  async function handleAddPhase() {
    if (!newPhaseName.trim()) return;
    setError("");
    try {
      await createProjectPhase(projectId, { name: newPhaseName.trim() });
      setNewPhaseName("");
      await reload();
    } catch (err) {
      setError(err.message || "Unable to add phase.");
    }
  }

  async function movePhase(index, direction) {
    const next = [...phases];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setPhases(next);
    await reorderProjectPhases(
      projectId,
      next.map((phase) => phase.id)
    );
    await reload();
  }

  if (loading) {
    return <p className="text-sm text-brand-muted">Loading phases…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Overall progress
          </p>
          <p className="mt-1 font-display text-3xl text-brand-navy">
            {projectProgress}%
          </p>
          <div className="mt-3 h-2 w-48 overflow-hidden rounded-full bg-brand-cream">
            <div
              className="h-full rounded-full bg-brand-gold"
              style={{ width: `${projectProgress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Apply template
            </label>
            <select
              className={fieldClassName()}
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="button" variant="secondary" size="md" onClick={() => handleApplyTemplate(false)}>
            Apply
          </Button>
          <Button type="button" variant="outline" size="md" onClick={() => handleApplyTemplate(true)}>
            Replace existing
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input
          className={fieldClassName("max-w-xs")}
          placeholder="New phase name"
          value={newPhaseName}
          onChange={(event) => setNewPhaseName(event.target.value)}
        />
        <Button type="button" variant="outline" size="md" onClick={handleAddPhase}>
          Add phase
        </Button>
      </div>

      {phases.length === 0 ? (
        <p className="text-sm text-brand-muted">
          No phases yet. Apply a template or add phases manually.
        </p>
      ) : (
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              contractors={contractors}
              onMoveUp={() => movePhase(index, -1)}
              onMoveDown={() => movePhase(index, 1)}
              onChanged={reload}
              onError={setError}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PhaseCard({ phase, contractors, onMoveUp, onMoveDown, onChanged, onError }) {
  const internalNotes =
    phase.project_phase_internal_notes?.notes ??
    phase.project_phase_internal_notes?.[0]?.notes ??
    "";

  async function savePatch(patch) {
    try {
      await updateProjectPhase(phase.id, patch);
      await onChanged();
    } catch (err) {
      onError(err.message || "Unable to update phase.");
    }
  }

  async function toggleTask(task) {
    try {
      await upsertPhaseTask(phase.id, {
        ...task,
        status: task.status === "completed" ? "pending" : "completed",
      });
      await onChanged();
    } catch (err) {
      onError(err.message || "Unable to update task.");
    }
  }

  async function handleComplete(override = false) {
    try {
      await completePhase(phase.id, {
        override,
        reason: override ? "Staff override from admin UI" : null,
      });
      await onChanged();
    } catch (err) {
      onError(err.message || "Unable to complete phase.");
    }
  }

  return (
    <article className="rounded-2xl border border-brand-border bg-brand-cream/30 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-brand-navy">
            {phase.sort_order}. {phase.name}
          </h3>
          <p className="mt-1 text-xs text-brand-muted">
            {phaseStatusLabel(phase.status)} · {phase.progress_percent}% ·{" "}
            {phase.client_visible ? "Client visible" : "Internal only"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onMoveUp}>
            Up
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onMoveDown}>
            Down
          </Button>
          {phase.status !== "completed" ? (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => handleComplete(false)}>
                Complete
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => handleComplete(true)}>
                Complete w/ override
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <select
          className={fieldClassName()}
          value={phase.status}
          onChange={(event) => savePatch({ status: event.target.value })}
        >
          {PHASE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {phaseStatusLabel(status)}
            </option>
          ))}
        </select>
        <input
          type="date"
          className={fieldClassName()}
          value={phase.due_date || ""}
          onChange={(event) => savePatch({ due_date: event.target.value || null })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={phase.client_visible}
            onChange={(event) => savePatch({ client_visible: event.target.checked })}
          />
          Visible to clients
        </label>
      </div>

      {phase.status === "blocked" ? (
        <input
          className={`${fieldClassName()} mt-3`}
          placeholder="Blocked reason"
          defaultValue={phase.blocked_reason || ""}
          onBlur={(event) => savePatch({ blocked_reason: event.target.value })}
        />
      ) : null}

      <textarea
        className={`${fieldClassName()} mt-3`}
        rows={2}
        placeholder="Client-facing update for this phase"
        defaultValue={phase.client_facing_update || ""}
        onBlur={(event) => savePatch({ client_facing_update: event.target.value })}
      />

      <textarea
        className={`${fieldClassName()} mt-3`}
        rows={2}
        placeholder="Internal phase notes (staff only)"
        defaultValue={internalNotes}
        onBlur={(event) => savePatch({ internal_notes: event.target.value })}
      />

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Contractors
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {contractors.map((person) => {
            const selected = (phase.project_phase_assignees || []).some(
              (row) => row.profile_id === person.id
            );
            return (
              <label
                key={person.id}
                className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs"
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const current = (phase.project_phase_assignees || []).map(
                      (row) => row.profile_id
                    );
                    const next = selected
                      ? current.filter((id) => id !== person.id)
                      : [...current, person.id];
                    savePatch({ assignee_ids: next });
                  }}
                />
                {person.full_name || person.email}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tasks
        </p>
        {(phase.project_phase_tasks || []).map((task) => (
          <div
            key={task.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() => toggleTask(task)}
              />
              <span>
                {task.title}
                {task.is_required ? (
                  <span className="ml-1 text-xs text-rose-600">required</span>
                ) : null}
              </span>
            </label>
            <select
              className="rounded-lg border border-brand-border px-2 py-1 text-xs"
              value={task.status}
              onChange={async (event) => {
                await upsertPhaseTask(phase.id, {
                  ...task,
                  status: event.target.value,
                });
                await onChanged();
              }}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={async () => {
            const title = window.prompt("Task title");
            if (!title) return;
            await upsertPhaseTask(phase.id, {
              title,
              is_required: true,
              status: "pending",
              sort_order: (phase.project_phase_tasks || []).length + 1,
            });
            await onChanged();
          }}
        >
          Add task
        </Button>
      </div>
    </article>
  );
}
