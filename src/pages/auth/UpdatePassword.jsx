import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormControls";
import { portalHomeForRole } from "../../lib/roles";

export default function UpdatePassword() {
  const { updatePassword, profile, session, configured, configError } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      navigate(portalHomeForRole(profile?.role), { replace: true });
    } catch (err) {
      setError(err.message || "Unable to update password.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center bg-brand-cream">
      <Container className="max-w-md py-16">
        <div className="rounded-section border border-brand-border bg-white p-8 shadow-card">
          <h1 className="font-display text-3xl text-brand-navy">Set new password</h1>
          <p className="mt-3 text-sm leading-7 text-brand-muted">
            Choose a new password for your EconoPro portal account.
          </p>

          {!configured ? (
            <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {configError}
            </p>
          ) : !session ? (
            <p className="mt-6 text-sm text-brand-muted">
              Open the recovery link from your email first, then return here.{" "}
              <Link to="/sign-in" className="font-semibold text-brand-navy">
                Sign in
              </Link>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormField
                id="new-password"
                label="New password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
              <FormField
                id="confirm-password"
                label="Confirm password"
                name="confirm"
                type="password"
                required
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
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
                {submitting ? "Saving…" : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
