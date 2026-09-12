import { useCallback } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router';
import type { UseUnsavedChangesGuardOptions, UseUnsavedChangesGuardResult } from '../types';

/**
 * Hook to guard against accidental navigation when a campaign wizard form has unsaved changes.
 * Integrates React Router navigation blocker for in-app client route changes and
 * window beforeunload listener for browser refresh or tab closing.
 *
 * @param options - Blocker configuration containing isDirty and isSaving flags.
 * @returns Object containing blocked status and proceed/cancel callbacks.
 */
export function UseUnsavedChangesGuard({ isDirty, isSaving = false }: UseUnsavedChangesGuardOptions): UseUnsavedChangesGuardResult {
  const shouldBlock = isDirty && !isSaving;

  useBeforeUnload(
    useCallback(
      (event: BeforeUnloadEvent) => {
        if (shouldBlock) {
          event.preventDefault();
        }
      },
      [shouldBlock]
    )
  );

  const blocker = useBlocker(
    useCallback(({ currentLocation, nextLocation }) => shouldBlock && currentLocation.pathname !== nextLocation.pathname, [shouldBlock])
  );

  const isBlocked = blocker.state === 'blocked';

  const ConfirmNavigation = useCallback(() => {
    if (isBlocked) {
      blocker.proceed();
    }
  }, [blocker, isBlocked]);

  const CancelNavigation = useCallback(() => {
    if (isBlocked) {
      blocker.reset();
    }
  }, [blocker, isBlocked]);

  return {
    isBlocked,
    ConfirmNavigation,
    CancelNavigation,
  };
}
