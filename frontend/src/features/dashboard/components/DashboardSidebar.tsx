import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { GetNavItemsForRole } from '../config/nav-config';

interface DashboardSidebarProps {
  role?: string | null;
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile: () => void;
}

/**
 * Left sidebar navigation component running the full height of the viewport.
 * Features the Klipday brand logo and minimize toggle at the top of the sidebar,
 * and renders dynamic menu items with identical active/hover behaviors in expanded and collapsed states.
 *
 * @param props - Sidebar properties including role, collapsed state, and toggle handlers.
 * @returns The full-height left navigation sidebar.
 */
export function DashboardSidebar({
  role,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}: DashboardSidebarProps) {
  const location = useLocation();
  const navItems = GetNavItemsForRole(role);

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }

    return location.pathname.startsWith(href);
  };

  const renderSidebarContent = (collapsed: boolean, isDrawer = false) => (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-full flex-col">
        {/* Top Header of the Sidebar with Brand Title and Minimize Button */}
        <div className={cn('flex h-16 shrink-0 items-center border-b', collapsed ? 'justify-center px-2' : 'justify-between px-4 sm:px-5')}>
          {collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="size-11 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Perluas sidebar"
              title="Perluas sidebar">
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Link to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-2 transition-opacity hover:opacity-90">
                <span className="font-heading text-2xl font-bold tracking-tight sm:text-[1.65rem]">
                  Klip<span className="text-primary">day</span>
                </span>
              </Link>

              {isDrawer ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCloseMobile}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Tutup menu">
                  <X className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Kecilkan sidebar"
                  title="Kecilkan sidebar">
                  <PanelLeftClose className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Navigation List */}
        <div className={cn('flex-1 overflow-y-auto', collapsed ? 'p-3' : 'p-4 sm:p-5')}>
          <nav className={cn('space-y-3', collapsed ? 'flex flex-col items-center' : '')}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isLinkActive(item.href);

              if (collapsed) {
                const collapsedItemClass = cn(
                  'flex size-11 items-center justify-center rounded-xl transition-colors',
                  isActive ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                );

                return (
                  <Tooltip key={item.href + item.title}>
                    <TooltipTrigger asChild>
                      <Link to={item.href} onClick={onCloseMobile} className={collapsedItemClass} aria-label={item.title}>
                        <IconComponent className="h-5 w-5 shrink-0" />
                        <span className="sr-only">{item.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12}>
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              const expandedItemClass = cn(
                'flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              );

              return (
                <Link key={item.href + item.title} to={item.href} onClick={onCloseMobile} className={expandedItemClass}>
                  <IconComponent className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.title}</span>
                  {item.badge ? (
                    <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );

  return (
    <>
      {/* Desktop Persistent Full-Height Sidebar */}
      <aside
        className={cn(
          'hidden h-screen shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 md:flex',
          isCollapsed ? 'w-20' : 'w-64'
        )}>
        {renderSidebarContent(isCollapsed, false)}
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="relative flex h-full w-64 max-w-[80vw] flex-1 flex-col border-r bg-sidebar shadow-xl">
            {renderSidebarContent(false, true)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
