import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { RootErrorBoundary } from '@/components/RootErrorBoundary';
import { ProtectedRoute } from '@/features/authentication/components';
import AuthLayout from '@/features/authentication/layouts/AuthLayout';
import { CampaignWizardIndexRedirect } from '@/features/campaign/components';
import CampaignWizardLayout from '@/features/campaign/layouts/CampaignWizardLayout';
import DashboardLayout from '@/features/dashboard/layouts/DashboardLayout';

const Home = lazy(() => import('@/features/home/pages/Home'));
const SignIn = lazy(() => import('@/features/authentication/pages/SignIn'));
const SignUp = lazy(() => import('@/features/authentication/pages/SignUp'));
const BrandCampaigns = lazy(() => import('@/features/campaign/pages/BrandCampaigns'));
const CampaignStep1 = lazy(() => import('@/features/campaign/pages/steps/CampaignStep1'));
const CampaignStep2 = lazy(() => import('@/features/campaign/pages/steps/CampaignStep2'));
const CampaignStep3 = lazy(() => import('@/features/campaign/pages/steps/CampaignStep3'));
const CampaignStep4 = lazy(() => import('@/features/campaign/pages/steps/CampaignStep4'));
const CampaignStep5 = lazy(() => import('@/features/campaign/pages/steps/CampaignStep5'));
const CampaignDetail = lazy(() => import('@/features/campaign/pages/CampaignDetail'));

/**
 * Generic full-page loading fallback spinner for lazily loaded routes.
 *
 * @returns The rendered loading spinner placeholder.
 */
function PageLoadingFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<RootErrorBoundary />}>
      <Route
        index
        element={
          <Suspense fallback={<PageLoadingFallback />}>
            <Home />
          </Suspense>
        }
      />
      <Route element={<AuthLayout />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="login" element={<Navigate to="/signin" replace />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['BRAND', 'ADMIN']} />}>
        <Route path="brand-dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="brand-campaigns" replace />} />
          <Route path="brand-campaigns" element={<BrandCampaigns />} />
          <Route path="brand-campaigns/:id" element={<CampaignDetail />} />
          <Route path="brand-campaigns/create" element={<CampaignWizardLayout />}>
            <Route index element={<Navigate to="step-1" replace />} />
            <Route path="step-1" element={<CampaignStep1 />} />
            <Route path="step-2" element={<CampaignStep2 />} />
            <Route path="step-3" element={<CampaignStep3 />} />
            <Route path="step-4" element={<CampaignStep4 />} />
            <Route path="step-5" element={<CampaignStep5 />} />
          </Route>
          <Route path="brand-campaigns/:id/create" element={<CampaignWizardLayout />}>
            <Route index element={<CampaignWizardIndexRedirect />} />
            <Route path="step-1" element={<CampaignStep1 />} />
            <Route path="step-2" element={<CampaignStep2 />} />
            <Route path="step-3" element={<CampaignStep3 />} />
            <Route path="step-4" element={<CampaignStep4 />} />
            <Route path="step-5" element={<CampaignStep5 />} />
          </Route>
        </Route>
        <Route path="dashboard" element={<Navigate to="/brand-dashboard" replace />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['BRAND', 'CREATOR', 'ADMIN']} />}>
        <Route path="campaigns/:id" element={<DashboardLayout />}>
          <Route index element={<CampaignDetail />} />
        </Route>
      </Route>
    </Route>
  )
);

/**
 * Root application component configuring routing and global toast notifications.
 * Uses a Data Router (RouterProvider) to support navigation blockers (useBlocker)
 * and route-level code splitting via dynamic imports.
 *
 * @returns The root application router tree.
 */
function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
