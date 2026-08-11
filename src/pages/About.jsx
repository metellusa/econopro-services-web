import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import CtaStrip from "../components/ui/CtaStrip";

export default function About() {
  return (
    <>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>About</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              A Local Company You Can Count On
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              EconoPro Services provides flooring, drywall, painting, cleaning,
              and property maintenance for homeowners and property managers in
              Orlando and Tampa, FL.
            </p>
            <div className="mt-8">
              <Button to="/bookings" variant="primary" size="lg">
                Request an Estimate
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>What you can expect</SectionEyebrow>
            <h2 className="mt-4 font-display text-display-md text-brand-navy">
              Clear communication and dependable results
            </h2>
            <ul className="mt-8 space-y-4 text-sm leading-7 text-brand-muted sm:text-base">
              <li>Clear communication throughout your project</li>
              <li>Clean, professional workmanship</li>
              <li>Respect for your home and property</li>
              <li>A straightforward estimate request process</li>
            </ul>
          </div>
        </Container>
      </Section>

      <CtaStrip
        title="Ready to talk about your project?"
        description="Request an estimate online or explore recent work."
        secondaryLabel="View Projects"
        secondaryTo="/projects"
      />
    </>
  );
}
