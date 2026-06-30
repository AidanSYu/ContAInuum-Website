import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal, Magnetic, ParticleField } from '@/components/motion';
import { Cta, Kicker } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { AsciiMedia } from '@/components/marketing/AsciiMedia';
import { ConsolePreview } from '@/components/marketing/ConsolePreview';
import { gsap, useGSAP, SplitText } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/* =============================================================================
   Landing — Contineon home. Condensed: one locked hero, one thesis beat,
   Atlas as the tangible proof, a products grid, a newsletter capture, and a
   conversion close. Vision stated once; the rest is tangible. GI focus meets
   Palantir utility. Signature treatment: AsciiMedia (obsidian -> ember/ice).
   ============================================================================= */

function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = root.current?.querySelector('[data-hero-title]');
        if (title) {
          const split = new SplitText(title, { type: 'lines,words', linesClass: 'overflow-hidden pb-[0.1em]' });
          gsap.from(split.words, { yPercent: 115, duration: 1.05, ease: 'power4.out', stagger: 0.045, delay: 0.15 });
        }
        gsap.from('[data-hero-fade]', { opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
        if (media.current) {
          gsap.fromTo(
            media.current,
            { scale: 1.06 },
            { scale: 1.16, duration: 24, ease: 'sine.inOut', repeat: -1, yoyo: true },
          );
          gsap.to(media.current, {
            yPercent: 16,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="dark relative flex min-h-[100svh] items-end overflow-hidden bg-paper text-ink">
      <div className="absolute inset-0">
        <video
          ref={media}
          className="h-[118%] w-full object-cover will-change-transform [filter:saturate(0.85)_contrast(1.04)_brightness(0.9)]"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/airglow.jpg"
          onLoadedData={(e) => {
            e.currentTarget.playbackRate = 2.2;
          }}
        >
          <source src="/images/iss-earth.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/55 via-[#06080B]/35 to-[#06080B]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080B]/85 via-transparent to-transparent" />
      </div>
      <ParticleField className="pointer-events-none absolute inset-0 z-[1]" />
      <GridField className="opacity-[0.5]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-[5vw] pb-20 pt-32 lg:px-8 xl:px-16">
        <div className="max-w-5xl">
          <h1
            data-hero-title
            className="text-[clamp(44px,7.4vw,116px)] font-bold leading-[0.94] tracking-[-0.045em]"
          >
            <span className="block">Industrializing</span>
            <span className="block">Breakthrough</span>
            <span className="block">Science.</span>
          </h1>
          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Cta to="/platform" variant="outlineLight">
                See Atlas <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Thesis (one beat) ---------------------------- */
function Thesis() {
  return (
    <section id="thesis" className="dark relative flex min-h-[88vh] items-center overflow-hidden bg-[#06080B] text-ink">
      <AsciiMedia
        src="/images/gargantua-blackhole.png"
        type="image"
        tint="ember"
        cols={150}
        className="absolute inset-0 opacity-[0.3]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06080B] via-[#06080B]/85 to-[#06080B]/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06080B] to-transparent" />
      <GridField className="opacity-30" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-[5vw] py-[clamp(80px,12vw,150px)] lg:px-8 xl:px-16">
        <Reveal>
          <Kicker className="text-safety">The thesis</Kicker>
        </Reveal>
        <Reveal delay={0.03}>
          <h2 className="mt-5 text-[clamp(34px,6vw,86px)] font-bold leading-[0.98] tracking-[-0.04em]">
            Science never had its industrial revolution.
          </h2>
        </Reveal>
        <div className="mt-10 max-w-3xl space-y-5 text-[clamp(18px,2.1vw,30px)] font-medium leading-[1.18] tracking-[-0.02em]">
          <Reveal delay={0.05}>
            <p className="text-white/55">
              It is still made by hand. One mind at a time. The way cloth was made before the loom.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              We are not betting it gets easier. We are betting it gets{' '}
              <span className="text-safety">industrialized</span>.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-white/80">
              This is the second invention factory: intelligence turned into matter, at scale.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>Whoever industrializes science owns the fastest curve in the world.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Atlas (the proof) ---------------------------- */
const ATLAS_LOOP: Array<[string, string]> = [
  ['01', 'Designs the experiment'],
  ['02', 'Runs it on real instruments'],
  ['03', 'Learns, remembers, tries again'],
  ['04', 'Repeats, and the advantage compounds'],
];

function Atlas() {
  return (
    <section className="dark relative overflow-hidden bg-[#06080B] py-[clamp(80px,12vw,160px)] text-ink">
      <GridField className="opacity-25" />
      <div className="relative z-10 mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Kicker className="text-safety">Atlas, the first product</Kicker>
            <h2 className="mt-5 text-[clamp(28px,3.8vw,52px)] font-bold leading-[1.02] tracking-[-0.035em]">
              Prompt in. Physical result out. At machine speed.
            </h2>
            <p className="mt-6 max-w-xl text-[clamp(15px,1.2vw,18px)] leading-relaxed text-white/70">
              Atlas makes the labs that already exist autonomous. It designs the experiment, runs it
              on real instruments, then learns, remembers, and tries again on its own. Every run is
              logged, versioned, and reused, so the lab's advantage compounds and stays the lab's.
            </p>
            <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
              {ATLAS_LOOP.map(([n, t]) => (
                <div key={n} className="flex items-center gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-3.5 last:border-b-0">
                  <span className="font-mono text-xs text-safety">{n}</span>
                  <span className="text-[15px] text-white/85">{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Magnetic>
                <Cta to="/platform" variant="accent">
                  Explore Atlas <ArrowRight className="h-4 w-4" />
                </Cta>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <ConsolePreview className="w-full" label="Atlas console" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Products (utility) ----------------------------- */
type Product = {
  n: string;
  name: string;
  line: string;
  status: 'live' | 'dev';
  to?: string;
  thumb: string;
  tint: 'ember' | 'ice';
};

const PRODUCTS: Product[] = [
  { n: '01', name: 'Atlas', line: 'The autonomous lab operating system.', status: 'live', to: '/platform', thumb: '/images/earth-night-poster.jpg', tint: 'ember' },
  { n: '02', name: 'Infrastructure', line: 'The compute and instruments the autonomous lab runs on.', status: 'dev', thumb: '/images/sun-sdo-poster.jpg', tint: 'ice' },
  { n: '03', name: 'Foundational models', line: 'Our own language and world models. Owned, not rented.', status: 'dev', thumb: '/images/gargantua-blackhole.png', tint: 'ember' },
  { n: '04', name: 'Unusual methods', line: 'State of the art reached by routes others will not take.', status: 'dev', thumb: '/images/sr71-horse-rider.png', tint: 'ember' },
];

function StatusChip({ status }: { status: Product['status'] }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide',
        status === 'live' ? 'border-safety text-safety' : 'border-line text-ink-muted',
      )}
    >
      {status === 'live' ? 'Live' : 'In development'}
    </span>
  );
}

function ProductCard({ p }: { p: Product }) {
  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <AsciiMedia
          src={p.thumb}
          type="image"
          tint={p.tint}
          cols={94}
          className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 font-mono text-xs text-safety">{p.n}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[17px] font-bold tracking-[-0.01em] text-ink">{p.name}</h3>
          <StatusChip status={p.status} />
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{p.line}</p>
        {p.to && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:text-safety">
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </>
  );
  const cls = 'group flex h-full flex-col';
  return p.to ? (
    <Link to={p.to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function ProductsGrid() {
  return (
    <section id="products" className="relative bg-surface py-[clamp(72px,10vw,140px)]">
      <div className="mx-auto max-w-7xl px-[5vw] lg:px-8 xl:px-16">
        <Reveal className="max-w-2xl">
          <Kicker className="text-safety">What we are building</Kicker>
          <h2 className="mt-4 text-[clamp(28px,4vw,54px)] font-bold leading-[1.02] tracking-[-0.035em] text-ink">
            One stack. Built to compound.
          </h2>
          <p className="mt-5 max-w-xl text-[clamp(15px,1.15vw,18px)] leading-relaxed text-ink-muted">
            Atlas is live today. The rest of the stack is in active development. We own our AI rather
            than rent it, so the whole system improves together.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.04} className="bg-surface">
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Newsletter (utility) --------------------------- */
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="dark relative overflow-hidden bg-[#06080B] text-ink">
      <GridField className="opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl px-[5vw] py-[clamp(56px,8vw,96px)] lg:px-8 xl:px-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Kicker className="text-safety">From the lab</Kicker>
            <h2 className="mt-4 text-[clamp(26px,3.4vw,44px)] font-bold leading-[1.02] tracking-[-0.03em]">
              Get the build log.
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
              Notes from the work as it happens. No cadence promises, no noise. The newsroom opens
              when there is real news to publish.
            </p>
          </Reveal>
          <Reveal delay={0.05} className="w-full lg:ml-auto lg:max-w-md">
            {done ? (
              <p className="text-[15px] text-white/80">Thanks. You are on the list.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setDone(true);
                }}
                className="flex w-full gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@lab.org"
                  aria-label="Email address"
                  className="h-11 flex-1 rounded-full border border-white/15 bg-transparent px-4 text-[15px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-1.5 rounded-full bg-safety px-5 text-[15px] font-medium text-white transition-colors hover:bg-safety/90"
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Close (CTA) -------------------------------- */
function Close() {
  return (
    <section className="dark relative overflow-hidden bg-[#06080B] text-ink">
      <div className="absolute inset-0">
        <img src="/images/sr71-quote-wide.png" alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080B]/85 to-[#06080B]/96" />
      </div>
      <GridField className="opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-[5vw] py-[clamp(88px,13vw,180px)] lg:px-8 xl:px-16">
        <Reveal className="max-w-3xl">
          <Kicker className="text-safety">Work with us</Kicker>
          <h2 className="mt-5 text-[clamp(34px,5.2vw,78px)] font-bold leading-[0.98] tracking-[-0.045em]">
            Bring us your hardest problem.
          </h2>
          <p className="mt-7 max-w-xl text-[clamp(16px,1.3vw,20px)] leading-relaxed text-white/70">
            If you run a lab, build instruments, or want to industrialize discovery, talk to us. We
            reply within two business days.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Cta to="/contact?topic=partner" variant="accent">
                Request access <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
            <Magnetic>
              <Cta to="/contact?topic=demo" variant="outlineLight">
                Book a demo
              </Cta>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <>
      <Seo
        title="Contineon, industrializing breakthrough science"
        description="Contineon is the frontier lab turning intelligence into matter. We are building the second invention factory. Atlas, our first product, makes the labs that already exist autonomous."
        path="/"
      />

      <Hero />
      <Thesis />
      <Atlas />
      <div aria-hidden className="h-[clamp(64px,9vw,120px)] bg-gradient-to-b from-[#06080B] to-[#FFFFFF]" />
      <ProductsGrid />
      <div aria-hidden className="h-[clamp(64px,9vw,120px)] bg-gradient-to-b from-[#FFFFFF] to-[#06080B]" />
      <NewsletterSignup />
      <Close />
    </>
  );
}
