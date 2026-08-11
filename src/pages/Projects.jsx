import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import CtaStrip from "../components/ui/CtaStrip";
import {
  PROJECTS,
  getProjectCategories,
  getProjectPath,
} from "../data/projects";

export default function Projects() {
  const categories = useMemo(() => ["All", ...getProjectCategories()], []);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return PROJECTS;
    return PROJECTS.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <main>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>Projects</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              See the Work
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              Real completed projects from flooring and painting to exterior
              upgrades, cleaning, and a full kitchen transformation.
            </p>
            <div className="mt-8">
              <Button to="/bookings" variant="primary" size="lg">
                Request an Estimate
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-brand-navy text-white"
                      : "border border-brand-border bg-brand-cream text-brand-navy hover:border-brand-gold/40",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.slug}
                to={getProjectPath(project.slug)}
                className="group overflow-hidden rounded-section border border-brand-border bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream-dark">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                    <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy opacity-0 transition group-hover:opacity-100">
                      View Project
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                    {project.category}
                  </p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-brand-navy">
                    {project.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-brand-muted">
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaStrip
        eyebrow="Ready to start your own project?"
        title="Request an estimate for similar work"
        description="Tell us what you need and we’ll follow up to confirm the details."
        secondaryLabel="View Services"
        secondaryTo="/services"
      />
    </main>
  );
}
