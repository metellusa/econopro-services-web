import { ArrowRight, Hammer, Wrench, Home, Sparkles } from "lucide-react";

const projectSteps = [
  {
    image: "/kitchen-demo-1.jpeg",
    title: "Demolition Begins",
    phase: "Step 1",
    icon: Hammer,
    description:
      "The original kitchen and surrounding space were opened up and prepared for a full transformation.",
  },
  {
    image: "/kitchen-demo-2.jpeg",
    title: "Structural & Prep Work",
    phase: "Step 2",
    icon: Wrench,
    description:
      "Framing, wall preparation, lighting updates, and flooring progress moved the project into build-out mode.",
  },
  {
    image: "/kitchen-progress-1.jpeg",
    title: "New Layout Takes Shape",
    phase: "Step 3",
    icon: Home,
    description:
      "Cabinetry, island installation, backsplash work, and new finishes started bringing the space to life.",
  },
  {
    image: "/kitchen-finished-1.jpeg",
    title: "Finished Main View",
    phase: "Step 4",
    icon: Sparkles,
    description:
      "The completed kitchen features a bright modern layout, a large island, upgraded cabinetry, and elegant finishes.",
  },
  {
    image: "/kitchen-finished-2.jpeg",
    title: "Finished Living View",
    phase: "Final Result",
    icon: Sparkles,
    description:
      "From the opposite angle, the completed space feels open, polished, functional, and fully transformed.",
  },
];

export default function ProjectProgressShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Real Project Transformation
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
            From demolition to a finished dream kitchen
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We don’t just talk about quality work — we show it. Here’s a real
            project progression from demolition and prep to a clean, polished
            final result.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {projectSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-brand-cream shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy shadow-sm">
                    <Icon size={14} className="text-brand-gold" />
                    {step.phase}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-brand-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            View More Projects
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
