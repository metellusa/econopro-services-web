import {
  BadgeDollarSign,
  Brush,
  HandHelping,
  Home,
  PaintBucket,
  Sparkles,
  ChevronRight,
  Sofa,
} from "lucide-react";

import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";

const services = [
  {
    icon: Home,
    title: "Flooring Installation & Repair",
    description:
      "Beautiful, durable flooring solutions for living spaces, rentals, and investment properties.",
    bullets: ["Tile", "Vinyl plank", "Laminate", "Hardwood"],
  },
  {
    icon: Brush,
    title: "Drywall Services",
    description:
      "From patchwork to full drywall updates, we help restore walls and ceilings with a polished look.",
    bullets: ["Drywall installation", "Drywall repair", "Texture matching"],
  },
  {
    icon: PaintBucket,
    title: "Interior & Exterior Painting",
    description:
      "Freshen up your property with careful prep, crisp lines, and high-quality workmanship.",
    bullets: [
      "Interior painting", "Exterior painting", "Touch-ups and repainting",
    ],
  },
  {
    icon: Sparkles,
    title: "Cleaning Services",
    description:
      "Reliable residential cleaning options that keep your home looking refreshed and guest-ready.",
    bullets: [
      "Standard cleaning",
      "Deep cleaning",
      "Move-out cleaning",
    ],
  },
  {
    icon: HandHelping,
    title: "General Property Maintenance",
    description:
      "Practical handyman help for property owners who want dependable service without surprises.",
    bullets: [
      "Minor repairs",
      "Punch-list items",
      "Ongoing upkeep support",
    ],
  },
  {
    icon: Sofa,
    title: "Interior Design Services",
    description:
      "Home styling and color guidance to help you plan your space with confidence.",
    bullets: [
      "In-home consultation",
      "Design mockups",
      "Color & décor recommendations",
    ],
  },
  {
    icon: BadgeDollarSign,
    title: "Flexible Payment Options",
    description:
      "Convenient monthly payment plans are available to make larger projects more manageable.",
    bullets: [
      "Budget-friendly options",
      "Clear communication",
      "Project-friendly flexibility",
    ],
  },
];

export default function Services() {
  return (
    <main>
      <section className="bg-hero-glow py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Our Services
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              Reliable home improvement and cleaning services for Orlando and Tampa
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              EconoPro Services provides practical, high-quality solutions for
              homeowners, landlords, and busy families who want dependable work,
              clear communication, and professional results.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Offer"
            title="Built for homeowners, property managers, and busy families"
            description="Whether you need a repair, a refresh, or recurring help around the home, EconoPro Services offers dependable solutions with professional care."
            centered
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-brand-cream p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-brand-navy">
              Why customers choose EconoPro
            </h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                We focus on the things that matter most: showing up, communicating
                clearly, respecting your property, and delivering work you can
                feel good about.
              </p>
              <p>
                Our goal is simple: deliver clean, professional results with clear
                communication and no surprises. We treat every home like it’s our
                own and take pride in getting the job done right the first time.
                That's why both homeowners and home flippers alike work with us.
              </p>
              <p>
                Flexible payment options are also available, including convenient
                monthly plans for qualifying projects.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-brand-navy p-8 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Ready to get started?
            </p>
            <h2 className="mt-4 text-3xl font-bold">
              Tell us what you need and request your estimate online
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Need flooring, drywall, painting, maintenance, or cleaning? Submit
              your request and we’ll follow up to confirm the details.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/bookings"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5"
              >
                Book Now
                <ChevronRight size={18} className="ml-2" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
