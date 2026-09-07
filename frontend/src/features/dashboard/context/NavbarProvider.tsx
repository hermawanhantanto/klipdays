import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NavbarContextValue, NavbarProviderProps } from '../types';
import { NavbarContext } from './navbar-context';

/**
 * Context provider coordinating responsive navigation across the dashboard top bar and sidebar.
 * Controls desktop sidebar collapse status and mobile drawer visibility with memoized action dispatches.
 * Locks background body scrolling while the mobile drawer is active.
 *
 * @param props - Children nodes and optional initial sidebar collapsed state.
 * @returns The provider element wrapping child components with navbar navigation state.
 */
export function NavbarProvider({ children, defaultSidebarCollapsed = false }: NavbarProviderProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  const ToggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((previousState) => !previousState);
  }, []);

  const SetSidebarCollapsed = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  const ToggleMobileMenu = useCallback(() => {
    setIsMobileOpen((previousState) => !previousState);
  }, []);

  const CloseMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const OpenMobileMenu = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const contextValue: NavbarContextValue = useMemo(
    () => ({
      isSidebarCollapsed,
      isMobileOpen,
      ToggleSidebarCollapse,
      SetSidebarCollapsed,
      ToggleMobileMenu,
      CloseMobileMenu,
      OpenMobileMenu,
    }),
    [isSidebarCollapsed, isMobileOpen, ToggleSidebarCollapse, SetSidebarCollapsed, ToggleMobileMenu, CloseMobileMenu, OpenMobileMenu]
  );

  return <NavbarContext.Provider value={contextValue}>{children}</NavbarContext.Provider>;
}
