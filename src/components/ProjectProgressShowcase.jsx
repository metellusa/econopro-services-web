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
import Button from "./ui/Button";
import Container from "./ui/Container";
import SectionEyebrow from "./ui/SectionEyebrow";

const projectSteps = [
  {
    image: "/original-kitchen.jpeg",
    title: "Original Kitchen",
    phase: "Original",
    icon: Hammer,
    description:
      "The starting point before demolition and the full kitchen renovation.",
  },
  {
    image: "/kitchen-demo-1.jpeg",
    title: "Demolition",
    phase: "Demolition",
    icon: Hammer,
    description:
      "The original kitchen and surrounding space were opened up for transformation.",
  },
  {
    image: "/kitchen-demo-2.jpeg",
    title: "Prep Work",
    phase: "Prep",
    icon: Wrench,
    description:
      "Framing, wall preparation, and build-out prep moved the project forward.",
  },
  {
    image: "/kitchen-finished-1.jpeg",
    title: "New Layout",
    phase: "Installation",
    icon: Home,
    description:
      "Cabinetry, island installation, and new finishes started taking shape.",
  },
  {
    image: "/kitchen-progress-2.jpeg",
    title: "Finishing",
    phase: "Finishing",
    icon: Sparkles,
    description:
      "Final details brought the space to a bright, polished finish.",
  },
  {
    image: "/kitchen-finished-2.jpeg",
    title: "Completed",
    phase: "Completed",
    icon: Sparkles,
    description:
      "The finished kitchen feels open, functional, and fully transformed.",
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
    if (selectedIndex === null) return undefined;

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
    <section className="bg-brand-navy py-16 text-white sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <SectionEyebrow tone="white">Recent Project Transformation</SectionEyebrow>
          <h2 className="mt-4 font-display text-display-lg text-white text-balance">
            From demolition to a finished kitchen
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            A real project progression from the original space through demolition,
            prep, installation, and the completed result.
          </p>
        </div>

        <div className="mt-12 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projectSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={`${step.title}-${index}`}
                className="group relative min-w-[260px] max-w-[260px] flex-shrink-0 snap-start overflow-hidden rounded-card border border-white/10 bg-white/5 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 sm:min-w-[280px] sm:max-w-[280px]"
              >
                <button
                  type="button"
                  onClick={() => openModal(index)}
                  className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                  aria-label={`View full image for ${step.title}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-brand-navy-deep">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy shadow-sm">
                      <Icon size={14} className="text-brand-gold" aria-hidden="true" />
                      {step.phase}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/25">
                      <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                </button>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button to="/projects" variant="primary" size="lg">
            View More Projects
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </Container>

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
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md hover:bg-white"
              aria-label="Close image"
            >
              <X size={22} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={showPrev}
              className="absolute left-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>

            <img
              src={selectedStep.image}
              alt={selectedStep.title}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={showNext}
              className="absolute right-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md hover:bg-white sm:right-16"
              aria-label="Next image"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
              {selectedStep.title}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
