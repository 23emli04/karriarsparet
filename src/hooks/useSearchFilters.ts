import { useState, useCallback } from "react";

interface UseSearchFiltersReturn {
  page: number;
  searchQuery: string;
  searchInput: string;
  selectedProviders: string[];
  selectedRegions: string[];
  setPage: (page: number | ((p: number) => number)) => void;
  setSearchInput: (value: string) => void;
  handleSearch: (e: React.FormEvent, searchValue: string) => void;
  setSearchFromInput: (value: string) => void;
  applyDebouncedSearch: (value: string) => void;
  toggleProvider: (nameSwe: string) => void;
  toggleRegion: (code: string) => void;
  clearProviders: () => void;
  clearRegions: () => void;
  clearSearch: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useSearchFilters(): UseSearchFiltersReturn {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSearchInput("");
    setSelectedProviders([]);
    setSelectedRegions([]);
    setPage(0);
  }, []);


  const handleSearch = useCallback((e: React.FormEvent, searchValue: string) => {
    e.preventDefault();
    setSearchQuery(searchValue);
    setPage(0);
  }, []);

  const setSearchFromInput = useCallback((value: string) => {
    setSearchInput(value);
    setSearchQuery(value);
    setPage(0);
  }, []);

  const applyDebouncedSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(0);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setPage(0);
  }, []);

  const toggleProvider = useCallback((nameSwe: string) => {
    setSelectedProviders((prev) =>
      prev.includes(nameSwe) ? prev.filter((p) => p !== nameSwe) : [...prev, nameSwe]
    );
    setPage(0);
  }, []);

  const toggleRegion = useCallback((regionCode: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionCode) ? prev.filter((c) => c !== regionCode) : [...prev, regionCode]
    );
    setPage(0);
  }, []);

  const clearProviders = useCallback(() => {
    setSelectedProviders([]);
    setPage(0);
  }, []);

  const clearRegions = useCallback(() => {
    setSelectedRegions([]);
    setPage(0);
  }, []);

  const hasActiveFilters =
    !!searchQuery || selectedProviders.length > 0 || selectedRegions.length > 0;

  return {
    page,
    searchQuery,
    searchInput,
    selectedProviders,
    selectedRegions,
    setPage,
    setSearchInput,
    handleSearch,
    setSearchFromInput,
    applyDebouncedSearch,
    toggleProvider,
    toggleRegion,
    clearProviders,
    clearRegions,
    clearSearch,
    clearFilters,
    hasActiveFilters,
  };
}
