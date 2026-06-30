import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Atlas Framework', href: '/platform' },
      { label: 'Demo', href: '/contact?topic=demo' },
      { label: 'Request access', href: '/contact?topic=partner' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Security', href: '/security' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Research', href: '/blog' },
      { label: 'Contact', href: '/contact' },
      { label: 'Sign in', href: '/login' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-[5vw] py-16 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] lg:px-8 xl:px-16">
        <div className="max-w-xs">
          <Logo className="text-[19px]" />
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            The self-driving lab that remembers. Atlas runs autonomous campaigns on
            the instruments you already have.
          </p>

          <div className="mt-6">
            <h4 className="lab-label">Get launch updates</h4>
            <p className="mb-3 mt-2 text-sm text-ink-muted">
              Partner names and benchmarks at launch. No spam.
            </p>
            <NewsletterSignup source="footer" />
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="lab-label">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-[5vw] py-6 lab-label sm:flex-row lg:px-8 xl:px-16">
          <span>© 2026 Contineon</span>
          <span>Built for working labs</span>
        </div>
      </div>
    </footer>
  );
}
