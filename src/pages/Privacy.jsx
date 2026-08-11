import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import SectionEyebrow from "../components/ui/SectionEyebrow";
import { COMPANY } from "../data/site";

function LegalSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-brand-navy sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-7 text-brand-muted sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
  return (
    <main>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>Legal</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              Privacy Policy
            </h1>
            <p className="mt-6 text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              This Privacy Policy explains how {COMPANY.name} collects, uses, and
              protects information when you visit econoproservices.com or contact us.
            </p>
            <p className="mt-3 text-sm text-brand-muted">
              Last updated: August 11, 2026
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-3xl space-y-10">
          <LegalSection title="1. Who we are">
            <p>
              {COMPANY.name} (“we,” “us,” or “our”) provides home improvement and
              cleaning services in {COMPANY.serviceArea}. This website is used to
              share information about our services and to receive estimate and
              cleaning requests.
            </p>
            <p>
              Contact:{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-medium text-brand-navy hover:text-brand-gold"
              >
                {COMPANY.email}
              </a>{" "}
              ·{" "}
              <a
                href={`tel:${COMPANY.phoneTel}`}
                className="font-medium text-brand-navy hover:text-brand-gold"
              >
                {COMPANY.phoneDisplay}
              </a>
            </p>
          </LegalSection>

          <LegalSection title="2. Information we collect">
            <p>We may collect information you choose to provide, including:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Name, phone number, and email address</li>
              <li>Service or project address and related project details</li>
              <li>Preferred date/time windows and service preferences</li>
              <li>Messages, notes, or other details submitted through our forms</li>
            </ul>
            <p>
              We may also collect limited technical information automatically when
              you visit the site, such as browser type, device information, pages
              viewed, and approximate location derived from IP address. If analytics
              tools are enabled in the future, they may collect similar usage data.
            </p>
          </LegalSection>

          <LegalSection title="3. How we use information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Respond to estimate and cleaning requests</li>
              <li>Confirm appointment details and communicate about projects</li>
              <li>Provide customer support by phone or email</li>
              <li>Improve our website, services, and customer experience</li>
              <li>Comply with legal obligations and protect our business</li>
            </ul>
            <p>
              We do not sell your personal information.
            </p>
          </LegalSection>

          <LegalSection title="4. How information is shared">
            <p>We may share information with:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Service providers that help us operate the website and receive form
                submissions (for example, our hosting and form provider, Netlify)
              </li>
              <li>
                Financing partners, only when you choose to continue to their
                pre-qualification or financing flow
              </li>
              <li>
                Professional advisors or authorities when required by law or to
                protect our rights and safety
              </li>
            </ul>
            <p>
              Third-party websites and financing providers have their own privacy
              practices. Their policies apply when you leave our site.
            </p>
          </LegalSection>

          <LegalSection title="5. Forms and communications">
            <p>
              When you submit a request through our website, the details you provide
              are sent to us so we can follow up. Submitting a form is a request for
              contact. It is not an instant confirmed booking.
            </p>
            <p>
              You may ask us to update or remove contact information by emailing{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-medium text-brand-navy hover:text-brand-gold"
              >
                {COMPANY.email}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="6. Cookies and similar technologies">
            <p>
              Our site may use cookies or similar technologies that are necessary
              for basic site operation, security, or performance. If we enable
              analytics or advertising tools later, those tools may use cookies as
              described by their providers.
            </p>
          </LegalSection>

          <LegalSection title="7. Data retention and security">
            <p>
              We retain request and contact information as needed to respond to
              inquiries, manage projects, and meet business or legal requirements.
              We take reasonable steps to protect information, but no method of
              transmission or storage is completely secure.
            </p>
          </LegalSection>

          <LegalSection title="8. Children’s privacy">
            <p>
              This website is intended for adults seeking home services. We do not
              knowingly collect personal information from children under 13.
            </p>
          </LegalSection>

          <LegalSection title="9. Your choices">
            <p>
              You may contact us to request access to, correction of, or deletion of
              personal information you have provided, subject to applicable law and
              any records we must retain for legitimate business purposes.
            </p>
          </LegalSection>

          <LegalSection title="10. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The “Last updated”
              date at the top of this page will change when we do. Continued use of
              the website after updates means you acknowledge the revised policy.
            </p>
          </LegalSection>

          <LegalSection title="11. Contact">
            <p>
              Questions about this Privacy Policy can be sent to{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-medium text-brand-navy hover:text-brand-gold"
              >
                {COMPANY.email}
              </a>{" "}
              or by calling{" "}
              <a
                href={`tel:${COMPANY.phoneTel}`}
                className="font-medium text-brand-navy hover:text-brand-gold"
              >
                {COMPANY.phoneDisplay}
              </a>
              .
            </p>
            <p>
              See also our{" "}
              <Link to="/terms" className="font-medium text-brand-navy hover:text-brand-gold">
                Terms of Use
              </Link>
              .
            </p>
          </LegalSection>
        </Container>
      </Section>
    </main>
  );
}
