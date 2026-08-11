import { CheckCircle2, ClipboardList, CalendarDays, Hammer, Sparkles } from "lucide-react";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import TrustItem from "../components/ui/TrustItem";
import CtaStrip from "../components/ui/CtaStrip";
import { COMPANY } from "../data/site";
import { BBB } from "../data/reviews";

const values = [
  {
    title: "Clear communication",
    description: "Straightforward updates from the first request through completion.",
  },
  {
    title: "Quality workmanship",
    description: "Clean, professional results across flooring, drywall, painting, and more.",
  },
  {
    title: "Respect for the property",
    description: "We treat every home carefully and leave finished spaces tidy.",
  },
  {
    title: "Dependable process",
    description: "A simple path from estimate request to scheduled work.",
  },
];

const processSteps = [
  {
    title: "Request",
    description: "Share what you need through a quick online request.",
    icon: ClipboardList,
  },
  {
    title: "Estimate",
    description: "We review the details and follow up with clear next steps.",
    icon: CalendarDays,
  },
  {
    title: "Schedule",
    description: "We confirm timing that works for your project.",
    icon: Hammer,
  },
  {
    title: "Complete",
    description: "We finish the work with dependable, professional results.",
    icon: Sparkles,
  },
];

export default function About() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <img
            src="/kitchen-finished-2.jpeg"
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/55" />
        </div>

        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <SectionEyebrow tone="white">About</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-white text-balance">
              A Local Company You Can Count On
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              EconoPro Services provides flooring, drywall, painting, cleaning,
              and property maintenance for homeowners and property managers in
              Orlando and Tampa, FL.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/bookings" variant="primary" size="lg">
                Request an Estimate
              </Button>
              <Button to="/projects" variant="outline-light" size="lg">
                View Projects
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-section border border-white/10 shadow-soft">
            <img
              src="/kitchen-finished-2.jpeg"
              alt="Completed EconoPro project interior"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Container>
      </section>

      <Section tone="white">
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionEyebrow>Our Approach</SectionEyebrow>
            <h2 className="mt-3 font-display text-display-md text-brand-navy">
              Practical home improvement with clear expectations
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-brand-muted">
              We help with everyday repairs, larger refreshes, and cleaning
              requests. Our focus is simple: communicate clearly, respect your
              property, and deliver work you can feel good about.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-brand-muted">
              Whether you need flooring, drywall, painting, maintenance, or
              cleaning, you can request an estimate online and we’ll follow up
              to confirm the details.
            </p>
          </div>

          <div className="rounded-section border border-brand-border bg-brand-cream p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-brand-navy">
              Verified company details
            </h3>
            <div className="mt-6 space-y-5">
              <TrustItem
                icon={CheckCircle2}
                title={BBB.label}
                description="View our Better Business Bureau profile."
              />
              <a
                href={BBB.profileUrl}
                target="_blank"
                rel="nofollow noreferrer"
                className="inline-flex rounded-2xl bg-white p-3 shadow-card"
              >
                <img
                  src={BBB.sealUrl}
                  alt="BBB Accredited Business"
                  className="h-10 w-auto"
                />
              </a>
              <div className="space-y-2 text-sm text-brand-muted">
                <p>
                  <span className="font-semibold text-brand-navy">Service area:</span>{" "}
                  {COMPANY.serviceArea}
                </p>
                <p>
                  <span className="font-semibold text-brand-navy">Phone:</span>{" "}
                  <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-brand-navy">
                    {COMPANY.phoneDisplay}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-brand-navy">Email:</span>{" "}
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-brand-navy">
                    {COMPANY.email}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-brand-navy">Hours:</span>{" "}
                  {COMPANY.hours.weekdays}; {COMPANY.hours.saturday}
                </p>
                <p>
                  <span className="font-semibold text-brand-navy">Financing:</span>{" "}
                  Available for qualifying projects.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionEyebrow>What customers can expect</SectionEyebrow>
          <h2 className="mt-3 font-display text-display-md text-brand-navy">
            Our commitments on every project
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {values.map((item) => (
              <article
                key={item.title}
                className="rounded-card border border-brand-border bg-white p-6 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-brand-gold"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-brand-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-brand-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionEyebrow>Process</SectionEyebrow>
          <h2 className="mt-3 font-display text-display-md text-brand-navy">
            Request → Estimate → Schedule → Complete
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-card border border-brand-border bg-brand-cream p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                      0{index + 1}
                    </span>
                    <Icon size={18} className="text-brand-navy" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold text-brand-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="rounded-section border border-brand-border bg-white px-8 py-10 text-center shadow-card">
            <SectionEyebrow>Our Team</SectionEyebrow>
            <h2 className="mt-3 font-display text-display-md text-brand-navy">
              Real people, real project results
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-brand-muted">
              Team and owner photos will be added here as they become available.
              In the meantime, explore completed projects to see the quality of
              work EconoPro delivers.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/projects" variant="secondary" size="lg">
                View Projects
              </Button>
              <Button to="/reviews" variant="outline" size="lg">
                Read Reviews
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <CtaStrip
        title="Ready to talk about your project?"
        description="Request an estimate online or call us directly."
        secondaryLabel="Call Now"
        secondaryHref={`tel:${COMPANY.phoneTel}`}
      />
    </main>
  );
}
