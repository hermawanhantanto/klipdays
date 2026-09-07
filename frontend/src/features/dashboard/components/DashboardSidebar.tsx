import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { UseNavbar } from '../hooks';
import type { DashboardSidebarProps, SidebarContentProps, SidebarHeaderProps, SidebarNavItemProps, SidebarNavListProps } from '../types';
import { GetNavItemsForRole, IsRouteActive } from '../utils';

/**
 * Header section of the dashboard sidebar.
 * Displays the brand logo and the collapse or drawer close toggle buttons.
 *
 * @param props - Header configuration including collapsed state and drawer mode.
 * @returns The rendered sidebar header.
 */
function SidebarHeader({ collapsed, isDrawer = false }: SidebarHeaderProps) {
  const { ToggleSidebarCollapse, CloseMobileMenu } = UseNavbar();

  if (collapsed) {
    return (
      <div className="flex h-16 shrink-0 items-center justify-center border-b px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={ToggleSidebarCollapse}
          className="size-11 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Perluas sidebar"
          title="Perluas sidebar">
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-5">
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
    </div>
  );
}

/**
 * Individual sidebar navigation link item.
 * Adapts between icon-only tooltip display (collapsed mode) and full title with optional badge (expanded mode).
 *
 * @param props - Item data, collapse state, active status, and click callback.
 * @returns An accessible navigation link element.
 */
function SidebarNavItem({ item, collapsed, isActive, onItemClick }: SidebarNavItemProps) {
  const IconComponent = item.icon;

  if (collapsed) {
    const collapsedClasses = cn(
      'flex size-11 items-center justify-center rounded-xl transition-colors',
      isActive ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    );

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={item.href} onClick={onItemClick} className={collapsedClasses} aria-label={item.title}>
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

  const expandedClasses = cn(
    'flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
    isActive ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  );

  return (
    <Link to={item.href} onClick={onItemClick} className={expandedClasses}>
      <IconComponent className="h-5 w-5 shrink-0" />
      <span className="truncate">{item.title}</span>
      {item.badge ? (
        <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">{item.badge}</span>
      ) : null}
    </Link>
  );
}

/**
 * Scrollable navigation list section rendering role-based links.
 *
 * @param props - Role configuration and collapsed display state.
 * @returns The list of navigation items wrapped in appropriate navigation semantics.
 */
function SidebarNavList({ role, collapsed }: SidebarNavListProps) {
  const location = useLocation();
  const { CloseMobileMenu } = UseNavbar();
  const navItems = GetNavItemsForRole(role);

  return (
    <div className={cn('flex-1 overflow-y-auto', collapsed ? 'p-3' : 'p-4 sm:p-5')}>
      <nav className={cn('space-y-3', collapsed && 'flex flex-col items-center')}>
        {navItems.map((item) => {
          const isActive = IsRouteActive(location.pathname, item.href);

          return <SidebarNavItem key={item.href} item={item} collapsed={collapsed} isActive={isActive} onItemClick={CloseMobileMenu} />;
        })}
      </nav>
    </div>
  );
}

/**
 * Composed layout combining the sidebar header and scrollable navigation links.
 * Wraps content in TooltipProvider for icon tooltips when collapsed.
 *
 * @param props - Component properties including role, collapsed state, and drawer mode.
 * @returns The inner sidebar header and navigation menu structure.
 */
function SidebarContent({ role, collapsed, isDrawer = false }: SidebarContentProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-full flex-col">
        <SidebarHeader collapsed={collapsed} isDrawer={isDrawer} />
        <SidebarNavList role={role} collapsed={collapsed} />
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
      {isMobileOpen && (
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
      )}
    </>
  );
}
