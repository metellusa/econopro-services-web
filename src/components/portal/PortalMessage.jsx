import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function PortalMessage({
  title,
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex min-h-screen items-center bg-brand-cream">
      <Container className="max-w-lg py-16">
        <div className="rounded-section border border-brand-border bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            EconoPro Portals
          </p>
          <h1 className="mt-3 font-display text-3xl text-brand-navy">{title}</h1>
          {description ? (
            <p className="mt-4 text-sm leading-7 text-brand-muted">{description}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {actionLabel && actionTo ? (
              <Button to={actionTo} variant="secondary" size="md">
                {actionLabel}
              </Button>
            ) : null}
            <Button to="/" variant="outline" size="md">
              Back to website
            </Button>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Need help?{" "}
            <Link to="/contact" className="font-semibold text-brand-navy hover:text-brand-gold">
              Contact us
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
