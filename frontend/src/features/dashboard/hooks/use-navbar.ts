import { useContext } from 'react';
import { NavbarContext } from '../context';
import type { NavbarContextValue } from '../types';

/**
 * Custom hook to access and control the responsive dashboard navbar state (top bar & sidebar).
 * Must be used within an enclosing NavbarProvider tree.
 *
 * @returns The active NavbarContextValue containing collapse and drawer states and actions.
 * @throws Error if called outside a NavbarProvider.
 */
export function UseNavbar(): NavbarContextValue {
  const context = useContext(NavbarContext);

  if (!context) {
    throw new Error('UseNavbar must be used within a NavbarProvider');
  }

  return context;
}
