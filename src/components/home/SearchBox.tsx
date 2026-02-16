interface SearchBoxProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchBox({
  searchInput,
  onSearchInputChange,
  onSubmit,
}: SearchBoxProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row gap-3 mb-6 items-stretch"
    >
      <div className="relative flex-1 min-w-0">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          aria-hidden
        >
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Sök bland tusentals utbildningar..."
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-lg"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 px-8 py-4 rounded-2xl bg-blue text-white font-semibold hover:opacity-90 transition-opacity h-[52px] md:h-auto"
      >
        Sök
      </button>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}
