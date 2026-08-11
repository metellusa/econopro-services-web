import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import { listContractorProjects } from "../../lib/contractorApi";
import { projectStatusLabel } from "../../lib/projects";
import { phaseStatusLabel } from "../../lib/phases";

export default function ContractorHome() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const rows = await listContractorProjects();
        if (!cancelled) setProjects(rows);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load jobs.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const grouped = useMemo(() => {
    const active = projects.filter((p) =>
      ["scheduled", "in_progress", "final_review"].includes(p.status)
    );
    const upcoming = projects.filter((p) =>
      ["estimate", "approved", "scheduled"].includes(p.status)
    );
    const dueTasks = [];
    const blocked = [];

    projects.forEach((project) => {
      (project.project_phases || []).forEach((phase) => {
        if (phase.status === "blocked") {
          blocked.push({ project, phase });
        }
        (phase.project_phase_tasks || []).forEach((task) => {
          if (task.status !== "completed" && task.due_date && task.due_date <= today) {
            dueTasks.push({ project, phase, task });
          }
        });
      });
    });

    return { active, upcoming, dueTasks, blocked };
  }, [projects, today]);

  return (
    <div className="bg-brand-cream pb-16">
      <Container className="py-8 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Contractor
          </p>
          <h1 className="mt-2 font-display text-3xl text-brand-navy sm:text-4xl">
            My jobs
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Assigned projects only. Internal notes stay with EconoPro staff.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-brand-muted">Loading jobs…</p>
        ) : (
          <>
            <JobSection title="Active / current" items={grouped.active} />
            <JobSection title="Upcoming" items={grouped.upcoming} />

            <section className="space-y-3">
              <h2 className="font-display text-xl text-brand-navy">Tasks due</h2>
              {grouped.dueTasks.length === 0 ? (
                <Empty>No due tasks.</Empty>
              ) : (
                grouped.dueTasks.map(({ project, phase, task }) => (
                  <Link
                    key={task.id}
                    to={`/contractor/projects/${project.id}`}
                    className="block rounded-2xl border border-brand-border bg-white p-4 shadow-card"
                  >
                    <p className="font-semibold text-brand-navy">{task.title}</p>
                    <p className="mt-1 text-xs text-brand-muted">
                      {project.title} · {phase.name} · due {task.due_date}
                    </p>
                  </Link>
                ))
              )}
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-brand-navy">Blocked / issues</h2>
              {grouped.blocked.length === 0 ? (
                <Empty>No blocked phases.</Empty>
              ) : (
                grouped.blocked.map(({ project, phase }) => (
                  <Link
                    key={phase.id}
                    to={`/contractor/projects/${project.id}`}
                    className="block rounded-2xl border border-amber-200 bg-amber-50 p-4"
                  >
                    <p className="font-semibold text-brand-navy">{phase.name}</p>
                    <p className="mt-1 text-xs text-amber-900/80">
                      {project.title} · {phaseStatusLabel(phase.status)}
                    </p>
                  </Link>
                ))
              )}
            </section>
          </>
        )}
      </Container>
    </div>
  );
}

function JobSection({ title, items }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-brand-navy">{title}</h2>
      {items.length === 0 ? (
        <Empty>No jobs here.</Empty>
      ) : (
        items.map((project) => (
          <Link
            key={project.id}
            to={`/contractor/projects/${project.id}`}
            className="block rounded-2xl border border-brand-border bg-white p-5 shadow-card active:scale-[0.99]"
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

function Empty({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-brand-border bg-white/70 px-4 py-5 text-sm text-brand-muted">
      {children}
    </p>
  );
}
