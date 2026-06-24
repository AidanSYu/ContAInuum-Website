import { LegalDoc, LegalSection, LegalTemplateNotice } from '@/components/marketing/LegalDoc';
import { Seo } from '@/components/Seo';

export function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy — contAInuum"
        description="How contAInuum collects, uses, and protects your data."
        path="/privacy"
      />

      <LegalDoc kicker="LEGAL" title="Privacy Policy" lastUpdated="June 23, 2026">
        <LegalTemplateNotice />

        <p>
          This Privacy Policy explains what information contAInuum collects, how we use it, and the
          choices you have. It applies to our websites and the ATLAS platform (the "Service").
        </p>

        <LegalSection n="1" heading="Information we collect">
          <p>
            <strong className="text-ink">Account information</strong> — name, email, and organization you
            provide at sign-up.{' '}
            <strong className="text-ink">Lab content</strong> — the campaigns, protocols, traces, and
            results you create or connect.{' '}
            <strong className="text-ink">Billing information</strong> — handled by Stripe; we store
            subscription status and a customer reference, not full card numbers.{' '}
            <strong className="text-ink">Usage data</strong> — logs and analytics needed to operate and
            secure the Service.
          </p>
        </LegalSection>

        <LegalSection n="2" heading="How we use information">
          <p>
            We use information to provide and secure the Service, process payments, respond to support
            requests, and improve features. Where we use lab content to improve models or
            recommendations, we do so to benefit your account; cross-customer learning, where offered, is
            opt-in and privacy-preserving (e.g., aggregated or differentially private), and never exposes
            one customer's data to another.
          </p>
        </LegalSection>

        <LegalSection n="3" heading="Legal bases & your control">
          <p>
            We process personal data to perform our contract with you, to comply with legal obligations,
            and for legitimate interests such as security. You retain ownership of your lab content and
            can export it, including your knowledge graph, at any time. We do not sell your personal data
            or your lab content.
          </p>
        </LegalSection>

        <LegalSection n="4" heading="Sharing & processors">
          <p>
            We share data with service providers who process it on our behalf under contract — for
            example, Stripe (payments), Supabase (database and authentication), and email/anti-abuse
            providers. We require these processors to protect your data and use it only to provide their
            service to us.
          </p>
        </LegalSection>

        <LegalSection n="5" heading="Security">
          <p>
            We use industry-standard measures — encryption in transit, access controls, and tenant
            isolation — to protect your data. No system is perfectly secure, but we work to reduce risk
            and to notify you of incidents as required by law. See our{' '}
            <a href="/security" className="text-safety hover:underline">Security page</a> for more.
          </p>
        </LegalSection>

        <LegalSection n="6" heading="Data retention">
          <p>
            We retain account and lab content while your account is active and for a reasonable period
            afterward so you can export it, then delete or anonymize it unless a longer period is required
            by law. You can request deletion at any time.
          </p>
        </LegalSection>

        <LegalSection n="7" heading="International transfers">
          <p>
            We may process data in countries other than your own. Where required, we use appropriate
            safeguards (such as standard contractual clauses) for international transfers.
          </p>
        </LegalSection>

        <LegalSection n="8" heading="Your rights">
          <p>
            Depending on where you live, you may have rights to access, correct, export, or delete your
            personal data, and to object to or restrict certain processing. To exercise these rights,
            contact us using the details below.
          </p>
        </LegalSection>

        <LegalSection n="9" heading="Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will be communicated through the
            Service or by email.
          </p>
        </LegalSection>

        <LegalSection n="10" heading="Contact">
          <p>
            Privacy questions or requests can be sent to{' '}
            <a href="mailto:hello@containuum.io" className="text-safety hover:underline">hello@containuum.io</a>.
          </p>
        </LegalSection>
      </LegalDoc>
    </>
  );
}
