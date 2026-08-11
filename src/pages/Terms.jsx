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

export default function Terms() {
  return (
    <main>
      <Section tone="cream" className="bg-hero-glow">
        <Container>
          <div className="max-w-3xl">
            <SectionEyebrow>Legal</SectionEyebrow>
            <h1 className="mt-4 font-display text-display-xl text-brand-navy text-balance">
              Terms of Use
            </h1>
            <p className="mt-6 text-base leading-7 text-brand-muted sm:text-lg sm:leading-8">
              These Terms of Use govern your use of the {COMPANY.name} website at
              econoproservices.com.
            </p>
            <p className="mt-3 text-sm text-brand-muted">
              Last updated: August 11, 2026
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-3xl space-y-10">
          <LegalSection title="1. Agreement">
            <p>
              By accessing or using this website, you agree to these Terms of Use
              and our{" "}
              <Link to="/privacy" className="font-medium text-brand-navy hover:text-brand-gold">
                Privacy Policy
              </Link>
              . If you do not agree, please do not use the site.
            </p>
          </LegalSection>

          <LegalSection title="2. About this website">
            <p>
              This website provides general information about {COMPANY.name} and
              allows visitors to request estimates or cleaning services. Website
              content is for informational purposes and may be updated without
              notice.
            </p>
            <p>
              Online form submissions are requests for follow-up. They are not
              instant confirmed appointments, contracts, or guarantees of service
              availability, pricing, or scheduling.
            </p>
          </LegalSection>

          <LegalSection title="3. Services and estimates">
            <p>
              Any description of services on this website is general. Actual scope,
              pricing, timing, and terms for a project are confirmed directly with{" "}
              {COMPANY.name} after we review your request and, when needed, the
              property or project details.
            </p>
            <p>
              We may decline work, reschedule, or revise estimates based on site
              conditions, availability, or information discovered after the initial
              request.
            </p>
          </LegalSection>

          <LegalSection title="4. Financing">
            <p>
              Financing options featured on this website, if any, are offered through
              independent third-party providers. Pre-qualification, approval,
              interest rates, fees, and loan terms are determined solely by the
              financing provider.
            </p>
            <p>
              {COMPANY.name} does not guarantee financing approval or specific loan
              terms. When you continue to a financing partner’s site, their terms
              and privacy practices apply.
            </p>
          </LegalSection>

          <LegalSection title="5. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use the site for unlawful, harmful, or fraudulent purposes</li>
              <li>Submit false, misleading, or incomplete contact information</li>
              <li>Attempt to disrupt, scrape, or misuse the website or its forms</li>
              <li>Interfere with the security or normal operation of the site</li>
            </ul>
          </LegalSection>

          <LegalSection title="6. Intellectual property">
            <p>
              Website content, branding, logos, and project photography owned by{" "}
              {COMPANY.name} are protected by applicable intellectual property laws.
              You may not copy, reuse, or distribute site materials for commercial
              purposes without our prior written permission.
            </p>
          </LegalSection>

          <LegalSection title="7. Third-party links">
            <p>
              This website may link to third-party sites, including BBB profiles or
              financing partners. We are not responsible for the content, policies,
              or practices of third-party websites.
            </p>
          </LegalSection>

          <LegalSection title="8. Disclaimer">
            <p>
              The website is provided on an “as is” and “as available” basis. To the
              fullest extent permitted by law, {COMPANY.name} disclaims warranties
              regarding uninterrupted access, error-free operation, or the
              completeness of website content.
            </p>
          </LegalSection>

          <LegalSection title="9. Limitation of liability">
            <p>
              To the fullest extent permitted by law, {COMPANY.name} is not liable
              for indirect, incidental, special, consequential, or punitive damages
              arising from your use of the website or reliance on website content.
              Project work, if performed, is governed by the specific agreement or
              estimate terms discussed with you for that job.
            </p>
          </LegalSection>

          <LegalSection title="10. Indemnification">
            <p>
              You agree to indemnify and hold harmless {COMPANY.name} from claims,
              damages, losses, and expenses arising from your misuse of the website
              or violation of these Terms.
            </p>
          </LegalSection>

          <LegalSection title="11. Governing law">
            <p>
              These Terms are governed by the laws of the State of Florida, without
              regard to conflict-of-law principles. Courts located in Florida shall
              have exclusive jurisdiction over disputes arising from these Terms or
              your use of the website, except where prohibited by law.
            </p>
          </LegalSection>

          <LegalSection title="12. Changes">
            <p>
              We may update these Terms from time to time. The “Last updated” date
              will reflect changes. Continued use of the website after updates means
              you accept the revised Terms.
            </p>
          </LegalSection>

          <LegalSection title="13. Contact">
            <p>
              Questions about these Terms can be sent to{" "}
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
          </LegalSection>
        </Container>
      </Section>
    </main>
  );
}
