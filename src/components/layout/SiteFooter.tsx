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
    <footer className="relative z-10 border-t border-white/10 bg-void">
      <div className="mx-auto grid max-w-7xl gap-10 px-[5vw] py-16 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="max-w-xs">
          <Logo className="text-lg" />
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Autonomous laboratories for the next era of research. Run ATLAS
            agents on managed, secure infrastructure.
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-text-secondary/70">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-[5vw] py-6 text-xs text-text-secondary/60 sm:flex-row lg:px-8">
          <span className="font-mono-tech tracking-wider">© {year} contAInuum — Autonomous Labs</span>
          <span className="font-mono-tech tracking-wider">Payments secured by Stripe</span>
        </div>
      </div>
    </footer>
  );
}
