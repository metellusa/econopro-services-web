import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/ui/Container";
import ClientProjectView from "../../components/portal/ClientProjectView";
import { getClientProjectPayload } from "../../lib/clientApi";

export default function ClientProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const payload = await getClientProjectPayload(projectId);
        if (!cancelled) setProject(payload);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load project.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <div className="bg-brand-cream pb-16">
      <Container className="py-6 space-y-6">
        <Link to="/client" className="text-sm font-semibold text-brand-navy">
          ← All projects
        </Link>
        {loading ? <p className="text-sm text-brand-muted">Loading…</p> : null}
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {!loading && !error ? (
          <ClientProjectView project={project} mode="client" />
        ) : null}
      </Container>
    </div>
  );
}
