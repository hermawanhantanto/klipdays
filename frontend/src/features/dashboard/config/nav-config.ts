import type { ComponentType } from 'react';
import { Compass, FileCheck, LayoutDashboard, Megaphone, Settings, ShieldCheck, Video, Wallet } from 'lucide-react';

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
}

const BRAND_NAV_ITEMS: DashboardNavItem[] = [
  {
    title: 'Beranda',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Kampanye',
    href: '/dashboard/campaigns',
    icon: Megaphone,
  },
  {
    title: 'Pengajuan Klip',
    href: '/dashboard/submissions',
    icon: Video,
  },
  {
    title: 'Dompet Escrow',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const CREATOR_NAV_ITEMS: DashboardNavItem[] = [
  {
    title: 'Beranda',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Cari Kampanye',
    href: '/dashboard/campaigns',
    icon: Compass,
  },
  {
    title: 'Klip Saya',
    href: '/dashboard/submissions',
    icon: Video,
  },
  {
    title: 'Pendapatan',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const ADMIN_NAV_ITEMS: DashboardNavItem[] = [
  {
    title: 'Beranda',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Review Kampanye',
    href: '/dashboard/campaigns',
    icon: ShieldCheck,
  },
  {
    title: 'Verifikasi & Settlement',
    href: '/dashboard/settlements',
    icon: FileCheck,
  },
  {
    title: 'Disbursement',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const DEFAULT_NAV_ITEMS: DashboardNavItem[] = [
  {
    title: 'Beranda',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Kampanye',
    href: '/dashboard/campaigns',
    icon: Megaphone,
  },
  {
    title: 'Klip & Pengajuan',
    href: '/dashboard/submissions',
    icon: Video,
  },
  {
    title: 'Dompet',
    href: '/dashboard/wallet',
    icon: Wallet,
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

/**
 * Returns the dynamic navigation menu items based on the user's role.
 *
 * @param role - The authenticated account role ('BRAND', 'CREATOR', 'ADMIN', or undefined).
 * @returns An array of DashboardNavItem configured for the specified role.
 */
export function GetNavItemsForRole(role?: string | null): DashboardNavItem[] {
  if (role === 'BRAND') {
    return BRAND_NAV_ITEMS;
  }

  if (role === 'CREATOR') {
    return CREATOR_NAV_ITEMS;
  }

  if (role === 'ADMIN') {
    return ADMIN_NAV_ITEMS;
  }

  return DEFAULT_NAV_ITEMS;
}
