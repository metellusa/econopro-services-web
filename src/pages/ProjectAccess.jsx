import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../components/ui/Container";
import ClientProjectView from "../components/portal/ClientProjectView";
import { isSupabaseConfigured } from "../lib/supabase";
import { getGuestProjectPayload } from "../lib/clientApi";
import { COMPANY } from "../data/site";

export default function ProjectAccess() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [payload, setPayload] = useState(null);
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
        const result = await getGuestProjectPayload(token);
        if (cancelled) return;

        if (!result) {
          setStatus("error");
          setError("This access link is invalid, expired, or revoked.");
          return;
        }

        setPayload(result);
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
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-brand-border bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="" className="h-10 w-10 rounded-2xl object-cover" />
            <span className="font-semibold text-brand-navy">{COMPANY.name}</span>
          </Link>
          <a
            href={`tel:${COMPANY.phoneTel}`}
            className="text-sm font-semibold text-brand-navy"
          >
            Call us
          </a>
        </Container>
      </header>

      <Container className="py-8 max-w-3xl">
        {status === "loading" ? (
          <p className="text-sm text-brand-muted">Validating your secure link…</p>
        ) : null}

        {status === "error" ? (
          <div className="rounded-section border border-red-200 bg-white p-8 shadow-card">
            <h1 className="font-display text-3xl text-brand-navy">Link unavailable</h1>
            <p className="mt-4 text-sm text-red-700">{error}</p>
            <p className="mt-4 text-sm text-brand-muted">
              Contact EconoPro at {COMPANY.phoneDisplay} if you need a new link.
            </p>
          </div>
        ) : null}

        {status === "ready" ? (
          <ClientProjectView
            project={payload.project}
            clientName={payload.client_name}
            mode="guest"
            guestToken={token}
          />
        ) : null}
      </Container>
    </div>
  );
}
