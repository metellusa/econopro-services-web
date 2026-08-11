import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormControls";
import { portalHomeForRole } from "../../lib/roles";

export default function SignIn() {
  const { signIn, session, profile, loading, configured, configError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && profile) {
    const destination =
      location.state?.from || portalHomeForRole(profile.role);
    return <Navigate to={destination} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await signIn({ email, password });
      const destination =
        location.state?.from || portalHomeForRole(result.profile?.role);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center bg-brand-cream bg-hero-glow">
      <Container className="max-w-md py-16">
        <div className="rounded-section border border-brand-border bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Portal Access
          </p>
          <h1 className="mt-3 font-display text-3xl text-brand-navy">Sign in</h1>
          <p className="mt-3 text-sm leading-7 text-brand-muted">
            Staff, contractors, and registered clients sign in here.
          </p>

          {!configured ? (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {configError}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormField
                id="sign-in-email"
                label="Email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
              <FormField
                id="sign-in-password"
                label="Password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />

              {error ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
            <Link
              to="/reset-password"
              className="font-semibold text-brand-navy hover:text-brand-gold"
            >
              Forgot password?
            </Link>
            <Link to="/" className="text-slate-500 hover:text-brand-navy">
              Back to website
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
