import { useEffect, useState } from "react";
import {
  ArrowRight,
  Hammer,
  Wrench,
  Home,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const projectSteps = [
  {
    image: "/original-kitchen.jpeg",
    title: "Original Kitchen",
    phase: "Original",
    icon: Hammer,
    description:
      "The client envisioned an open-concept layout with a fully renovated kitchen centered around a custom island.",
  },
  {
    image: "/kitchen-demo-1.jpeg",
    title: "Demolition Phase",
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
    image: "/kitchen-finished-1.jpeg",
    title: "New Layout Takes Shape",
    phase: "Step 3",
    icon: Home,
    description:
      "Cabinetry, island installation, backsplash work, and new finishes started bringing the space to life.",
  },
  {
    image: "/kitchen-progress-2.jpeg",
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
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const showPrev = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === 0 ? projectSteps.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === projectSteps.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  const selectedStep =
    selectedIndex !== null ? projectSteps[selectedIndex] : null;

  return (
    <section className="bg-white py-20">
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

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projectSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={`${step.title}-${index}`}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-brand-cream shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => openModal(index)}
                  className="block w-full text-left"
                  aria-label={`View full image for ${step.title}`}
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

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/25">
                      <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                </button>

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

      {selectedStep ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={selectedStep.title}
        >
          <div
            className="relative flex max-h-[95vh] w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md transition hover:bg-white"
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              onClick={showPrev}
              className="absolute left-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={selectedStep.image}
              alt={selectedStep.title}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={showNext}
              className="absolute right-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md transition hover:bg-white sm:right-16"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 rounded-2xl bg-black/65 px-5 py-4 text-white shadow-lg sm:w-auto sm:max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                {selectedStep.phase}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{selectedStep.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {selectedStep.description}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
