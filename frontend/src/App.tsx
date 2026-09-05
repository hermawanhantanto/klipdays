import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { Toaster } from '@/components/ui/sonner';
import AuthLayout from '@/features/authentication/layouts/AuthLayout';
import SignIn from '@/features/authentication/pages/SignIn';
import SignUp from '@/features/authentication/pages/SignUp';
import Campaigns from '@/features/campaign/pages/Campaigns';
import CampaignWizardLayout from '@/features/campaign/layouts/CampaignWizardLayout';
import Step1BasicInfo from '@/features/campaign/pages/steps/Step1BasicInfo';
import DashboardLayout from '@/features/dashboard/layouts/DashboardLayout';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import Home from '@/features/home/pages/Home';

/**
 * Root application component configuring routing and global toast notifications.
 *
 * @returns The root application router tree.
 */
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route index element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="signin" element={<SignIn />} />
          <Route path="login" element={<Navigate to="/signin" replace />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/create" element={<CampaignWizardLayout />}>
            <Route index element={<Navigate to="step-1" replace />} />
            <Route path="step-1" element={<Step1BasicInfo />} />
          </Route>
          <Route path="campaigns/:id/create" element={<CampaignWizardLayout />}>
            <Route index element={<Navigate to="step-1" replace />} />
            <Route path="step-1" element={<Step1BasicInfo />} />
          </Route>
          <Route path="kampanye" element={<Navigate to="/dashboard/campaigns" replace />} />
        </Route>
        <Route path="kampanye" element={<Navigate to="/dashboard/campaigns" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
