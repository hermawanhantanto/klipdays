import { ADMIN_NAV_ITEMS, BRAND_NAV_ITEMS, CREATOR_NAV_ITEMS, DEFAULT_NAV_ITEMS } from '../config';
import type { DashboardNavItem } from '../types';

const NAV_ITEMS_BY_ROLE: Record<string, DashboardNavItem[]> = {
  BRAND: BRAND_NAV_ITEMS,
  CREATOR: CREATOR_NAV_ITEMS,
  ADMIN: ADMIN_NAV_ITEMS,
};

/**
 * Returns the dynamic navigation menu items based on the user's role.
 *
 * @param role - The authenticated account role ('BRAND', 'CREATOR', 'ADMIN', or undefined/null).
 * @returns An array of DashboardNavItem configured for the specified role.
 */
export function GetNavItemsForRole(role?: string | null): DashboardNavItem[] {
  if (!role) {
    return DEFAULT_NAV_ITEMS;
  }

  const items = NAV_ITEMS_BY_ROLE[role];
  if (items) {
    return items;
  }

  return DEFAULT_NAV_ITEMS;
}

/**
 * Determines whether a given navigation item URL is active for the current pathname.
 *
 * @param currentPath - The active browser location pathname.
 * @param targetHref - The target route URL to evaluate.
 * @returns True if targetHref matches the path or is an active route prefix.
 */
export function IsRouteActive(currentPath: string, targetHref: string): boolean {
  if (targetHref === '/brand-dashboard' || targetHref === '/creator-dashboard' || targetHref === '/admin-dashboard') {
    return currentPath === targetHref;
  }

  return currentPath.startsWith(targetHref);
}
