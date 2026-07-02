import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MarketingLayout } from '@/components/layout';
import { Spinner } from '@/components/ui/spinner';

/* Route-level code splitting, each page ships in its own chunk. */
const LandingPage = lazy(() =>
  import('@/pages/marketing/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const AtlasPage = lazy(() =>
  import('@/pages/marketing/AtlasPage').then((m) => ({ default: m.AtlasPage })),
);
const ContactPage = lazy(() =>
  import('@/pages/marketing/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const TermsPage = lazy(() =>
  import('@/pages/marketing/TermsPage').then((m) => ({ default: m.TermsPage })),
);
const PrivacyPage = lazy(() =>
  import('@/pages/marketing/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);
const FaqPage = lazy(() => import('@/pages/marketing/FaqPage').then((m) => ({ default: m.FaqPage })));
const SecurityPage = lazy(() =>
  import('@/pages/marketing/SecurityPage').then((m) => ({ default: m.SecurityPage })),
);
const AboutPage = lazy(() =>
  import('@/pages/marketing/AboutPage').then((m) => ({ default: m.AboutPage })),
);
const DocsPage = lazy(() => import('@/pages/marketing/DocsPage').then((m) => ({ default: m.DocsPage })));
const BlogPage = lazy(() => import('@/pages/marketing/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() =>
  import('@/pages/marketing/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
);
const ChangelogPage = lazy(() =>
  import('@/pages/marketing/ChangelogPage').then((m) => ({ default: m.ChangelogPage })),
);

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <Spinner className="size-6 text-ink-muted" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public marketing, Atlas is open source, no login required */}
        <Route element={<MarketingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="platform" element={<AtlasPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="changelog" element={<ChangelogPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
