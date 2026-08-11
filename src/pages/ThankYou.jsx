import { CheckCircle2, Phone, Mail } from "lucide-react";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import { COMPANY } from "../data/site";

export default function ThankYou() {
  return (
    <main className="bg-brand-cream py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto inline-flex rounded-full bg-white p-4 shadow-card">
            <CheckCircle2 size={48} className="text-emerald-600" aria-hidden="true" />
          </div>

          <h1 className="mt-6 font-display text-display-lg text-brand-navy">
            Request Received
          </h1>

          <p className="mt-4 text-base leading-7 text-brand-muted sm:text-lg">
            Thanks for reaching out to EconoPro Services. Your request was
            submitted successfully.
          </p>
          <p className="mt-3 text-base leading-7 text-brand-muted sm:text-lg">
            We’ll review your details and follow up to confirm the next steps.
          </p>

          <div className="mt-8 rounded-card border border-brand-border bg-white p-6 text-left shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-gold">
              What happens next?
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              <li>• We review your request</li>
              <li>• We contact you to confirm details</li>
              <li>• We schedule the appointment once confirmed</li>
            </ul>
          </div>

          <div className="mt-8 space-y-3 text-sm text-brand-muted">
            <p>Need to reach us sooner?</p>
            <div className="flex flex-col items-center gap-2">
              <a
                href={`tel:${COMPANY.phoneTel}`}
                className="inline-flex items-center gap-2 font-semibold text-brand-navy hover:text-brand-gold"
              >
                <Phone size={16} aria-hidden="true" />
                {COMPANY.phoneDisplay}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 hover:text-brand-navy"
              >
                <Mail size={16} aria-hidden="true" />
                {COMPANY.email}
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/projects" variant="outline" size="lg">
              View Projects
            </Button>
            <Button to="/services" variant="secondary" size="lg">
              View Services
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
