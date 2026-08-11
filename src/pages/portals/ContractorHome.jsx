import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";

export default function ContractorHome() {
  return (
    <Section tone="cream">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
          Contractor
        </p>
        <h1 className="mt-3 font-display text-display-md text-brand-navy">
          Contractor portal
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
          Assigned projects and progress submissions will appear here. You will
          only see work assigned to you, and internal notes stay internal.
        </p>
      </Container>
    </Section>
  );
}
