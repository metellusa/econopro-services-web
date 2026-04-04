import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  {
    image: "/deep-cleaning.jpeg",
    title: "Move-Out Deep Cleaning",
    category: "Cleaning",
    description:
      "Detail-oriented deep cleaning that leaves your home truly spotless.",
  },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const showPrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setSelectedIndex((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <main>
      {/* HERO */}
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
              takes pride in delivering clean, professional results.
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item, index) => (
              <article
                key={item.title}
                onClick={() => openModal(index)}
                className="group cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/25">
                    <span className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy transition">
                      View Image
                    </span>
                  </div>
                </div>

                {/* ✅ KEEP captions here */}
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
                    {item.category}
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-brand-navy">
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

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-[2.2rem] bg-brand-navy px-8 py-12 text-white shadow-soft lg:px-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
                  Ready to start your own project?
                </p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Let’s bring your vision to life
                </h2>
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

      {/* MODAL (NO CAPTION) */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative flex max-h-[95vh] w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-20 rounded-full bg-white/90 p-2"
            >
              <X size={22} />
            </button>

            <button
              onClick={showPrev}
              className="absolute left-2 z-20 rounded-full bg-white/90 p-2"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={galleryItems[selectedIndex].image}
              alt=""
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              onClick={showNext}
              className="absolute right-2 z-20 rounded-full bg-white/90 p-2 sm:right-16"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
