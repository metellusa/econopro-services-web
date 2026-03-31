import { ArrowRight, Sparkles } from "lucide-react";

const galleryItems = [
  {
    image: "/after-foyer-pic.jpg",
    title: "Custom Foyer Flooring Design",
    category: "Flooring",
    description:
      "Decorative tile and wood-look flooring installation with a bold custom pattern.",
  },
  {
    image: "/after-kitchen-tile installation.png",
    title: "Kitchen Tile Flooring Installation",
    category: "Flooring",
    description:
      "Warm wood-look tile flooring installed to give the kitchen a clean, modern finish.",
  },
  {
    image: "/after-room-painted.png",
    title: "Interior Painting Project",
    category: "Painting",
    description:
      "Fresh interior wall painting that brightened the room and refreshed the overall space.",
  },
  {
    image: "/composite-panel-installation-after-1.png",
    title: "Exterior Composite Panel Installation",
    category: "Exterior",
    description:
      "Modern exterior upgrade with composite panel installation for a sleek, durable finish.",
  },
  {
    image: "/composite-panel-installation-after-2.png",
    title: "Composite Panel Detail View",
    category: "Exterior",
    description:
      "Additional view highlighting the clean lines and finished appearance of the exterior panel work.",
  },
];

export default function Gallery() {
  return (
    <main>
      <section className="bg-hero-glow py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/20 bg-white/70 px-4 py-2 text-sm font-medium text-brand-navy shadow-sm">
              <Sparkles size={16} className="text-brand-gold" />
              Recent Work
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              A look at some of our completed projects
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              From flooring and painting to exterior upgrades, EconoPro Services
              takes pride in delivering clean, professional results that elevate
              the look and feel of each property.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
                    {item.category}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-brand-navy">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-[2.2rem] bg-brand-navy px-8 py-12 text-white shadow-soft lg:px-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
                  Ready to start your own project?
                </p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Let’s talk about your flooring, painting, or home improvement needs
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                  Request an onsite estimate or contact us to discuss your
                  project. We’ll help you plan the next step with clear
                  communication and dependable service.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <a
                  href="/bookings"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-brand-navy"
                >
                  Request Estimate
                  <ArrowRight size={16} className="ml-2" />
                </a>
                <a
                  href="/contact"
                  className="rounded-full border border-white/15 px-6 py-4 text-center text-sm font-semibold text-white"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
