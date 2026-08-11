import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import { fieldClassName } from "../../components/ui/FormControls";
import {
  listOpenIssues,
  listSubmittedProgressUpdates,
  reviewProgressUpdate,
  updateIssueStatus,
} from "../../lib/contractorApi";
import { processQueuedNotifications } from "../../lib/notifications/service";
import { convertIssueToChangeOrder } from "../../lib/changeOrderApi";

export default function AdminReviews() {
  const [updates, setUpdates] = useState([]);
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function reload() {
    const [updateRows, issueRows] = await Promise.all([
      listSubmittedProgressUpdates(),
      listOpenIssues(),
    ]);
    setUpdates(updateRows);
    setIssues(issueRows);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        await reload();
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load review queue.");
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
      <Container className="space-y-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Review queue
          </p>
          <h1 className="mt-2 font-display text-display-md text-brand-navy">
            Progress updates & issues
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-brand-muted">
            Contractor internal notes never publish automatically. Edit the
            client-facing message, then publish when ready.
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
            <section className="space-y-4">
              <h2 className="font-display text-xl text-brand-navy">
                Progress updates ({updates.length})
              </h2>
              {updates.length === 0 ? (
                <p className="text-sm text-brand-muted">No updates awaiting action.</p>
              ) : (
                updates.map((update) => (
                  <UpdateCard
                    key={update.id}
                    update={update}
                    onChanged={reload}
                    onError={setError}
                  />
                ))
              )}
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl text-brand-navy">
                Open issues ({issues.length})
              </h2>
              {issues.length === 0 ? (
                <p className="text-sm text-brand-muted">No open issues.</p>
              ) : (
                issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-section border border-amber-200 bg-amber-50/40 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-brand-navy">{issue.title}</p>
                        <p className="mt-1 text-xs text-brand-muted">
                          {issue.projects?.title} · {issue.category} ·{" "}
                          {issue.profiles?.full_name || issue.profiles?.email}
                        </p>
                        <p className="mt-3 text-sm text-brand-ink">{issue.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            await updateIssueStatus(issue.id, "acknowledged");
                            await reload();
                          }}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            await convertIssueToChangeOrder(issue);
                            await reload();
                          }}
                        >
                          To change order
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={async () => {
                            await updateIssueStatus(issue.id, "resolved");
                            await reload();
                          }}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                    <Link
                      to={`/admin/projects/${issue.project_id}`}
                      className="mt-3 inline-block text-sm font-semibold text-brand-navy"
                    >
                      Open project →
                    </Link>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </Container>
    </Section>
  );
}

function UpdateCard({ update, onChanged, onError }) {
  const [clientText, setClientText] = useState(
    update.published_client_update || update.proposed_client_update || ""
  );
  const [notes, setNotes] = useState(update.review_notes || "");
  const [busy, setBusy] = useState(false);

  async function act(action) {
    setBusy(true);
    try {
      await reviewProgressUpdate(update.id, action, clientText, notes);
      if (action === "publish") {
        try {
          await processQueuedNotifications();
        } catch {
          // Publish already succeeded; failures appear in Notifications.
        }
      }
      await onChanged();
    } catch (err) {
      onError(err.message || "Review action failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-section border border-brand-border bg-white p-5 shadow-card space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-navy">
            {update.projects?.title || "Project"}
          </p>
          <p className="text-xs text-brand-muted">
            {update.profiles?.full_name || update.profiles?.email} ·{" "}
            {update.project_phases?.name || "No phase"} · {update.status}
          </p>
        </div>
        <Link
          to={`/admin/projects/${update.project_id}`}
          className="text-sm font-semibold text-brand-navy"
        >
          Project →
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            Internal note
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-brand-ink">
            {update.internal_note || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Client-facing message
          </p>
          <textarea
            className={`${fieldClassName()} mt-2`}
            rows={5}
            value={clientText}
            onChange={(event) => setClientText(event.target.value)}
          />
        </div>
      </div>

      <textarea
        className={fieldClassName()}
        rows={2}
        placeholder="Review notes to contractor (optional)"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      {(update.progress_update_media || []).length ? (
        <ul className="text-sm text-brand-muted">
          {update.progress_update_media.map((media) => (
            <li key={media.id}>
              {media.file_name} ({media.visibility})
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="md" disabled={busy} onClick={() => act("approve")}>
          Approve
        </Button>
        <Button type="button" variant="secondary" size="md" disabled={busy} onClick={() => act("publish")}>
          Publish to client
        </Button>
        <Button type="button" variant="ghost" size="md" disabled={busy} onClick={() => act("reject")}>
          Reject / request revision
        </Button>
      </div>
    </article>
  );
}
