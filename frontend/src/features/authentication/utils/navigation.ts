import type { AuthRole } from '../types';

/**
 * Resolves the primary dashboard route URL according to the account's authenticated role.
 * Maps CREATOR -> /creator-dashboard, ADMIN -> /admin-dashboard, and BRAND -> /brand-dashboard.
 *
 * @param role - The authenticated account role ('CREATOR', 'ADMIN', 'BRAND', or undefined/null).
 * @returns The destination dashboard path.
 */
export function GetDashboardRouteByRole(role?: AuthRole | string | null): string {
  if (role === 'CREATOR') {
    const creatorPath = '/creator-dashboard';
    return creatorPath;
  }

  if (role === 'ADMIN') {
    const adminPath = '/admin-dashboard';
    return adminPath;
  }

  if (role === 'BRAND') {
    const brandPath = '/brand-dashboard';
    return brandPath;
  }

  const fallbackPath = '/dashboard';
  return fallbackPath;
}
