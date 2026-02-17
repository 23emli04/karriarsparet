import { useState, useMemo } from "react";
import type { EducationProvider, RegionDto } from "../../types/api";
import ProviderFilter from "./ProviderFilter";
import RegionFilter from "./RegionFilter";

interface FilterSidebarProps {
  providers: EducationProvider[];
  regions: RegionDto[];
  selectedProviders: string[];
  selectedRegions: string[];
  onToggleProvider: (name: string) => void;
  onToggleRegion: (code: string) => void;
  onClearProviders: () => void;
  onClearRegions: () => void;
  providersLoading: boolean;
  regionsLoading: boolean;
  /** When true, renders without the card wrapper (e.g. inside FilterSheet) */
  inline?: boolean;
}

export default function FilterSidebar({
  providers,
  regions,
  selectedProviders,
  selectedRegions,
  onToggleProvider,
  onToggleRegion,
  onClearProviders,
  onClearRegions,
  providersLoading,
  regionsLoading,
  inline,
}: FilterSidebarProps) {
  const [providerSearch, setProviderSearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");

  const filteredProviders = useMemo(() => {
    if (!providerSearch.trim()) return providers;
    const q = providerSearch.trim().toLowerCase();
    return providers.filter((p) => p.nameSwe.toLowerCase().includes(q));
  }, [providers, providerSearch]);

  const filteredRegions = useMemo(() => {
    if (!regionSearch.trim()) return regions;
    const q = regionSearch.trim().toLowerCase();
    return regions.filter((r) => r.name.toLowerCase().includes(q));
  }, [regions, regionSearch]);

  const content = (
    <div className="p-4 space-y-6">
            <ProviderFilterSection
              filteredProviders={filteredProviders}
              selectedProviders={selectedProviders}
              onToggleProvider={onToggleProvider}
              onClearProviders={onClearProviders}
              isLoading={providersLoading}
              searchValue={providerSearch}
              onSearchChange={setProviderSearch}
            />
            <RegionFilterSection
              filteredRegions={filteredRegions}
              selectedRegions={selectedRegions}
              onToggleRegion={onToggleRegion}
              onClearRegions={onClearRegions}
              isLoading={regionsLoading}
              searchValue={regionSearch}
              onSearchChange={setRegionSearch}
            />
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <aside className="lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Filter</h3>
          </div>
          {content}
        </div>
      </div>
    </aside>
  );
}

function ProviderFilterSection({
  filteredProviders,
  selectedProviders,
  onToggleProvider,
  onClearProviders,
  isLoading,
  searchValue,
  onSearchChange,
}: {
  filteredProviders: EducationProvider[];
  selectedProviders: string[];
  onToggleProvider: (name: string) => void;
  onClearProviders: () => void;
  isLoading: boolean;
  searchValue: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div>
      <input
        type="search"
        placeholder="Sök anordnare..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none mb-3"
      />
      <ProviderFilter
        providers={filteredProviders}
        selectedProviders={selectedProviders}
        onToggleProvider={onToggleProvider}
        onClearProviders={onClearProviders}
        isLoading={isLoading}
        compact
      />
    </div>
  );
}

function RegionFilterSection({
  filteredRegions,
  selectedRegions,
  onToggleRegion,
  onClearRegions,
  isLoading,
  searchValue,
  onSearchChange,
}: {
  filteredRegions: RegionDto[];
  selectedRegions: string[];
  onToggleRegion: (code: string) => void;
  onClearRegions: () => void;
  isLoading: boolean;
  searchValue: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div className="pt-4 border-t border-slate-100">
      <input
        type="search"
        placeholder="Sök region..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none mb-3"
      />
      <RegionFilter
        regions={filteredRegions}
        selectedRegionCodes={selectedRegions}
        onToggleRegion={onToggleRegion}
        onClearRegions={onClearRegions}
        isLoading={isLoading}
        compact
      />
    </div>
  );
}
