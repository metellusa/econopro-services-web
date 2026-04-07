import { CalendarDays, Sparkles } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { useNavigate } from "react-router-dom";

const cleaningOptions = [
  "Standard Cleaning",
  "Deep Cleaning",
  "Move-Out Cleaning",
];

function Input({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-brand-navy">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-2 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

function baseFieldClass() {
  return "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10";
}

export default function Bookings() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      navigate("/thank-you");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <main>
      <section className="bg-hero-glow py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Online Booking
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              Request an onsite estimate or schedule a cleaning service
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Use the forms below to send your request online. We’ll review your
              submission and follow up to confirm the appointment details.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Business hours are Monday through Friday, from 8:00 AM to 8:00 PM.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Book Online"
            title="Choose the type of appointment you need"
            centered
          />

          <div className="mt-14 grid gap-8 xl:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-brand-cream p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-brand-navy shadow-sm">
                  <CalendarDays size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-brand-navy">
                    Book an Onsite Estimate
                  </h2>
                  <p className="text-sm text-slate-600">
                    Ideal for flooring, drywall, painting, and general project
                    estimates.
                  </p>
                </div>
              </div>

              <form
                name="onsite-estimate"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <input type="hidden" name="form-name" value="onsite-estimate" />
                <input
                  type="hidden"
                  name="serviceType"
                  value="Onsite Estimate"
                />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you’re human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Full Name">
                    <input
                      required
                      name="fullName"
                      className={baseFieldClass()}
                      placeholder="Your full name"
                    />
                  </Input>
                  <Input label="Phone Number">
                    <input
                      required
                      name="phone"
                      type="tel"
                      className={baseFieldClass()}
                      placeholder="(555) 555-5555"
                    />
                  </Input>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Email Address">
                    <input
                      required
                      name="email"
                      type="email"
                      className={baseFieldClass()}
                      placeholder="you@example.com"
                    />
                  </Input>
                  <Input label="City / Area">
                    <input
                      required
                      name="city"
                      className={baseFieldClass()}
                      placeholder="Orlando, Tampa, etc."
                    />
                  </Input>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Preferred Date">
                    <input
                      required
                      name="preferredDate"
                      type="date"
                      className={baseFieldClass()}
                    />
                  </Input>
                  <Input
                    label="Preferred Time Window"
                    hint="Business hours: Monday to Friday, 8am to 8pm. Saturday, 8am to 5pm"
                  >
                    <select
                      required
                      name="preferredTime"
                      className={baseFieldClass()}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a time window
                      </option>
                      <option>8:00 AM - 10:00 AM</option>
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 2:00 PM</option>
                      <option>2:00 PM - 4:00 PM</option>
                      <option>4:00 PM - 6:00 PM</option>
                      <option>6:00 PM - 8:00 PM</option>
                    </select>
                  </Input>
                </div>

                <Input label="Project Type">
                  <select
                    required
                    name="projectType"
                    className={baseFieldClass()}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a project type
                    </option>
                    <option>Flooring Installation</option>
                    <option>Flooring Repair</option>
                    <option>Drywall Installation</option>
                    <option>Drywall Repair</option>
                    <option>Interior Painting</option>
                    <option>Exterior Painting</option>
                    <option>Property Maintenance</option>
                    <option>Other</option>
                  </select>
                </Input>

                <Input label="Project Address">
                  <input
                    required
                    name="address"
                    className={baseFieldClass()}
                    placeholder="Street address"
                  />
                </Input>

                <Input label="Project Details">
                  <textarea
                    required
                    name="projectDetails"
                    rows="5"
                    className={baseFieldClass()}
                    placeholder="Tell us about the scope, size, timeline, or anything else we should know."
                  />
                </Input>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-navy px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Submit Estimate Request
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-brand-navy p-8 text-white shadow-soft">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-brand-gold">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">
                    Schedule a Cleaning Service
                  </h2>
                  <p className="text-sm text-slate-300">
                    Choose the service type and request your preferred day and
                    time.
                  </p>
                </div>
              </div>

              <form
                name="cleaning-service"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
                netlify-honeypot="bot-field"
                className="mt-8 space-y-5"
              >
                <input
                  type="hidden"
                  name="form-name"
                  value="cleaning-service"
                />
                <input
                  type="hidden"
                  name="serviceType"
                  value="Cleaning Service"
                />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you’re human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Full Name">
                    <input
                      required
                      name="fullName"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                      placeholder="Your full name"
                    />
                  </Input>
                  <Input label="Phone Number">
                    <input
                      required
                      name="phone"
                      type="tel"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                      placeholder="(555) 555-5555"
                    />
                  </Input>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Email Address">
                    <input
                      required
                      name="email"
                      type="email"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                      placeholder="you@example.com"
                    />
                  </Input>
                  <Input label="Cleaning Type">
                    <select
                      required
                      name="cleaningType"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select cleaning type
                      </option>
                      {cleaningOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </Input>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Preferred Date">
                    <input
                      required
                      name="preferredDate"
                      type="date"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                    />
                  </Input>
                  <Input label="Preferred Time Window">
                    <select
                      required
                      name="preferredTime"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a time window
                      </option>
                      <option>8:00 AM - 10:00 AM</option>
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 2:00 PM</option>
                      <option>2:00 PM - 4:00 PM</option>
                      <option>4:00 PM - 6:00 PM</option>
                      <option>6:00 PM - 8:00 PM</option>
                    </select>
                  </Input>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Property Size">
                    <input
                      name="propertySize"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                      placeholder="Example: 3 bed / 2 bath"
                    />
                  </Input>
                  <Input label="Address">
                    <input
                      required
                      name="address"
                      className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                      placeholder="Service address"
                    />
                  </Input>
                </div>

                <Input label="Special Instructions">
                  <textarea
                    name="details"
                    rows="5"
                    className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`}
                    placeholder="Pets, gate code, priority areas, or anything else we should know."
                  />
                </Input>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-gold px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Submit Cleaning Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}