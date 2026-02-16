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
  handleQuickSearch: (term: string) => void;
  toggleProvider: (nameSwe: string) => void;
  toggleRegion: (code: string) => void;
  clearProviders: () => void;
  clearRegions: () => void;
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

  const handleQuickSearch = useCallback((term: string) => {
    setSearchInput(term);
    setSearchQuery(term);
    setPage(0);
  }, []);

  const toggleProvider = useCallback((nameSwe: string) => {
    setSelectedProviders((prev) =>
      prev.includes(nameSwe) ? prev.filter((p) => p !== nameSwe) : [...prev, nameSwe]
    );
    setSelectedRegions([]); // Either/or: choosing provider clears region
    setPage(0);
  }, []);

  const toggleRegion = useCallback((regionCode: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionCode) ? prev.filter((c) => c !== regionCode) : [...prev, regionCode]
    );
    setSelectedProviders([]); // Either/or: choosing region clears provider
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
    handleQuickSearch,
    toggleProvider,
    toggleRegion,
    clearProviders,
    clearRegions,
    clearFilters,
    hasActiveFilters,
  };
}
