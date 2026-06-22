import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Platform', href: '/#platform' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Start free trial', href: '/signup' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Sign in', href: '/login' },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-[5vw] py-16 md:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        <div className="max-w-xs">
          <Logo className="text-lg" />
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Autonomous laboratories for the next era of research. Run ATLAS
            agents on managed, secure infrastructure.
          </p>
          <p className="mt-6 lab-label">EST. 2026 — AUTONOMOUS LABS</p>
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-[5vw] py-6 font-mono-tech text-[11px] uppercase tracking-[0.15em] text-ink-faint sm:flex-row lg:px-8">
          <span>© {year} contAInuum</span>
          <span>Payments secured by Stripe</span>
        </div>
      </div>
    </footer>
  );
}
