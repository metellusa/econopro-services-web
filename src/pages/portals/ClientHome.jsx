import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import { listClientProjects } from "../../lib/clientApi";
import { projectStatusLabel } from "../../lib/projects";

export default function ClientHome() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const rows = await listClientProjects();
        if (!cancelled) setProjects(rows);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const { active, history } = useMemo(() => {
    const activeRows = projects.filter((p) => p.status !== "completed" && p.status !== "cancelled");
    const historyRows = projects.filter((p) => p.status === "completed" || p.status === "cancelled");
    return { active: activeRows, history: historyRows };
  }, [projects]);

  return (
    <div className="bg-brand-cream pb-16">
      <Container className="py-8 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Client portal
          </p>
          <h1 className="mt-2 font-display text-3xl text-brand-navy sm:text-4xl">
            Your projects
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Track progress, published updates, and next steps for your EconoPro work.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-brand-muted">Loading…</p>
        ) : (
          <>
            <ProjectGroup title="Active" items={active} />
            <ProjectGroup title="History" items={history} />
          </>
        )}
      </Container>
    </div>
  );
}

function ProjectGroup({ title, items }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-brand-navy">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-border bg-white/70 px-4 py-5 text-sm text-brand-muted">
          No projects here yet.
        </p>
      ) : (
        items.map((project) => (
          <Link
            key={project.id}
            to={`/client/projects/${project.id}`}
            className="block rounded-2xl border border-brand-border bg-white p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-brand-navy">{project.title}</p>
                <p className="mt-1 text-sm text-brand-muted">{project.property_address}</p>
              </div>
              <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-navy">
                {project.progress_percent || 0}%
              </span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
              {projectStatusLabel(project.status)}
            </p>
          </Link>
        ))
      )}
    </section>
  );
}
