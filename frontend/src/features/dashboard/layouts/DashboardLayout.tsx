import { Outlet } from 'react-router';
import { UseCurrentAccountQuery } from '@/features/authentication/hooks';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { DashboardTopBar } from '@/features/dashboard/components/DashboardTopBar';
import { NavbarProvider } from '@/features/dashboard/context';

/**
 * Main dashboard layout orchestrator.
 * Wraps the dashboard layout shell in a NavbarProvider, combining the sticky top bar,
 * the role-dynamic left sidebar navigation, and the main scrollable content outlet.
 *
 * @returns The full-height dashboard layout shell.
 */
function DashboardLayout() {
  const { data: userProfile } = UseCurrentAccountQuery();

  return (
    <NavbarProvider>
      <div className="fixed inset-0 flex overflow-hidden bg-background text-foreground">
        <DashboardSidebar role={userProfile?.role} />
        <div className="flex flex-1 flex-col h-full min-h-0 overflow-hidden">
          <DashboardTopBar userName={userProfile?.name} userEmail={userProfile?.email} userRole={userProfile?.role} />
          <main className="flex-1 min-h-0 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
            <div className="w-full">
              <Outlet context={{ user: userProfile }} />
            </div>
          </main>
        </div>
      </div>
    </NavbarProvider>
  );
}

export default DashboardLayout;
