import { useMemo } from "react";
import type { EducationProvider } from "../../types/api";
import FilterButton from "../ui/FilterButton";

interface ProviderFilterProps {
  providers: EducationProvider[];
  selectedProviders: string[];
  onToggleProvider: (nameSwe: string) => void;
  onClearProviders: () => void;
  isLoading: boolean;
  compact?: boolean;
}

const sortedByName = (list: EducationProvider[]) =>
  [...list].sort((a, b) => a.nameSwe.localeCompare(b.nameSwe, "sv"));

export default function ProviderFilter({
  providers,
  selectedProviders,
  onToggleProvider,
  onClearProviders,
  isLoading,
  compact,
}: ProviderFilterProps) {
  const sortedProviders = useMemo(() => sortedByName(providers), [providers]);

  return (
    <div className={compact ? "" : "mt-6 pt-6 border-t border-slate-200"}>
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
