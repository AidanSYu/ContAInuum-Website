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
    <div className="px-[5vw] pb-28 pt-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-safety">Pricing</p>
          <h1 className="mt-4 font-display text-5xl font-bold text-text-primary sm:text-6xl">
            Simple, scalable pricing.
          </h1>
          <p className="mt-5 text-lg text-text-secondary">
            Start with a 14-day free trial on any plan. Upgrade, downgrade, or
            cancel whenever you like.
          </p>
        </div>

        <div className="mt-16">
          <PricingCards />
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-28 max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold text-text-primary">
            Frequently asked
          </h2>
          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="font-display text-lg font-semibold text-text-primary">{item.q}</h3>
                <p className="mt-2 leading-relaxed text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-text-secondary">
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
