import { useState } from "react";
import { BadgeDollarSign, ChevronRight, ShieldCheck } from "lucide-react";

export default function FinancingOptions() {
  const [loanAmount, setLoanAmount] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const numericAmount = String(loanAmount).replace(/[^\d]/g, "");

    if (!numericAmount) return;

    const acornUrl = `https://www.acornfinance.com/pre-qualify/?d=F3ZCC&utm_medium=web_pre_qual_link&loanAmount=${numericAmount}`;

    window.open(acornUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <section className="bg-hero-glow py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/20 bg-white/70 px-4 py-2 text-sm font-medium text-brand-navy shadow-sm">
              <BadgeDollarSign size={16} className="text-brand-gold" />
              Flexible Payment Options
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-brand-navy sm:text-6xl">
              Financing options to help make your project more manageable
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              EconoPro Services offers flexible payment options, including
              convenient monthly plans through our financing partners, to help
              make your project more manageable.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Whether you’re planning flooring installation, painting, drywall
              work, cleaning, or other property improvements, financing may help
              you move forward without delaying the work you need.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-brand-navy">
              Check available payment options
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Enter your estimated project amount below and continue to our
              financing partner’s pre-qualification page.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-navy">
                  Estimated Project Amount
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Example: 5500"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"
                  required
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-navy px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Continue to Financing Options
                <ChevronRight size={18} className="ml-2" />
              </button>
            </form>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              You’ll be redirected to our financing partner to review available
              options. Pre-qualification and financing decisions are handled by
              the financing provider.
            </p>
          </div>

          <div className="rounded-[2rem] bg-brand-navy p-8 text-white shadow-soft">
            <div className="rounded-2xl bg-white/5 p-5">
              <div className="flex items-center gap-2 text-brand-gold">
                <ShieldCheck size={18} />
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                  Good to know
                </span>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                <p>
                  Flexible monthly plans can be helpful for larger home
                  improvement projects.
                </p>
                <p>
                  Financing may allow you to start your project sooner while
                  spreading payments out over time.
                </p>
                <p>
                  Availability, approval, and final terms are determined by the
                  financing provider.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-white/5 p-5">
              <h3 className="text-xl font-semibold">Popular uses for financing</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                <li>• Flooring installation and upgrades</li>
                <li>• Interior and exterior painting</li>
                <li>• Drywall repairs and improvements</li>
                <li>• Larger handyman or maintenance projects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-[2.2rem] bg-brand-cream px-8 py-12 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-brand-navy">
              Need help estimating your project total first?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Request an onsite estimate and we’ll help you understand your
              project scope and expected cost before you explore financing.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/bookings"
                className="rounded-full bg-brand-navy px-6 py-4 text-sm font-semibold text-white"
              >
                Request Estimate
              </a>
              <a
                href="/contact"
                className="rounded-full border border-brand-navy/15 px-6 py-4 text-sm font-semibold text-brand-navy"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
