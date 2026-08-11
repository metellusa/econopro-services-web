import ReviewCard from "../components/ui/ReviewCard";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import CtaStrip from "../components/ui/CtaStrip";
import Button from "../components/ui/Button";

const reviews = [
  {
    quote:
      "I had my living room and dining room walls painted recently, and I’m so happy with how everything turned out! The team was super professional and showed up right on time.",
    name: "Clement Beauvais",
  },
  {
    quote:
      "Did everything that was asked and did it well. Will be using them on a regular basis. Thanks again for a great job.",
    name: "Douglas Lanier",
  },
  {
    quote: "Excellent service! Very professional, quick and reasonable price.",
    name: "Mary Valero",
  },
];

export default function Reviews() {
  return (
    <>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>Reviews</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              What customers say about EconoPro
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              Real feedback from customers who have worked with EconoPro Services.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
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
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </>
  );
}
