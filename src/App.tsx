import { Routes, Route } from 'react-router-dom';

import { MarketingLayout, AuthLayout, DashboardLayout } from '@/components/layout';
import { RequireAuth } from '@/components/auth/RequireAuth';

import { LandingPage } from '@/pages/marketing/LandingPage';
import { PricingPage } from '@/pages/marketing/PricingPage';
import { ContactPage } from '@/pages/marketing/ContactPage';

import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

import { OverviewPage } from '@/pages/app/OverviewPage';
import { ProjectsPage } from '@/pages/app/ProjectsPage';
import { BillingPage } from '@/pages/app/BillingPage';
import { SettingsPage } from '@/pages/app/SettingsPage';

import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Public marketing */}
      <Route element={<MarketingLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="contact" element={<ContactPage />} />
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
  );
}

export default App;
