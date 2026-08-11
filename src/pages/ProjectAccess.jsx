import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../components/ui/Container";
import { isSupabaseConfigured } from "../lib/supabase";
import { validateGuestAccessToken } from "../lib/backend";

/**
 * Phase 1 foundation only: validates the tokenized guest link.
 * Full guest project UI arrives in a later phase.
 */
export default function ProjectAccess() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [access, setAccess] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isSupabaseConfigured) {
        setStatus("error");
        setError("Backend is not configured yet.");
        return;
      }

      if (!token || token.length < 32) {
        setStatus("error");
        setError("This access link is invalid.");
        return;
      }

      try {
        const result = await validateGuestAccessToken(token);
        if (cancelled) return;

        if (!result) {
          setStatus("error");
          setError("This access link is invalid, expired, or revoked.");
          return;
        }

        setAccess(result);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setError(err.message || "Unable to validate this access link.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-screen items-center bg-brand-cream">
      <Container className="max-w-lg py-16">
        <div className="rounded-section border border-brand-border bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Project Access
          </p>
          <h1 className="mt-3 font-display text-3xl text-brand-navy">
            Secure guest link
          </h1>

          {status === "loading" ? (
            <p className="mt-4 text-sm text-brand-muted">Validating your link…</p>
          ) : null}

          {status === "error" ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {status === "ready" ? (
            <div className="mt-4 space-y-3 text-sm leading-7 text-brand-muted">
              <p>
                Access confirmed for{" "}
                <span className="font-semibold text-brand-navy">
                  {access.client_name}
                </span>
                .
              </p>
              <p>
                Your project view will appear here in a later release. This link
                does not expose internal project IDs and can be revoked by
                EconoPro staff at any time.
              </p>
            </div>
          ) : null}

          <p className="mt-8 text-sm">
            <Link to="/" className="font-semibold text-brand-navy hover:text-brand-gold">
              Back to website
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
