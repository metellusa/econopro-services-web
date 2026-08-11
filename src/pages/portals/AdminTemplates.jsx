import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import { FormField, fieldClassName } from "../../components/ui/FormControls";
import {
  createPhaseTemplate,
  listPhaseTemplates,
  setTemplateActive,
} from "../../lib/phaseApi";
import { SERVICE_TYPE_OPTIONS } from "../../lib/projects";

const blankPhase = () => ({
  name: "",
  description: "",
  client_visible: true,
  tasksText: "Confirm scope\nComplete work",
});

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    service_category: SERVICE_TYPE_OPTIONS[0],
    description: "",
    phases: [blankPhase(), blankPhase()],
  });

  async function reload() {
    const rows = await listPhaseTemplates();
    setTemplates(rows);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        await reload();
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load templates.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const phases = form.phases
        .filter((phase) => phase.name.trim())
        .map((phase, index) => ({
          name: phase.name.trim(),
          description: phase.description.trim(),
          sort_order: index + 1,
          client_visible: phase.client_visible,
          tasks: phase.tasksText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((title, taskIndex) => ({
              title,
              is_required: true,
              sort_order: taskIndex + 1,
            })),
        }));

      if (!form.name.trim()) throw new Error("Template name is required.");
      if (!phases.length) throw new Error("Add at least one phase.");

      await createPhaseTemplate({
        name: form.name.trim(),
        service_category: form.service_category,
        description: form.description.trim() || null,
        is_active: true,
        phases,
      });

      setForm({
        name: "",
        service_category: SERVICE_TYPE_OPTIONS[0],
        description: "",
        phases: [blankPhase(), blankPhase()],
      });
      await reload();
    } catch (err) {
      setError(err.message || "Unable to create template.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section tone="cream">
      <Container className="space-y-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Templates
          </p>
          <h1 className="mt-2 font-display text-display-md text-brand-navy">
            Phase templates
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-brand-muted">
            Reusable phase checklists by service. Applying a template copies a
            snapshot onto a project; later template edits do not rewrite live
            projects.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form
          onSubmit={handleCreate}
          className="rounded-section border border-brand-border bg-white p-6 shadow-card space-y-5"
        >
          <h2 className="font-display text-xl text-brand-navy">Create template</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Template name"
              name="name"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <FormField
              label="Service category"
              name="service_category"
              as="select"
              value={form.service_category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, service_category: event.target.value }))
              }
            >
              {SERVICE_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormField>
          </div>
          <FormField
            label="Description"
            name="description"
            as="textarea"
            rows={3}
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
          />

          <div className="space-y-4">
            {form.phases.map((phase, index) => (
              <div
                key={`phase-${index}`}
                className="rounded-2xl border border-brand-border bg-brand-cream/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-navy">
                    Phase {index + 1}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-semibold text-rose-700"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        phases: prev.phases.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={fieldClassName()}
                  placeholder="Phase name"
                  value={phase.name}
                  onChange={(event) =>
                    setForm((prev) => {
                      const phases = [...prev.phases];
                      phases[index] = { ...phases[index], name: event.target.value };
                      return { ...prev, phases };
                    })
                  }
                />
                <textarea
                  className={fieldClassName()}
                  rows={2}
                  placeholder="Phase description"
                  value={phase.description}
                  onChange={(event) =>
                    setForm((prev) => {
                      const phases = [...prev.phases];
                      phases[index] = {
                        ...phases[index],
                        description: event.target.value,
                      };
                      return { ...prev, phases };
                    })
                  }
                />
                <textarea
                  className={fieldClassName()}
                  rows={3}
                  placeholder="Tasks (one per line)"
                  value={phase.tasksText}
                  onChange={(event) =>
                    setForm((prev) => {
                      const phases = [...prev.phases];
                      phases[index] = {
                        ...phases[index],
                        tasksText: event.target.value,
                      };
                      return { ...prev, phases };
                    })
                  }
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={phase.client_visible}
                    onChange={(event) =>
                      setForm((prev) => {
                        const phases = [...prev.phases];
                        phases[index] = {
                          ...phases[index],
                          client_visible: event.target.checked,
                        };
                        return { ...prev, phases };
                      })
                    }
                  />
                  Visible to clients/guests
                </label>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  phases: [...prev.phases, blankPhase()],
                }))
              }
            >
              Add phase
            </Button>
          </div>

          <Button type="submit" variant="secondary" size="lg" disabled={saving}>
            {saving ? "Saving…" : "Create template"}
          </Button>
        </form>

        <div>
          <h2 className="font-display text-xl text-brand-navy">Existing templates</h2>
          {loading ? (
            <p className="mt-4 text-sm text-brand-muted">Loading…</p>
          ) : templates.length === 0 ? (
            <p className="mt-4 text-sm text-brand-muted">No templates yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-section border border-brand-border bg-white p-5 shadow-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-brand-navy">{template.name}</h3>
                      <p className="text-sm text-brand-muted">
                        {template.service_category} ·{" "}
                        {(template.phase_template_phases || []).length} phases ·{" "}
                        {template.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await setTemplateActive(template.id, !template.is_active);
                        await reload();
                      }}
                    >
                      {template.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                  <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-brand-muted">
                    {(template.phase_template_phases || []).map((phase) => (
                      <li key={phase.id}>
                        {phase.name}
                        {!phase.client_visible ? " (internal)" : ""}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
