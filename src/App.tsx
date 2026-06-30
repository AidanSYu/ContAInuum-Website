import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { MarketingLayout, AuthLayout, DashboardLayout } from '@/components/layout';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { Spinner } from '@/components/ui/spinner';

/* Route-level code splitting — each page ships in its own chunk. */
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
const SettingsPage = lazy(() =>
  import('@/pages/app/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const EscrowListPage = lazy(() =>
  import('@/pages/app/EscrowListPage').then((m) => ({ default: m.EscrowListPage })),
);
const EscrowDetailPage = lazy(() =>
  import('@/pages/app/EscrowDetailPage').then((m) => ({ default: m.EscrowDetailPage })),
);
const AdminEscrowPage = lazy(() =>
  import('@/pages/app/admin/AdminEscrowPage').then((m) => ({ default: m.AdminEscrowPage })),
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

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Authenticated app (no self-serve billing — access is provisioned) */}
        <Route element={<RequireAuth />}>
          <Route path="app" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="escrow" element={<EscrowListPage />} />
            <Route path="escrow/:id" element={<EscrowDetailPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="admin/escrow" element={<AdminEscrowPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
