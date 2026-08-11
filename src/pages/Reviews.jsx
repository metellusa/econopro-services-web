import ReviewCard from "../components/ui/ReviewCard";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import CtaStrip from "../components/ui/CtaStrip";
import Button from "../components/ui/Button";
import { BBB, REVIEWS } from "../data/reviews";
import { COMPANY } from "../data/site";

export default function Reviews() {
  return (
    <main>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>Reviews</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              What customers say about EconoPro
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              Real feedback from customers who have worked with EconoPro Services
              in Orlando and Tampa.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </div>

          <div className="mt-12 rounded-section border border-brand-border bg-brand-cream p-8 text-center">
            <SectionEyebrow>Trust</SectionEyebrow>
            <h2 className="mt-3 font-display text-display-md text-brand-navy">
              BBB Accredited Business
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-brand-muted">
              EconoPro Services is a BBB Accredited Business. View our public
              profile for additional company information.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={BBB.profileUrl}
                target="_blank"
                rel="nofollow noreferrer"
                className="inline-flex rounded-2xl bg-white p-3 shadow-card"
              >
                <img
                  src={BBB.sealUrl}
                  alt="BBB Accredited Business"
                  className="h-12 w-auto"
                />
              </a>
              <Button
                href={BBB.profileUrl}
                variant="outline"
                size="lg"
                target="_blank"
                rel="nofollow noreferrer"
              >
                View BBB Profile
              </Button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button to="/bookings" variant="secondary" size="lg">
              Request an Estimate
            </Button>
          </div>
        </Container>
      </Section>

      <CtaStrip
        title="Ready to get started?"
        description="Tell us about your project and we’ll follow up to confirm the details."
        secondaryLabel={`Call ${COMPANY.phoneDisplay}`}
        secondaryHref={`tel:${COMPANY.phoneTel}`}
      />
    </main>
  );
}
