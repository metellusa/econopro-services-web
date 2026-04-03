import SectionHeading from "../components/SectionHeading";

const faqs = [
  {
    question: "How does booking work?",
    answer:
      "Customers can submit either the onsite estimate form or the cleaning service form. After submission, EconoPro Services reviews the request and follows up to confirm the final appointment details.",
  },
  {
    question: "Do you offer payment flexibility?",
    answer:
      "Yes. Flexible payment options are available, including monthly plans that can help make larger projects more manageable.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "EconoPro Services provides reliable service throughout Orlando, Tampa, and surrounding areas within a 25–30 mile radius.",
  },
  {
    question: "What cleaning services can be scheduled online?",
    answer:
      "Standard cleaning, deep cleaning, and move-out cleaning can all be requested through the online booking form.",
  },
  {
    question: "When are you open?",
    answer:
      "Our business hours are Monday through Friday, from 8:00 AM to 8:00 PM. Online requests can be submitted anytime.",
  },
  {
    question: "Do you provide onsite estimates?",
    answer:
      "Yes. For flooring, drywall, painting, and other project-based work, you can request an onsite estimate through the bookings page.",
  },
];

export default function Faq() {
  return (
    <main>
      <section className="bg-hero-glow py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              FAQ
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              Common questions
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Here are a few common questions about our services, booking process,
              hours, and payment options.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Helpful Answers"
            title="What customers often ask before getting started"
            description="A simple guide to what you can expect when working with EconoPro Services."
            centered
          />

          <div className="mt-12 space-y-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-slate-200 bg-brand-cream p-6 open:bg-white open:shadow-sm"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-brand-navy marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-[2.2rem] bg-brand-navy px-8 py-12 text-white shadow-soft lg:px-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Still have questions?
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              We’d be happy to help
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Reach out through our contact page or submit a booking request and
              we’ll follow up with you directly.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="rounded-full bg-white px-6 py-4 text-sm font-semibold text-brand-navy"
              >
                Contact Us
              </a>
              <a
                href="/bookings"
                className="rounded-full border border-white/15 px-6 py-4 text-sm font-semibold text-white"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
