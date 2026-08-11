import { useEffect, useState } from "react";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import {
  listNotificationLogs,
  processNotificationLog,
  processQueuedNotifications,
} from "../../lib/notifications/service";
import { isNotificationDevMode } from "../../lib/notifications/adapters";

export default function AdminNotifications() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function reload() {
    const rows = await listNotificationLogs();
    setLogs(rows);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        await reload();
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load notifications.");
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
      <Container className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Notifications
            </p>
            <h1 className="mt-2 font-display text-display-md text-brand-navy">
              Email & SMS log
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-brand-muted">
              Transactional only. Mode:{" "}
              <strong>{isNotificationDevMode() ? "development (console)" : "production"}</strong>.
              Publishing a progress update queues messages; contractor submissions never notify clients.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await processQueuedNotifications();
                await reload();
              } catch (err) {
                setError(err.message || "Processing failed.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Process queued
          </Button>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-brand-muted">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-brand-muted">No notification attempts yet.</p>
        ) : (
          <div className="overflow-hidden rounded-section border border-brand-border bg-white shadow-card">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-brand-cream/70 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-brand-border/70">
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{log.projects?.title || "—"}</td>
                    <td className="px-4 py-3">{log.notification_type}</td>
                    <td className="px-4 py-3 uppercase">{log.channel}</td>
                    <td className="px-4 py-3">{log.destination_masked}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold capitalize">{log.status}</span>
                      {log.error_message ? (
                        <p className="mt-1 text-xs text-red-600">{log.error_message}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {["queued", "failed"].includes(log.status) ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await processNotificationLog(log.id);
                              await reload();
                            } catch (err) {
                              setError(err.message || "Retry failed.");
                              await reload();
                            }
                          }}
                        >
                          Retry
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </Section>
  );
}
