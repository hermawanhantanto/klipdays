import { Menu } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';

interface DashboardTopBarProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  avatarUrl?: string | null;
  onToggleMobileSidebar: () => void;
}

/**
 * Top bar header component positioned to the right of the sidebar.
 * Displays mobile menu controls on mobile screens and the user profile menu on the right.
 *
 * @param props - Top bar properties including profile details and mobile menu callback.
 * @returns The rendered dashboard header bar.
 */
export function DashboardTopBar({ userName, userEmail, userRole, avatarUrl, onToggleMobileSidebar }: DashboardTopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleMobileSidebar} aria-label="Buka menu navigasi">
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-90 md:hidden">
          <span className="font-heading text-xl font-bold tracking-tight">
            Klip<span className="text-primary">day</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <UserNav name={userName} email={userEmail} role={userRole} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
