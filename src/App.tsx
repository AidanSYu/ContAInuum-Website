import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MarketingLayout, AuthLayout, DashboardLayout } from '@/components/layout';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Spinner } from '@/components/ui/spinner';

/* Route-level code splitting — each page (and its heavy deps like recharts and
   the knowledge graph) ships in its own chunk instead of the initial bundle. */
const LandingPage = lazy(() =>
  import('@/pages/marketing/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const PricingPage = lazy(() =>
  import('@/pages/marketing/PricingPage').then((m) => ({ default: m.PricingPage })),
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

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() =>
  import('@/pages/auth/SignupPage').then((m) => ({ default: m.SignupPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);

const OverviewPage = lazy(() =>
  import('@/pages/app/OverviewPage').then((m) => ({ default: m.OverviewPage })),
);
const ProjectsPage = lazy(() =>
  import('@/pages/app/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
const BillingPage = lazy(() =>
  import('@/pages/app/BillingPage').then((m) => ({ default: m.BillingPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/app/SettingsPage').then((m) => ({ default: m.SettingsPage })),
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
        {/* Public marketing */}
        <Route element={<MarketingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
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

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Authenticated app */}
        <Route element={<RequireAuth />}>
          <Route path="app" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
