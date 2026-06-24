import { LegalDoc, LegalSection, LegalTemplateNotice } from '@/components/marketing/LegalDoc';
import { Seo } from '@/components/Seo';

export function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service — contAInuum"
        description="The terms governing your use of contAInuum and the ATLAS platform."
        path="/terms"
      />

      <LegalDoc kicker="LEGAL" title="Terms of Service" lastUpdated="June 23, 2026">
        <LegalTemplateNotice />

        <p>
          These Terms of Service ("Terms") govern your access to and use of contAInuum's websites,
          the ATLAS platform, and related services (collectively, the "Service"). By creating an
          account or using the Service, you agree to these Terms.
        </p>

        <LegalSection n="1" heading="The Service">
          <p>
            contAInuum provides software that helps laboratories plan, run, and learn from research
            campaigns, including autonomous agent workflows and human-in-the-loop handoffs. The
            Service is provided on a subscription basis and may evolve over time.
          </p>
        </LegalSection>

        <LegalSection n="2" heading="Accounts">
          <p>
            You are responsible for safeguarding your account credentials and for all activity under
            your account. Provide accurate information and keep it current. Notify us promptly of any
            unauthorized use.
          </p>
        </LegalSection>

        <LegalSection n="3" heading="Trials, plans & billing">
          <p>
            Paid plans begin with a free trial of the length shown at sign-up (currently 14 days). A
            payment method is collected at checkout; you are not charged during the trial, and you may
            cancel at any time before it ends to avoid charges. After the trial, the plan renews at the
            then-current price for its billing period until canceled.
          </p>
          <p>
            Payments are processed by Stripe; your use of payment features is also subject to Stripe's
            terms. Except where required by law, fees are non-refundable. You can manage or cancel your
            subscription from the in-app billing portal.
          </p>
        </LegalSection>

        <LegalSection n="4" heading="Your data & content">
          <p>
            You retain ownership of the data, protocols, and results you bring to or generate with the
            Service ("Your Content"). You grant contAInuum a limited license to process Your Content
            solely to provide and improve the Service for you, as described in our{' '}
            <a href="/privacy" className="text-safety hover:underline">Privacy Policy</a>. You can export
            Your Content, including your knowledge graph, and we do not sell it.
          </p>
        </LegalSection>

        <LegalSection n="5" heading="Acceptable use">
          <p>
            Do not misuse the Service: no unlawful activity, no attempts to breach security or access
            other customers' data, no reverse engineering except as permitted by law, and no use that
            could endanger health, safety, or the environment. We may suspend access for conduct that
            risks harm to the Service or others.
          </p>
        </LegalSection>

        <LegalSection n="6" heading="Autonomy & human oversight">
          <p>
            ATLAS executes steps autonomously and pauses for human approval where configured. You are
            responsible for appropriate oversight of laboratory work, for validating outputs, and for
            compliance with the safety and regulatory requirements that apply to your lab. The Service
            is a tool, not a substitute for professional judgment.
          </p>
        </LegalSection>

        <LegalSection n="7" heading="Service availability & changes">
          <p>
            We strive for high availability but do not guarantee uninterrupted service. We may modify or
            discontinue features, with notice where material. Specific availability commitments, if any,
            are set out in a separate agreement (e.g., for Institute plans).
          </p>
        </LegalSection>

        <LegalSection n="8" heading="Disclaimers & limitation of liability">
          <p>
            The Service is provided "as is" without warranties of any kind to the extent permitted by
            law. To the maximum extent permitted by law, contAInuum is not liable for indirect,
            incidental, or consequential damages, and our total liability is limited to the amounts you
            paid for the Service in the twelve months before the claim.
          </p>
        </LegalSection>

        <LegalSection n="9" heading="Termination">
          <p>
            You may stop using the Service and cancel at any time. We may suspend or terminate access for
            material breach of these Terms. On termination, you may export Your Content for a reasonable
            period as described in the Privacy Policy.
          </p>
        </LegalSection>

        <LegalSection n="10" heading="Changes to these Terms">
          <p>
            We may update these Terms from time to time. Material changes will be communicated through the
            Service or by email. Continued use after changes take effect constitutes acceptance.
          </p>
        </LegalSection>

        <LegalSection n="11" heading="Contact">
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:hello@containuum.io" className="text-safety hover:underline">hello@containuum.io</a>.
          </p>
        </LegalSection>
      </LegalDoc>
    </>
  );
}
