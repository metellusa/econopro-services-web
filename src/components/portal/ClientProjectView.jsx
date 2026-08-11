import { Link } from "react-router-dom";
import { COMPANY } from "../../data/site";
import { projectStatusLabel } from "../../lib/projects";
import { phaseStatusLabel } from "../../lib/phases";

export default function ClientProjectView({
  project,
  clientName,
  mode = "client",
  upgradeSlot = null,
}) {
  if (!project) {
    return (
      <p className="rounded-2xl border border-brand-border bg-white px-4 py-6 text-sm text-brand-muted">
        No project is available for this access link yet.
      </p>
    );
  }

  const phases = project.phases || [];
  const updates = project.updates || [];
  const files = project.files || [];
  const managers = project.managers || [];
  const currentPhase =
    phases.find((phase) => phase.status === "in_progress") ||
    phases.find((phase) => phase.status !== "completed") ||
    phases[phases.length - 1];
  const latestUpdate = updates[0];

  return (
    <div className="space-y-6">
      <section className="rounded-section bg-brand-navy p-6 text-white shadow-soft sm:p-8">
        {clientName ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            {mode === "guest" ? "Guest project access" : "Your project"} · {clientName}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">{project.title}</h1>
        <p className="mt-3 text-sm text-slate-300">
          {project.service_type} · {project.property_address}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            {projectStatusLabel(project.status)}
          </span>
          <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-white">
            {project.progress_percent || 0}% complete
          </span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-brand-gold"
            style={{ width: `${project.progress_percent || 0}%` }}
          />
        </div>
        {project.client_summary ? (
          <p className="mt-5 text-sm leading-7 text-slate-200">{project.client_summary}</p>
        ) : null}
      </section>

      {latestUpdate ? (
        <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            Latest update
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-ink">{latestUpdate.message}</p>
          {latestUpdate.published_at ? (
            <p className="mt-2 text-xs text-brand-muted">
              {new Date(latestUpdate.published_at).toLocaleString()}
            </p>
          ) : null}
        </section>
      ) : null}

      {currentPhase ? (
        <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Current / upcoming step
          </p>
          <h2 className="mt-2 font-display text-2xl text-brand-navy">{currentPhase.name}</h2>
          <p className="mt-2 text-sm text-brand-muted">
            {phaseStatusLabel(currentPhase.status)}
            {currentPhase.due_date ? ` · target ${currentPhase.due_date}` : ""}
          </p>
          {currentPhase.client_facing_update ? (
            <p className="mt-3 text-sm leading-7 text-brand-ink">
              {currentPhase.client_facing_update}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-card">
        <h2 className="font-display text-xl text-brand-navy">Project phases</h2>
        <ol className="mt-4 space-y-3">
          {phases.map((phase) => (
            <li
              key={phase.id}
              className="rounded-xl border border-brand-border/70 bg-brand-cream/40 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">{phase.name}</p>
                  <p className="text-xs text-brand-muted">
                    {phaseStatusLabel(phase.status)}
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-navy">
                  {phase.progress_percent || 0}%
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {files.length ? (
        <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-card">
          <h2 className="font-display text-xl text-brand-navy">Documents</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-muted">
            {files.map((file) => (
              <li key={file.id}>{file.file_name}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-card">
        <h2 className="font-display text-xl text-brand-navy">Contact EconoPro</h2>
        {managers.length ? (
          <ul className="mt-3 space-y-2 text-sm text-brand-muted">
            {managers.map((manager, index) => (
              <li key={`${manager.email}-${index}`}>
                {manager.full_name || "Project manager"}
                {manager.phone ? ` · ${manager.phone}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-brand-muted">
            Call {COMPANY.phoneDisplay} or email {COMPANY.email}.
          </p>
        )}
        <a
          href={`tel:${COMPANY.phoneTel}`}
          className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-gold"
        >
          Call {COMPANY.phoneDisplay}
        </a>
      </section>

      {upgradeSlot}

      {mode === "guest" ? (
        <p className="text-center text-xs text-slate-500">
          Prefer a full account for project history?{" "}
          <Link to="/sign-in" className="font-semibold text-brand-navy">
            Sign in
          </Link>{" "}
          or ask EconoPro to link your projects.
        </p>
      ) : null}
    </div>
  );
}
