import {
  BadgeCheck,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  MessageSquare,
  CalendarDays,
  Hammer,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ui/ServiceCard";
import TrustItem from "../components/ui/TrustItem";
import ReviewCard from "../components/ui/ReviewCard";
import CtaStrip from "../components/ui/CtaStrip";
import ProjectProgressShowcase from "../components/ProjectProgressShowcase";
import { COMPANY } from "../data/site";

const servicesPreview = [
  {
    title: "Flooring",
    description: "Tile, vinyl plank, laminate, and hardwood installation and repair.",
    image: "/after-foyer-pic.jpg",
    to: "/services",
  },
  {
    title: "Drywall",
    description: "Installation, repairs, patching, and texture matching.",
    image: "/kitchen-demo-2.jpeg",
    to: "/services",
  },
  {
    title: "Painting",
    description: "Interior and exterior painting with clean, professional finishes.",
    image: "/after-room-painted.png",
    to: "/services",
  },
  {
    title: "Cleaning",
    description: "Standard, deep, and move-out cleaning for homes and properties.",
    image: "/deep-cleaning.jpeg",
    to: "/services",
  },
  {
    title: "Property Maintenance",
    description: "Practical repairs and upkeep support for homeowners and landlords.",
    image: "/composite-panel-installation-after-1.png",
    to: "/services",
  },
  {
    title: "Design Assistance",
    description: "In-home consultation, mockups, and color guidance for your space.",
    image: "/kitchen-finished-1.jpeg",
    to: "/services",
  },
];

const trustItems = [
  {
    icon: BadgeCheck,
    title: "BBB Accredited Business",
    description: "Verified accreditation with the Better Business Bureau.",
  },
  {
    icon: BadgeDollarSign,
    title: "Financing Available",
    description: "Flexible payment options for qualifying projects.",
  },
  {
    icon: MapPin,
    title: "Local Service",
    description: "Proudly serving Orlando & Tampa, FL.",
  },
  {
    icon: MessageSquare,
    title: "Clear Communication",
    description: "Straightforward updates from estimate to completion.",
  },
  {
    icon: Clock3,
    title: "Convenient Hours",
    description: "Mon–Fri 8am–8pm · Sat 8am–5pm",
  },
];

const testimonials = [
  {
    quote:
      "I had my living room and dining room walls painted recently, and I’m so happy with how everything turned out! The team was super professional and showed up right on time.",
    name: "Clement Beauvais",
  },
  {
    quote:
      "Did everything that was asked and did it well. Will be using them on a regular basis. Thanks again for a great job.",
    name: "Douglas Lanier",
  },
  {
    quote: "Excellent service! Very professional, quick and reasonable price.",
    name: "Mary Valero",
  },
];

const whyChoose = [
  "Clear communication",
  "Professional workmanship",
  "Respect for the property",
  "Straightforward estimate process",
];

const processSteps = [
  {
    step: "01",
    title: "Request",
    description: "Tell us what you need through a quick online request.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Estimate",
    description: "We review the details and follow up with clear next steps.",
    icon: CalendarDays,
  },
  {
    step: "03",
    title: "Schedule",
    description: "We confirm timing that works for your project.",
    icon: Hammer,
  },
  {
    step: "04",
    title: "Complete",
    description: "We finish the work with clean, dependable results.",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <img
            src="/kitchen-finished-1.jpeg"
            alt="Completed kitchen renovation by EconoPro Services"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/55" />
        </div>

        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="max-w-xl">
            <SectionEyebrow tone="white">
              Home Improvement & Cleaning Services
            </SectionEyebrow>

            <h1 className="mt-5 font-display text-display-xl text-white text-balance">
              Reliable Home Improvement Services in Orlando & Tampa
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Flooring, drywall, painting, cleaning, and property maintenance
              with clear communication and dependable results.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/bookings" variant="primary" size="lg">
                Request an Estimate
              </Button>
              <Button to="/projects" variant="outline-light" size="lg">
                View Our Work
              </Button>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-sm text-slate-300">
              <MapPin size={16} className="text-brand-gold" aria-hidden="true" />
              Serving Orlando & Tampa, FL
            </p>

            <a
              href="https://www.bbb.org/us/fl/orlando/profile/handyman/econopro-services-llc-0733-235980930/#sealclick"
              target="_blank"
              rel="nofollow noreferrer"
              className="mt-6 inline-flex rounded-2xl bg-white p-3 shadow-card lg:hidden"
            >
              <img
                src="https://seal-centralflorida.bbb.org/seals/black-seal-250-52-bbb-235980930.png"
                alt="BBB Accredited Business"
                className="h-10 w-auto"
              />
            </a>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-section border border-white/10 shadow-soft">
              <img
                src="/kitchen-finished-1.jpeg"
                alt="Finished kitchen project with island and modern finishes"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <a
              href="https://www.bbb.org/us/fl/orlando/profile/handyman/econopro-services-llc-0733-235980930/#sealclick"
              target="_blank"
              rel="nofollow noreferrer"
              className="absolute -bottom-5 left-6 hidden rounded-2xl bg-white p-3 shadow-card transition hover:-translate-y-0.5 lg:inline-flex"
            >
              <img
                src="https://seal-centralflorida.bbb.org/seals/black-seal-250-52-bbb-235980930.png"
                alt="BBB Accredited Business"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </Container>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-brand-border bg-white">
        <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 lg:py-10">
          {trustItems.map((item) => (
            <TrustItem key={item.title} {...item} />
          ))}
        </Container>
      </section>

      {/* SERVICES */}
      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="Our Services"
            title="Solutions for Your Home & Property"
            description="Practical home improvement and cleaning services with professional care."
            centered
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {servicesPreview.map((service) => (
              <ServiceCard key={service.title} {...service} linkLabel="Learn More" />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="text-sm font-semibold text-brand-navy transition hover:text-brand-gold"
            >
              View All Services
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </Container>
      </Section>

      <ProjectProgressShowcase />

      {/* REVIEWS + WHY CHOOSE */}
      <Section tone="cream">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Why Choose EconoPro"
              title="A smooth experience from start to finish"
              description="We focus on the essentials that make home projects easier."
            />

            <ul className="mt-8 space-y-4">
              {whyChoose.map((item) => (
                <li key={item} className="flex items-start gap-3 text-brand-ink">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-brand-gold"
                    aria-hidden="true"
                  />
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button to="/reviews" variant="outline" size="md">
                Read More Reviews
              </Button>
            </div>
          </div>

          <div>
            <SectionEyebrow>Customer Feedback</SectionEyebrow>
            <h2 className="mt-3 font-display text-display-md text-brand-navy">
              What customers say
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              {testimonials.map((review) => (
                <ReviewCard key={review.name} {...review} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* HOW IT WORKS */}
      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="Four simple steps"
            description="From your first request to a completed project."
            centered
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.step}
                  className="rounded-card border border-brand-border bg-brand-cream p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                      {step.step}
                    </span>
                    <div className="rounded-xl bg-white p-2 text-brand-navy shadow-sm">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-brand-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-brand-muted">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <CtaStrip
        eyebrow="Ready to get started?"
        title="Request an estimate or call us today"
        description="Tell us about your project and we’ll follow up to confirm the details."
        primaryLabel="Request an Estimate"
        primaryTo="/bookings"
        secondaryLabel="Call Now"
        secondaryHref={`tel:${COMPANY.phoneTel}`}
      />
    </main>
  );
}
