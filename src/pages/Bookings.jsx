import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import { FormField, fieldClassName } from "../components/ui/FormControls";
import { COMPANY } from "../data/site";

const cleaningOptions = [
  "Standard Cleaning",
  "Deep Cleaning",
  "Move-Out Cleaning",
];

const projectTypes = [
  "Flooring Installation",
  "Flooring Repair",
  "Drywall Installation",
  "Drywall Repair",
  "Interior Painting",
  "Exterior Painting",
  "Interior Design",
  "Property Maintenance",
  "Other",
];

const timeWindows = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

// TODO: Optional project photo upload skipped for now.
// Netlify Forms file uploads need multipart handling and careful production testing.
// Revisit once a reliable upload path is confirmed.

export default function Bookings() {
  const navigate = useNavigate();
  const [flow, setFlow] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      navigate("/thank-you");
    } catch {
      setError(
        "Something went wrong submitting your request. Please try again or call us."
      );
      setSubmitting(false);
    }
  }

  return (
    <main>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>Request Service</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              How can we help you today?
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              Submit a request online and we’ll follow up to confirm the details.
              This is a request — not an instant confirmed booking.
            </p>
            <p className="mt-4 text-sm text-brand-muted">
              Hours: {COMPANY.hours.weekdays}. {COMPANY.hours.saturday}.
            </p>
            <a
              href={`tel:${COMPANY.phoneTel}`}
              className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:text-brand-gold"
            >
              Prefer to talk? Call {COMPANY.phoneDisplay}
            </a>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-4xl">
          {!flow ? (
            <div className="grid gap-6 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setFlow("estimate");
                  setError("");
                }}
                className="rounded-section border border-brand-border bg-brand-cream p-8 text-left shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="inline-flex rounded-2xl bg-white p-3 text-brand-navy shadow-sm">
                  <CalendarDays size={24} aria-hidden="true" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold text-brand-navy">
                  Home Improvement & Repairs
                </h2>
                <p className="mt-3 text-sm leading-7 text-brand-muted">
                  Flooring, drywall, painting, maintenance, and related projects.
                </p>
                <p className="mt-5 text-sm font-semibold text-brand-navy">
                  Request an Estimate →
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFlow("cleaning");
                  setError("");
                }}
                className="rounded-section border border-brand-border bg-brand-navy p-8 text-left text-white shadow-soft transition hover:-translate-y-1"
              >
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-brand-gold">
                  <Sparkles size={24} aria-hidden="true" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold">
                  Cleaning Services
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Standard, deep, and move-out cleaning.
                </p>
                <p className="mt-5 text-sm font-semibold text-brand-gold">
                  Request Cleaning →
                </p>
              </button>
            </div>
          ) : null}

          {flow === "estimate" ? (
            <div className="rounded-section border border-brand-border bg-brand-cream p-6 shadow-card sm:p-8">
              <button
                type="button"
                onClick={() => setFlow(null)}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-gold"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to options
              </button>

              <h2 className="font-display text-display-md text-brand-navy">
                Request an Estimate
              </h2>
              <p className="mt-3 text-sm leading-7 text-brand-muted">
                For flooring, drywall, painting, maintenance, and related projects.
              </p>

              <form
                name="onsite-estimate"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <input type="hidden" name="form-name" value="onsite-estimate" />
                <input type="hidden" name="serviceType" value="Onsite Estimate" />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you’re human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Full Name" name="fullName" required placeholder="Your full name" />
                  <FormField label="Phone Number" name="phone" type="tel" required placeholder="(555) 555-5555" />
                </div>

                <FormField label="Email Address" name="email" type="email" required placeholder="you@example.com" />

                <FormField label="Project Type" name="projectType" as="select" required defaultValue="">
                  <option value="" disabled>
                    Select a project type
                  </option>
                  {projectTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </FormField>

                <FormField label="Project Address" name="address" required placeholder="Street address" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Preferred Date" name="preferredDate" type="date" required />
                  <FormField
                    label="Preferred Time Window"
                    name="preferredTime"
                    as="select"
                    required
                    defaultValue=""
                    hint="Business hours: Mon–Fri 8am–8pm, Sat 8am–5pm"
                  >
                    <option value="" disabled>
                      Select a time window
                    </option>
                    {timeWindows.map((window) => (
                      <option key={window}>{window}</option>
                    ))}
                  </FormField>
                </div>

                <FormField
                  label="Project Details"
                  name="projectDetails"
                  as="textarea"
                  required
                  rows="5"
                  placeholder="Tell us about the scope, rooms, timeline, or anything else we should know."
                />

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {error}{" "}
                    <a href={`tel:${COMPANY.phoneTel}`} className="font-semibold underline">
                      {COMPANY.phoneDisplay}
                    </a>
                  </div>
                ) : null}

                <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Estimate Request"}
                </Button>
              </form>
            </div>
          ) : null}

          {flow === "cleaning" ? (
            <div className="rounded-section bg-brand-navy p-6 text-white shadow-soft sm:p-8">
              <button
                type="button"
                onClick={() => setFlow(null)}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-brand-gold"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to options
              </button>

              <h2 className="font-display text-display-md text-white">
                Request Cleaning
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Choose the service type and preferred day. We’ll follow up to confirm.
              </p>

              <form
                name="cleaning-service"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <input type="hidden" name="form-name" value="cleaning-service" />
                <input type="hidden" name="serviceType" value="Cleaning Service" />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you’re human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cleaning-fullName" className="mb-2 block text-sm font-semibold text-white">
                      Full Name
                    </label>
                    <input
                      id="cleaning-fullName"
                      name="fullName"
                      required
                      placeholder="Your full name"
                      className={fieldClassName("border-white/10")}
                    />
                  </div>
                  <div>
                    <label htmlFor="cleaning-phone" className="mb-2 block text-sm font-semibold text-white">
                      Phone Number
                    </label>
                    <input
                      id="cleaning-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="(555) 555-5555"
                      className={fieldClassName("border-white/10")}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cleaning-email" className="mb-2 block text-sm font-semibold text-white">
                      Email Address
                    </label>
                    <input
                      id="cleaning-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={fieldClassName("border-white/10")}
                    />
                  </div>
                  <div>
                    <label htmlFor="cleaningType" className="mb-2 block text-sm font-semibold text-white">
                      Cleaning Type
                    </label>
                    <select
                      id="cleaningType"
                      name="cleaningType"
                      required
                      defaultValue=""
                      className={fieldClassName("border-white/10")}
                    >
                      <option value="" disabled>
                        Select cleaning type
                      </option>
                      {cleaningOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="cleaning-address" className="mb-2 block text-sm font-semibold text-white">
                    Service Address
                  </label>
                  <input
                    id="cleaning-address"
                    name="address"
                    required
                    placeholder="Service address"
                    className={fieldClassName("border-white/10")}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cleaning-preferredDate" className="mb-2 block text-sm font-semibold text-white">
                      Preferred Date
                    </label>
                    <input
                      id="cleaning-preferredDate"
                      name="preferredDate"
                      type="date"
                      required
                      className={fieldClassName("border-white/10")}
                    />
                  </div>
                  <div>
                    <label htmlFor="cleaning-preferredTime" className="mb-2 block text-sm font-semibold text-white">
                      Preferred Time Window
                    </label>
                    <select
                      id="cleaning-preferredTime"
                      name="preferredTime"
                      required
                      defaultValue=""
                      className={fieldClassName("border-white/10")}
                    >
                      <option value="" disabled>
                        Select a time window
                      </option>
                      {timeWindows.map((window) => (
                        <option key={window}>{window}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="propertySize" className="mb-2 block text-sm font-semibold text-white">
                    Home / Property Details
                  </label>
                  <input
                    id="propertySize"
                    name="propertySize"
                    placeholder="Example: 3 bed / 2 bath"
                    className={fieldClassName("border-white/10")}
                  />
                </div>

                <div>
                  <label htmlFor="cleaning-details" className="mb-2 block text-sm font-semibold text-white">
                    Notes
                  </label>
                  <textarea
                    id="cleaning-details"
                    name="details"
                    rows="5"
                    placeholder="Pets, gate code, priority areas, or anything else we should know."
                    className={fieldClassName("border-white/10")}
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {error}{" "}
                    <a href={`tel:${COMPANY.phoneTel}`} className="font-semibold underline">
                      {COMPANY.phoneDisplay}
                    </a>
                  </div>
                ) : null}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Cleaning Request"}
                </Button>
              </form>
            </div>
          ) : null}
        </Container>
      </Section>
    </main>
  );
}
