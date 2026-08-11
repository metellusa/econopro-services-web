import Container from "./Container";
import Button from "./Button";
import SectionEyebrow from "./SectionEyebrow";

export default function CtaStrip({
  eyebrow = "Ready to get started?",
  title,
  description,
  primaryLabel = "Request an Estimate",
  primaryTo = "/bookings",
  secondaryLabel,
  secondaryTo,
  secondaryHref,
  tone = "navy",
}) {
  const isNavy = tone === "navy";

  return (
    <section className={isNavy ? "bg-brand-navy py-16 text-white sm:py-20" : "bg-brand-cream py-16 sm:py-20"}>
      <Container>
        <div
          className={[
            "rounded-section px-8 py-12 text-center sm:px-12",
            isNavy ? "bg-white/5" : "border border-brand-border bg-white shadow-card",
          ].join(" ")}
        >
          {eyebrow ? (
            <SectionEyebrow tone={isNavy ? "white" : "gold"}>{eyebrow}</SectionEyebrow>
          ) : null}
          <h2
            className={[
              "mx-auto mt-4 max-w-3xl font-display text-display-md text-balance",
              isNavy ? "text-white" : "text-brand-navy",
            ].join(" ")}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={[
                "mx-auto mt-4 max-w-2xl text-base leading-7 sm:text-lg",
                isNavy ? "text-slate-300" : "text-brand-muted",
              ].join(" ")}
            >
              {description}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to={primaryTo} variant={isNavy ? "primary" : "secondary"} size="lg">
              {primaryLabel}
            </Button>
            {secondaryLabel && (secondaryTo || secondaryHref) ? (
              <Button
                to={secondaryTo}
                href={secondaryHref}
                variant={isNavy ? "outline-light" : "outline"}
                size="lg"
              >
                {secondaryLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
