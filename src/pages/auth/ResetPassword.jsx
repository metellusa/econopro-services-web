import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormControls";

export default function ResetPassword() {
  const { resetPassword, configured, configError } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await resetPassword(email);
      setDone(true);
    } catch (err) {
      setError(err.message || "Unable to send reset email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center bg-brand-cream">
      <Container className="max-w-md py-16">
        <div className="rounded-section border border-brand-border bg-white p-8 shadow-card">
          <h1 className="font-display text-3xl text-brand-navy">Reset password</h1>
          <p className="mt-3 text-sm leading-7 text-brand-muted">
            Enter your account email and we’ll send a recovery link.
          </p>

          {!configured ? (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {configError}
            </p>
          ) : done ? (
            <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              If an account exists for that email, a reset link is on the way.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormField
                id="reset-email"
                label="Email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
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
                {submitting ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-sm">
            <Link to="/sign-in" className="font-semibold text-brand-navy hover:text-brand-gold">
              Back to sign in
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
