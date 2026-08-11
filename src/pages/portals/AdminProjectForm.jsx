import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import { FormField, fieldClassName } from "../../components/ui/FormControls";
import {
  createClient,
  createProject,
  getProject,
  listAssignableProfiles,
  listClients,
  updateProject,
} from "../../lib/projectApi";
import {
  PROJECT_STATUSES,
  SERVICE_TYPE_OPTIONS,
  projectStatusLabel,
} from "../../lib/projects";

const emptyForm = {
  title: "",
  client_id: "",
  property_address: "",
  service_type: SERVICE_TYPE_OPTIONS[0],
  scope: "",
  status: "estimate",
  start_date: "",
  estimated_completion_date: "",
  actual_completion_date: "",
  client_summary: "",
  internal_notes: "",
  managers: [],
  staff: [],
  contractors: [],
  newClient: {
    enabled: false,
    full_name: "",
    email: "",
    phone: "",
    preferred_contact_method: "email",
  },
};

export default function AdminProjectForm() {
  const { projectId } = useParams();
  const isEdit = Boolean(projectId);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [clients, setClients] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [clientRows, profileRows] = await Promise.all([
          listClients(),
          listAssignableProfiles(),
        ]);
        if (cancelled) return;
        setClients(clientRows);
        setProfiles(profileRows);

        if (projectId) {
          const project = await getProject(projectId);
          if (!project) throw new Error("Project not found.");
          if (cancelled) return;

          const assignees = project.project_assignees || [];
          const notes =
            project.project_internal_notes?.notes ??
            project.project_internal_notes?.[0]?.notes ??
            "";

          setForm({
            title: project.title || "",
            client_id: project.client_id || "",
            property_address: project.property_address || "",
            service_type: project.service_type || SERVICE_TYPE_OPTIONS[0],
            scope: project.scope || "",
            status: project.status || "estimate",
            start_date: project.start_date || "",
            estimated_completion_date: project.estimated_completion_date || "",
            actual_completion_date: project.actual_completion_date || "",
            client_summary: project.client_summary || "",
            internal_notes: notes,
            managers: assignees
              .filter((row) => row.assignee_role === "project_manager")
              .map((row) => row.profile_id),
            staff: assignees
              .filter((row) => row.assignee_role === "staff")
              .map((row) => row.profile_id),
            contractors: assignees
              .filter((row) => row.assignee_role === "contractor")
              .map((row) => row.profile_id),
            newClient: emptyForm.newClient,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load form.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const managers = useMemo(
    () => profiles.filter((p) => p.role === "admin" || p.role === "staff"),
    [profiles]
  );
  const contractors = useMemo(
    () => profiles.filter((p) => p.role === "contractor"),
    [profiles]
  );

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAssignee(group, profileId) {
    setForm((prev) => {
      const current = new Set(prev[group]);
      if (current.has(profileId)) current.delete(profileId);
      else current.add(profileId);
      return { ...prev, [group]: [...current] };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.title.trim()) throw new Error("Project title is required.");
      if (!form.property_address.trim()) {
        throw new Error("Property address is required.");
      }

      let clientId = form.client_id;
      if (form.newClient.enabled) {
        if (!form.newClient.full_name.trim()) {
          throw new Error("Guest client name is required.");
        }
        if (!form.newClient.email && !form.newClient.phone) {
          throw new Error("Guest client needs an email or phone.");
        }
        const created = await createClient({
          full_name: form.newClient.full_name.trim(),
          email: form.newClient.email.trim() || null,
          phone: form.newClient.phone.trim() || null,
          preferred_contact_method: form.newClient.preferred_contact_method,
          is_guest: true,
          email_notifications_enabled: true,
          sms_notifications_enabled: Boolean(form.newClient.phone),
        });
        clientId = created.id;
      }

      if (!clientId) throw new Error("Select or create a client.");

      const payload = {
        title: form.title.trim(),
        client_id: clientId,
        property_address: form.property_address.trim(),
        service_type: form.service_type,
        scope: form.scope.trim() || null,
        status: form.status,
        start_date: form.start_date || null,
        estimated_completion_date: form.estimated_completion_date || null,
        actual_completion_date: form.actual_completion_date || null,
        client_summary: form.client_summary.trim() || null,
      };

      const assigneeIds = {
        managers: form.managers,
        staff: form.staff,
        contractors: form.contractors,
      };

      const saved = isEdit
        ? await updateProject(projectId, {
            project: payload,
            internalNotes: form.internal_notes,
            assigneeIds,
          })
        : await createProject({
            project: payload,
            internalNotes: form.internal_notes,
            assigneeIds,
          });

      navigate(`/admin/projects/${saved.id}`);
    } catch (err) {
      setError(err.message || "Unable to save project.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Section tone="cream">
        <Container>
          <p className="text-sm text-brand-muted">Loading…</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section tone="cream">
      <Container className="max-w-4xl">
        <Link
          to={isEdit ? `/admin/projects/${projectId}` : "/admin/projects"}
          className="text-sm font-semibold text-brand-navy hover:text-brand-gold"
        >
          ← Back
        </Link>
        <h1 className="mt-4 font-display text-display-md text-brand-navy">
          {isEdit ? "Edit project" : "Create project"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="rounded-section border border-brand-border bg-white p-6 shadow-card space-y-5">
            <h2 className="font-display text-xl text-brand-navy">Overview</h2>
            <FormField
              label="Project title"
              name="title"
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
            <FormField
              label="Service type"
              name="service_type"
              as="select"
              value={form.service_type}
              onChange={(event) => updateField("service_type", event.target.value)}
            >
              {SERVICE_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </FormField>
            <FormField
              label="Property / service address"
              name="property_address"
              required
              value={form.property_address}
              onChange={(event) =>
                updateField("property_address", event.target.value)
              }
            />
            <FormField
              label="Scope / description"
              name="scope"
              as="textarea"
              rows={4}
              value={form.scope}
              onChange={(event) => updateField("scope", event.target.value)}
            />
            <FormField
              label="Status"
              name="status"
              as="select"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {PROJECT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {projectStatusLabel(value)}
                </option>
              ))}
            </FormField>
            <div className="grid gap-5 sm:grid-cols-3">
              <FormField
                label="Start date"
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={(event) => updateField("start_date", event.target.value)}
              />
              <FormField
                label="Estimated completion"
                name="estimated_completion_date"
                type="date"
                value={form.estimated_completion_date}
                onChange={(event) =>
                  updateField("estimated_completion_date", event.target.value)
                }
              />
              <FormField
                label="Actual completion"
                name="actual_completion_date"
                type="date"
                value={form.actual_completion_date}
                onChange={(event) =>
                  updateField("actual_completion_date", event.target.value)
                }
              />
            </div>
          </div>

          <div className="rounded-section border border-brand-border bg-white p-6 shadow-card space-y-5">
            <h2 className="font-display text-xl text-brand-navy">Client</h2>
            <label className="flex items-center gap-2 text-sm text-brand-ink">
              <input
                type="checkbox"
                checked={form.newClient.enabled}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    newClient: {
                      ...prev.newClient,
                      enabled: event.target.checked,
                    },
                    client_id: event.target.checked ? "" : prev.client_id,
                  }))
                }
              />
              Create a new guest client
            </label>

            {form.newClient.enabled ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  name="guest_full_name"
                  required
                  value={form.newClient.full_name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      newClient: {
                        ...prev.newClient,
                        full_name: event.target.value,
                      },
                    }))
                  }
                />
                <FormField
                  label="Preferred contact"
                  name="preferred_contact_method"
                  as="select"
                  value={form.newClient.preferred_contact_method}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      newClient: {
                        ...prev.newClient,
                        preferred_contact_method: event.target.value,
                      },
                    }))
                  }
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="phone">Phone</option>
                  <option value="either">Either</option>
                </FormField>
                <FormField
                  label="Email"
                  name="guest_email"
                  type="email"
                  value={form.newClient.email}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      newClient: { ...prev.newClient, email: event.target.value },
                    }))
                  }
                />
                <FormField
                  label="Phone"
                  name="guest_phone"
                  type="tel"
                  value={form.newClient.phone}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      newClient: { ...prev.newClient, phone: event.target.value },
                    }))
                  }
                />
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-semibold text-brand-navy">
                  Existing client
                </label>
                <select
                  className={fieldClassName()}
                  value={form.client_id}
                  onChange={(event) => updateField("client_id", event.target.value)}
                  required={!form.newClient.enabled}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name}
                      {client.is_guest ? " (guest)" : ""}
                      {client.email ? ` · ${client.email}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="rounded-section border border-brand-border bg-white p-6 shadow-card space-y-5">
            <h2 className="font-display text-xl text-brand-navy">Team</h2>
            <AssigneeChecklist
              label="Project managers / staff leads"
              people={managers}
              selected={form.managers}
              onToggle={(id) => toggleAssignee("managers", id)}
            />
            <AssigneeChecklist
              label="Additional staff"
              people={managers}
              selected={form.staff}
              onToggle={(id) => toggleAssignee("staff", id)}
            />
            <AssigneeChecklist
              label="Contractors"
              people={contractors}
              selected={form.contractors}
              onToggle={(id) => toggleAssignee("contractors", id)}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-section border border-brand-border bg-white p-6 shadow-card space-y-4">
              <h2 className="font-display text-xl text-brand-navy">
                Client-facing summary
              </h2>
              <p className="text-xs text-brand-muted">
                Visible to registered clients and guest project links later.
              </p>
              <textarea
                className={fieldClassName()}
                rows={6}
                value={form.client_summary}
                onChange={(event) =>
                  updateField("client_summary", event.target.value)
                }
                placeholder="Short, client-safe project summary"
              />
            </div>
            <div className="rounded-section border border-amber-200 bg-amber-50/40 p-6 shadow-card space-y-4">
              <h2 className="font-display text-xl text-brand-navy">
                Internal notes
              </h2>
              <p className="text-xs text-amber-900/80">
                Staff only. Never shown to clients or guests.
              </p>
              <textarea
                className={fieldClassName()}
                rows={6}
                value={form.internal_notes}
                onChange={(event) =>
                  updateField("internal_notes", event.target.value)
                }
                placeholder="Scheduling constraints, pricing notes, contractor context…"
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="secondary" size="lg" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
            </Button>
            <Button
              to={isEdit ? `/admin/projects/${projectId}` : "/admin/projects"}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Container>
    </Section>
  );
}

function AssigneeChecklist({ label, people, selected, onToggle }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-brand-navy">{label}</p>
      {people.length === 0 ? (
        <p className="text-sm text-brand-muted">
          No matching profiles yet. Invite users in Supabase and set their roles.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {people.map((person) => (
            <label
              key={`${label}-${person.id}`}
              className="flex items-center gap-2 rounded-2xl border border-brand-border px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(person.id)}
                onChange={() => onToggle(person.id)}
              />
              <span>
                {person.full_name || person.email}
                <span className="ml-1 text-xs capitalize text-slate-500">
                  ({person.role})
                </span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
