import { Mail, MapPin, Phone, Clock3, ChevronRight } from "lucide-react";

export default function Contact() {
  return (
    <main>
      <section className="bg-hero-glow py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Contact
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              Let’s talk about your project
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Whether you need flooring, drywall, painting, cleaning, or general
              property maintenance, EconoPro Services is here to help. Reach out
              directly or submit a booking request online.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-[2rem] bg-brand-navy p-8 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Get in touch
            </p>
            <h2 className="mt-4 text-3xl font-bold">
              We’d be glad to hear from you
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Contact us directly for questions, project discussions, or help
              choosing the right service.
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-1 text-brand-gold" />
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <a
                    href="tel:8133629287"
                    className="text-slate-300 transition hover:text-white"
                  >
                    (813) 362-9287
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-1 text-brand-gold" />
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <a
                    href="mailto:admin@econoproservices.com"
                    className="text-slate-300 transition hover:text-white"
                  >
                    admin@econoproservices.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-brand-gold" />
                <div>
                  <p className="font-semibold text-white">Service Area</p>
                  <p className="text-slate-300">Orlando & Tampa, Florida</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 size={18} className="mt-1 text-brand-gold" />
                <div>
                  <p className="font-semibold text-white">Business Hours</p>
                  <p className="text-slate-300">Monday - Friday</p>
                  <p className="text-slate-300">8:00 AM - 8:00 PM</p>
                  <p className="text-slate-300">Saturday</p>
                  <p className="text-slate-300">8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-brand-navy">
              The fastest way to get started
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              For project estimates and cleaning appointments, the best next step
              is to use our online booking page. That helps us gather the details
              we need and follow up faster.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="/bookings"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-brand-cream px-5 py-5 transition hover:border-brand-gold/40 hover:bg-brand-cream/70"
              >
                <div>
                  <p className="text-lg font-semibold text-brand-navy">
                    Request an Onsite Estimate
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    For flooring, drywall, painting, and other project work
                  </p>
                </div>
                <ChevronRight size={20} className="text-brand-navy" />
              </a>

              <a
                href="/bookings"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-brand-cream px-5 py-5 transition hover:border-brand-gold/40 hover:bg-brand-cream/70"
              >
                <div>
                  <p className="text-lg font-semibold text-brand-navy">
                    Schedule a Cleaning Service
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Standard, deep, and move-out cleaning appointments
                  </p>
                </div>
                <ChevronRight size={20} className="text-brand-navy" />
              </a>

              <a
                href="/financing-options"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-brand-cream px-5 py-5 transition hover:border-brand-gold/40 hover:bg-brand-cream/70"
              >
                <div>
                  <p className="text-lg font-semibold text-brand-navy">
                    Explore Financing Options
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Flexible payment options, including monthly plans
                  </p>
                </div>
                <ChevronRight size={20} className="text-brand-navy" />
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm leading-7 text-slate-600">
                Prefer to reach out directly first? Call or email us and we’ll
                point you in the right direction.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}