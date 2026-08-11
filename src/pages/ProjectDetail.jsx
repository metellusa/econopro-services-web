import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import CtaStrip from "../components/ui/CtaStrip";
import RequestEstimateButton from "../components/RequestEstimateButton";
import { getProjectBySlug, getProjectPath, PROJECTS } from "../data/projects";
import { getServicePath } from "../data/services";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const images = project?.gallery || [];

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null ? null : prev === 0 ? images.length - 1 : prev - 1
        );
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : prev === images.length - 1 ? 0 : prev + 1
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, images.length]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const relatedProjects = PROJECTS.filter(
    (item) => item.slug !== project.slug && item.category === project.category
  ).slice(0, 2);

  const lightboxImage =
    lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <img
            src={project.heroImage}
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/55" />
        </div>

        <Container className="relative grid items-end gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <SectionEyebrow tone="white">{project.category}</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-white text-balance">
              {project.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {project.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RequestEstimateButton variant="primary" size="lg" source="project-detail">
                Request an Estimate
              </RequestEstimateButton>
              {project.relatedServiceSlug ? (
                <Button
                  to={getServicePath(project.relatedServiceSlug)}
                  variant="outline-light"
                  size="lg"
                >
                  View {project.relatedServiceLabel}
                </Button>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="overflow-hidden rounded-section border border-white/10 text-left shadow-soft"
            aria-label={`Enlarge ${project.title} image`}
          >
            <img
              src={project.heroImage}
              alt={project.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </button>
        </Container>
      </section>

      {project.progression?.length ? (
        <Section tone="cream">
          <Container>
            <SectionEyebrow>Project Progression</SectionEyebrow>
            <h2 className="mt-3 font-display text-display-md text-brand-navy">
              Before, during, and after
            </h2>

            <div className="mt-10 flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {project.progression.map((step, index) => (
                <article
                  key={`${step.label}-${index}`}
                  className="min-w-[240px] max-w-[240px] flex-shrink-0 snap-start overflow-hidden rounded-card border border-brand-border bg-white shadow-card sm:min-w-[260px] sm:max-w-[260px]"
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() =>
                      setLightboxIndex(
                        Math.max(0, images.indexOf(step.image))
                      )
                    }
                    aria-label={`Enlarge ${step.label} photo`}
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-brand-cream-dark">
                      <img
                        src={step.image}
                        alt={step.caption || step.label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </button>
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                      {step.label}
                    </p>
                    {step.caption ? (
                      <p className="mt-2 text-sm leading-6 text-brand-muted">
                        {step.caption}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="white">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionEyebrow>Scope</SectionEyebrow>
            <h2 className="mt-3 font-display text-display-md text-brand-navy">
              What this project included
            </h2>
            <ul className="mt-6 space-y-3">
              {project.scope.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-brand-border bg-brand-cream px-4 py-3 text-sm text-brand-navy"
                >
                  {item}
                </li>
              ))}
            </ul>

            {project.relatedServiceSlug ? (
              <div className="mt-8">
                <Link
                  to={getServicePath(project.relatedServiceSlug)}
                  className="text-sm font-semibold text-brand-navy hover:text-brand-gold"
                >
                  Learn more about {project.relatedServiceLabel}
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>
            ) : null}
          </div>

          <div>
            <SectionEyebrow>Gallery</SectionEyebrow>
            <h2 className="mt-3 font-display text-display-md text-brand-navy">
              Project photos
            </h2>
            <div
              className={[
                "mt-6 grid gap-4",
                images.length === 1 ? "max-w-xl" : "sm:grid-cols-2",
              ].join(" ")}
            >
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="overflow-hidden rounded-card border border-brand-border bg-brand-cream text-left shadow-card"
                  aria-label={`Enlarge project photo ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${project.title} photo ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {relatedProjects.length ? (
        <Section tone="cream">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <div>
                <SectionEyebrow>More Projects</SectionEyebrow>
                <h2 className="mt-3 font-display text-display-md text-brand-navy">
                  Related work
                </h2>
              </div>
              <Link
                to="/projects"
                className="text-sm font-semibold text-brand-navy hover:text-brand-gold"
              >
                All Projects →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {relatedProjects.map((item) => (
                <Link
                  key={item.slug}
                  to={getProjectPath(item.slug)}
                  className="overflow-hidden rounded-card border border-brand-border bg-white shadow-card transition hover:-translate-y-0.5"
                >
                  <img
                    src={item.heroImage}
                    alt={item.title}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                      {item.category}
                    </p>
                    <p className="mt-2 font-semibold text-brand-navy">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaStrip
        eyebrow="Have a similar project?"
        title="Request an estimate for your home"
        description="Tell us what you need and we’ll follow up to confirm the details."
        secondaryLabel="View Services"
        secondaryTo="/services"
      />

      {lightboxImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} gallery`}
        >
          <div
            className="relative flex max-h-[95vh] w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md hover:bg-white"
              aria-label="Close gallery"
            >
              <X size={22} aria-hidden="true" />
            </button>

            {images.length > 1 ? (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>
            ) : null}

            <img
              src={lightboxImage}
              alt={`${project.title} enlarged`}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {images.length > 1 ? (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 z-20 rounded-full bg-white/90 p-2 text-brand-navy shadow-md hover:bg-white sm:right-16"
                aria-label="Next image"
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
