import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import Hero from "../ui/Hero";
import {
  SearchBox,
  ActiveFilterChips,
  FilterSidebar,
  FilterSheet,
  FilterSheetTrigger,
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
    applyDebouncedSearch,
    toggleProvider,
    toggleRegion,
    clearProviders,
    clearRegions,
    clearSearch,
    clearFilters,
  } = useSearchFilters();

  const debouncedSearchInput = useDebounce(searchInput, 400);
  useEffect(() => {
    applyDebouncedSearch(debouncedSearchInput);
  }, [debouncedSearchInput, applyDebouncedSearch]);

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

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const filterCount = selectedProviders.length + selectedRegions.length;

  useEffect(() => {
    if (page > 0) {
      document.getElementById(RESULTS_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  const filterContent = (inline?: boolean) => (
    <FilterSidebar
      providers={providers}
      regions={regions}
      selectedProviders={selectedProviders}
      selectedRegions={selectedRegions}
      onToggleProvider={toggleProvider}
      onToggleRegion={toggleRegion}
      onClearProviders={clearProviders}
      onClearRegions={clearRegions}
      providersLoading={providersLoading}
      regionsLoading={regionsLoading}
      inline={inline}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Hero />

      <section
        id="programs"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20"
      >
        <div id={RESULTS_ANCHOR_ID} />

        <div className="mb-6 p-6 sm:p-8 overflow-visible">
          <SearchBox
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSubmit={(e) => handleSearch(e, searchInput)}
          />

          <ActiveFilterChips
            searchQuery={searchQuery}
            selectedProviders={selectedProviders}
            selectedRegions={selectedRegions}
            regionNames={regionNames}
            onRemoveSearch={clearSearch}
            onRemoveProvider={toggleProvider}
            onRemoveRegion={toggleRegion}
            onClearAll={clearFilters}
          />

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <FilterSheetTrigger
              filterCount={filterCount}
              onClick={() => setFilterSheetOpen(true)}
            />
          </div>

          <FilterSheet isOpen={filterSheetOpen} onClose={() => setFilterSheetOpen(false)}>
            {filterContent(true)}
          </FilterSheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-72 shrink-0">
            {filterContent()}
          </div>
          <div className="min-w-0 flex-1">
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
          </div>
        </div>
      </section>
    </div>
  );
}
