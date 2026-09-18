import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { UseCampaignFiltersResult } from '../types';

const DEBOUNCE_DELAY_MS = 500;

/**
 * Custom hook managing campaign search keywords, categories, types, and sorting.
 * Encapsulates bidirectional synchronization between local input state and URL search parameters,
 * debounced keystroke handling, and filter reset logic.
 *
 * @returns Filter states and event handlers for the campaign filters toolbar.
 */
export function UseCampaignFilters(): UseCampaignFiltersResult {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? 'ALL';
  const campaignType = searchParams.get('campaignType') ?? 'ALL';
  const sort = searchParams.get('sort') ?? 'latest';

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const isTypingRef = useRef(false);
  const lastAppliedSearchRef = useRef(urlSearch);

  /**
   * Applies the search keyword to URL search parameters immediately.
   *
   * @param keyword - Keyword string to apply.
   */
  const ApplySearchKeyword = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim();
      const currentParam = searchParams.get('search') ?? '';

      // Skip update if parameter is already identical to avoid unnecessary history entries
      if (trimmed === currentParam) {
        lastAppliedSearchRef.current = trimmed;
        isTypingRef.current = false;
        return;
      }

      const nextParams = new URLSearchParams(searchParams);
      if (trimmed) {
        nextParams.set('search', trimmed);
      } else {
        nextParams.delete('search');
      }

      lastAppliedSearchRef.current = trimmed;
      isTypingRef.current = false;
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Synchronize local input state when URL changes externally (e.g. browser navigation or reset)
  useEffect(() => {
    if (urlSearch !== lastAppliedSearchRef.current) {
      lastAppliedSearchRef.current = urlSearch;
      setSearchTerm(urlSearch);
      isTypingRef.current = false;
    }
  }, [urlSearch]);

  // Debounce user keystrokes to prevent flooding the URL history on every key press
  useEffect(() => {
    if (!isTypingRef.current) {
      return;
    }

    const handler = setTimeout(() => {
      ApplySearchKeyword(searchTerm);
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(handler);
  }, [searchTerm, ApplySearchKeyword]);

  const hasActiveFilters = Boolean(
    urlSearch ||
    (category && category !== 'ALL') ||
    (campaignType && campaignType !== 'ALL') ||
    (sort && sort !== 'latest')
  );

  /**
   * Updates a single query parameter in the URL while preserving all other parameters.
   *
   * @param key - Query parameter name.
   * @param value - New parameter value, or null to remove.
   */
  const UpdateParam = useCallback(
    (key: string, value: string | null) => {
      const nextParams = new URLSearchParams(searchParams);
      if (!value || value === 'ALL' || (key === 'sort' && value === 'latest')) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  /**
   * Resets all search and filter parameters back to default states while preserving
   * tenant-specific parameters such as lifecycle status.
   */
  const ResetFilters = useCallback(() => {
    isTypingRef.current = false;
    lastAppliedSearchRef.current = '';
    setSearchTerm('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('search');
    nextParams.delete('category');
    nextParams.delete('campaignType');
    nextParams.delete('sort');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  /**
   * Clears only the search input field and updates URL immediately.
   */
  const ClearSearch = useCallback(() => {
    isTypingRef.current = false;
    lastAppliedSearchRef.current = '';
    setSearchTerm('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('search');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  /**
   * Handles immediate search execution upon pressing the Enter key.
   *
   * @param event - Keyboard event from the input field.
   */
  const HandleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      ApplySearchKeyword(searchTerm);
    }
  };

  /**
   * Updates local search term on keystroke and marks user typing activity.
   *
   * @param event - Change event from the input field.
   */
  const HandleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isTypingRef.current = true;
    setSearchTerm(event.target.value);
  };

  return {
    searchTerm,
    category,
    campaignType,
    sort,
    hasActiveFilters,
    HandleSearchChange,
    HandleSearchKeyDown,
    ClearSearch,
    UpdateParam,
    ResetFilters,
  };
}
