import { Navigate } from 'react-router';
import { UseCurrentAccountQuery } from '@/features/authentication/hooks';
import { GetDashboardRouteByRole } from '@/features/authentication/utils';

/**
 * Route redirection component that navigates an authenticated user to their role-specific dashboard.
 *
 * @returns A Navigate component redirecting to the resolved role dashboard.
 */
export function DashboardRoleRedirect() {
  const { data: account } = UseCurrentAccountQuery();
  const targetPath = GetDashboardRouteByRole(account?.role);

  return <Navigate to={targetPath} replace />;
}
