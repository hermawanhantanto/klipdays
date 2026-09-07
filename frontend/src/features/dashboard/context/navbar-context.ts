import { createContext } from 'react';
import type { NavbarContextValue } from '../types';

/**
 * Shared React Context for responsive dashboard navbar states and dispatchers.
 */
export const NavbarContext = createContext<NavbarContextValue | null>(null);
