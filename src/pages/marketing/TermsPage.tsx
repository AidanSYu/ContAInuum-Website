import { LegalDoc, LegalSection, LegalTemplateNotice, Placeholder, Fact } from '@/components/marketing/LegalDoc';
import { Seo } from '@/components/Seo';
import { legal } from '@/config/legal';

export function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service, Contineon"
        description="The terms governing your use of Contineon and the Atlas platform."
        path="/terms"
      />

      <LegalDoc kicker="LEGAL" title="Terms of Service" lastUpdated={legal.effectiveDate ?? '[EFFECTIVE DATE]'}>
        <LegalTemplateNotice />

        <p>
          These Terms of Service ("Terms") govern your access to and use of the websites, account
          dashboard, Atlas platform, and related services (collectively, the "Service") offered by{' '}
          <Fact value={legal.entityName} placeholder="[LEGAL ENTITY NAME]" /> ("Contineon", "we", "us"). By creating an
          account or using the Service, you agree to these Terms. If you are agreeing on behalf of an
          organization, you represent that you are authorized to bind it.
        </p>

        <LegalSection n="1" heading="The Service">
          <p>
            Contineon provides software that helps laboratories plan, run, and learn from research
            campaigns, including autonomous agent workflows and human-in-the-loop handoffs. The
            Service is currently offered to design-partner labs and may evolve over time.
          </p>
        </LegalSection>

        <LegalSection n="2" heading="Accounts">
          <p>
            To use most features you must create an account with a valid email address and name. You
            are responsible for safeguarding your credentials and for all activity under your account.
            Provide accurate information, keep it current, and notify us promptly of any unauthorized
            use. You must be old enough to form a binding contract in your jurisdiction.
          </p>
        </LegalSection>

        <LegalSection n="3" heading="Access & pilots">
          <p>
            <strong className="text-ink">Design-partner access.</strong> Contineon is currently offered
            to a limited cohort of design-partner labs. There is no self-serve paid plan today.
            Access is provisioned by us after you request it, and the scope of each pilot is agreed
            with your lab.
          </p>
          <p>
            <strong className="text-ink">Pilot terms.</strong> Where a pilot involves fees or
            milestone funding, those commercial terms are set out in a separate order or engagement
            agreement between you and Contineon, which governs in the event of any conflict with these
            Terms.
          </p>
        </LegalSection>

        <LegalSection n="4" heading="Your data & content">
          <p>
            You retain ownership of the data, protocols, and results you bring to or generate with the
            Service ("Your Content"). You grant Contineon a limited license to host and process Your
            Content solely to provide and secure the Service for you, as described in our{' '}
            <a href="/privacy" className="text-safety hover:underline">Privacy Policy</a>. You can export
            Your Content, including your knowledge graph, and we do not sell it.
          </p>
        </LegalSection>

        <LegalSection n="5" heading="Acceptable use">
          <p>You agree not to:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>use the Service for any unlawful purpose or in violation of these Terms;</li>
            <li>attempt to breach security, access other customers' data, or disrupt the Service;</li>
            <li>reverse engineer, resell, or sublicense the Service except as permitted by law;</li>
            <li>submit malware, abuse our forms or email systems, or send spam;</li>
            <li>
              use the Service in any way that could endanger health, safety, or the environment, or
              that violates the safety and regulatory requirements applicable to your laboratory.
            </li>
          </ul>
          <p>We may suspend or limit access for conduct that risks harm to the Service or to others.</p>
        </LegalSection>

        <LegalSection n="6" heading="Autonomy & human oversight">
          <p>
            Atlas executes steps autonomously and pauses for human approval where configured. You are
            responsible for appropriate oversight of laboratory work, for validating outputs, and for
            compliance with the safety and regulatory requirements that apply to your lab. The Service
            is a tool, not a substitute for professional judgment.
          </p>
        </LegalSection>

        <LegalSection n="7" heading="Intellectual property">
          <p>
            The Service, including its software, design, and trademarks, is owned by Contineon and its
            licensors and is protected by intellectual-property laws. These Terms grant you a limited,
            non-exclusive, non-transferable right to use the Service during your engagement. We may
            use anonymized and aggregated data that does not identify you or your content to operate
            and improve the Service. If you send us feedback, you grant us a license to use it without
            restriction or obligation.
          </p>
        </LegalSection>

        <LegalSection n="8" heading="Third-party services">
          <p>
            The Service relies on third parties (including Supabase for hosting
            and authentication, Cloudflare for bot mitigation, and Resend for email). Your use of those
            features may be subject to the third party's terms, and we are not responsible for their
            acts or omissions.
          </p>
        </LegalSection>

        <LegalSection n="9" heading="Service availability & changes">
          <p>
            We strive for high availability but do not guarantee uninterrupted service. We may modify or
            discontinue features, with notice where material. Specific availability commitments, if any,
            are set out in a separate agreement (for example, for enterprise engagements).
          </p>
        </LegalSection>

        <LegalSection n="10" heading="Disclaimers">
          <p>
            To the maximum extent permitted by law, the Service is provided "as is" and "as available"
            without warranties of any kind, whether express or implied, including merchantability,
            fitness for a particular purpose, and non-infringement. We do not warrant that the Service
            will be error-free, secure, or uninterrupted, or that any result obtained through the
            Service is accurate or reliable.
          </p>
        </LegalSection>

        <LegalSection n="11" heading="Limitation of liability">
          <p>
            <Placeholder>[REVIEW WITH COUNSEL]</Placeholder> To the maximum extent permitted by law,
            Contineon will not be liable for any indirect, incidental, special, consequential, or
            punitive damages, or for lost profits, data, or goodwill. Our total aggregate liability
            arising out of or relating to the Service is limited to the amounts you paid to us for the
            Service in the <Fact value={legal.liabilityCapPeriod} placeholder="[CAP PERIOD, e.g. 12 months]" /> preceding the event
            giving rise to the claim. Some jurisdictions do not allow certain limitations; in those
            cases, the limitations apply to the fullest extent permitted.
          </p>
        </LegalSection>

        <LegalSection n="12" heading="Indemnification">
          <p>
            <Placeholder>[REVIEW WITH COUNSEL]</Placeholder> You agree to indemnify and hold harmless
            Contineon from claims, losses, and expenses arising out of your misuse of the Service,
            your violation of these Terms, or your violation of applicable law or third-party rights.
            The exact scope and any mutual obligations should be confirmed with counsel.
          </p>
        </LegalSection>

        <LegalSection n="13" heading="Termination">
          <p>
            You may stop using the Service and cancel at any time. We may suspend or terminate access
            for material breach of these Terms or for conduct that risks harm. On termination, your
            right to use the Service ends; you may export Your Content for a reasonable period as
            described in the Privacy Policy. Sections intended to survive termination (such as IP,
            disclaimers, and limitation of liability) will continue to apply.
          </p>
        </LegalSection>

        <LegalSection n="14" heading="Governing law & disputes">
          <p>
            <Placeholder>[REVIEW WITH COUNSEL]</Placeholder> These Terms are governed by the laws of{' '}
            <Fact value={legal.governingLaw} placeholder="[JURISDICTION]" />, without regard to its conflict-of-laws rules.
            The courts located in <Fact value={legal.venue} placeholder="[VENUE]" /> will have exclusive jurisdiction,
            unless a mandatory arbitration or alternative dispute-resolution mechanism is adopted
            (<Placeholder>[ARBITRATION CLAUSE, REVIEW WITH COUNSEL]</Placeholder>).
          </p>
        </LegalSection>

        <LegalSection n="15" heading="Changes to these Terms">
          <p>
            We may update these Terms from time to time. Material changes will be communicated through
            the Service or by email, and the "Last updated" date above will change. Continued use after
            changes take effect constitutes acceptance.
          </p>
        </LegalSection>

        <LegalSection n="16" heading="Contact">
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:hello@contineon.io" className="text-safety hover:underline">hello@contineon.io</a>.
            The contracting entity is <Fact value={legal.entityName} placeholder="[LEGAL ENTITY NAME]" />,{' '}
            <Fact value={legal.registeredAddress} placeholder="[REGISTERED ADDRESS]" />.
          </p>
        </LegalSection>
      </LegalDoc>
    </>
  );
}
