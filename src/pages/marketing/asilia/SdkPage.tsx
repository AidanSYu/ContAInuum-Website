import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Github,
  Copy,
  Check,
  Layers,
  ShieldCheck,
  FileKey2,
  PackageCheck,
} from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Magnetic } from '@/components/motion';
import { Cta } from '@/components/marketing/ui';
import { GridField } from '@/components/marketing/visuals';
import { cn } from '@/lib/utils';
import { Section } from './shared';

/* Asilia SDK — the umbrella developer kit (github.com/AidanSYu/Asilia-SDK):
   two packages with one job each. `asilia-protocol` is Asilia Protocol (ALP),
   the open typed contract — capability manifests, the actor firewall, goals,
   transfer, and the signed `.asilia` container format (v2). `asilia-sdk` is the
   toolkit that ships the `asilia` CLI: scaffold, validate, build, sign, verify,
   and conformance-test `.asilia` plugin packages. Structured like a real SDK
   product page (antigravity.google/sdk). The hero centerpiece is a live,
   frameless terminal that ships a signed plugin in five commands — the exact
   README quickstart. All names, commands, and outputs from the repo. */

const REPO = 'https://github.com/AidanSYu/Asilia-SDK';
const INSTALL = 'pip install asilia-sdk';
/* Until the PyPI release lands, this is the install that works today. */
const INSTALL_SOURCE =
  'git clone https://github.com/AidanSYu/Asilia-SDK && pip install ./Asilia-SDK/protocol ./Asilia-SDK/sdk';

const FEATURES = [
  {
    icon: Layers,
    h: 'One typed pipeline',
    p: 'Capabilities register as typed Pydantic models across six kinds (tool, oracle, theorist, instrument, verifier, actuator), so the kernel always knows what a capability is and who may run it. Adding a science means writing a new plugin. The kernel never changes.',
  },
  {
    icon: ShieldCheck,
    h: 'The actor firewall',
    p: 'The cognition brain never mints numbers and never actuates: measurements acquire ledger authority only through instruments. JSONLogic pre- and post-conditions travel with every capability, and non-finite values never reach the record.',
  },
  {
    icon: FileKey2,
    h: 'Signed, tamper-evident packages',
    p: 'A .asilia container (format v2) carries a cleartext manifest, a portable source bundle, and an Ed25519 signature block. Flip one byte anywhere and verification fails. A local trust store resolves publishers into tiers, with revocation built in.',
  },
  {
    icon: PackageCheck,
    h: 'Air-gap friendly by construction',
    p: 'Fat models stay out of the container. Assets are declared by sha256, fetched from the first reachable source, verified against that hash, and cached, so a hostile mirror can’t swap the file. Offline is a protocol-level guarantee.',
  },
];

/* CLI reference — the real command surface from the sdk README. */
const CLI: { cmd: string; desc: string }[] = [
  { cmd: 'asilia init <name> --runtime python', desc: 'Scaffold a plugin from domain-neutral templates' },
  { cmd: 'asilia validate <dir>', desc: 'Validate manifest, schemas, and asset references' },
  { cmd: 'asilia keygen -o <name>', desc: 'Generate an Ed25519 publisher keypair' },
  { cmd: 'asilia build <dir> --sign KEY', desc: 'Build (and optionally encrypt) a signed .asilia' },
  { cmd: 'asilia sign <file> --key KEY', desc: 'Sign a built .asilia in place' },
  { cmd: 'asilia verify <file>', desc: 'Verify the signature and report the trust level' },
  { cmd: 'asilia inspect <file> --json', desc: 'Show the manifest and package metadata' },
  { cmd: 'asilia trust add|list|revoke', desc: 'Manage the local trust store' },
  { cmd: 'asilia test <dir>', desc: 'Run the executable conformance suite' },
];

/* ---- Live, frameless terminal hero (signature orange) --------------------- */

type Line = { prefix?: string; prefixCls?: string; text: string; textCls: string };
type Step =
  | { k: 'type'; p: string; t: string } // typed char-by-char (interactive command)
  | { k: 'line'; p: string; t: string } // pasted whole (continuation body)
  | { k: 'out'; t: string; role: 'res' | 'ok' | 'comment' }
  | { k: 'gap' };

const C = {
  prompt: 'text-[#F2613A]',
  cont: 'text-[#F2613A]/45',
  cmd: 'text-[#F4A98C]',
  res: 'text-[#F2613A]/75',
  ok: 'text-[#FF7A4D]',
  comment: 'text-white/30',
};

/* The real README quickstart, outputs and all: install the toolkit, scaffold a
   plugin, mint a publisher key, build + sign a `.asilia`, verify it, and run the
   conformance suite — the same commands CI runs on examples/hello_sensor. */
const SCRIPT: Step[] = [
  { k: 'out', role: 'comment', t: '# ship a signed plugin in five commands' },
  { k: 'type', p: '$', t: 'pip install asilia-sdk' },
  { k: 'out', role: 'ok', t: 'Successfully installed asilia-protocol-1.0.1 asilia-sdk-1.0.1' },
  { k: 'type', p: '$', t: 'asilia init hplc_qc --runtime python' },
  { k: 'out', role: 'res', t: 'created hplc_qc/   manifest.json · wrapper.py' },
  { k: 'type', p: '$', t: 'asilia keygen -o acme_lab' },
  { k: 'out', role: 'res', t: 'ed25519 keypair    acme_lab.key (keep secret) · acme_lab.pub' },
  { k: 'type', p: '$', t: 'asilia build hplc_qc --sign acme_lab.key -o hplc_qc.asilia' },
  { k: 'out', role: 'res', t: 'container v2       source bundle · assets · signature block' },
  { k: 'out', role: 'ok', t: 'built hplc_qc.asilia' },
  { k: 'type', p: '$', t: 'asilia verify hplc_qc.asilia' },
  { k: 'out', role: 'ok', t: 'signature valid · publisher acme_lab · trust: trusted_signed' },
  { k: 'type', p: '$', t: 'asilia test hplc_qc' },
  { k: 'out', role: 'ok', t: 'conformance passed   manifest strict · schemas sane · imports isolated' },
  { k: 'gap' },
  { k: 'out', role: 'comment', t: '# open contract, proprietary kernel: anyone can build to it' },
];

const prefixCls = (p: string) => (p === '...' ? C.cont : C.prompt);
const toLine = (s: Step): Line => {
  if (s.k === 'gap') return { text: '', textCls: C.res };
  if (s.k === 'out') return { text: s.t, textCls: s.role === 'ok' ? C.ok : s.role === 'comment' ? C.comment : C.res };
  return { prefix: s.p, prefixCls: prefixCls(s.p), text: s.t, textCls: C.cmd };
};

const Caret = () => (
  <span
    aria-hidden="true"
    className="ml-0.5 inline-block w-[0.55em] align-text-bottom"
    style={{ height: '1.05em', background: '#F2613A', animation: 'sdkblink 1s steps(1) infinite' }}
  />
);

/* Frameless typed session, rendered straight onto the obsidian ground (no box). */
function TerminalSession() {
  // Under reduced motion the full session renders immediately, no typing loop.
  const [lines, setLines] = useState<Line[]>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? SCRIPT.map(toLine) : [],
  );
  const [typing, setTyping] = useState<Line | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const body = bodyRef.current;
    if (!body) return;

    let cancelled = false;
    let pauseCurrentSleep: (() => void) | null = null;
    let resumeWhenActive: (() => void) | null = null;

    const bounds = body.getBoundingClientRect();
    let isIntersecting =
      bounds.bottom > 0 &&
      bounds.right > 0 &&
      bounds.top < (window.innerHeight || document.documentElement.clientHeight) &&
      bounds.left < (window.innerWidth || document.documentElement.clientWidth);
    let isActive = isIntersecting && !document.hidden;

    const syncActivity = () => {
      const nextActive = isIntersecting && !document.hidden;
      if (nextActive === isActive) return;
      isActive = nextActive;

      if (isActive) {
        const resume = resumeWhenActive;
        resumeWhenActive = null;
        resume?.();
      } else {
        pauseCurrentSleep?.();
      }
    };

    const waitUntilActive = () => {
      if (isActive || cancelled) return Promise.resolve();
      return new Promise<void>((resolve) => {
        resumeWhenActive = resolve;
      });
    };

    const sleep = async (ms: number) => {
      let remaining = ms;

      while (!cancelled && remaining > 0) {
        await waitUntilActive();
        if (cancelled) return;

        const startedAt = performance.now();
        const completed = await new Promise<boolean>((resolve) => {
          const timeoutId = window.setTimeout(() => {
            pauseCurrentSleep = null;
            resolve(true);
          }, remaining);

          pauseCurrentSleep = () => {
            window.clearTimeout(timeoutId);
            pauseCurrentSleep = null;
            resolve(false);
          };
        });

        if (cancelled || completed) return;
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      isIntersecting = entry.isIntersecting;
      syncActivity();
    });
    const handleVisibilityChange = () => syncActivity();

    observer.observe(body);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    (async () => {
      while (!cancelled) {
        await waitUntilActive();
        if (cancelled) return;
        setLines([]);
        setTyping(null);
        await sleep(500);
        for (const s of SCRIPT) {
          if (cancelled) return;
          if (s.k === 'type') {
            const base = { prefix: s.p, prefixCls: prefixCls(s.p), textCls: C.cmd };
            for (let i = 1; i <= s.t.length; i++) {
              if (cancelled) return;
              setTyping({ ...base, text: s.t.slice(0, i) });
              await sleep(16 + Math.random() * 26);
            }
            setTyping(null);
            setLines((l) => [...l, { ...base, text: s.t }]);
            await sleep(240);
          } else {
            setLines((l) => [...l, toLine(s)]);
            await sleep(s.k === 'line' ? 55 : s.k === 'gap' ? 120 : 200);
          }
        }
        await sleep(3600);
      }
    })();

    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      pauseCurrentSleep?.();
      const resume = resumeWhenActive;
      resumeWhenActive = null;
      resume?.();
    };
  }, []);

  return (
    <div
      ref={bodyRef}
      className="flex h-[clamp(360px,58vh,680px)] flex-col justify-end overflow-hidden font-mono-tech text-[clamp(11px,0.95vw,16px)] leading-[1.75]"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, #000 8%, #000 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 8%, #000 100%)',
      }}
    >
      <style>{`@keyframes sdkblink{0%,50%{opacity:1}50.01%,100%{opacity:0}}`}</style>
      {lines.map((ln, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {ln.prefix && <span className={ln.prefixCls}>{ln.prefix} </span>}
          <span className={ln.textCls}>{ln.text || ' '}</span>
        </div>
      ))}
      {typing ? (
        <div className="whitespace-pre-wrap break-words">
          {typing.prefix && <span className={typing.prefixCls}>{typing.prefix} </span>}
          <span className={typing.textCls}>{typing.text}</span>
          <Caret />
        </div>
      ) : (
        <div>
          <Caret />
        </div>
      )}
    </div>
  );
}

/* Copy-able install command, mirroring Antigravity's Download block.
   `wrap` lets a long command break across lines instead of truncating. */
function CopyCommand({ cmd, label, wrap = false }: { cmd: string; label?: string; wrap?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="min-w-0">
      {label && <p className="lab-label mb-2 text-white/40">{label}</p>}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-[#0A0C10] px-5 py-4">
        <code
          className={cn(
            'min-w-0 font-mono-tech text-[13px] text-white/85 2xl:text-[14px]',
            wrap ? 'break-all leading-relaxed' : 'truncate',
          )}
        >
          <span className="text-safety">$</span> {cmd}
        </code>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="shrink-0 rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Copy install command"
        >
          {copied ? <Check className="h-4 w-4 text-safety" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

/* The real ALP manifest, trimmed for display (protocol README quickstart). */
function CodeFrame() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/12 bg-[#0A0C10] shadow-[0_50px_140px_-45px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 font-mono-tech text-[12px] text-white/45">manifest.py</span>
        </div>
        <span className="lab-label text-white/35">Asilia Protocol · 1.0 · container v2</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono-tech text-[12.5px] leading-[1.8] text-white/85 2xl:text-[14px]">
        <code>
          <span className="text-[#7FB6D6]">from</span> asilia_protocol <span className="text-[#7FB6D6]">import</span> (
          {'\n'}
          {'    '}CapabilityManifest, CapabilityDecl,
          {'\n'}
          {'    '}CapabilityKind, Actor, Determinism, EffectDecl,
          {'\n'}
          )
          {'\n\n'}
          manifest <span className="text-white/40">=</span> CapabilityManifest(
          {'\n'}
          {'    '}id<span className="text-white/40">=</span><span className="text-safety">&quot;org.example.hplc_qc&quot;</span>, version<span className="text-white/40">=</span><span className="text-safety">&quot;0.1.0&quot;</span>,
          {'\n'}
          {'    '}capabilities<span className="text-white/40">=</span>[
          {'\n'}
          {'        '}CapabilityDecl(
          {'\n'}
          {'            '}name<span className="text-white/40">=</span><span className="text-safety">&quot;measure_purity&quot;</span>,
          {'\n'}
          {'            '}kind<span className="text-white/40">=</span>CapabilityKind.INSTRUMENT,
          {'\n'}
          {'            '}actor<span className="text-white/40">=</span>Actor.INSTRUMENT,  <span className="text-white/35"># the brain never measures</span>
          {'\n'}
          {'            '}effects<span className="text-white/40">=</span>EffectDecl(physical<span className="text-white/40">=</span><span className="text-[#7FB6D6]">True</span>, reagent<span className="text-white/40">=</span><span className="text-[#7FB6D6]">True</span>),
          {'\n'}
          {'            '}post<span className="text-white/40">=</span>[{'{'}<span className="text-safety">&quot;&lt;=&quot;</span>: [<span className="text-[#C9A879]">0</span>, {'{'}<span className="text-safety">&quot;var&quot;</span>: <span className="text-safety">&quot;purity_pct&quot;</span>{'}'}, <span className="text-[#C9A879]">100</span>]{'}'}],
          {'\n'}
          {'        '})
          {'\n'}
          {'    '}],
          {'\n'}
          )
        </code>
      </pre>
    </figure>
  );
}

export function AsiliaSdkPage() {
  return (
    <>
      <Seo
        title="Asilia SDK, Contineon"
        description="Everything you need to build for Asilia: asilia-protocol, the open typed contract for autonomous-lab software, and the asilia CLI that scaffolds, builds, signs, and verifies .asilia plugin packages. Open source, Apache-2.0."
        path="/asilia/sdk"
      />

      {/* HERO — headline + lead on the left, a live CLI session shipping a signed plugin */}
      <Section minH="min-h-[100svh]" className="items-center" media={<GridField className="opacity-[0.10]" />}>
        <div className="grid grid-cols-1 items-center gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] 2xl:gap-x-20">
          <div className="max-w-xl 2xl:max-w-2xl">
            <h1 data-title className="text-[clamp(44px,6.4vw,136px)] font-bold leading-[0.92] tracking-[-0.05em]">
              Asilia SDK
            </h1>
            <p data-fade className="mt-7 max-w-lg text-[clamp(16px,1.5vw,25px)] font-medium leading-snug text-white/70 2xl:max-w-xl">
              Everything you need to build for Asilia. asilia-protocol is the open, typed contract:
              the capability model, the actor firewall, the signed .asilia container. The asilia CLI
              scaffolds, builds, signs, and verifies your plugin. Open source, Apache 2.0.
            </p>
            <div data-fade className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Cta to="/asilia/docs" variant="accent">
                  Read the docs <ArrowRight className="h-4 w-4" />
                </Cta>
              </Magnetic>
              <Magnetic>
                <Cta to={REPO} variant="outlineLight">
                  <Github className="h-4 w-4" /> View on GitHub
                </Cta>
              </Magnetic>
            </div>
          </div>
          <div data-fade className="lg:pl-4">
            <TerminalSession />
          </div>
        </div>
      </Section>

      {/* INSTALL — copy-able commands + Important callout, paired with the manifest */}
      <Section minH="min-h-[90svh]" media={<GridField className="opacity-[0.16]" />}>
        <div className="grid grid-cols-1 items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] 2xl:gap-x-24">
          <div>
            <h2 data-title className="text-[clamp(26px,3.2vw,64px)] font-bold leading-[1.04] tracking-[-0.04em]">
              Install in one line.
            </h2>
            <div data-fade className="mt-7 space-y-4">
              <CopyCommand cmd={INSTALL} />
              <p className="text-[13px] leading-relaxed text-white/40 2xl:text-[14px]">
                The toolkit pulls in asilia-protocol, the contract library. Python ≥ 3.10 · Pydantic v2 +
                cryptography (Ed25519) · Apache-2.0. Until the PyPI release lands, install from the repo:
              </p>
              <CopyCommand cmd={INSTALL_SOURCE} label="From source, today" wrap />
            </div>
            <div data-fade className="mt-7 rounded-xl border border-safety/30 bg-safety/[0.06] p-5">
              <p className="lab-label text-safety">Important</p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/70 2xl:text-[15px]">
                Both packages are open source under Apache-2.0, so the contract is auditable and anyone can
                build to it. The engine that runs your capabilities (the verification firewall, the per-lab
                ledger, the instrument bridges) is a separate, closed product. Declaring, building, and
                signing packages is fully open. Executing them against a live lab takes a provisioned
                Asilia kernel.
              </p>
              <Magnetic>
                <Cta to="/contact?topic=partner" variant="outlineLight" className="mt-4 px-4 py-2 text-[13px]">
                  Request access <ArrowRight className="h-4 w-4" />
                </Cta>
              </Magnetic>
            </div>
          </div>
          <div data-fade>
            <CodeFrame />
          </div>
        </div>
      </Section>

      {/* FEATURE BLOCKS — Antigravity-style named blocks, repo-accurate */}
      <Section minH="min-h-[80svh]" media={<GridField className="opacity-[0.12]" />}>
        <div className="mx-auto max-w-6xl 2xl:max-w-none">
          <h2
            data-title
            className="max-w-3xl text-[clamp(26px,3.4vw,72px)] font-bold leading-[1.02] tracking-[-0.04em] 2xl:max-w-4xl"
          >
            The rules are the types.
          </h2>
          <p data-fade className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60 2xl:max-w-2xl 2xl:text-[17px]">
            A discovery system is only trustworthy if the rules by which a result counts are inspectable.
            So ALP writes the rules down as types the kernel can enforce, and extends the same invariants
            to the artifact a lab actually loads.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.h} data-fade className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                  <span className="inline-flex rounded-lg bg-white/5 p-2.5 text-safety">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.01em] text-white 2xl:text-[21px]">{f.h}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-white/60 2xl:text-[15.5px]">{f.p}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* CLI REFERENCE — the real command surface + the trust model */}
      <Section id="cli" minH="min-h-[80svh]" media={<GridField className="opacity-[0.12]" />}>
        <div className="mx-auto max-w-6xl 2xl:max-w-none">
          <h2
            data-title
            className="max-w-3xl text-[clamp(26px,3.4vw,72px)] font-bold leading-[1.02] tracking-[-0.04em] 2xl:max-w-4xl"
          >
            Scaffold to signed package, one CLI.
          </h2>
          <p data-fade className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60 2xl:max-w-2xl 2xl:text-[17px]">
            The CLI is a thin front-end: the one implementation of the format, signing, trust store, and
            asset resolver lives in asilia-protocol, so a package you build and one the runtime loads always
            agree.
          </p>
          <div className="mt-12 grid grid-cols-1 items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div data-fade className="divide-y divide-white/8 rounded-2xl border border-white/10 bg-white/[0.02]">
              {CLI.map((row) => (
                <div
                  key={row.cmd}
                  className="grid gap-x-8 gap-y-1 px-5 py-3.5 sm:grid-cols-[minmax(0,22rem)_1fr] sm:items-baseline 2xl:py-4"
                >
                  <code className="font-mono-tech text-[13px] text-[#F4A98C] 2xl:text-[14px]">{row.cmd}</code>
                  <p className="text-[13.5px] leading-relaxed text-white/55 2xl:text-[14.5px]">{row.desc}</p>
                </div>
              ))}
            </div>
            <div data-fade className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
              <p className="lab-label text-safety">Trust model</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/60 2xl:text-[15.5px]">
                The runtime refuses an unsigned or unknown-publisher .asilia by default. Trust a publisher’s
                public key once per machine, and revocation demotes it later:
              </p>
              <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-[#0A0C10] p-4 font-mono-tech text-[12.5px] leading-[1.9] text-white/85 2xl:text-[13.5px]">
                <code>
                  <span className="text-safety">$</span> asilia trust add acme_lab.pub --label <span className="text-safety">&quot;Acme Lab&quot;</span>
                  {'\n'}
                  <span className="text-[#F2613A]/75">→ trusted_signed</span>
                </code>
              </pre>
              <p className="mt-4 text-[13.5px] leading-relaxed text-white/45 2xl:text-[14.5px]">
                first_party and trusted_signed run. unknown_signed and unsigned are refused. For a working
                example, see examples/hello_sensor: CI builds, signs, verifies, and conformance-tests it
                on every push.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CLOSE — one strong close + the developer CTAs */}
      <Section
        minH="min-h-[80svh]"
        className="items-center"
        media={
          <>
            <GridField className="opacity-[0.14]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_118%,rgba(242,97,58,0.20),transparent_66%)]" />
          </>
        }
      >
        <div className="mx-auto max-w-3xl text-center 2xl:max-w-4xl">
          <h2 data-title className="text-[clamp(30px,4.6vw,96px)] font-bold leading-[1.0] tracking-[-0.05em]">
            Build on Asilia.
          </h2>
          <p data-fade className="mx-auto mt-6 max-w-xl text-[clamp(16px,1.4vw,23px)] leading-relaxed text-white/70 2xl:max-w-2xl">
            Declare the contract, build the package, sign it, and run it on the kernel that powers Asilia.
          </p>
          <div data-fade className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Cta to="/asilia/docs" variant="accent">
                Read the docs <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
            <Magnetic>
              <Cta to={REPO} variant="outlineLight">
                <Github className="h-4 w-4" /> View on GitHub
              </Cta>
            </Magnetic>
            <Magnetic>
              <Cta to="/asilia/framework" variant="outlineLight">
                Explore the Framework <ArrowRight className="h-4 w-4" />
              </Cta>
            </Magnetic>
          </div>
        </div>
      </Section>
    </>
  );
}
