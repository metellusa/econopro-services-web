import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";

export default function AdminHome() {
  return (
    <Section tone="cream">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
          Admin
        </p>
        <h1 className="mt-3 font-display text-display-md text-brand-navy">
          Operations portal
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
          Manage guest and registered clients, assign contractors, and track
          project status. Internal notes stay staff-only.
        </p>
        <div className="mt-8">
          <Button to="/admin/projects" variant="secondary" size="lg">
            Open projects
          </Button>
        </div>
      </Container>
    </Section>
  );
}
