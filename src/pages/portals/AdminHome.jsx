import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import { getOperationsSnapshot } from "../../lib/opsApi";
import { projectStatusLabel } from "../../lib/projects";

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const snapshot = await getOperationsSnapshot();
        if (!cancelled) setData(snapshot);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load operations dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section tone="cream">
      <Container className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Operations
            </p>
            <h1 className="mt-2 font-display text-display-md text-brand-navy">
              Daily action center
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-brand-muted">
              Prioritize reviews, blockers, overdue work, and client approvals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/admin/projects/new" variant="primary" size="md">
              New project
            </Button>
            <Button to="/admin/clients" variant="outline" size="md">
              Clients
            </Button>
          </div>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading || !data ? (
          <p className="text-sm text-brand-muted">Loading operations…</p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Active projects" value={data.counts.active} to="/admin/projects" />
              <Stat label="Awaiting staff review" value={data.counts.awaitingReview} to="/admin/reviews" />
              <Stat label="Open issues" value={data.counts.openIssues} to="/admin/reviews" />
              <Stat label="Failed notifications" value={data.counts.failedNotifications} to="/admin/notifications" />
              <Stat label="Awaiting client approval" value={data.counts.awaitingClient} to="/admin/projects" />
              <Stat label="Blocked phases" value={data.counts.blocked} />
              <Stat label="Overdue phases" value={data.counts.overduePhases} />
              <Stat label="Starting within 7 days" value={data.counts.startingSoon} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Queue
                title="Needs attention"
                empty="Nothing urgent right now."
                items={[
                  ...data.awaitingReview.slice(0, 5).map((item) => ({
                    id: `update-${item.id}`,
                    title: item.projects?.title || "Progress update",
                    meta: `Update ${item.status} · ${item.profiles?.full_name || "contractor"}`,
                    to: "/admin/reviews",
                  })),
                  ...data.issues.slice(0, 5).map((item) => ({
                    id: `issue-${item.id}`,
                    title: item.title,
                    meta: `${item.projects?.title || "Project"} · ${item.category}`,
                    to: `/admin/projects/${item.project_id}`,
                  })),
                  ...data.failedNotifications.slice(0, 5).map((item) => ({
                    id: `notif-${item.id}`,
                    title: `${item.channel.toUpperCase()} failed`,
                    meta: item.projects?.title || item.notification_type,
                    to: "/admin/notifications",
                  })),
                ]}
              />

              <Queue
                title="Overdue / blocked"
                empty="No overdue phases or blockers."
                items={[
                  ...data.blocked.slice(0, 5).map((phase) => ({
                    id: `blocked-${phase.id}`,
                    title: phase.name,
                    meta: `${phase.projects?.title || "Project"} · blocked`,
                    to: `/admin/projects/${phase.project_id}`,
                  })),
                  ...data.overduePhases.slice(0, 5).map((phase) => ({
                    id: `overdue-${phase.id}`,
                    title: phase.name,
                    meta: `${phase.projects?.title || "Project"} · due ${phase.due_date}`,
                    to: `/admin/projects/${phase.project_id}`,
                  })),
                ]}
              />
            </div>

            <section className="rounded-section border border-brand-border bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl text-brand-navy">
                  Contractor workload
                </h2>
                <Link to="/admin/projects" className="text-sm font-semibold text-brand-navy">
                  View projects
                </Link>
              </div>
              {data.contractorWorkload.length === 0 ? (
                <p className="mt-4 text-sm text-brand-muted">
                  No contractor profiles yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-brand-border">
                  {data.contractorWorkload.map((person) => (
                    <li
                      key={person.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                    >
                      <span className="font-medium text-brand-navy">
                        {person.full_name || person.email}
                      </span>
                      <span className="text-brand-muted">
                        {person.activeAssignments} active · {person.overdueTasks} overdue tasks
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-section border border-brand-border bg-white p-5 shadow-card">
              <h2 className="font-display text-xl text-brand-navy">Active projects</h2>
              {data.active.length === 0 ? (
                <p className="mt-4 text-sm text-brand-muted">No active projects.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.active.slice(0, 8).map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/admin/projects/${project.id}`}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border/70 px-4 py-3 hover:border-brand-gold/40"
                      >
                        <div>
                          <p className="font-semibold text-brand-navy">{project.title}</p>
                          <p className="text-xs text-brand-muted">
                            {project.clients?.full_name || "Client"} ·{" "}
                            {projectStatusLabel(project.status)}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-brand-navy">
                          {project.progress_percent || 0}%
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </Container>
    </Section>
  );
}

function Stat({ label, value, to }) {
  const content = (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-brand-navy">{value}</p>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function Queue({ title, items, empty }) {
  return (
    <section className="rounded-section border border-brand-border bg-white p-5 shadow-card">
      <h2 className="font-display text-xl text-brand-navy">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-brand-muted">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                className="block rounded-xl border border-brand-border/70 px-4 py-3 hover:border-brand-gold/40"
              >
                <p className="font-semibold text-brand-navy">{item.title}</p>
                <p className="mt-1 text-xs text-brand-muted">{item.meta}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
