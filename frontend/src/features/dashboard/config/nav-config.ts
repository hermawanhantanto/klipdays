import { Compass, FileCheck, LayoutDashboard, Megaphone, Settings, ShieldCheck, Video, Wallet } from 'lucide-react';
import type { DashboardNavItem } from '../types';

export type { DashboardNavItem };

export const BRAND_NAV_ITEMS: DashboardNavItem[] = [
  {
    title: 'Beranda',
    href: '/brand-dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Kampanye',
    href: '/brand-dashboard/brand-campaigns',
    icon: Megaphone,
  },
  {
    title: 'Pengajuan Klip',
    href: '/brand-dashboard/submissions',
    icon: Video,
  },
  {
    title: 'Dompet Escrow',
    href: '/brand-dashboard/wallet',
    icon: Wallet,
  },
  {
    title: 'Pengaturan',
    href: '/brand-dashboard/settings',
    icon: Settings,
  },
];

export const CREATOR_NAV_ITEMS: DashboardNavItem[] = [
  {
    title: 'Beranda',
    href: '/creator-dashboard',
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

export const ADMIN_NAV_ITEMS: DashboardNavItem[] = [
  {
    title: 'Beranda',
    href: '/admin-dashboard',
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

export const DEFAULT_NAV_ITEMS: DashboardNavItem[] = [
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

