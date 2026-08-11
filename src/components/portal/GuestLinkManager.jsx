import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { fieldClassName } from "../ui/FormControls";
import {
  generateGuestLink,
  listGuestTokens,
  revokeGuestLink,
} from "../../lib/clientApi";

export default function GuestLinkManager({ clientId, projectId }) {
  const [tokens, setTokens] = useState([]);
  const [createdPath, setCreatedPath] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function reload() {
    if (!clientId) return;
    const rows = await listGuestTokens(clientId);
    setTokens(rows);
  }

  useEffect(() => {
    reload().catch((err) => setError(err.message || "Unable to load guest links."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  async function handleCreate() {
    setBusy(true);
    setError("");
    setCreatedPath("");
    try {
      const created = await generateGuestLink(
        clientId,
        projectId ? [projectId] : [],
        "Client project access"
      );
      setCreatedPath(created.access_path);
      await reload();
    } catch (err) {
      setError(err.message || "Unable to create guest link.");
    } finally {
      setBusy(false);
    }
  }

  if (!clientId) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-brand-navy">Guest access links</h3>
          <p className="text-xs text-brand-muted">
            Secure tokenized URLs. No database IDs in the public path.
          </p>
        </div>
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={handleCreate}>
          {busy ? "Creating…" : "Generate link"}
        </Button>
      </div>

      {createdPath ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
          <p className="font-semibold text-emerald-900">Copy this link now (shown once):</p>
          <input
            className={`${fieldClassName()} mt-2`}
            readOnly
            value={`${window.location.origin}${createdPath}`}
            onFocus={(event) => event.target.select()}
          />
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : null}

      <ul className="space-y-2 text-sm">
        {tokens.map((token) => (
          <li
            key={token.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border px-3 py-2"
          >
            <div>
              <p className="font-medium text-brand-navy">{token.label || "Guest link"}</p>
              <p className="text-xs text-brand-muted">
                {token.revoked_at
                  ? `Revoked ${new Date(token.revoked_at).toLocaleString()}`
                  : "Active"}
                {token.last_used_at
                  ? ` · last used ${new Date(token.last_used_at).toLocaleString()}`
                  : ""}
              </p>
            </div>
            {!token.revoked_at ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  await revokeGuestLink(token.id);
                  await reload();
                }}
              >
                Revoke
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
