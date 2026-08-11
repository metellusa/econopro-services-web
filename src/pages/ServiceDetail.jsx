import { Link, Navigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import SectionHeading from "../components/SectionHeading";
import CtaStrip from "../components/ui/CtaStrip";
import { getServiceBySlug, SERVICES, getServicePath } from "../data/services";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const primaryCta = service.primaryCta || {
    label: "Request an Estimate",
    to: "/bookings",
  };

  const otherServices = SERVICES.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/92 to-brand-navy/60" />
        </div>

        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <SectionEyebrow tone="white">Services</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-white text-balance">
              {service.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {service.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to={primaryCta.to} variant="primary" size="lg">
                {primaryCta.label}
              </Button>
              <Button to="/projects" variant="outline-light" size="lg">
                View Projects
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-section border border-white/10 shadow-soft">
            <img
              src={service.image}
              alt={service.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="What We Do"
            title={`${service.shortTitle} services`}
            description={service.description}
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.offerings.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-card border border-brand-border bg-white p-5 shadow-card"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-brand-gold"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-brand-navy">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {service.proofImages?.length ? (
        <Section tone="white">
          <Container>
            <SectionHeading
              eyebrow="Project Proof"
              title="Recent related work"
              description="Real project photography from EconoPro Services."
            />

            <div
              className={[
                "mt-10 grid gap-6",
                service.proofImages.length === 1
                  ? "max-w-3xl md:grid-cols-1"
                  : "md:grid-cols-2",
              ].join(" ")}
            >
              {service.proofImages.map((image) => (
                <div
                  key={image}
                  className="overflow-hidden rounded-section border border-brand-border bg-brand-cream shadow-card"
                >
                  <img
                    src={image}
                    alt={`${service.title} project example`}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="How it works"
            description="A simple path from request to completed work."
            centered
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {service.process.map((step, index) => (
              <article
                key={step.title}
                className="rounded-card border border-brand-border bg-white p-6 shadow-card"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                  Step {index + 1}
                </p>
                <h2 className="mt-3 font-display text-xl font-semibold text-brand-navy">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-brand-muted">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-4xl">
          <SectionHeading
            eyebrow="FAQ"
            title={`Common ${service.shortTitle.toLowerCase()} questions`}
            centered
          />

          <div className="mt-10 space-y-4">
            {service.faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-card border border-brand-border bg-brand-cream p-5 open:bg-white open:shadow-card"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-brand-navy marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-brand-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="More Services"
              title="Explore related solutions"
            />
            <Link
              to="/services"
              className="text-sm font-semibold text-brand-navy hover:text-brand-gold"
            >
              All Services →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {otherServices.map((item) => (
              <Link
                key={item.slug}
                to={getServicePath(item.slug)}
                className="rounded-card border border-brand-border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <p className="font-semibold text-brand-navy">{item.shortTitle}</p>
                <p className="mt-2 text-sm leading-6 text-brand-muted">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaStrip
        eyebrow="Ready to get started?"
        title={`Have a ${service.ctaLabel} project in mind?`}
        description="Request an estimate online and we’ll follow up to confirm the details."
        primaryLabel={primaryCta.label}
        primaryTo={primaryCta.to}
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </main>
  );
}
