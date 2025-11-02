import { useState, useEffect, useCallback } from 'react';
import type { FileSearchResult } from '../../../_shared/types/ipc';

interface UseFileSearchOptions {
  debounceMs?: number;
  maxResults?: number;
  enabled?: boolean;
}

interface UseFileSearchReturn {
  results: FileSearchResult[];
  isSearching: boolean;
  error: string | null;
  search: (query: string) => void;
}

export function useFileSearch(options: UseFileSearchOptions = {}): UseFileSearchReturn {
  const { debounceMs = 150, maxResults = 50, enabled = true } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FileSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    const performSearch = async () => {
      try {
        const response = await window.api.invoke('file-tree:search-files', {
          query: query.trim(),
          maxResults
        });

        if ('error' in response) {
          setError(response.error);
          setResults([]);
        } else {
          setResults(response.results);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      void performSearch();
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceMs, maxResults, enabled]);

  return {
    results,
    isSearching,
    error,
    search
  };
}
