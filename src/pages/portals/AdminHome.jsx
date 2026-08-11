import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";

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
          Authentication and guest-client foundations are live. Project
          management tools arrive in the next phases.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-brand-ink">
          <li>Staff and admin access is enforced by Supabase RLS + role checks.</li>
          <li>Clients can exist as guests without portal accounts.</li>
          <li>Guest project links use hashed, revocable tokens.</li>
        </ul>
      </Container>
    </Section>
  );
}
