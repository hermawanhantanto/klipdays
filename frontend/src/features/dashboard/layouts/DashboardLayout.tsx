import { useState } from 'react';
import { Outlet } from 'react-router';

import { UseCurrentAccountQuery } from '@/features/authentication/hooks';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { DashboardTopBar } from '@/features/dashboard/components/DashboardTopBar';

/**
 * Main dashboard layout orchestrator.
 * Combines the sticky top bar with branding and user profile,
 * the role-dynamic left sidebar navigation, and the main scrollable content outlet.
 *
 * @returns The full-height dashboard layout shell.
 */
function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { data: userProfile } = UseCurrentAccountQuery();

  const displayName = userProfile?.name ?? 'Budi Santoso';
  const displayEmail = userProfile?.email ?? 'budi@klipday.com';
  const displayRole = userProfile?.role ?? 'BRAND';

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((previousState) => !previousState);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((previousState) => !previousState);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar
        role={displayRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={handleCloseMobileMenu}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopBar
          userName={displayName}
          userEmail={displayEmail}
          userRole={displayRole}
          onToggleMobileSidebar={handleToggleMobileMenu}
        />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            <Outlet context={{ user: userProfile }} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
