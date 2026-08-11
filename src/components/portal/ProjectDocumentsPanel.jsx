import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { fieldClassName } from "../ui/FormControls";
import {
  createChangeOrder,
  issueGuestVerification,
  listChangeOrders,
  listProjectDocuments,
  publishChangeOrder,
  uploadProjectDocument,
} from "../../lib/changeOrderApi";
import { processQueuedNotifications } from "../../lib/notifications/service";

export default function ProjectDocumentsPanel({ projectId }) {
  const [documents, setDocuments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    reason: "",
    cost_adjustment: "",
    schedule_impact_days: "",
  });
  const [verificationCode, setVerificationCode] = useState("");

  async function reload() {
    const [docs, changeOrders] = await Promise.all([
      listProjectDocuments(projectId),
      listChangeOrders(projectId),
    ]);
    setDocuments(docs);
    setOrders(changeOrders);
  }

  useEffect(() => {
    reload().catch((err) => setError(err.message || "Unable to load documents."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-brand-navy">Documents</h3>
          <label className="inline-flex cursor-pointer rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white">
            Upload client document
            <input
              type="file"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  await uploadProjectDocument({
                    projectId,
                    file,
                    title: file.name,
                    kind: "client_attachment",
                    visibility: "client",
                  });
                  await reload();
                } catch (err) {
                  setError(err.message || "Upload failed.");
                } finally {
                  event.target.value = "";
                }
              }}
            />
          </label>
        </div>
        {documents.length === 0 ? (
          <p className="text-sm text-brand-muted">No documents yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-border px-3 py-2"
              >
                <span>
                  {doc.title}{" "}
                  <span className="text-xs text-brand-muted">
                    ({doc.kind} · {doc.visibility})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy">Create change order</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className={fieldClassName()}
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <input
            className={fieldClassName()}
            placeholder="Reason"
            value={form.reason}
            onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
          />
          <input
            className={fieldClassName()}
            placeholder="Cost adjustment (e.g. 250.00)"
            value={form.cost_adjustment}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, cost_adjustment: event.target.value }))
            }
          />
          <input
            className={fieldClassName()}
            placeholder="Schedule impact (days)"
            value={form.schedule_impact_days}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, schedule_impact_days: event.target.value }))
            }
          />
        </div>
        <textarea
          className={fieldClassName()}
          rows={4}
          placeholder="Description for the client"
          value={form.description}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, description: event.target.value }))
          }
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={async () => {
            try {
              await createChangeOrder({
                project_id: projectId,
                title: form.title.trim(),
                description: form.description.trim(),
                reason: form.reason.trim(),
                cost_adjustment: form.cost_adjustment
                  ? Number(form.cost_adjustment)
                  : null,
                schedule_impact_days: form.schedule_impact_days
                  ? Number(form.schedule_impact_days)
                  : null,
              });
              setForm({
                title: "",
                description: "",
                reason: "",
                cost_adjustment: "",
                schedule_impact_days: "",
              });
              await reload();
            } catch (err) {
              setError(err.message || "Unable to create change order.");
            }
          }}
        >
          Save draft
        </Button>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-brand-navy">Change orders</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-brand-muted">No change orders yet.</p>
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-brand-border bg-brand-cream/40 p-4 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">{order.title}</p>
                  <p className="text-xs capitalize text-brand-muted">{order.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.status === "draft" || order.status === "internal_review" ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        try {
                          await publishChangeOrder(order.id);
                          await processQueuedNotifications();
                          await reload();
                        } catch (err) {
                          setError(err.message || "Publish failed.");
                        }
                      }}
                    >
                      Send to client
                    </Button>
                  ) : null}
                  {order.status === "awaiting_client" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const code = await issueGuestVerification(order.id);
                          setVerificationCode(code);
                        } catch (err) {
                          setError(err.message || "Unable to issue code.");
                        }
                      }}
                    >
                      Issue guest verification code
                    </Button>
                  ) : null}
                </div>
              </div>
              <p className="text-sm text-brand-ink whitespace-pre-wrap">{order.description}</p>
              <p className="text-xs text-brand-muted">
                Cost: {order.cost_adjustment ?? "—"} · Schedule days:{" "}
                {order.schedule_impact_days ?? "—"}
              </p>
              {order.client_response ? (
                <p className="text-sm font-semibold text-brand-navy">
                  Client {order.client_response}
                  {order.client_comment ? `: ${order.client_comment}` : ""}
                </p>
              ) : null}
            </article>
          ))
        )}
        {verificationCode ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Guest verification code (share via SMS/email once): <strong>{verificationCode}</strong>
          </p>
        ) : null}
      </section>
    </div>
  );
}
