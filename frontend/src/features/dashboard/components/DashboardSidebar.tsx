import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { GetNavItemsForRole } from '../config/nav-config';
import { UseNavbar } from '../hooks';
import type { DashboardSidebarProps, SidebarContentProps } from '../types';

/**
 * Inner navigation and header layout for the dashboard sidebar.
 * Adapts between desktop collapsed (icons only) and full expanded / mobile drawer states.
 *
 * @param props - Component properties including role, collapsed state, and drawer mode.
 * @returns The inner sidebar header and navigation menu structure.
 */
function SidebarContent({ role, collapsed, isDrawer = false }: SidebarContentProps) {
  const location = useLocation();
  const { ToggleSidebarCollapse, CloseMobileMenu } = UseNavbar();
  const navItems = GetNavItemsForRole(role);

  const IsLinkActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }

    return location.pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-full flex-col">
        {/* Top Header of the Sidebar with Brand Title and Minimize Button */}
        <div className={cn('flex h-16 shrink-0 items-center border-b', collapsed ? 'justify-center px-2' : 'justify-between px-4 sm:px-5')}>
          {collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={ToggleSidebarCollapse}
              className="size-11 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Perluas sidebar"
              title="Perluas sidebar">
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Link to="/dashboard" onClick={CloseMobileMenu} className="flex items-center gap-2 transition-opacity hover:opacity-90">
                <span className="font-heading text-2xl font-bold tracking-tight sm:text-[1.65rem]">
                  Klip<span className="text-primary">day</span>
                </span>
              </Link>

              {isDrawer ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={CloseMobileMenu}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Tutup menu">
                  <X className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={ToggleSidebarCollapse}
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
              const isActive = IsLinkActive(item.href);

              if (collapsed) {
                const collapsedItemClass = cn(
                  'flex size-11 items-center justify-center rounded-xl transition-colors',
                  isActive ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                );

                return (
                  <Tooltip key={item.href + item.title}>
                    <TooltipTrigger asChild>
                      <Link to={item.href} onClick={CloseMobileMenu} className={collapsedItemClass} aria-label={item.title}>
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
                <Link key={item.href + item.title} to={item.href} onClick={CloseMobileMenu} className={expandedItemClass}>
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
}

/**
 * Left sidebar navigation component running the full height of the viewport.
 * Consumes UseNavbar to manage desktop collapse and mobile drawer state without prop drilling.
 *
 * @param props - Sidebar properties including the user role.
 * @returns The full-height left navigation sidebar.
 */
export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const { isSidebarCollapsed, isMobileOpen, CloseMobileMenu } = UseNavbar();

  return (
    <>
      {/* Desktop Persistent Full-Height Sidebar */}
      <aside
        className={cn(
          'sticky top-0 hidden h-full shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 md:flex',
          isSidebarCollapsed ? 'w-20' : 'w-64'
        )}>
        <SidebarContent role={role} collapsed={isSidebarCollapsed} isDrawer={false} />
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={CloseMobileMenu}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-64 max-w-[80vw] flex-1 flex-col border-r bg-sidebar shadow-xl">
            <SidebarContent role={role} collapsed={false} isDrawer={true} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
