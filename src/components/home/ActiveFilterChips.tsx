interface ActiveFilterChipsProps {
  searchQuery: string;
  selectedProviders: string[];
  selectedRegions: string[];
  regionNames: string[];
  onRemoveSearch: () => void;
  onRemoveProvider: (name: string) => void;
  onRemoveRegion: (code: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilterChips({
  searchQuery,
  selectedProviders,
  selectedRegions,
  regionNames,
  onRemoveSearch,
  onRemoveProvider,
  onRemoveRegion,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasActiveFilters =
    !!searchQuery ||
    selectedProviders.length > 0 ||
    selectedRegions.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-slate-500 text-sm font-medium mr-1">Aktiva filter:</span>
      {searchQuery && (
        <FilterChip label={`Sökning: "${searchQuery}"`} onRemove={onRemoveSearch} />
      )}
      {selectedProviders.map((name) => (
        <FilterChip key={name} label={name} onRemove={() => onRemoveProvider(name)} />
      ))}
      {selectedRegions.map((code, i) => (
        <FilterChip
          key={code}
          label={regionNames[i] ?? code}
          onRemove={() => onRemoveRegion(code)}
        />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-sm font-medium text-slate-500 hover:text-slate-700 underline underline-offset-2 cursor-pointer"
      >
        Rensa alla
      </button>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium"
      role="listitem"
    >
      <span className="max-w-[180px] truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Ta bort ${label}`}
        className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
      >
        <span aria-hidden>×</span>
      </button>
    </span>
  );
}
