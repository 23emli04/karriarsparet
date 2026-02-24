import { useCallback, useEffect, useState } from "react";

const FILTERS_STORAGE_KEY = "karriarsparet.home.filters.v1";

interface PersistedFilters {
  searchQuery?: string;
  selectedProviders?: string[];
  selectedRegions?: string[];
  selectedEducationLevels?: string[];
  selectedFormCodes?: string[];
}

function readPersistedFilters(): PersistedFilters {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PersistedFilters;
    return {
      searchQuery: typeof parsed.searchQuery === "string" ? parsed.searchQuery : "",
      selectedProviders: Array.isArray(parsed.selectedProviders) ? parsed.selectedProviders : [],
      selectedRegions: Array.isArray(parsed.selectedRegions) ? parsed.selectedRegions : [],
      selectedEducationLevels: Array.isArray(parsed.selectedEducationLevels) ? parsed.selectedEducationLevels : [],
      selectedFormCodes: Array.isArray(parsed.selectedFormCodes) ? parsed.selectedFormCodes : [],
    };
  } catch {
    return {};
  }
}

interface UseSearchFiltersReturn {
  page: number;
  searchQuery: string;
  searchInput: string;
  selectedProviders: string[];
  selectedRegions: string[];
  selectedEducationLevels: string[];
  selectedFormCodes: string[];
  setPage: (page: number | ((p: number) => number)) => void;
  setSearchInput: (value: string) => void;
  handleSearch: (e: React.FormEvent, searchValue: string) => void;
  setSearchFromInput: (value: string) => void;
  applyDebouncedSearch: (value: string) => void;
  toggleProvider: (nameSwe: string) => void;
  toggleRegion: (code: string) => void;
  toggleEducationLevel: (code: string) => void;
  toggleFormCode: (code: string) => void;
  clearProviders: () => void;
  clearRegions: () => void;
  clearEducationLevels: () => void;
  clearFormCodes: () => void;
  clearSearch: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useSearchFilters(): UseSearchFiltersReturn {
  const persisted = readPersistedFilters();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(persisted.searchQuery ?? "");
  const [searchInput, setSearchInput] = useState(persisted.searchQuery ?? "");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    persisted.selectedProviders ?? []
  );
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    persisted.selectedRegions ?? []
  );
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>(
    persisted.selectedEducationLevels ?? []
  );
  const [selectedFormCodes, setSelectedFormCodes] = useState<string[]>(
    persisted.selectedFormCodes ?? []
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSearchInput("");
    setSelectedProviders([]);
    setSelectedRegions([]);
    setSelectedEducationLevels([]);
    setSelectedFormCodes([]);
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

  const toggleEducationLevel = useCallback((code: string) => {
    setSelectedEducationLevels((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
    setPage(0);
  }, []);

  const toggleFormCode = useCallback((code: string) => {
    setSelectedFormCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
    setPage(0);
  }, []);

  const clearEducationLevels = useCallback(() => {
    setSelectedEducationLevels([]);
    setPage(0);
  }, []);

  const clearFormCodes = useCallback(() => {
    setSelectedFormCodes([]);
    setPage(0);
  }, []);

  const hasActiveFilters =
    !!searchQuery ||
    selectedProviders.length > 0 ||
    selectedRegions.length > 0 ||
    selectedEducationLevels.length > 0 ||
    selectedFormCodes.length > 0;

  useEffect(() => {
    const payload: PersistedFilters = {
      searchQuery,
      selectedProviders,
      selectedRegions,
      selectedEducationLevels,
      selectedFormCodes,
    };
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(payload));
  }, [
    searchQuery,
    selectedProviders,
    selectedRegions,
    selectedEducationLevels,
    selectedFormCodes,
  ]);

  return {
    page,
    searchQuery,
    searchInput,
    selectedProviders,
    selectedRegions,
    selectedEducationLevels,
    selectedFormCodes,
    setPage,
    setSearchInput,
    handleSearch,
    setSearchFromInput,
    applyDebouncedSearch,
    toggleProvider,
    toggleRegion,
    toggleEducationLevel,
    toggleFormCode,
    clearProviders,
    clearRegions,
    clearEducationLevels,
    clearFormCodes,
    clearSearch,
    clearFilters,
    hasActiveFilters,
  };
}
