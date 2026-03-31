import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Bookings", to: "/bookings" },
  { label: "Financing", to: "/financing-options" },
  { label: "Gallery", to: "/gallery" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

function navLinkClass(isActive) {
  return [
    "text-sm font-medium transition",
    isActive ? "text-brand-navy" : "text-slate-700 hover:text-brand-navy",
  ].join(" ");
}

export default function SiteShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-brand-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/logo.jpg"
              alt="EconoPro Services logo"
              className="h-12 w-12 rounded-2xl object-cover shadow-md"
            />
            <div>
              <p className="text-lg font-bold text-brand-navy">
                EconoPro Services
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-gold">
                Affordable Quality, Dependable Service
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/bookings"
              className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
            >
              Book Now
            </Link>
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
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      "rounded-xl px-3 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-brand-cream text-brand-navy"
                        : "text-slate-700 hover:bg-brand-cream",
                    ].join(" ")
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              <Link
                to="/bookings"
                className="mt-2 rounded-xl bg-brand-navy px-4 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="EconoPro Services logo"
                className="h-14 w-14 rounded-2xl object-cover shadow-md"
              />
              <div>
                <p className="text-xl font-bold text-brand-navy">
                  EconoPro Services
                </p>
                <p className="text-sm text-slate-600">
                  Affordable Quality, Dependable Service
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              Trusted handyman, home improvement, and cleaning solutions for
              customers in the Orlando and Tampa, FL areas.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Contact
            </h3>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-brand-navy" />
                <a href="tel:8133629287" className="hover:text-brand-navy">
                  (813) 362-9287
                </a>
              </p>
              <p className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-brand-navy" />
                <a
                  href="mailto:admin@econoproservices.com"
                  className="hover:text-brand-navy"
                >
                  admin@econoproservices.com
                </a>
              </p>
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-brand-navy" />
                Orlando & Tampa, Florida
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Quick Links
            </h3>
            <div className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive
                      ? "block text-brand-navy"
                      : "block text-slate-600 transition hover:text-brand-navy"
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5 text-center text-sm text-slate-500 lg:px-8">
          © {year} EconoPro Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
