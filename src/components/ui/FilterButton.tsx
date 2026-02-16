interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

export default function FilterButton({
  label,
  isSelected,
  onSelect,
  className = "",
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`
        px-3 py-2 rounded-xl text-left text-sm font-medium transition-all duration-150
        ${isSelected ? "bg-blue text-slate-900 shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
        ${className}
      `.trim()}
    >
      {label}
    </button>
  );
}
