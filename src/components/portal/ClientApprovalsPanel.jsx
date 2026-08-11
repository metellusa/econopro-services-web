import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { fieldClassName } from "../ui/FormControls";
import { listChangeOrders, respondToChangeOrder } from "../../lib/changeOrderApi";

export default function ClientApprovalsPanel({
  projectId,
  guestToken = null,
}) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [codes, setCodes] = useState({});
  const [comments, setComments] = useState({});

  async function reload() {
    const rows = await listChangeOrders(projectId);
    setOrders(
      rows.filter((order) =>
        ["awaiting_client", "approved", "declined"].includes(order.status)
      )
    );
  }

  useEffect(() => {
    if (!projectId) return;
    reload().catch((err) => setError(err.message || "Unable to load approvals."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!orders.length && !error) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-card space-y-4">
      <h2 className="font-display text-xl text-brand-navy">Approvals</h2>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {orders.map((order) => (
        <article key={order.id} className="rounded-xl border border-brand-border/70 p-4 space-y-3">
          <div>
            <p className="font-semibold text-brand-navy">{order.title}</p>
            <p className="mt-1 text-xs capitalize text-brand-muted">{order.status}</p>
          </div>
          <p className="text-sm leading-7 text-brand-ink whitespace-pre-wrap">
            {order.description}
          </p>
          <p className="text-xs text-brand-muted">
            Cost impact: {order.cost_adjustment ?? "—"} · Schedule:{" "}
            {order.schedule_impact_days ?? "—"} days
          </p>

          {order.status === "awaiting_client" ? (
            <>
              <textarea
                className={fieldClassName()}
                rows={2}
                placeholder="Optional comment"
                value={comments[order.id] || ""}
                onChange={(event) =>
                  setComments((prev) => ({ ...prev, [order.id]: event.target.value }))
                }
              />
              {guestToken ? (
                <input
                  className={fieldClassName()}
                  placeholder="Verification code from EconoPro"
                  value={codes[order.id] || ""}
                  onChange={(event) =>
                    setCodes((prev) => ({ ...prev, [order.id]: event.target.value }))
                  }
                />
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={async () => {
                    try {
                      await respondToChangeOrder({
                        changeOrderId: order.id,
                        response: "approved",
                        comment: comments[order.id] || "",
                        guestToken,
                        verificationCode: codes[order.id] || null,
                      });
                      await reload();
                    } catch (err) {
                      setError(err.message || "Unable to approve.");
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={async () => {
                    try {
                      await respondToChangeOrder({
                        changeOrderId: order.id,
                        response: "declined",
                        comment: comments[order.id] || "",
                        guestToken,
                        verificationCode: codes[order.id] || null,
                      });
                      await reload();
                    } catch (err) {
                      setError(err.message || "Unable to decline.");
                    }
                  }}
                >
                  Decline
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm font-semibold text-brand-navy">
              You {order.client_response} this change order.
            </p>
          )}
        </article>
      ))}
    </section>
  );
}
