import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";

export default function ClientHome() {
  return (
    <Section tone="cream">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
          Client
        </p>
        <h1 className="mt-3 font-display text-display-md text-brand-navy">
          Client portal
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
          Registered clients will see their project history here. One-time guests
          can continue using secure project links without creating an account.
        </p>
      </Container>
    </Section>
  );
}
