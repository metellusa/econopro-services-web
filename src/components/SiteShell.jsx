import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin, Clock3 } from "lucide-react";
import Container from "./ui/Container";
import RequestEstimateButton from "./RequestEstimateButton";
import {
  COMPANY,
  FOOTER_COMPANY_LINKS,
  FOOTER_SERVICE_LINKS,
  NAV_LINKS,
} from "../data/site";
import { useEstimateModal } from "../context/EstimateModalContext";

function navLinkClass(isActive) {
  return [
    "text-sm font-medium transition",
    isActive
      ? "text-brand-navy"
      : "text-slate-600 hover:text-brand-navy",
  ].join(" ");
}

export default function SiteShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);
  const { openEstimateModal } = useEstimateModal();

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-50 border-b border-brand-border/70 bg-brand-cream/90 backdrop-blur-xl">
        <Container className="flex items-center justify-between gap-4 py-3.5 lg:py-4">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/logo.jpg"
              alt="EconoPro Services logo"
              className="h-11 w-11 shrink-0 rounded-2xl object-cover shadow-md sm:h-12 sm:w-12"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-brand-navy sm:text-lg">
                {COMPANY.name}
              </p>
              <p className="hidden text-[10px] uppercase tracking-[0.16em] text-brand-gold sm:block sm:text-xs">
                {COMPANY.tagline}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}

            <RequestEstimateButton variant="primary" size="sm" source="header">
              Request Estimate
            </RequestEstimateButton>
          </nav>

          <button
            type="button"
            className="inline-flex rounded-xl border border-brand-border bg-white p-2.5 text-brand-navy transition hover:bg-brand-cream xl:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </Container>

        {mobileMenuOpen ? (
          <div
            id="mobile-navigation"
            className="border-t border-brand-border bg-white xl:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === "/"}
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

              <RequestEstimateButton
                variant="primary"
                size="lg"
                className="mt-2 w-full"
                source="mobile-nav"
                onClick={() => setMobileMenuOpen(false)}
              >
                Request Estimate
              </RequestEstimateButton>
            </Container>
          </div>
        ) : null}
      </header>

      {children}

      <footer className="border-t border-brand-border bg-white">
        <Container className="grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="EconoPro Services logo"
                className="h-14 w-14 rounded-2xl object-cover shadow-md"
              />
              <div>
                <p className="text-xl font-bold text-brand-navy">{COMPANY.name}</p>
                <p className="text-sm text-brand-muted">{COMPANY.tagline}</p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-brand-muted">
              {COMPANY.shortDescription}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Services
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {FOOTER_SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-slate-600 transition hover:text-brand-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Company
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  {/estimate/i.test(link.label) ? (
                    <button
                      type="button"
                      onClick={() => openEstimateModal("footer")}
                      className="text-slate-600 transition hover:text-brand-navy"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-slate-600 transition hover:text-brand-navy"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
              Contact
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-brand-navy" aria-hidden="true" />
                <a href={`tel:${COMPANY.phoneTel}`} className="transition hover:text-brand-navy">
                  {COMPANY.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-brand-navy" aria-hidden="true" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="break-all transition hover:text-brand-navy"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-navy" aria-hidden="true" />
                <span>{COMPANY.serviceArea}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock3 size={18} className="mt-0.5 shrink-0 text-brand-navy" aria-hidden="true" />
                <span>
                  {COMPANY.hours.weekdays}
                  <br />
                  {COMPANY.hours.saturday}
                </span>
              </li>
            </ul>
          </div>
        </Container>

        <div className="border-t border-brand-border">
          <Container className="flex flex-col items-center justify-between gap-3 py-5 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
            <p>© {year} {COMPANY.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="transition hover:text-brand-navy">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition hover:text-brand-navy">
                Terms of Use
              </Link>
            </div>
          </Container>
        </div>
      </footer>
    </div>
  );
}
