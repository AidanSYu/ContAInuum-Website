import { Link } from 'react-router-dom';
import { PricingCards } from '@/components/marketing/PricingCards';

const FAQ = [
  {
    q: 'How does the free trial work?',
    a: 'Every plan starts with a 14-day free trial. You get full access to the ATLAS platform during the trial, and you won’t be charged until it ends. Cancel anytime before then and you pay nothing.',
  },
  {
    q: 'Do I need a credit card to start?',
    a: 'You can create an account and explore without a card. To start a trial that converts into a paid plan, you’ll add a card via Stripe Checkout — it’s only charged when the trial ends.',
  },
  {
    q: 'How are payments secured?',
    a: 'All payments are processed by Stripe. Your card details never touch our servers — we only store a reference to your Stripe customer and subscription.',
  },
  {
    q: 'Can I change or cancel my plan?',
    a: 'Yes. Manage your subscription, payment methods, and invoices anytime from the billing portal inside your dashboard, powered by Stripe.',
  },
];

export function PricingPage() {
  return (
    <div className="px-[5vw] pb-28 pt-32 lg:px-8 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-line pb-10 text-center">
          <p className="lab-label text-safety">PRICING</p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl">
            Simple, scalable pricing.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
            Start with a 14-day free trial on any plan. Upgrade, downgrade, or
            cancel whenever you like.
          </p>
        </div>

        <div className="mt-14">
          <PricingCards />
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-28 max-w-3xl">
          <p className="lab-label text-center text-safety">FAQ</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-ink">
            Frequently asked
          </h2>
          <div className="mt-10 border-t border-line">
            {FAQ.map((item, i) => (
              <div key={item.q} className="border-b border-line py-7">
                <div className="flex gap-4">
                  <span className="font-mono-tech text-xs text-ink-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{item.q}</h3>
                    <p className="mt-2 leading-relaxed text-ink-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-ink-muted">
            Still have questions?{' '}
            <Link to="/contact" className="text-safety hover:underline">
              Talk to us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
