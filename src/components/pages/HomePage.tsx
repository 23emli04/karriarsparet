import { useEffect, useMemo } from "react";
import Hero from "../ui/Hero";
import {
  SearchBox,
  QuickSearchChips,
  ProviderFilter,
  RegionFilter,
  ResultsHeader,
  EducationResults,
  Pagination,
} from "../home";
import { useSearchFilters } from "../../hooks/useSearchFilters";
import { useEducations } from "../../hooks/useEducations";
import { useRegions } from "../../hooks/useRegions";
import { useEducationProviders } from "../../hooks/useEducationProviders";
import { buildEducationsQuery } from "../../services/queryBuilder";

const RESULTS_ANCHOR_ID = "results-anchor";
const PAGE_SIZE = 20;

export default function HomePage() {
  const {
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
  } = useSearchFilters();

  const { regions, loading: regionsLoading } = useRegions();
  const { providers, loading: providersLoading } = useEducationProviders();

  const query = buildEducationsQuery(
    searchQuery,
    selectedProviders,
    selectedRegions,
    page,
    PAGE_SIZE
  );
  const { data, loading, error } = useEducations(query);

  const regionNames = useMemo(
    () =>
      selectedRegions
        .map((code) => regions.find((r) => r.code === code)?.name)
        .filter(Boolean) as string[],
    [regions, selectedRegions]
  );

  useEffect(() => {
    if (page > 0) {
      document.getElementById(RESULTS_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Hero />

      <section
        id="programs"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20"
      >
        <div id={RESULTS_ANCHOR_ID} />

        <div className="mb-8 p-6 sm:p-8">
          <SearchBox
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSubmit={(e) => handleSearch(e, searchInput)}
          />

          <QuickSearchChips
            onQuickSearch={handleQuickSearch}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <ProviderFilter
            providers={providers}
            selectedProviders={selectedProviders}
            onToggleProvider={toggleProvider}
            onClearProviders={clearProviders}
            isLoading={providersLoading}
          />

          <RegionFilter
            regions={regions}
            selectedRegionCodes={selectedRegions}
            onToggleRegion={toggleRegion}
            onClearRegions={clearRegions}
            isLoading={regionsLoading}
          />
        </div>

        <ResultsHeader
          searchQuery={searchQuery}
          selectedProviders={selectedProviders}
          selectedRegions={selectedRegions}
          regionNames={regionNames}
          totalElements={data?.totalElements ?? null}
          isLoading={loading}
        />

        <EducationResults
          isLoading={loading}
          error={error ?? null}
          educations={data?.content ?? []}
          onClearFilters={clearFilters}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            data={data}
            onPageChange={(delta) => setPage((p) => p + delta)}
          />
        )}
      </section>
    </div>
  );
}
