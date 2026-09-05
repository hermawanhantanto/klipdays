import { LogOut, Settings, User } from 'lucide-react';
import { Link } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UseLogoutMutation } from '@/features/authentication/hooks';
import { GetInitials } from '../utils/initials';

interface UserNavProps {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
}

/**
 * User account navigation component rendering an avatar with fallback initials
 * and an interactive dropdown menu for profile management and sign-out.
 *
 * @param props - User profile properties including name, email, role, and avatarUrl.
 * @returns The user avatar trigger and dropdown menu.
 */
export function UserNav({ name = 'Budi Santoso', email = 'budi@klipday.com', role = 'BRAND', avatarUrl }: UserNavProps) {
  const logoutMutation = UseLogoutMutation();
  const displayName = name ?? 'Budi Santoso';
  const displayEmail = email ?? 'budi@klipday.com';
  const initials = GetInitials(displayName);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto gap-2.5 rounded-full px-2 py-1.5 hover:bg-muted/80"
          aria-label="Menu akun pengguna">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback className="bg-primary/10 font-medium text-primary text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start text-left md:flex">
            <span className="text-xs font-semibold leading-none">{displayName}</span>
            <span className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">{role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil Akun</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
