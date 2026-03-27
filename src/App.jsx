import {
  BadgeDollarSign,
  Brush,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HandHelping,
  Home,
  Mail,
  MapPin,
  Menu,
  PaintBucket,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import SectionHeading from './components/SectionHeading'
import ServiceCard from './components/ServiceCard'

const services = [
  {
    icon: Home,
    title: 'Flooring Installation & Repair',
    description:
      'Beautiful, durable flooring solutions for living spaces, rentals, and investment properties.',
    bullets: ['Luxury vinyl plank', 'Repairs and replacements', 'Clean, professional finishes'],
  },
  {
    icon: Brush,
    title: 'Drywall Services',
    description:
      'From patchwork to full drywall updates, we help restore walls and ceilings with a polished look.',
    bullets: ['Drywall repair', 'Texture matching', 'Prep for painting'],
  },
  {
    icon: PaintBucket,
    title: 'Interior & Exterior Painting',
    description:
      'Freshen up your property with careful prep, crisp lines, and high-quality workmanship.',
    bullets: ['Interior painting', 'Exterior painting', 'Touch-ups and repainting'],
  },
  {
    icon: Sparkles,
    title: 'Cleaning Services',
    description:
      'Reliable residential cleaning options that keep your home looking refreshed and guest-ready.',
    bullets: ['Standard cleaning', 'Deep cleaning', 'Move-out cleaning'],
  },
  {
    icon: HandHelping,
    title: 'General Property Maintenance',
    description:
      'Practical handyman help for property owners who want dependable service without surprises.',
    bullets: ['Minor repairs', 'Punch-list items', 'Ongoing upkeep support'],
  },
  {
    icon: BadgeDollarSign,
    title: 'Flexible Payment Options',
    description:
      'Convenient monthly payment plans are available to make larger projects more manageable.',
    bullets: ['Budget-friendly options', 'Clear communication', 'Project-friendly flexibility'],
  },
]

const cleaningOptions = ['Standard Cleaning', 'Deep Cleaning', 'Move-Out Cleaning']

const testimonials = [
  {
    quote:
      'Professional, responsive, and easy to work with. The communication was clear from start to finish.',
    name: 'Local Homeowner',
  },
  {
    quote:
      'They showed up ready to work, kept the space clean, and made the whole project feel stress-free.',
    name: 'Property Client',
  },
  {
    quote:
      'A great choice when you want quality work without the runaround.',
    name: 'Residential Customer',
  },
]

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Booking', href: '#booking' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

function Input({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-brand-navy">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function baseFieldClass() {
  return 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10'
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-brand-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="EconoPro Services logo" className="h-12 w-12 rounded-2xl object-cover shadow-md" />
            <div>
              <p className="text-lg font-bold text-brand-navy">EconoPro Services</p>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-gold">Affordable Quality, Dependable Service</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-slate-700 transition hover:text-brand-navy">
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
            >
              Book Now
            </a>
          </nav>

          <button
            type="button"
            className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-brand-navy lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-brand-cream"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#booking"
                className="mt-2 rounded-xl bg-brand-navy px-4 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-hero-glow">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/20 bg-white/70 px-4 py-2 text-sm font-medium text-brand-navy shadow-sm">
                <ShieldCheck size={16} className="text-brand-gold" />
                Serving Orlando and Tampa, Florida
              </div>
              <h1 className="mt-8 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
                Home improvement and cleaning services you can actually count on.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                EconoPro Services is your trusted partner for high-quality handyman and home improvement services in the
                Orlando and Tampa, FL areas. We specialize in flooring installation and repair, drywall services,
                interior and exterior painting, house cleaning, and general property maintenance.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Our goal is simple: deliver clean, professional results with clear communication and no surprises. We
                treat every home like it’s our own and take pride in getting the job done right the first time.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  Request Onsite Estimate
                  <ChevronRight size={18} className="ml-2" />
                </a>
                <a
                  href="#cleaning-form"
                  className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-white px-6 py-4 text-sm font-semibold text-brand-navy transition hover:border-brand-navy/40"
                >
                  Schedule Cleaning
                </a>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {[
                  ['Mon - Fri', '8:00 AM - 8:00 PM'],
                  ['Payment Options', 'Monthly plans available'],
                  ['Estimate Requests', 'Fast onsite booking form'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-brand-gold">{label}</p>
                    <p className="mt-2 text-base font-medium text-brand-navy">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-soft">
                <div className="overflow-hidden rounded-[1.6rem] bg-brand-navy p-8 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-brand-gold">Why homeowners choose us</p>
                      <h2 className="mt-4 text-3xl font-semibold">Affordable quality. Dependable service.</h2>
                    </div>
                    <img src="/logo.jpg" alt="EconoPro logo" className="h-20 w-20 rounded-3xl bg-white object-cover p-2" />
                  </div>
                  <div className="mt-8 space-y-4">
                    {[
                      'Straightforward communication and clear next steps',
                      'Professional workmanship with respect for your space',
                      'Flexible payment options for qualifying projects',
                      'Simple online booking for estimates and cleaning services',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-4">
                        <CheckCircle2 className="mt-0.5 text-brand-gold" size={20} />
                        <p className="text-sm leading-6 text-slate-100">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Our Services"
            title="Built for homeowners, property managers, and busy families"
            description="Whether you need a repair, a refresh, or recurring help around the home, EconoPro Services offers dependable solutions with professional care."
            centered
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section id="booking" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Online Booking"
              title="Request an onsite estimate or schedule a cleaning service"
              description="These forms are set up for Netlify Forms, so you can receive submissions directly after deployment."
              centered
            />

            <div className="mt-14 grid gap-8 xl:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-brand-cream p-8 shadow-soft" id="estimate-form">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 text-brand-navy shadow-sm">
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-brand-navy">Book an Onsite Estimate</h3>
                    <p className="text-sm text-slate-600">Ideal for flooring, drywall, painting, and general project estimates.</p>
                  </div>
                </div>

                <form
                  name="onsite-estimate"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  className="mt-8 space-y-5"
                >
                  <input type="hidden" name="form-name" value="onsite-estimate" />
                  <input type="hidden" name="serviceType" value="Onsite Estimate" />
                  <p className="hidden">
                    <label>
                      Don’t fill this out if you’re human: <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Full Name">
                      <input required name="fullName" className={baseFieldClass()} placeholder="Your full name" />
                    </Input>
                    <Input label="Phone Number">
                      <input required name="phone" type="tel" className={baseFieldClass()} placeholder="(555) 555-5555" />
                    </Input>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Email Address">
                      <input required name="email" type="email" className={baseFieldClass()} placeholder="you@example.com" />
                    </Input>
                    <Input label="City / Area">
                      <input required name="city" className={baseFieldClass()} placeholder="Orlando, Tampa, etc." />
                    </Input>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Preferred Date">
                      <input required name="preferredDate" type="date" className={baseFieldClass()} />
                    </Input>
                    <Input label="Preferred Time Window" hint="Business hours: Monday to Friday, 8am to 8pm">
                      <select required name="preferredTime" className={baseFieldClass()} defaultValue="">
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
                    <select required name="projectType" className={baseFieldClass()} defaultValue="">
                      <option value="" disabled>
                        Select a project type
                      </option>
                      <option>Flooring Installation / Repair</option>
                      <option>Drywall Services</option>
                      <option>Interior Painting</option>
                      <option>Exterior Painting</option>
                      <option>Property Maintenance</option>
                      <option>Other</option>
                    </select>
                  </Input>

                  <Input label="Project Address">
                    <input required name="address" className={baseFieldClass()} placeholder="Street address" />
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

              <div className="rounded-[2rem] border border-slate-200 bg-brand-navy p-8 text-white shadow-soft" id="cleaning-form">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3 text-brand-gold">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">Schedule a Cleaning Service</h3>
                    <p className="text-sm text-slate-300">Choose the service type and request your preferred day and time.</p>
                  </div>
                </div>

                <form
                  name="cleaning-service"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  className="mt-8 space-y-5"
                >
                  <input type="hidden" name="form-name" value="cleaning-service" />
                  <input type="hidden" name="serviceType" value="Cleaning Service" />
                  <p className="hidden">
                    <label>
                      Don’t fill this out if you’re human: <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Full Name">
                      <input required name="fullName" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} placeholder="Your full name" />
                    </Input>
                    <Input label="Phone Number">
                      <input required name="phone" type="tel" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} placeholder="(555) 555-5555" />
                    </Input>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Email Address">
                      <input required name="email" type="email" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} placeholder="you@example.com" />
                    </Input>
                    <Input label="Cleaning Type">
                      <select required name="cleaningType" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} defaultValue="">
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
                      <input required name="preferredDate" type="date" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} />
                    </Input>
                    <Input label="Preferred Time Window">
                      <select required name="preferredTime" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} defaultValue="">
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
                      <input name="propertySize" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} placeholder="Example: 3 bed / 2 bath" />
                    </Input>
                    <Input label="Address">
                      <input required name="address" className={`${baseFieldClass()} border-white/10 bg-white text-slate-800`} placeholder="Service address" />
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

        <section id="why-us" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Why EconoPro"
                title="A practical, polished experience from first contact to final walkthrough"
                description="We focus on the things customers care about most: dependable work, clear communication, respectful service, and affordable options."
              />
              <div className="mt-8 space-y-4">
                {[
                  {
                    title: 'Clear communication',
                    body: 'Straightforward updates, honest expectations, and no confusing runaround.',
                  },
                  {
                    title: 'Clean professional results',
                    body: 'We take pride in doing the job right and treating your home with respect.',
                  },
                  {
                    title: 'Convenient planning',
                    body: 'Book estimate requests and cleaning appointments online in just a few minutes.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-brand-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((item) => (
                <div key={item.name + item.quote} className="rounded-[2rem] bg-white p-7 shadow-soft">
                  <div className="flex gap-1 text-brand-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 text-base leading-8 text-slate-700">“{item.quote}”</p>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-brand-navy">{item.name}</p>
                </div>
              ))}
              <div className="rounded-[2rem] border border-brand-gold/20 bg-brand-cream p-7 shadow-sm">
                <Clock3 className="text-brand-gold" size={28} />
                <h3 className="mt-4 text-xl font-semibold text-brand-navy">Business Hours</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">Monday through Friday</p>
                <p className="text-lg font-semibold text-brand-navy">8:00 AM to 8:00 PM</p>
                <p className="mt-6 text-sm leading-7 text-slate-600">
                  Online requests can be submitted anytime. We will follow up to confirm the appointment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="FAQ"
              title="Common questions"
              description="A simple starting point for customers who want to know what to expect."
              centered
            />
            <div className="mt-12 space-y-4">
              {[
                {
                  q: 'How does booking work?',
                  a: 'Customers can submit either the onsite estimate form or the cleaning service form. After submission, EconoPro Services can review the request and confirm the final appointment details.',
                },
                {
                  q: 'Do you offer payment flexibility?',
                  a: 'Yes. Flexible payment options are available, including monthly plans that can help make larger projects more manageable.',
                },
                {
                  q: 'What areas do you serve?',
                  a: 'This site is set up for customers in the Orlando and Tampa, Florida areas.',
                },
                {
                  q: 'What cleaning services can be scheduled online?',
                  a: 'Standard cleaning, deep cleaning, and move-out cleaning are included in the scheduling form.',
                },
              ].map((item) => (
                <details key={item.q} className="group rounded-3xl border border-slate-200 bg-brand-cream p-6 open:bg-white open:shadow-sm">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-brand-navy marker:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-[2.2rem] bg-brand-navy px-8 py-12 text-white shadow-soft lg:px-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Ready to get started?</p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Tell us about your project or reserve your cleaning appointment today.</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                  Use the booking section above to send your request through Netlify Forms, then follow up by phone or email if needed.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <a href="#estimate-form" className="rounded-full bg-white px-6 py-4 text-center text-sm font-semibold text-brand-navy">
                  Request Estimate
                </a>
                <a href="#cleaning-form" className="rounded-full border border-white/15 px-6 py-4 text-center text-sm font-semibold text-white">
                  Schedule Cleaning
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="EconoPro Services logo" className="h-14 w-14 rounded-2xl object-cover shadow-md" />
              <div>
                <p className="text-xl font-bold text-brand-navy">EconoPro Services</p>
                <p className="text-sm text-slate-600">Affordable Quality, Dependable Service</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              Trusted handyman, home improvement, and cleaning solutions for customers in the Orlando and Tampa, FL areas.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Contact</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p className="flex items-start gap-3"><Phone size={18} className="mt-0.5 text-brand-navy" /> (813) 362-9287</p>
              <p className="flex items-start gap-3"><Mail size={18} className="mt-0.5 text-brand-navy" /> admin@econoproservices.com</p>
              <p className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 text-brand-navy" /> Orlando & Tampa, Florida</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">Quick Links</h3>
            <div className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="block text-slate-600 transition hover:text-brand-navy">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 px-6 py-5 text-center text-sm text-slate-500 lg:px-8">
          © {year} EconoPro Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
