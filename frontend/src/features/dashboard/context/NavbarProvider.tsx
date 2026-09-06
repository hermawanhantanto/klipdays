import { createContext, useCallback, useMemo, useState } from 'react';
import type { NavbarContextValue, NavbarProviderProps } from '../types';

export const NavbarContext = createContext<NavbarContextValue | null>(null);

/**
 * Context provider coordinating responsive navigation across the dashboard top bar and sidebar.
 * Controls desktop sidebar collapse status and mobile drawer visibility with memoized action dispatches.
 *
 * @param props - Children nodes and optional initial sidebar collapsed state.
 * @returns The provider element wrapping child components with navbar navigation state.
 */
export function NavbarProvider({ children, defaultSidebarCollapsed = false }: NavbarProviderProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    [
      isSidebarCollapsed,
      isMobileOpen,
      ToggleSidebarCollapse,
      SetSidebarCollapsed,
      ToggleMobileMenu,
      CloseMobileMenu,
      OpenMobileMenu,
    ]
  );

  return <NavbarContext.Provider value={contextValue}>{children}</NavbarContext.Provider>;
}
