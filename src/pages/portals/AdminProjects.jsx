import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import { fieldClassName } from "../../components/ui/FormControls";
import { StatusBadge, groupProjects } from "../../components/portal/ProjectBadges";
import { listProjects, listClients, listAssignableProfiles } from "../../lib/projectApi";
import {
  PROJECT_STATUSES,
  SERVICE_TYPE_OPTIONS,
  projectStatusLabel,
} from "../../lib/projects";
import { isSupabaseConfigured } from "../../lib/supabase";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [clientId, setClientId] = useState("");
  const [contractorId, setContractorId] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        setError("Supabase is not configured.");
        return;
      }
      try {
        const [clientRows, profileRows] = await Promise.all([
          listClients(),
          listAssignableProfiles(),
        ]);
        if (cancelled) return;
        setClients(clientRows);
        setContractors(profileRows.filter((p) => p.role === "contractor"));
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load filters.");
      }
    }

    loadMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isSupabaseConfigured) return;
      setLoading(true);
      setError("");
      try {
        const rows = await listProjects({
          search,
          status,
          serviceType,
          clientId,
          contractorId,
        });
        if (!cancelled) setProjects(rows);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(load, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, status, serviceType, clientId, contractorId]);

  const groups = useMemo(() => groupProjects(projects), [projects]);

  return (
    <Section tone="cream">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Projects
            </p>
            <h1 className="mt-2 font-display text-display-md text-brand-navy">
              Project dashboard
            </h1>
          </div>
          <Button to="/admin/projects/new" variant="primary" size="md">
            New Project
          </Button>
        </div>

        <div className="mt-8 grid gap-3 rounded-section border border-brand-border bg-white p-4 shadow-card md:grid-cols-2 xl:grid-cols-5">
          <input
            className={fieldClassName()}
            placeholder="Search projects or clients"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className={fieldClassName()}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {PROJECT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {projectStatusLabel(value)}
              </option>
            ))}
          </select>
          <select
            className={fieldClassName()}
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
          >
            <option value="">All services</option>
            {SERVICE_TYPE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            className={fieldClassName()}
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
          >
            <option value="">All clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name}
              </option>
            ))}
          </select>
          <select
            className={fieldClassName()}
            value={contractorId}
            onChange={(event) => setContractorId(event.target.value)}
          >
            <option value="">All contractors</option>
            {contractors.map((person) => (
              <option key={person.id} value={person.id}>
                {person.full_name || person.email}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-8 text-sm text-brand-muted">Loading projects…</p>
        ) : (
          <div className="mt-8 space-y-10">
            <ProjectGroup title="Awaiting action" items={groups.awaiting} />
            <ProjectGroup title="Active" items={groups.active} />
            <ProjectGroup title="Upcoming" items={groups.upcoming} />
            <ProjectGroup title="Completed" items={groups.completed} />
          </div>
        )}
      </Container>
    </Section>
  );
}

function ProjectGroup({ title, items }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy">{title}</h2>
        <span className="text-sm text-brand-muted">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-border bg-white/60 px-4 py-6 text-sm text-brand-muted">
          No projects in this group.
        </p>
      ) : (
        <div className="overflow-hidden rounded-section border border-brand-border bg-white shadow-card">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-cream/70 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {items.map((project) => (
                <tr key={project.id} className="border-t border-brand-border/70">
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/projects/${project.id}`}
                      className="font-semibold text-brand-navy hover:text-brand-gold"
                    >
                      {project.title}
                    </Link>
                    <p className="mt-1 text-xs text-brand-muted">
                      {project.property_address}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {project.clients?.full_name || "—"}
                    {project.clients?.is_guest ? (
                      <span className="mt-1 block text-xs text-slate-500">Guest</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{project.service_type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    {project.updated_at
                      ? new Date(project.updated_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
