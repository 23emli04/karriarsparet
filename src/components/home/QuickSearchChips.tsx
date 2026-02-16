const QUICK_SEARCH_TERMS = ["AI", "Programmering", "Sjuksköterska", "Ekonomi"] as const;

interface QuickSearchChipsProps {
  onQuickSearch: (term: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function QuickSearchChips({
  onQuickSearch,
  onClearFilters,
  hasActiveFilters,
}: QuickSearchChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-slate-400 font-medium">Populärt:</span>
      {QUICK_SEARCH_TERMS.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onQuickSearch(term)}
          className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border border-transparent transition-colors"
        >
          {term}
        </button>
      ))}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="ml-auto text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-4"
        >
          Rensa filter
        </button>
      )}
    </div>
  );
}
