import { Link } from "react-router-dom";
import { BadgeDollarSign, CheckCircle2 } from "lucide-react";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ui/ServiceCard";
import CtaStrip from "../components/ui/CtaStrip";
import RequestEstimateButton from "../components/RequestEstimateButton";
import { SERVICES, getServicePath } from "../data/services";

const valuePoints = [
  "Clear communication from request to completion",
  "Clean, professional workmanship",
  "Practical solutions for homes and rentals",
  "Financing available for qualifying projects",
];

export default function Services() {
  return (
    <main>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>Our Services</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              Home improvement and cleaning services for Orlando and Tampa
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              Flooring, drywall, painting, cleaning, maintenance, and design
              assistance with clear communication and dependable results.
            </p>
            <div className="mt-8">
              <RequestEstimateButton variant="primary" size="lg" source="services-hero">
                Request an Estimate
              </RequestEstimateButton>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="What We Offer"
            title="Solutions for your home and property"
            description="Choose a service to learn more, then request an estimate online."
            centered
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.shortTitle}
                description={service.description}
                image={service.image}
                to={getServicePath(service.slug)}
                linkLabel="Learn More"
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-section border border-brand-border bg-white p-8 shadow-card">
            <SectionEyebrow>Why EconoPro</SectionEyebrow>
            <h2 className="mt-4 font-display text-display-md text-brand-navy">
              Dependable work with a straightforward process
            </h2>
            <ul className="mt-8 space-y-4">
              {valuePoints.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-gold"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-7 text-brand-muted sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-section bg-brand-navy p-8 text-white shadow-soft">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-brand-gold">
              <BadgeDollarSign size={24} aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Financing
            </p>
            <h2 className="mt-3 font-display text-display-md text-white">
              Flexible payment options for larger projects
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Convenient monthly plans may be available through our financing
              partners to help make your project more manageable.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/financing-options" variant="primary" size="lg">
                Explore Financing
              </Button>
              <RequestEstimateButton variant="outline-light" size="lg" source="services-financing">
                Request Estimate
              </RequestEstimateButton>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="rounded-section border border-brand-border bg-brand-cream px-8 py-10 text-center">
            <h2 className="font-display text-display-md text-brand-navy">
              Looking for a specific service?
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  to={getServicePath(service.slug)}
                  className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-gold/40"
                >
                  {service.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CtaStrip
        title="Tell us what you need"
        description="Request an estimate online and we’ll follow up to confirm the details."
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </main>
  );
}
