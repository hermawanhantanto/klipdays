import type { ComponentType, ReactNode } from 'react';

/**
 * Representation of an individual item within the dashboard navigation list.
 */
export interface DashboardNavItem {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
}

/**
 * State and mutation actions exposed by the navbar context for coordinating top bar and sidebar navigation.
 */
export interface NavbarContextValue {
  isSidebarCollapsed: boolean;
  isMobileOpen: boolean;
  ToggleSidebarCollapse: () => void;
  SetSidebarCollapsed: (collapsed: boolean) => void;
  ToggleMobileMenu: () => void;
  CloseMobileMenu: () => void;
  OpenMobileMenu: () => void;
}

/**
 * Props for the NavbarProvider component wrapper.
 */
export interface NavbarProviderProps {
  children: ReactNode;
  defaultSidebarCollapsed?: boolean;
}

/**
 * Props for the main full-height DashboardSidebar component.
 */
export interface DashboardSidebarProps {
  role?: string | null;
}

/**
 * Props for the inner navigation and header content of the sidebar.
 */
export interface SidebarContentProps {
  role?: string | null;
  collapsed: boolean;
  isDrawer?: boolean;
}

/**
 * Props for the sidebar header component with brand title and toggle buttons.
 */
export interface SidebarHeaderProps {
  collapsed: boolean;
  isDrawer?: boolean;
}

/**
 * Props for an individual sidebar navigation item.
 */
export interface SidebarNavItemProps {
  item: DashboardNavItem;
  collapsed: boolean;
  isActive: boolean;
  onItemClick: () => void;
}

/**
 * Props for the sidebar navigation links list container.
 */
export interface SidebarNavListProps {
  role?: string | null;
  collapsed: boolean;
}

/**
 * Props for the DashboardTopBar header component.
 */
export interface DashboardTopBarProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  avatarUrl?: string | null;
}

/**
 * Props for the UserNav dropdown and avatar trigger.
 */
export interface UserNavProps {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
}
