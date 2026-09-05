import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { Toaster } from '@/components/ui/sonner';
import AuthLayout from '@/features/authentication/layouts/AuthLayout';
import SignIn from '@/features/authentication/pages/SignIn';
import SignUp from '@/features/authentication/pages/SignUp';
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
