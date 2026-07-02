import { LegalDoc, LegalSection, LegalTemplateNotice, Placeholder, Fact } from '@/components/marketing/LegalDoc';
import { Seo } from '@/components/Seo';
import { legal } from '@/config/legal';

export function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy, Contineon"
        description="How Contineon collects, uses, and protects your data."
        path="/privacy"
      />

      <LegalDoc kicker="LEGAL" title="Privacy Policy" lastUpdated={legal.effectiveDate ?? '[EFFECTIVE DATE]'}>
        <LegalTemplateNotice />

        <p>
          This Privacy Policy explains what information <Fact value={legal.entityName} placeholder="[LEGAL ENTITY NAME]" />{' '}
          ("Contineon", "we", "us") collects, how we use it, and the choices you have. It applies to
          our marketing website, the account/dashboard area, and the Atlas platform (together, the
          "Service"). It is written to describe how the Service actually handles data today.
        </p>

        <LegalSection n="1" heading="Information we collect">
          <p>
            <strong className="text-ink">Account information.</strong> This site does not offer sign-up,
            and using the open-source Atlas software requires no account with us. If you use an optional
            hosted or supported deployment, that service may store your email address, name, and a role
            flag used for access control. <Placeholder>[REVIEW WITH COUNSEL]</Placeholder>
          </p>
          <p>
            <strong className="text-ink">Billing information.</strong> Contineon does not currently
            operate self-serve payments and does not collect or store card or billing details through
            this site. Where a hosted or supported deployment involves fees, those are handled under a
            separate engagement agreement. <Placeholder>[REVIEW WITH COUNSEL]</Placeholder>
          </p>
          <p>
            <strong className="text-ink">Contact form.</strong> When you submit the contact form we
            store the name, email, optional organization, and message you provide. For anti-abuse
            purposes we also store a one-way <strong className="text-ink">SHA-256 hash of your IP
            address</strong>, never the raw IP. Submissions are screened with Cloudflare Turnstile to
            block automated abuse.
          </p>
          <p>
            <strong className="text-ink">Newsletter.</strong> If you subscribe, we store
            your email address, the source of the sign-up, and your confirmation status. We use{' '}
            <strong className="text-ink">double opt-in</strong>: a confirmation email is sent and your
            subscription is only activated after you click the link. You can unsubscribe at any time.
          </p>
          <p>
            <strong className="text-ink">Cookies &amp; local storage.</strong> We use a small number of
            essential cookies and similar local storage to remember your preferences (such as light or
            dark theme) and to operate the site securely. We do not use them to track you across other
            sites.
          </p>
          <p>
            <strong className="text-ink">Lab content.</strong> The campaigns, protocols, traces,
            results, and knowledge graph you create or connect within Atlas are processed to provide
            the Service to your account. <Placeholder>[REVIEW WITH COUNSEL]</Placeholder>, confirm the
            scope of lab-content processing and any feature-specific data flows before launch.
          </p>
          <p>
            <strong className="text-ink">Operational logs.</strong> We process server and security
            logs needed to operate, debug, and protect the Service.
          </p>
        </LegalSection>

        <LegalSection n="2" heading="How we use information">
          <p>
            We use information to: create and secure your account; provide the Service and its
            features; respond to contact and
            support requests; send transactional and (with consent) newsletter email; prevent abuse
            and fraud; and operate, debug, and improve the Service. We do not sell your personal data
            or your lab content, and we do not use the contents of your contact message for any
            purpose other than responding to and securing that communication.
          </p>
        </LegalSection>

        <LegalSection n="3" heading="Legal bases">
          <p>
            Where applicable law (such as the GDPR) requires a legal basis, we rely on: performance of
            our contract with you (providing the Service); your consent (newsletter
            email); our legitimate interests (securing the Service, preventing abuse, and basic
            operational analytics); and compliance with legal obligations. <Placeholder>[REVIEW WITH COUNSEL]</Placeholder>{' '}
           , confirm the legal bases and consent mechanics for your target jurisdictions.
          </p>
        </LegalSection>

        <LegalSection n="4" heading="Subprocessors & sharing">
          <p>
            We share data with a small set of service providers who process it on our behalf, under
            contract, only to deliver their service to us:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="text-ink">Supabase</strong>, database, authentication, and edge
              functions (stores account, contact, and newsletter records).
            </li>
            <li>
              <strong className="text-ink">Cloudflare</strong>, Turnstile bot mitigation on public
              forms (and edge delivery, where used).
            </li>
            <li>
              <strong className="text-ink">Resend</strong>, transactional and confirmation email
              delivery (contact notifications and newsletter double opt-in).
            </li>
            <li>
              <strong className="text-ink"><Fact value={legal.hostingProvider} placeholder="[HOSTING/CDN PROVIDER, e.g. Vercel or Cloudflare]" /></strong>{' '}
             , website and application hosting and content delivery.
            </li>
          </ul>
          <p>
            We may also disclose information where required by law or to protect the rights, safety,
            and security of users and the Service. We do not sell your data. A current list of
            subprocessors is also summarized on our{' '}
            <a href="/security" className="text-safety hover:underline">Security page</a>.
          </p>
        </LegalSection>

        <LegalSection n="5" heading="Data retention">
          <p>
            We retain account and lab content while your account is active and for a reasonable period
            afterward so you can export it, then delete or anonymize it unless a longer period is
            required by law. Contact-form submissions are retained for support and anti-abuse purposes
            and then deleted on a periodic basis. Newsletter records are retained until you
            unsubscribe.{' '}
            {legal.retentionPeriods ?? (
              <>
                <Placeholder>[RETENTION PERIODS]</Placeholder>, set concrete retention windows with
                counsel.
              </>
            )}
          </p>
        </LegalSection>

        <LegalSection n="6" heading="Security">
          <p>
            We use measures such as encryption in transit (TLS), database row-level security and
            tenant isolation, hardened authentication, and least-privilege access for our processors.
            No system is perfectly secure, but we
            work to reduce risk and to notify you of incidents as required by law. See our{' '}
            <a href="/security" className="text-safety hover:underline">Security page</a> for more.
          </p>
        </LegalSection>

        <LegalSection n="7" heading="International transfers">
          <p>
            Our processors may store and process data in countries other than your own (for example,
            in the United States and the European Union). Where required, we rely on appropriate
            safeguards such as standard contractual clauses. <Placeholder>[REVIEW WITH COUNSEL]</Placeholder>{' '}
           , confirm hosting/processing regions and transfer mechanisms for your subprocessors.
          </p>
        </LegalSection>

        <LegalSection n="8" heading="Your rights & choices">
          <p>
            Depending on where you live, you may have rights to access, correct, export, delete, or
            restrict the processing of your personal data, and to object to certain processing or
            withdraw consent. In practice:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="text-ink">Access &amp; export.</strong> You can export your lab
              content, including your knowledge graph, from within the Service, and you may request a
              copy of the account data we hold.
            </li>
            <li>
              <strong className="text-ink">Deletion.</strong> You can request deletion of your account
              and associated personal data.
            </li>
            <li>
              <strong className="text-ink">Newsletter.</strong> You can withdraw consent and
              unsubscribe at any time.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us using the details below. We will respond
            within the timeframes required by applicable law.
          </p>
        </LegalSection>

        <LegalSection n="9" heading="Children's privacy">
          <p>
            The Service is intended for use by professionals and organizations and is not directed to
            children. We do not knowingly collect personal data from children.{' '}
            <Placeholder>[REVIEW WITH COUNSEL]</Placeholder>, confirm the applicable minimum-age
            statement for your jurisdictions.
          </p>
        </LegalSection>

        <LegalSection n="10" heading="Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will be communicated through
            the Service or by email, and the "Last updated" date above will change.
          </p>
        </LegalSection>

        <LegalSection n="11" heading="Contact">
          <p>
            Privacy questions or requests can be sent to{' '}
            <a href="mailto:hello@contineon.io" className="text-safety hover:underline">hello@contineon.io</a>.
            The data controller is <Fact value={legal.entityName} placeholder="[LEGAL ENTITY NAME]" />, located at{' '}
            <Fact value={legal.registeredAddress} placeholder="[REGISTERED ADDRESS]" />.{' '}
            <Fact value={legal.dpoOrEuRepresentative} placeholder="[DPO / EU REPRESENTATIVE, IF REQUIRED]" />.
          </p>
        </LegalSection>
      </LegalDoc>
    </>
  );
}
