import { useMemo } from "react";
import type { EducationProvider } from "../../types/api";

interface ProviderFilterProps {
  providers: EducationProvider[];
  selectedProviders: string[];
  onToggleProvider: (nameSwe: string) => void;
  onClearProviders: () => void;
  isLoading: boolean;
}

const sortedByName = (list: EducationProvider[]) =>
  [...list].sort((a, b) => a.nameSwe.localeCompare(b.nameSwe, "sv"));

export default function ProviderFilter({
  providers,
  selectedProviders,
  onToggleProvider,
  onClearProviders,
  isLoading,
}: ProviderFilterProps) {
  const sortedProviders = useMemo(() => sortedByName(providers), [providers]);

  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <p className="text-slate-500 text-sm font-medium mb-3">
        Filter på universitet / anordnare
      </p>
      <ul className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 list-none">
        <li>
          <FilterButton
            label="Alla anordnare"
            isSelected={selectedProviders.length === 0}
            onSelect={onClearProviders}
          />
        </li>
        {isLoading ? (
          <li className="text-slate-400 text-sm py-1">Laddar...</li>
        ) : (
          sortedProviders.map((p) => (
            <li key={p.identifier}>
              <FilterButton
                label={p.nameSwe}
                isSelected={selectedProviders.includes(p.nameSwe)}
                onSelect={() => onToggleProvider(p.nameSwe)}
                className="text-left w-full"
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

function FilterButton({
  label,
  isSelected,
  onSelect,
  className = "",
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-left ${
        isSelected ? "bg-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      } ${className}`}
    >
      {label}
    </button>
  );
}
